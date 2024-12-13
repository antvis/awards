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
# AntV Awards

This repository records the badges granted to the Github users who have made outstanding contributions to the AntV project.
`;

const maintain = `
## How to Maintain List

1. Clone this repository to your local environment.

\`\`\`bash
git clone git@github.com:antvis/awards.git
\`\`\`

2. Install the dependencies.

\`\`\`bash
npm i
\`\`\`

3. Create or award badges through interaction

\`\`\`bash
npm run award
\`\`\`

4. Commit and push the changes.

\`\`\`bash
git checkout -b update-awards
git add .
git commit -m "chore: update awards"
git push
\`\`\`
`;

const usages = `
## Usage

1. Query your award information under this document based on the GitHub ID.

2. Copy the Badge and paste it into the README.md of your repository.

Example:

[![](https://img.shields.io/endpoint?url=https://awards.antv.vision/aarebecca-g6-maintainer.json)](github.com/antvis/g6)

Note: If you are an AntV product user, you can add the logo freely in the following way:

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
## Achievements

| Achievement | Description | Approach |
| - | - | - |
${badges}

## Awards

| GitHub ID | Award | Date | Badge |
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
