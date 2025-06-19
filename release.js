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

// 检查包是否在变更集中被修改
function isPackageInChangesets(pkgName) {
  try {
    if (!fs.existsSync('.changeset')) {
      return false;
    }
    
    const files = fs.readdirSync('.changeset');
    const changesetFiles = files.filter(file => 
      file.endsWith('.md') && 
      file !== 'README.md' && 
      file !== 'config.json'
    );
    
    for (const file of changesetFiles) {
      const content = fs.readFileSync(path.join('.changeset', file), 'utf8');
      // 检查文件内容是否包含包名
      if (content.includes(`"${pkgName}"`) || content.includes(`'${pkgName}'`)) {
        return true;
      }
    }
    
    return false;
  } catch (e) {
    console.error(`检查变更集时出错:`, e);
    return false;
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

// 生成standard-version格式的CHANGELOG
function generateStandardVersionChangelog(pkgPath, pkgName, currentVersion) {
  try {
    console.log(`为 ${pkgName} 生成standard-version格式的CHANGELOG...`);
    
    // 保存当前目录
    const currentDir = process.cwd();
    
    // 切换到包目录
    process.chdir(pkgPath);
    
    // 删除现有的CHANGELOG.md
    if (fs.existsSync('CHANGELOG.md')) {
      fs.unlinkSync('CHANGELOG.md');
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
      "compareUrlFormat": "https://github.com/huoshan25/monorepo-changeset-test/compare/{{previousTag}}...{{currentTag}}",
      "issueUrlFormat": "https://github.com/huoshan25/monorepo-changeset-test/issues/{{id}}",
      "skip": {
        "tag": true,
        "commit": true,
        "bump": true
      },
      "releaseCommitMessageFormat": "chore(release): {{currentTag}}",
      "path": ".",
      "packageFiles": ["package.json"],
      "bumpFiles": ["package.json"]
    });
    
    fs.writeFileSync('.versionrc.json', versionrcContent);
    
    // 运行 standard-version 生成 CHANGELOG
    execQuiet('npx standard-version --skip.tag --skip.commit --skip.bump --silent');
    
    // 删除临时文件
    if (fs.existsSync('.versionrc.json')) {
      fs.unlinkSync('.versionrc.json');
    }
    
    // 如果CHANGELOG.md存在，添加包名作为标题
    if (fs.existsSync('CHANGELOG.md')) {
      const changelogContent = fs.readFileSync('CHANGELOG.md', 'utf8');
      const newContent = `# ${pkgName}\n\n${changelogContent}`;
      fs.writeFileSync('CHANGELOG.md', newContent);
    }
    
    // 返回原目录
    process.chdir(currentDir);
    
    console.log(`✅ 已为 ${pkgName} 生成standard-version格式的CHANGELOG`);
  } catch (e) {
    console.error(`为 ${pkgName} 生成 CHANGELOG 失败:`, e);
    // 确保返回原目录
    try {
      process.chdir(currentDir);
    } catch (dirError) {
      // 忽略错误
    }
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

    // 2. 在更新版本之前，先检查哪些包在变更集中
    console.log('检查哪些包有变更...');
    
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
    
    // 跟踪需要更新的包
    const packagesToUpdate = [];
    
    // 检查哪些包在变更集中被修改
    for (const pkg of packages) {
      if (isPackageInChangesets(pkg.name)) {
        console.log(`检测到包 ${pkg.name} 在变更集中`);
        packagesToUpdate.push(pkg);
      } else {
        console.log(`跳过包: ${pkg.name} (不在变更集中)`);
      }
    }

    if (packagesToUpdate.length === 0) {
      console.log('没有包需要更新，跳过发布步骤。');
      process.exit(0);
    }

    // 3. 使用 @changesets/cli 更新版本
    console.log('更新包版本...');
    exec('pnpm version:update');

    // 4. 为更新的包生成standard-version格式的CHANGELOG并记录版本信息
    console.log('生成详细的 CHANGELOG...');
    
    const updatedPackages = [];
    
    for (const pkg of packagesToUpdate) {
      // 获取更新后的版本
      const pkgJsonPath = path.join(pkg.path, 'package.json');
      const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
      const currentVersion = pkgJson.version;
      
      // 记录更新的包
      updatedPackages.push({ 
        name: pkg.name, 
        version: currentVersion,
        path: pkg.path
      });
      
      // 生成standard-version格式的CHANGELOG
      generateStandardVersionChangelog(pkg.path, pkg.name, currentVersion);
    }

    // 5. 提交更改
    if (updatedPackages.length > 0) {
      console.log('提交版本更新...');
      
      // 生成提交信息
      const packageNames = updatedPackages.map(p => p.name).join(', ');
      const versionInfo = updatedPackages.map(p => `${p.name}@${p.version}`).join(', ');
      const commitMessage = `chore(release): 发布新版本 [${packageNames}] - ${versionInfo}`;
      
      // 只添加必要的文件
      for (const pkg of updatedPackages) {
        exec(`git add ${pkg.path}/package.json ${pkg.path}/CHANGELOG.md`);
      }
      // 添加根目录的package.json和pnpm-lock.yaml（如果存在）
      if (fs.existsSync('package.json')) {
        exec('git add package.json');
      }
      if (fs.existsSync('pnpm-lock.yaml')) {
        exec('git add pnpm-lock.yaml');
      }
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