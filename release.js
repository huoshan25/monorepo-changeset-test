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

// 获取最新的提交信息
function getLatestCommits() {
  try {
    // 获取最后一次发布的commit
    let lastReleaseCommit = '';
    try {
      const releaseCommits = execQuiet('git log --oneline --grep="chore(release):" -n 1');
      if (releaseCommits) {
        lastReleaseCommit = releaseCommits.split(' ')[0];
        console.log(`找到最后一次发布提交: ${lastReleaseCommit}`);
      }
    } catch (e) {
      console.log('未找到之前的发布提交');
    }
    
    let gitLogCmd = 'git log --oneline --pretty=format:"%h %s"';
    if (lastReleaseCommit) {
      gitLogCmd += ` ${lastReleaseCommit}..HEAD`;
    } else {
      gitLogCmd += ' -10'; // 如果没有上次发布，只取最近10条
    }
    
    const commits = execQuiet(gitLogCmd);
    if (!commits) return [];
    
    return commits.split('\n').filter(line => line.trim()).map(line => {
      const match = line.match(/^([a-f0-9]+)\s+(.+)$/);
      if (match) {
        return {
          hash: match[1],
          message: match[2]
        };
      }
      return null;
    }).filter(Boolean).filter(commit => {
      // 过滤掉发布相关的提交
      const message = commit.message.toLowerCase();
      return !message.includes('chore(release):') && 
             !message.includes('release:') &&
             !message.includes('发布新版本') &&
             !message.includes('version bump') &&
             !message.includes('update changelog');
    });
  } catch (e) {
    console.error('获取提交信息失败:', e);
    return [];
  }
}

// 检查两个变更描述是否相似（避免重复）
function areChangesSimilar(change1, change2) {
  if (!change1 || !change2) return false;
  
  // 提取核心内容进行比较
  const extractCore = (str) => {
    return str.toLowerCase()
      .replace(/^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(\([^)]*\))?:\s*/i, '') // 移除type(scope):
      .replace(/[^\w\s\u4e00-\u9fff]/g, '') // 移除标点符号，保留中英文
      .replace(/\s+/g, ' ') // 标准化空格
      .trim();
  };
  
  const core1 = extractCore(change1);
  const core2 = extractCore(change2);
  
  // 如果核心内容为空，不认为相似
  if (!core1 || !core2) return false;
  
  // 计算相似度
  const similarity = calculateSimilarity(core1, core2);
  
  // 如果相似度超过70%，认为是重复
  return similarity > 0.7;
}

// 计算两个字符串的相似度
function calculateSimilarity(str1, str2) {
  // 使用简单的编辑距离算法
  const len1 = str1.length;
  const len2 = str2.length;
  
  if (len1 === 0) return len2 === 0 ? 1 : 0;
  if (len2 === 0) return 0;
  
  // 如果长度差异太大，直接认为不相似
  if (Math.abs(len1 - len2) > Math.max(len1, len2) * 0.5) return 0;
  
  // 标准化数字和空格，特别处理中文数字表达
  const normalize = (s) => s
    .replace(/第\s*(\d+)\s*次/g, '第$1次')  // 统一"第X次"格式
    .replace(/\s+/g, ' ')  // 统一空格
    .trim();
  
  const norm1 = normalize(str1);
  const norm2 = normalize(str2);
  
  // 简单的包含检查
  if (norm1.includes(norm2) || norm2.includes(norm1)) return 0.95;
  if (norm1 === norm2) return 1.0;
  
  // 检查共同的关键词（过滤掉常见词）
  const words1 = norm1.split(' ').filter(w => w.length > 1 && !['的', '和', '与', '或', '及'].includes(w));
  const words2 = norm2.split(' ').filter(w => w.length > 1 && !['的', '和', '与', '或', '及'].includes(w));
  
  if (words1.length === 0 || words2.length === 0) return 0;
  
  const commonWords = words1.filter(w => words2.includes(w));
  const similarity = (commonWords.length * 2) / (words1.length + words2.length);
  
  // 如果关键词匹配度很高，认为相似
  return similarity;
}

