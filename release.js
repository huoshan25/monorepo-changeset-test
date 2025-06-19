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

// 执行命令但不打印输出
function execQuiet(command) {
  try {
    return execSync(command, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
  } catch (error) {
    return null;
  }
}

// 获取当前日期，格式为 YYYY-MM-DD
function getCurrentDate() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// 检查包是否有版本变更
function hasVersionChanged(pkgPath, lastCommitId) {
  try {
    // 获取上次提交的package.json内容
    const lastPackageJson = execQuiet(
      `git show ${lastCommitId}:${pkgPath}/package.json`
    );
    
    if (!lastPackageJson) {
      // 如果无法获取上次提交的package.json，可能是新包
      return true;
    }
    
    // 获取当前package.json内容
    const currentPackageJson = fs.readFileSync(
      path.join(pkgPath, 'package.json'),
      'utf8'
    );
    
    // 解析版本号
    const lastVersion = JSON.parse(lastPackageJson).version;
    const currentVersion = JSON.parse(currentPackageJson).version;
    
    // 比较版本号
    return lastVersion !== currentVersion;
  } catch (e) {
    console.error(`检查版本变更时出错:`, e);
    // 如果出错，假设没有变更
    return false;
  }
}

// 获取包的变更集信息
function getChangesetInfo(pkgName) {
  try {
    // 读取.changeset目录下的所有.md文件
    const changesetDir = path.join(process.cwd(), '.changeset');
    if (!fs.existsSync(changesetDir)) {
      return null;
    }
    
    const files = fs.readdirSync(changesetDir);
    for (const file of files) {
      if (file.endsWith('.md')) {
        const content = fs.readFileSync(path.join(changesetDir, file), 'utf8');
        if (content.includes(`"${pkgName}"`)) {
          return true;
        }
      }
    }
    
    return false;
  } catch (e) {
    console.error(`获取变更集信息时出错:`, e);
    return false;
  }
}

// 格式化CHANGELOG
function formatChangelog(pkgName, content) {
  // 移除@changesets/cli生成的内容
  const changesetContent = content.split('\n\n## ');
  
  if (changesetContent.length <= 1) {
    return content;
  }
  
  // 提取版本号和变更内容
  const versionMatch = content.match(/## (\d+\.\d+\.\d+)/);
  if (!versionMatch) {
    return content;
  }
  
  const version = versionMatch[1];
  const currentDate = getCurrentDate();
  
  // 从原始内容中提取变更内容
  const changelogRegex = /### (.*?)\n\n([\s\S]*?)(?=\n\n###|$)/g;
  let match;
  const sections = [];
  
  while ((match = changelogRegex.exec(content)) !== null) {
    const sectionTitle = match[1].trim();
    const sectionContent = match[2].trim();
    sections.push({ title: sectionTitle, content: sectionContent });
  }
  
  // 构建新的CHANGELOG内容
  let newContent = `# ${pkgName}\n\n## [${version}](https://github.com/huoshan25/monorepo-changeset-test/compare/v${version}...v${version}) (${currentDate})\n\n`;
  
  // 添加各部分内容
  for (const section of sections) {
    newContent += `### ${section.title}\n\n${section.content}\n\n`;
  }
  
  return newContent;
}

// 清理CHANGELOG文件，移除重复内容
function cleanupChangelog(changelogPath) {
  if (!fs.existsSync(changelogPath)) {
    return;
  }
  
  // 读取CHANGELOG内容
  const content = fs.readFileSync(changelogPath, 'utf8');
  
  // 提取所有版本块
  const versionBlocks = [];
  const versionRegex = /## \[\d+\.\d+\.\d+\].*?(?=## \[\d+\.\d+\.\d+\]|$)/gs;
  let match;
  
  while ((match = versionRegex.exec(content)) !== null) {
    versionBlocks.push(match[0]);
  }
  
  // 如果没有找到版本块，返回原内容
  if (versionBlocks.length === 0) {
    return;
  }
  
  // 提取标题
  const titleMatch = content.match(/^# .*/);
  const title = titleMatch ? titleMatch[0] : '# Changelog';
  
  // 构建新的CHANGELOG内容
  let newContent = `${title}\n\n`;
  
  // 添加不重复的版本块
  const addedVersions = new Set();
  for (const block of versionBlocks) {
    const versionMatch = block.match(/## \[(\d+\.\d+\.\d+)\]/);
    if (versionMatch) {
      const version = versionMatch[1];
      if (!addedVersions.has(version)) {
        newContent += block + '\n\n';
        addedVersions.add(version);
      }
    }
  }
  
  // 写回文件
  fs.writeFileSync(changelogPath, newContent);
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

    // 获取最近的提交ID
    const lastCommitId = execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();

    // 2. 使用 @changesets/cli 更新版本
    console.log('更新包版本...');
    exec('pnpm version:update');

    // 3. 为有版本变更的包生成详细的 CHANGELOG
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
    
    // 为有版本变更的包生成 CHANGELOG
    for (const pkg of packages) {
      // 检查包是否有版本变更
      const versionChanged = hasVersionChanged(pkg.path, lastCommitId);
      const hasChangeset = getChangesetInfo(pkg.name);
      
      if (versionChanged) {
        console.log(`处理包: ${pkg.name} (版本已变更)`);
        
        // 获取包信息
        const pkgJsonPath = path.join(pkg.path, 'package.json');
        const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
        const currentVersion = pkgJson.version;
        
        // 在包目录中生成 CHANGELOG
        try {
          // 保存当前目录
          const currentDir = process.cwd();
          
          // 切换到包目录
          process.chdir(pkg.path);
          
          // 运行 standard-version 生成 CHANGELOG
          execQuiet('npx standard-version --skip.tag --skip.commit --skip.bump --silent');
          
          // 读取生成的 CHANGELOG
          const changelogPath = path.join(process.cwd(), 'CHANGELOG.md');
          if (fs.existsSync(changelogPath)) {
            const content = fs.readFileSync(changelogPath, 'utf8');
            
            // 格式化 CHANGELOG
            const formattedContent = formatChangelog(pkg.name, content);
            
            // 写回格式化后的 CHANGELOG
            fs.writeFileSync(changelogPath, formattedContent);
            
            // 清理CHANGELOG，移除重复内容
            cleanupChangelog(changelogPath);
          }
          
          // 返回原目录
          process.chdir(currentDir);
        } catch (e) {
          console.error(`为 ${pkg.name} 生成 CHANGELOG 失败:`, e);
          // 确保返回原目录
          try {
            process.chdir(currentDir);
          } catch (dirError) {
            // 忽略错误
          }
        }
      } else {
        console.log(`跳过包: ${pkg.name} (版本未变更)`);
      }
    }

    // 4. 提交更改
    console.log('提交版本更新...');
    exec('git add .');
    exec('git commit -m "chore(release): 发布新版本"');

    console.log('完成！');
    console.log(`\n要推送更改，请运行:\ngit push`);
  } catch (error) {
    console.error('发布过程中出错:', error);
    process.exit(1);
  }
}

main(); 