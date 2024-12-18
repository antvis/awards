const fetch = require('node-fetch');
const { getOwnerRepo, withAwards } = require('./utils');
const { ANTV_REPOS } = require('./constants');

const ownerRepo = ANTV_REPOS.map(getOwnerRepo);

Promise.all(ownerRepo.map(getContributors)).then((results) => {
  const awards = withAwards();

  results.forEach((data, index) => {
    const repo = ANTV_REPOS[index];
    const badge = `${repo} Contributor`;
    data.forEach((contributor) => {
      const { login } = contributor;
      awards.insert(login, badge);
    });
  });

  // filter out the robot
  awards.forEach((id) => {
    if (id.includes('[bot]') || id.endsWith('-bot')) awards.delete(id);
  });

  awards.close();
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
