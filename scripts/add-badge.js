const { writeFileSync } = require('fs');
const inquirer = require('inquirer');
const { loadJsonFile } = require('./utils');
const { execSync } = require('child_process');

const mode = inquirer.createPromptModule();
const category = inquirer.createPromptModule();
const badge = inquirer.createPromptModule();
const award = inquirer.createPromptModule();

mode({
  name: 'mode',
  message: '选择操作',
  type: 'select',
  choices: [
    { name: '📤 新增徽章', value: 'badge' },
    { name: '🏅 颁发徽章', value: 'award' },
    { name: '🏷️  新增徽章类型', value: 'category' },
    { name: '❌ 退出', value: 'exit' },
  ],
}).then(({ mode }) => {
  if (mode === 'badge') addBadge();
  else if (mode === 'award') awardBadge();
  else if (mode === 'category') addBadgeCategory();
  else process.exit(0);
});

function addBadgeCategory() {
  category([
    {
      name: 'category',
      message: '徽章类型名(如： Maintainer, Contributor)',
      type: 'input',
    },
  ]).then(({ category }) => {
    const config = loadJsonFile('config.json');
    if (config.category.includes(category)) {
      console.log(`类型 ${category} 已存在`);
      return;
    }

    config.category.push(category);

    writeFileSync('config.json', JSON.stringify(config, null, 2));

    console.log(`已添加分类 ${category}`);
  });
}

function addBadge() {
  const config = loadJsonFile('config.json');

  const inferDescription = (badge, repo) => {
    switch (badge) {
      case 'Maintainer':
        return `参与 AntV ${repo} 项目维护`;
      case 'Contributor':
        return `为 AntV ${repo} 项目提交 PR 并被合并`;
      case 'Skilled':
        return `熟练使用 AntV ${repo}`;
      default:
        return '';
    }
  };

  badge([
    {
      name: 'repo',
      message: '选择技术栈',
      type: 'select',
      choices: ['G', 'G2', 'S2', 'F2', 'G6', 'X6', 'L7', 'ADC', 'AVA'],
    },
    {
      name: 'badge',
      message: '选择徽章类型',
      type: 'select',
      choices: config.category,
    },
    {
      name: 'description',
      message: '徽章描述（可选，默认自动生成）',
      type: 'input',
    },
    {
      name: 'approach',
      message: '获取方式',
      type: 'input',
    },
  ]).then(({ repo, badge, description, approach }) => {
    const config = loadJsonFile('config.json');

    const _badge = `${repo} ${badge}`;
    if (config.badges[_badge]) {
      console.log(`徽章 ${_badge} 已存在`);
      return;
    }

    config.badges[_badge] = {
      description: description || inferDescription(badge, repo),
      approach: [approach],
    };

    config.style[_badge] = {
      extends: badge,
    };

    writeFileSync('config.json', JSON.stringify(config, null, 2));

    console.log(`已添加徽章 ${_badge}`);
  });
}

function awardBadge() {
  const config = loadJsonFile('config.json');
  const awards = loadJsonFile('awards.json');

  award([
    { name: 'github', message: 'GitHub 账号', type: 'input' },
    {
      name: 'badge',
      message: '颁发徽章',
      type: 'select',
      choices: Object.keys(config.badges),
    },
    {
      name: 'date',
      message: '颁发日期(可选, YYYY-MM-DD)',
      type: 'input',
      validate: (value) => {
        if (value) {
          const reg = /^\d{4}-\d{2}-\d{2}$/;
          if (!reg.test(value)) {
            return '日期格式不正确';
          }
        }
        return true;
      },
    },
  ]).then(({ github, badge, date }) => {
    if (!awards[github]) awards[github] = [];
    const badges = awards[github];
    if (
      badges.some((b) =>
        typeof b === 'string' ? b === badge : b.badge === badge
      )
    ) {
      console.log(`用户 ${github} 已获得过 ${badge}`);
      return;
    }

    badges.push(date ? { badge, date } : badge);

    writeFileSync('awards.json', JSON.stringify(awards, null, 2));

    execSync('npm run readme');

    console.log(`已为 ${github} 颁发了 ${badge}`);
  });
}
