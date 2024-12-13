const { writeFileSync } = require('fs');
const {
  loadJsonFile,
  parseList,
  parseConfig,
  normalizeBadge,
} = require('./utils');

const config = parseConfig(loadJsonFile('config.json'));
const list = parseList(loadJsonFile('list.json'));

const description = `
# AntV Awards

This repository records the badges granted to the Github users who have made outstanding contributions to the AntV project.
`;

const usages = `
## Usage

1. Query your award information under this document based on the GitHub ID.

2. Generate the badge URL:

> <div>![](https://img.shields.io/endpoint?url=https://antv.vision/awards/&lt;<b>github_id</b>&gt;-&lt;<b>badge</b>&gt;.json)</div>

Example:

![](https://img.shields.io/endpoint?url=https://antv.vision/awards/aarebecca-g6-maintainer.json)
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
      `|\`${normalizeBadge(badge)}\`|${description}|_${achievement}_|`
  )
  .join('\n');

const table = `
## Badges

| Badge | Description | Achievement |
| - | - | - |
${badges}

## Awards

| GitHub ID | Award | Date |
| - | - | - |
${awards
  .map(([id, badge, date]) => `|${id.toLowerCase()}|${badge}|${date}|`)
  .join('\n')}
`;

writeFileSync('README.md', [description, usages, table].join('\n'));
