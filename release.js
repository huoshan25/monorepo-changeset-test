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

// 检查包是否有版本变更
function hasVersionChanged(pkgPath, lastCommitId) {
  try {
    // 获取上次提交的package.json内容
    const lastPackageJson = execSync(
      `git show ${lastCommitId}:${pkgPath}/package.json`,
      { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }
    );
    
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
    // 如果出错（例如，这是新包），假设有变更
    return true;
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
    
    const changedPackages = [];
    const currentDate = getCurrentDate();
    
    // 为有版本变更的包生成 CHANGELOG
    for (const pkg of packages) {
      // 检查包是否有版本变更
      if (hasVersionChanged(pkg.path, lastCommitId)) {
        console.log(`处理包: ${pkg.name} (版本已变更)`);
        changedPackages.push(pkg);
        
        // 获取包信息
        const pkgJsonPath = path.join(pkg.path, 'package.json');
        const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
        const currentVersion = pkgJson.version;
        
        // 在包目录中生成 CHANGELOG
        try {
          process.chdir(pkg.path);
          
          // 检查是否存在 CHANGELOG.md
          const changelogPath = path.join(process.cwd(), 'CHANGELOG.md');
          let previousVersion = '1.0.0';
          
          if (fs.existsSync(changelogPath)) {
            const changelogContent = fs.readFileSync(changelogPath, 'utf8');
            const versionMatch = changelogContent.match(/\[(\d+\.\d+\.\d+)\]/);
            if (versionMatch && versionMatch[1]) {
              previousVersion = versionMatch[1];
            }
          }
          
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
            "header": `# ${pkg.name}\n\n## [${currentVersion}](https://github.com/huoshan25/monorepo-changeset-test/compare/v${previousVersion}...v${currentVersion}) (${currentDate})\n`,
          });
          
          fs.writeFileSync('.versionrc.json', versionrcContent);
          
          // 运行 standard-version
          exec('npx standard-version --skip.tag --skip.commit --skip.bump');
          
          // 删除临时文件
          fs.unlinkSync('.versionrc.json');
          
          process.chdir('../../');
        } catch (e) {
          console.error(`为 ${pkg.name} 生成 CHANGELOG 失败`, e);
          // 确保返回根目录
          try {
            process.chdir('../../');
          } catch (dirError) {
            // 如果已经在根目录，忽略错误
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