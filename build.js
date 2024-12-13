const { writeFileSync, existsSync, mkdirSync } = require('fs');
const { join } = require('path');
const {
  loadJsonFile,
  parseConfig,
  parseList,
  normalizeName,
} = require('./utils');

const OUTPUT_DIR = 'dist';

const config = parseConfig(loadJsonFile('config.json'));
const list = parseList(loadJsonFile('list.json'));

createBadges(config, list);

function createBadges(config, list) {
  const { style } = config;
  const auth = {};
  for (const id in list) {
    const badges = list[id];
    for (const { badge } of badges) {
      if (badge in style) {
        auth[normalizeName(id, badge)] = {
          ...style[badge],
          schemaVersion: 1,
          label: 'AntV',
          namedLogo: 'antv',
        };
      }
    }
  }
  if (!existsSync(OUTPUT_DIR)) mkdirSync(OUTPUT_DIR);
  for (const filename in auth) {
    writeFileSync(
      join(OUTPUT_DIR, `${filename.toLowerCase()}.json`),
      JSON.stringify(auth[filename], null, 2)
    );
  }
}
