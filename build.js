const { readFileSync, writeFileSync, existsSync, mkdirSync } = require('fs');
const { join } = require('path');

const OUTPUT_DIR = 'dist';

const config = parseConfig(JSON.parse(readFileSync('config.json')));
const list = JSON.parse(readFileSync('list.json'));

createBadges(config, list);

function createBadges(config, list) {
  const { style } = config;
  const auth = {};
  for (const id in list) {
    const badges = list[id];
    for (const badge of badges) {
      if (badge in style) {
        auth[normalizeName(id, badge)] = {
          ...style[badge],
          schemaVersion: 1,
          namedLogo: 'antv',
        };
      }
    }
  }
  if (!existsSync(OUTPUT_DIR)) mkdirSync(OUTPUT_DIR);
  for (const filename in auth) {
    writeFileSync(
      join(OUTPUT_DIR, `${filename}.json`),
      JSON.stringify(auth[filename], null, 2)
    );
  }
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
    if (!parsedStyle.label) parsedStyle[key].label = key;
  }
  return { ...config, style: parsedStyle };
}

function normalizeName(id, badge) {
  const name = `${id}-${badge}`;
  return name.toLowerCase().replace(/ /g, '-');
}
