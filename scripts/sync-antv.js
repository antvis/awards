const fetch = require('node-fetch');
const { writeFileSync } = require('fs');
const { getOwnerRepo, loadJsonFile } = require('./utils');

const ANTV_REPOS = ['G', 'G2', 'S2', 'F2', 'G6', 'X6', 'L7', 'ADC', 'AVA'];

const ownerRepo = ANTV_REPOS.map(getOwnerRepo);

Promise.all(ownerRepo.map(getContributors)).then((results) => {
  const awards = loadJsonFile('awards.json');

  results.forEach((data, index) => {
    const repo = ANTV_REPOS[index];
    const badge = `${repo} Contributor`;
    data.forEach((contributor) => {
      const { login } = contributor;
      if (!awards[login]) awards[login] = [badge];
      else if (!awards[login].includes(badge)) awards[login].push(badge);
    });
  });

  writeFileSync('awards.json', JSON.stringify(awards, null, 2));
});

async function getContributors(ownerRepo) {
  const url = `https://api.github.com/repos/${ownerRepo}/contributors?per_page=100`;
  const headers = {
    Accept: 'application/vnd.github.v3+json',
  };

  let page = 1;
  let contributors = [];
  let totalPages = 1;

  while (page <= totalPages) {
    const response = await fetch(`${url}&page=${page}`, { headers });

    const linkHeader = response.headers.get('link');
    if (linkHeader) {
      const lastPageMatch = linkHeader.match(/page=(\d+)>; rel="last"/);
      if (lastPageMatch) {
        totalPages = parseInt(lastPageMatch[1], 10);
      }
    }

    const data = await response.json();
    contributors = contributors.concat(data);

    page++;
  }

  return contributors;
}
