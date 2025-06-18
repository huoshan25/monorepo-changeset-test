#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// 获取最近的commit信息
const lastCommit = execSync('git log -1 --pretty=%B').toString().trim();

// 解析commit信息
function parseCommit(commit) {
  const regex = /^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(?:\(([^\)]+)\))?\s*:\s*(.+)/i;
  const match = commit.match(regex);
  
  if (match) {
    return {
      type: match[1].toLowerCase(),
      scope: match[2] || '',
      message: match[3].trim()
    };
  }
  
  return {
    type: 'other',
    scope: '',
    message: commit
  };
}

const parsed = parseCommit(lastCommit);

// 确定版本类型
let bumpType = 'patch';
if (parsed.type === 'feat') {
  bumpType = 'minor';
} else if (parsed.type === 'breaking') {
  bumpType = 'major';
}

console.log('从最近的commit生成changeset：');
console.log(`类型: ${parsed.type}`);
console.log(`范围: ${parsed.scope}`);
console.log(`信息: ${parsed.message}`);
console.log(`建议的版本升级: ${bumpType}`);

// 询问要更新哪些包
console.log('\n请选择要更新的包:');

// 获取所有包
const packagesDir = path.join(process.cwd(), 'packages');
const packages = fs.readdirSync(packagesDir)
  .filter(dir => fs.statSync(path.join(packagesDir, dir)).isDirectory())
  .filter(dir => {
    try {
      const pkgJson = path.join(packagesDir, dir, 'package.json');
      return fs.existsSync(pkgJson);
    } catch (e) {
      return false;
    }
  });

packages.forEach((pkg, i) => {
  console.log(`${i + 1}. ${pkg}`);
});

rl.question('\n输入包的编号(用逗号分隔多个包，或输入"all"选择所有包): ', (answer) => {
  let selectedPackages = [];
  
  if (answer.toLowerCase() === 'all') {
    selectedPackages = packages;
  } else {
    const selections = answer.split(',').map(s => parseInt(s.trim(), 10));
    selectedPackages = selections.map(i => packages[i - 1]).filter(Boolean);
  }
  
  if (selectedPackages.length === 0) {
    console.log('未选择任何包，退出');
    rl.close();
    return;
  }
  
  console.log(`已选择包: ${selectedPackages.join(', ')}`);
  
  // 确认版本升级类型
  rl.question(`\n确认版本升级类型 (major/minor/patch) [${bumpType}]: `, (typeAnswer) => {
    const finalBumpType = typeAnswer.trim() || bumpType;
    
    // 确认变更信息
    const defaultMessage = `${parsed.type}${parsed.scope ? `(${parsed.scope})` : ''}: ${parsed.message}`;
    rl.question(`\n确认变更信息 [${defaultMessage}]: `, (msgAnswer) => {
      const finalMessage = msgAnswer.trim() || defaultMessage;
      
      // 生成changeset
      const changesetContent = `---\n${selectedPackages.map(pkg => `"${pkg}": ${finalBumpType}`).join('\n')}\n---\n\n${finalMessage}\n`;
      
      // 生成随机ID
      const adjectives = ['happy', 'sad', 'blue', 'red', 'green', 'yellow', 'purple', 'orange', 'black', 'white'];
      const nouns = ['dog', 'cat', 'bird', 'fish', 'lion', 'tiger', 'bear', 'wolf', 'fox', 'deer'];
      const verbs = ['run', 'jump', 'swim', 'fly', 'dance', 'sing', 'play', 'work', 'sleep', 'eat'];
      
      const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
      const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
      const randomVerb = verbs[Math.floor(Math.random() * verbs.length)];
      
      const changesetId = `${randomAdjective}-${randomNoun}-${randomVerb}`;
      
      // 确保.changeset目录存在
      const changesetDir = path.join(process.cwd(), '.changeset');
      if (!fs.existsSync(changesetDir)) {
        fs.mkdirSync(changesetDir);
      }
      
      // 写入文件
      fs.writeFileSync(path.join(changesetDir, `${changesetId}.md`), changesetContent);
      
      console.log(`\n已创建changeset: .changeset/${changesetId}.md`);
      rl.close();
    });
  });
}); 