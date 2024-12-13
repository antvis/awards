const { writeFileSync } = require('fs');
const {
  loadJsonFile,
  parseList,
  parseConfig,
  normalizeBadge,
  getRepoURI,
} = require('./utils');

const config = loadJsonFile('config.json', parseConfig);
const awards = loadJsonFile('awards.json', parseList);

const description = `
# AntV Awards / AntV 徽章

This repository records the badges granted to the Github users who have made outstanding contributions to the AntV project.

> 这个仓库库记录授予对 AntV 项目有贡献的 Github 用户的徽章。
`;

const maintain = `
## How to Maintain List / 如何维护徽章

1. Clone this repository to your local environment.

> 克隆仓库到本地

\`\`\`bash
git clone git@github.com:antvis/awards.git
\`\`\`

2. Install the dependencies.

> 安装依赖

\`\`\`bash
npm i
\`\`\`

3. Create or award badges through interaction

> 通过交互创建或授予徽章

\`\`\`bash
npm run award
\`\`\`

4. Commit and push the changes.

> 提交并推送更改

\`\`\`bash
git checkout -b update-awards
git add .
git commit -m "chore: update awards"
git push
\`\`\`
`;

const usages = `
## Badge Usage / 徽章使用方式

1. Query your award information [under this document](#Awards) based on the GitHub ID.

> 根据 GitHub ID 在[此文档](#Awards)下查询您的徽章信息。

2. Copy the Badge and paste it into the README.md of your repository.

> 复制徽章并粘贴到您的仓库的 README.md 中

Example / 示例:

[![](https://img.shields.io/endpoint?url=https://awards.antv.vision/aarebecca-g6-maintainer.json)](github.com/antvis/g6)

Note: If you are a user of AntV products, you can freely use the following badge.

> 注意: 如果您是 AntV 产品的用户，可以自由使用下面的徽章

\`\`\`text
https://img.shields.io/badge/AntV-G6_User-blue?&logo=antv&color=FFF&labelColor=8B5DFF
\`\`\`
![](https://img.shields.io/badge/AntV-G6_User-blue?&logo=antv&color=FFF&labelColor=8B5DFF)
`;

const _awards = [];
Object.entries(awards).forEach(([id, badges]) => {
  badges.forEach(({ badge, date }) => {
    _awards.push([id, badge, date]);
  });
});

const badges = Object.entries(config.badges)
  .map(
    ([badge, { description, approach }]) =>
      `|${badge}|${description}|_${approach}_|`
  )
  .join('\n');

const table = `
## Achievements / 徽章列表

| Achievement / 成就 | Description / 描述 | Approach / 获取方式 |
| - | - | - |
${badges}

## <a id="Awards" /> Awards / 颁发列表

| GitHub ID | Achievement / 成就 | Date / 颁发日期 | Badge / 徽章 |
| - | - | - | - |
${_awards
  .map(([id, badge, date]) => {
    const _id = id.toLowerCase();
    const _badge = normalizeBadge(badge);
    const _url = `[![](https://img.shields.io/endpoint?url=https://awards.antv.vision/${_id}-${_badge}.json)](${getRepoURI(
      badge
    )})`;
    return `|${id}|${badge}|${date}|\`${_url}\`|`;
  })
  .join('\n')}
`;

writeFileSync('README.md', [description, maintain, usages, table].join('\n'));
