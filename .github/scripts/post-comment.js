async function postComment(github, context) {
  const { owner, repo } = context.repo;
  const issue_number = context.issue.number;
  const url = `${process.env.GITHUB_SERVER_URL}/${owner}/${repo}/actions/runs/${context.runId}`;

  const message = process.env.build_result === 'success'
      ? '✅ VOL2:The Gradle build completed successfully without any issues!'
      : `❌ VOL2:The Gradle build failed!\nPlease check the details: [View Workflow Run](${url})`;

  try {
    await github.rest.issues.createComment({
      owner,
      repo,
      issue_number,
      body: message
    });
  } catch (error) {
    console.error(`Error posting comment to PR #${issue_number}: ${error.message}`);
  }
}

module.exports = postComment;
