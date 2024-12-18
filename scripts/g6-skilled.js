require('dotenv').config();
const { withAwards } = require('./utils');
const { G6_SKILLED_LIST } = require('./constants');
const fetch = require('node-fetch');

Promise.all(
  G6_SKILLED_LIST.map(async (id) => {
    if (await validateUser(id)) return id;
    return null;
  })
).then((ids) => {
  const skilled = ids.filter((id) => !!id);
  const awards = withAwards();

  skilled.forEach((id) => {
    awards.insert(id, 'G6 Skilled');
  });

  awards.close();
});

async function validateUser(id) {
  return await fetch(`https://api.github.com/users/${id}`, {
    headers: {
      Authorization: `token ${process.env.GITHUB_TOKEN}`,
      Accept: 'application/vnd.github.v3+json',
    },
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.login) return true;
      return false;
    });
}
