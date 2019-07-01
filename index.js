const rp = require('request-promise-native');

const subredditURL = 'https://www.reddit.com/r/RobinHoodPennyStocks/new/.json';
const webhook = '';
let lastPost = '';

const sendWebhook = (title, permalink, time) => {
  console.log(time);
  const payload = {
    headers: { 'Content-Type': 'application/json' },
    url: webhook,
    method: 'POST',
    json: {
      embeds: [{
        url: permalink,
        title,
        color: 1490505,
        footer: {
          text: `r/robinhoodpennystocks Monitor @ ${time}`,
        },
      }],
    },
  };
  rp(payload).catch(err => console.log(err));
};

const scrape = async () => {
  rp(subredditURL).then((response) => {
    const json = JSON.parse(response);
    const latestPost = json.data.children[0].data.url;
    if (lastPost !== latestPost) {
      lastPost = latestPost;
      sendWebhook(json.data.children[0].data.title, lastPost, new Date(json.data.children[0].data.created_utc * 1000).toUTCString());
    }
  }).catch(err => console.log(err));
};

const run = async () => {
  setInterval(async () => {
    await scrape();
  }, 10000);
};

run();