// 去重和合并变更
function deduplicateChanges(changesetChanges, gitCommits) {
  const allChanges = [];
  
  console.log('\n=== 开始去重处理 ===');
  console.log(`Changeset变更数量: ${changesetChanges.length}`);
  console.log(`Git提交数量: ${gitCommits.length}`);
  
  // 1. 首先添加git提交（优先级更高，因为有链接和commit hash）
  for (const commit of gitCommits) {
    console.log(`✅ 添加git提交: "${commit.message}"`);
    allChanges.push({
      ...commit,
      source: 'git',
      priority: 1
    });
  }
  
  // 2. 然后添加changeset变更，但要去重
  for (const change of changesetChanges) {
    let isDuplicate = false;
    
    // 检查是否与已有的git提交重复
    for (const existingChange of allChanges) {
      if (areChangesSimilar(change.message, existingChange.message)) {
        isDuplicate = true;
        console.log(`❌ 跳过重复的changeset: "${change.message}"`);
        console.log(`   与git提交重复: "${existingChange.message}"`);
        break;
      }
    }
    
    if (!isDuplicate) {
      console.log(`✅ 添加changeset变更: "${change.message}"`);
      allChanges.push({
        ...change,
        source: 'changeset',
        priority: 2
      });
    }
  }
  
  console.log(`=== 去重完成，最终变更数量: ${allChanges.length} ===\n`);
  
  // 3. 按优先级排序（git提交在前，changeset在后）
  return allChanges.sort((a, b) => a.priority - b.priority);
}

// 分类提交信息
function categorizeCommits(commits) {
  const categories = {
    'feat': { section: '✨ Features', commits: [] },
    'fix': { section: '🐛 Bug Fixes', commits: [] },
    'docs': { section: '📝 Documentation', commits: [] },
    'style': { section: '🎨 Code Styles', commits: [] },
    'refactor': { section: '♻️ Code Refactoring', commits: [] },
    'perf': { section: '🚀 Performance Improvements', commits: [] },
    'test': { section: '🧪 Tests', commits: [] },
    'build': { section: '🏗️ Build System', commits: [] },
    'ci': { section: '⚙️ CI Configuration', commits: [] },
    'chore': { section: '🧹 Chores', commits: [] },
    'revert': { section: '⏮️ Reverts', commits: [] }
  };
  
  commits.forEach(commit => {
    const message = commit.message;
    let category = 'chore'; // 默认分类
    
    // 解析conventional commit格式
    const match = message.match(/^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(\(.+\))?:\s*(.+)$/);
    if (match) {
      category = match[1];
    }
    
    // 跳过发布提交
    if (message.includes('chore(release):')) {
      return;
    }
    
    if (categories[category]) {
      categories[category].commits.push(commit);
    }
  });
  
  return categories;
}

// 从changeset文件中提取变更信息
function extractChangesetInfo(pkgName) {
  try {
    if (!fs.existsSync('.changeset')) {
      return [];
    }
    
    const files = fs.readdirSync('.changeset');
    const changesetFiles = files.filter(file => 
      file.endsWith('.md') && 
      file !== 'README.md' && 
      file !== 'config.json'
    );
    
    const changes = [];
    
    for (const file of changesetFiles) {
      const content = fs.readFileSync(path.join('.changeset', file), 'utf8');
      
      // 检查这个changeset是否包含当前包
      if (content.includes(`"${pkgName}"`) || content.includes(`'${pkgName}'`)) {
        // 提取变更描述（---分隔符后面的内容）
        const parts = content.split('---');
        if (parts.length >= 3) {
          const description = parts[2].trim();
          if (description) {
            changes.push({
              message: description,
              hash: 'changeset', // 标记为来自changeset
              type: 'changeset'
            });
          }
        }
      }
    }
    
    return changes;
  } catch (e) {
    console.error('提取changeset信息失败:', e);
    return [];
  }
}

// 生成CHANGELOG条目
function generateChangelogEntry(version, date, commits, changesetChanges, pkgName) {
  // 去重和合并变更
  const deduplicatedChanges = deduplicateChanges(changesetChanges, commits);
  
  if (deduplicatedChanges.length === 0) {
    // 如果没有变更，只返回版本标题
    return `## [${version}](https://github.com/huoshan25/monorepo-changeset-test/compare/v1.0.0...v${version}) (${date})\n\n`;
  }
  
  const categorizedCommits = categorizeCommits(deduplicatedChanges);
  
  let entry = `## [${version}](https://github.com/huoshan25/monorepo-changeset-test/compare/v1.0.0...v${version}) (${date})\n\n`;
  
  // 按类型生成各个section
  Object.entries(categorizedCommits).forEach(([type, data]) => {
    if (data.commits.length > 0) {
      entry += `\n### ${data.section}\n\n`;
      data.commits.forEach(commit => {
        if (commit.source === 'changeset') {
          // 对于changeset变更，直接使用描述
          entry += `* ${commit.message}\n`;
        } else {
          // 对于git提交，使用原有的格式
          const scope = commit.message.match(/\(([^)]+)\)/);
          const scopeText = scope ? `**${scope[1]}:** ` : '';
          const cleanMessage = commit.message.replace(/^[^:]+:\s*/, '');
          entry += `* ${scopeText}${cleanMessage} ([${commit.hash}](https://github.com/huoshan25/monorepo-changeset-test/commit/${commit.hash}))\n`;
        }
      });
    }
  });
  
  return entry;
}

