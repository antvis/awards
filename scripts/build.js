const { writeFileSync, existsSync, mkdirSync } = require('fs');
const { join } = require('path');
const {
  loadJsonFile,
  parseConfig,
  parseList,
  normalizeName,
} = require('./utils');

const OUTPUT_DIR = 'dist';
const CNAME = 'awards.antv.vision';

const config = loadJsonFile('config.json', parseConfig);
const awards = loadJsonFile('awards.json', parseList);

createBadges(config, awards);
writeCNAME();

function createBadges(config, awards) {
  const { style } = config;
  const auth = {};
  for (const id in awards) {
    const badges = awards[id];
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

function writeCNAME() {
  writeFileSync(join(OUTPUT_DIR, 'CNAME'), CNAME);
}
