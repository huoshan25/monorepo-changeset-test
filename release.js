#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// 执行命令并打印输出
function exec(command) {
  console.log(`执行: ${command}`);
  try {
    const output = execSync(command, { encoding: 'utf8' });
    console.log(output);
    return output;
  } catch (error) {
    console.error(`命令执行失败: ${error.message}`);
    console.error(error.stdout);
    console.error(error.stderr);
    process.exit(1);
  }
}

// 主流程
async function main() {
  try {
    // 1. 确保工作目录干净
    console.log('检查 git 工作目录...');
    try {
      execSync('git diff-index --quiet HEAD --');
    } catch (e) {
      console.error('工作目录不干净，请先提交或暂存更改');
      process.exit(1);
    }

    // 2. 使用 @changesets/cli 更新版本
    console.log('更新包版本...');
    exec('pnpm version:update');

    // 3. 为每个包生成详细的 CHANGELOG
    console.log('生成详细的 CHANGELOG...');
    
    // 获取所有包目录
    const packagesDir = ['packages', 'apps'];
    const packages = [];
    
    for (const dir of packagesDir) {
      if (fs.existsSync(dir)) {
        const subDirs = fs.readdirSync(dir);
        for (const subDir of subDirs) {
          const pkgPath = path.join(dir, subDir);
          const pkgJsonPath = path.join(pkgPath, 'package.json');
          if (fs.existsSync(pkgJsonPath) && fs.statSync(pkgPath).isDirectory()) {
            packages.push({ path: pkgPath, name: subDir });
          }
        }
      }
    }
    
    // 为每个包生成 CHANGELOG
    for (const pkg of packages) {
      console.log(`处理包: ${pkg.name}`);
      
      // 保存原始的 CHANGELOG 内容
      const changelogPath = path.join(pkg.path, 'CHANGELOG.md');
      let originalChangelog = '';
      if (fs.existsSync(changelogPath)) {
        originalChangelog = fs.readFileSync(changelogPath, 'utf8');
      }
      
      // 在包目录中生成 CHANGELOG
      try {
        process.chdir(pkg.path);
        exec('npx standard-version --skip.tag --skip.commit --skip.bump');
        process.chdir('../../');
      } catch (e) {
        console.error(`为 ${pkg.name} 生成 CHANGELOG 失败`);
        process.chdir('../../');
      }
      
      // 如果 CHANGELOG 被覆盖，恢复原始内容并追加新内容
      if (originalChangelog && fs.existsSync(changelogPath)) {
        const newChangelog = fs.readFileSync(changelogPath, 'utf8');
        if (newChangelog !== originalChangelog && !originalChangelog.includes(newChangelog)) {
          // 提取新版本的内容
          const versionMatch = newChangelog.match(/##\s+\[\d+\.\d+\.\d+\].+?(?=##|$)/s);
          if (versionMatch) {
            const newVersionContent = versionMatch[0];
            // 将新版本内容插入到原始 CHANGELOG 的顶部
            const updatedChangelog = originalChangelog.replace('# ', `# ${pkg.name}\n\n${newVersionContent}\n`);
            fs.writeFileSync(changelogPath, updatedChangelog);
          }
        }
      }
    }

    // 4. 提交更改
    console.log('提交版本更新...');
    exec('git add .');
    exec('git commit -m "chore(release): 发布新版本"');

    // 5. 创建标签
    console.log('创建标签...');
    const currentVersion = JSON.parse(fs.readFileSync('package.json', 'utf8')).version;
    exec(`git tag -a v${currentVersion} -m "v${currentVersion}"`);

    console.log('完成！');
    console.log(`\n要推送更改和标签，请运行:\ngit push && git push --tags`);
  } catch (error) {
    console.error('发布过程中出错:', error);
    process.exit(1);
  }
}

main(); 