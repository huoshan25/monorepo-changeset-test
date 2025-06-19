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
      return { changed: false, oldVersion: null, newVersion: null };
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
    return { 
      changed: lastVersion !== currentVersion, 
      oldVersion: lastVersion, 
      newVersion: currentVersion 
    };
  } catch (e) {
    console.error(`检查版本变更时出错:`, e);
    // 如果出错，假设没有变更
    return { changed: false, oldVersion: null, newVersion: null };
  }
}

// 检查是否有变更集文件
function hasChangesets() {
  if (!fs.existsSync('.changeset')) {
    return false;
  }
  
  const files = fs.readdirSync('.changeset');
  // 过滤掉README.md和config.json等非变更集文件
  const changesetFiles = files.filter(file => 
    file.endsWith('.md') && 
    file !== 'README.md' && 
    file !== 'config.json'
  );
  
  return changesetFiles.length > 0;
}

// 备份changeset生成的CHANGELOG
function backupChangesetChangelog(pkgPath) {
  const changelogPath = path.join(pkgPath, 'CHANGELOG.md');
  if (fs.existsSync(changelogPath)) {
    const changelogContent = fs.readFileSync(changelogPath, 'utf8');
    const backupPath = path.join(pkgPath, 'CHANGELOG.changeset.md');
    fs.writeFileSync(backupPath, changelogContent);
    console.log(`已备份changeset生成的CHANGELOG到: ${backupPath}`);
  }
}

// 主流程
async function main() {
  try {
    // 1. 检查是否有变更集文件
    console.log('检查变更集文件...');
    if (!hasChangesets()) {
      console.log('没有发现变更集文件，无需发布');
      process.exit(0);
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
    
    // 跟踪已更新的包
    const updatedPackages = [];
    
    // 为有版本变更的包生成 CHANGELOG
    for (const pkg of packages) {
      // 检查包是否有版本变更
      const versionInfo = hasVersionChanged(pkg.path, lastCommitId);
      
      if (versionInfo.changed) {
        console.log(`处理包: ${pkg.name} (版本已变更: ${versionInfo.oldVersion} -> ${versionInfo.newVersion})`);
        
        // 记录更新的包
        updatedPackages.push({ 
          name: pkg.name, 
          version: versionInfo.newVersion,
          oldVersion: versionInfo.oldVersion
        });
        
        // 备份changeset生成的CHANGELOG
        backupChangesetChangelog(pkg.path);
        
        // 在包目录中生成 CHANGELOG
        try {
          // 保存当前目录
          const currentDir = process.cwd();
          
          // 切换到包目录
          process.chdir(pkg.path);
          
          // 创建临时的 .versionrc.json
          const versionrcContent = JSON.stringify({
            "types": [
              {"type": "feat", "section": "✨ Features"},
              {"type": "minor", "section": "🌱 Minor Features", "bump": "patch"},
              {"type": "fix", "section": "🐛 Bug Fixes"},
              {"type": "docs", "section": "📝 Documentation"},
              {"type": "style", "section": "🎨 Code Styles"},
              {"type": "refactor", "section": "♻️ Code Refactoring"},
              {"type": "perf", "section": "🚀 Performance Improvements"},
              {"type": "test", "section": "🧪 Tests"},
              {"type": "build", "section": "🏗️ Build System"},
              {"type": "ci", "section": "⚙️ CI Configuration"},
              {"type": "chore", "section": "🧹 Chores"},
              {"type": "revert", "section": "⏮️ Reverts"}
            ],
            "commitUrlFormat": "https://github.com/huoshan25/monorepo-changeset-test/commit/{{hash}}",
            "compareUrlFormat": "https://github.com/huoshan25/monorepo-changeset-test/compare/v{{previousTag}}...v{{currentTag}}",
            "issueUrlFormat": "https://github.com/huoshan25/monorepo-changeset-test/issues/{{id}}",
            "skip": {
              "tag": true,
              "commit": true
            },
            "header": `# ${pkg.name}\n\n## [${versionInfo.newVersion}](https://github.com/huoshan25/monorepo-changeset-test/compare/v${versionInfo.oldVersion || '1.0.0'}...v${versionInfo.newVersion}) (${getCurrentDate()})\n`
          });
          
          fs.writeFileSync('.versionrc.json', versionrcContent);
          
          // 运行 standard-version 生成 CHANGELOG
          execQuiet('npx standard-version --skip.tag --skip.commit --skip.bump --silent');
          
          // 删除临时文件
          if (fs.existsSync('.versionrc.json')) {
            fs.unlinkSync('.versionrc.json');
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
    if (updatedPackages.length > 0) {
      console.log('提交版本更新...');
      
      // 生成提交信息
      const packageNames = updatedPackages.map(p => p.name).join(', ');
      const versionInfo = updatedPackages.map(p => `${p.name}@${p.version}`).join(', ');
      const commitMessage = `chore(release): 发布新版本 [${packageNames}] - ${versionInfo}`;
      
      // 只添加必要的文件
      for (const pkg of updatedPackages) {
        const pkgPath = packages.find(p => p.name === pkg.name).path;
        exec(`git add ${pkgPath}/package.json ${pkgPath}/CHANGELOG.md`);
      }
      // 添加根目录的package.json和pnpm-lock.yaml
      exec('git add package.json pnpm-lock.yaml');
      // 添加.changeset目录
      exec('git add .changeset');
      
      exec(`git commit -m "${commitMessage}"`);
      
      console.log('完成！');
      console.log(`\n要推送更改，请运行:\ngit push`);
    } else {
      console.log('没有包需要更新，跳过提交步骤。');
    }
  } catch (error) {
    console.error('发布过程中出错:', error);
    process.exit(1);
  }
}

main(); 