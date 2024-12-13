const { writeFileSync } = require('fs');
const {
  loadJsonFile,
  parseList,
  parseConfig,
  normalizeBadge,
} = require('./utils');

const config = parseConfig(loadJsonFile('config.json'));
const list = parseList(loadJsonFile('awards.json'));

const description = `
# AntV Awards

This repository records the badges granted to the Github users who have made outstanding contributions to the AntV project.
`;

const usages = `
## Usage

1. Query your award information under this document based on the GitHub ID.

2. Copy the Badge and paste it into the README.md of your repository.

Example:

![](https://img.shields.io/endpoint?url=https://awards.antv.vision/aarebecca-g6-maintainer.json)

Note: If you are an AntV product user, you can add the logo freely in the following way:

\`\`\`text
https://img.shields.io/badge/AntV-G6_User-blue?&logo=antv&color=FFF&labelColor=8B5DFF
\`\`\`
![](https://img.shields.io/badge/AntV-G6_User-blue?&logo=antv&color=FFF&labelColor=8B5DFF)
`;

const awards = [];
Object.entries(list).forEach(([id, badges]) => {
  badges.forEach(({ badge, date }) => {
    awards.push([id, badge, date]);
  });
});

const badges = Object.entries(config.badges)
  .map(
    ([badge, { description, achievement }]) =>
      `|${badge}|${description}|_${achievement}_|`
  )
  .join('\n');

const table = `
## Achievements

| Achievement | Description | Approach |
| - | - | - |
${badges}

## Awards

| GitHub ID | Award | Date | Badge |
| - | - | - | - |
${awards
  .map(([id, badge, date]) => {
    const _id = id.toLowerCase();
    const _badge = normalizeBadge(badge);
    const _url = `![](https://img.shields.io/endpoint?url=https://awards.antv.vision/${_id}-${_badge}.json)`;
    return `|${id}|${badge}|${date}|\`${_url}\`|`;
  })
  .join('\n')}
`;

writeFileSync('README.md', [description, usages, table].join('\n'));
