const { readFileSync } = require('fs');

function loadJsonFile(file, parser) {
  const json = JSON.parse(readFileSync(file, 'utf8'));
  if (parser) return parser(json);
  return json;
}

function parseConfig(config) {
  const { style } = config;
  const parsedStyle = {};
  for (const key in style) {
    const s = style[key];
    if (s.extends) {
      const { extends: e, ..._ } = s;
      parsedStyle[key] = { ...style[e], ..._ };
    } else {
      parsedStyle[key] = s;
    }

    // Set default label
    if (parsedStyle.label) parsedStyle.message = parsedStyle.label;
    else parsedStyle[key].message = key;
    delete parsedStyle[key].label;
  }
  return { ...config, style: parsedStyle };
}

function parseList(list) {
  for (const id in list) {
    const badges = list[id];
    list[id] = badges.map((badge) => {
      if (typeof badge === 'string') {
        return { badge, date: '' };
      }
      return badge;
    });
  }
  return list;
}

function normalizeBadge(badge) {
  return badge.toLowerCase().replace(/ /g, '-');
}

function normalizeName(id, badge) {
  return `${id}-${normalizeBadge(badge)}`;
}

function getOwnerRepo(repo) {
  repo = repo.toLowerCase();
  switch (repo) {
    case 'adc':
      return 'ant-design/ant-design-charts';
    default:
      return `antvis/${repo.toLowerCase()}`;
  }
}

function getRepoURI(badge) {
  const [repo] = badge.split(' ');
  return getOwnerRepo(repo);
}

module.exports = {
  loadJsonFile,
  parseConfig,
  parseList,
  normalizeBadge,
  normalizeName,
  getRepoURI,
  getOwnerRepo,
};
