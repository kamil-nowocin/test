const axios = require('axios');

async function sendSlackNotification(buildResult, prTitle, prUser, repo, runId,
    prNumber) {
  if (buildResult === 'failure') {
    const workflowURL = `https://github.com/${repo}/actions/runs/${runId}`;
    const prURL = `https://github.com/${repo}/pull/${prNumber}`;
    const message = `*Gradle build failed!*❌\nPR: "<${prURL}|${prTitle}>" by @${prUser}\nWorkflow URL: <${workflowURL}>`;

    try {
      await axios.post(process.env.SLACK_WEBHOOK_URL, {
        text: message, username: 'GitHub Actions', icon_emoji: ':warning:',
      });
      console.log('Slack notification sent successfully!');
    } catch (error) {
      console.error('Error sending Slack notification:', error.message);
    }
  }
}

const [buildResult, prTitle, prUser, repo, runId, prNumber] = process.argv.slice(2);
sendSlackNotification(buildResult, prTitle, prUser, repo, runId, prNumber);
