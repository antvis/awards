const { loadJsonFile, parseConfig, parseList } = require('./utils');

// 1. Validate the JSON files
const config = loadJsonFile('config.json', parseConfig);
const awards = loadJsonFile('awards.json', parseList);

// 2. Validate Awards Badge
for (const id in awards) {
  const badges = awards[id];
  for (const { badge } of badges) {
    if (!(badge in config.badges)) {
      throw new Error(`Badge ${badge} not found in config`);
    }
  }
}