// 生成standard-version格式的CHANGELOG
function generateStandardVersionChangelog(pkgPath, pkgName, currentVersion, changesetChanges) {
  try {
    console.log(`为 ${pkgName} 生成standard-version格式的CHANGELOG...`);
    console.log(`使用传入的 ${changesetChanges ? changesetChanges.length : 0} 个changeset变更`);
    
    // 保存当前目录
    const currentDir = process.cwd();
    
    // 切换到包目录
    process.chdir(pkgPath);
    
    // 读取现有的CHANGELOG.md（如果存在）
    let existingChangelog = '';
    const changelogPath = 'CHANGELOG.md';
    if (fs.existsSync(changelogPath)) {
      existingChangelog = fs.readFileSync(changelogPath, 'utf8');
      console.log(`已读取现有CHANGELOG`);
    }
    
    // 切换回原目录
    process.chdir(currentDir);
    
    // 获取最新的git提交信息
    const latestCommits = getLatestCommits();
    console.log(`找到 ${latestCommits.length} 个新git提交`);
    
    // 生成新版本的CHANGELOG条目
    const currentDate = getCurrentDate();
    const newVersionEntry = generateChangelogEntry(currentVersion, currentDate, latestCommits, changesetChanges || [], pkgName);
    
    // 切换回包目录
    process.chdir(pkgPath);
    
    // 处理现有CHANGELOG，提取旧版本部分
    let oldVersionsContent = '';
    if (existingChangelog) {
      const existingLines = existingChangelog.split('\n');
      
      // 找到第一个版本标题的位置
      let oldVersionsStartIndex = -1;
      for (let i = 0; i < existingLines.length; i++) {
        const line = existingLines[i];
        if (line.match(/^##\s+\[/) || line.match(/^###\s+\[/)) {
          oldVersionsStartIndex = i;
          break;
        }
      }
      
      if (oldVersionsStartIndex !== -1) {
        // 过滤掉changeset格式的内容，只保留standard-version格式的版本
        const oldVersionsLines = existingLines.slice(oldVersionsStartIndex);
        const filteredOldVersions = [];
        let skipChangesetVersion = false;
        
        for (const line of oldVersionsLines) {
          // 检测changeset格式的版本标题（没有链接的## 1.0.x格式）
          if (line.match(/^##\s+\d+\.\d+\.\d+$/) && !line.includes('](')) {
            skipChangesetVersion = true;
            continue;
          }
          
          // 检测standard-version格式的版本标题
          if (line.match(/^##\s+\[/) || line.match(/^###\s+\[/)) {
            skipChangesetVersion = false;
          }
          
          // 跳过changeset格式的内容
          if (skipChangesetVersion) {
            if (line.includes('### Patch Changes') || line.includes('### Minor Changes') || line.includes('### Major Changes') || line.startsWith('- ')) {
              continue;
            }
          }
          
          if (!skipChangesetVersion) {
            filteredOldVersions.push(line);
          }
        }
        
        oldVersionsContent = filteredOldVersions.join('\n');
      }
    }
    
    // 构造最终的CHANGELOG
    let finalChangelog = `# ${pkgName}\n\n# Changelog\n\nAll notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.\n\n${newVersionEntry}`;
    
    // 如果有旧版本内容，添加到最后
    if (oldVersionsContent.trim()) {
      finalChangelog += `\n${oldVersionsContent}`;
    }
    
    // 写入最终的CHANGELOG
    fs.writeFileSync(changelogPath, finalChangelog);
    
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

    // 2. 在更新版本之前，先检查哪些包在变更集中并提取变更信息
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
    
    // 跟踪需要更新的包及其changeset信息
    const packagesToUpdate = [];
    
    // 检查哪些包在变更集中被修改，并提取changeset信息
    for (const pkg of packages) {
      if (isPackageInChangesets(pkg.name)) {
        console.log(`检测到包 ${pkg.name} 在变更集中`);
        
        // 提取changeset变更信息
        const changesetChanges = extractChangesetInfo(pkg.name);
        console.log(`为 ${pkg.name} 找到 ${changesetChanges.length} 个changeset变更`);
        
        packagesToUpdate.push({
          ...pkg,
          changesetChanges
        });
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
      
      // 生成standard-version格式的CHANGELOG，传递changeset信息
      generateStandardVersionChangelog(pkg.path, pkg.name, currentVersion, pkg.changesetChanges);
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