const { Octokit } = require("@octokit/rest");

async function sendSlackNotification(buildResult, prTitle, prUser, repo, runId, prNumber) {
  if (buildResult === 'failure') {
    const octokit = new Octokit();
    const workflowUrl = `https://github.com/${repo}/actions/runs/${runId}`;
    const prUrl = `https://github.com/${repo}/pull/${prNumber}`;
    const message = `*Gradle build failed!* ❌\nPR: "<${prUrl}|${prTitle}>" by @${prUser}\nWorkflow URL: <${workflowUrl}>`;

    try {
      await octokit.request('POST', process.env.SLACK_WEBHOOK_URL, {
        data: {
          text: message,
          username: 'GitHub Actions',
          icon_emoji: ':warning:',
        },
      });
      console.log('Slack notification sent successfully');
    } catch (error) {
      console.error('Error sending Slack notification:', error.message);
    }
  }
}

// Get command line arguments passed from the workflow
const [buildResult, prTitle, prUser, repo, runId, prNumber] = process.argv.slice(2);

// Call the function to send the Slack notification
sendSlackNotification(buildResult, prTitle, prUser, repo, runId, prNumber);
