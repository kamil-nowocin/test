const axios = require('axios');

async function sendSlackNotification(buildResult, prTitle, prUser, repo, runId) {
  if (buildResult === 'failure') {
    const url = `https://github.com/${repo}/actions/runs/${runId}`;
    const message = `❌ *Gradle build failed!* PR: "${prTitle}" by @${prUser}\nURL: ${url}`;

    try {
      await axios.post(process.env.SLACK_WEBHOOK_URL, {
        text: message,
        username: 'GitHub Actions',
        icon_emoji: ':warning:'
      });
      console.log('Slack notification sent successfully');
    } catch (error) {
      console.error('Error sending Slack notification:', error.message);
    }
  }
}

const [buildResult, prTitle, prUser, repo, runId] = process.argv.slice(2);

sendSlackNotification(buildResult, prTitle, prUser, repo, runId);
