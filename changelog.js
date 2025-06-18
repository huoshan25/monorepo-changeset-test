const { getInfo } = require('@changesets/get-github-info');

// 与用户之前配置匹配的类型和section
const typeEmojis = {
  feat: '✨ Features',
  minor: '🌱 Minor Features',
  fix: '🐛 Bug Fixes',
  docs: '📝 Documentation',
  style: '🎨 Code Styles',
  refactor: '♻️ Code Refactoring',
  perf: '🚀 Performance Improvements',
  test: '🧪 Tests',
  build: '🏗️ Build System',
  ci: '⚙️ CI Configuration',
  chore: '🧹 Chores',
  revert: '⏮️ Reverts'
};

// 解析提交信息
function parseCommitMessage(message) {
  // 匹配 type(scope): message 格式
  const regex = /^(feat|minor|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(?:\(([^\)]+)\))?\s*:\s*(.+)/i;
  const match = message.match(regex);
  
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
    message: message
  };
}

async function getReleaseLine(changeset, type, options) {
  const [firstLine, ...futureLines] = changeset.summary
    .split('\n')
    .map(l => l.trimRight());
  
  const parsed = parseCommitMessage(firstLine);
  const displayType = typeEmojis[parsed.type] || '其他更改';
  
  const { user, repo } = options;
  
  let commitData = null;
  try {
    if (changeset.commit) {
      commitData = await getInfo({
        repo: `${user}/${repo}`,
        commit: changeset.commit
      });
    }
  } catch (e) {
    // 如果获取commit信息失败，继续但不添加链接
  }
  
  const scopeStr = parsed.scope ? `**${parsed.scope}:** ` : '';
  const commitLink = commitData && commitData.links && commitData.links.commit
    ? `([${commitData.shortHash}](${commitData.links.commit}))`
    : '';
  
  return [
    `### ${displayType}`,
    '',
    `* ${scopeStr}${parsed.message} ${commitLink}`,
    ...futureLines.map(l => `  ${l}`),
  ].join('\n');
}

async function getDependencyReleaseLine(changesets, dependenciesUpdated, options) {
  if (dependenciesUpdated.length === 0) return '';
  
  const dependencyLines = dependenciesUpdated.map(
    dependency => `* 更新依赖 ${dependency.name}@${dependency.newVersion}`
  );
  
  return ['', '### 依赖更新', '', ...dependencyLines].join('\n');
}

module.exports = {
  getReleaseLine,
  getDependencyReleaseLine,
}; 