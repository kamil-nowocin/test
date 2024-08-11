async function postComment(github, context) {
  const { owner, repo } = context.repo;
  const issue_number = context.issue.number;
  const run_number = context.runNumber;
  const url = `${process.env.GITHUB_SERVER_URL}/${owner}/${repo}/actions/runs/${context.runId}`;
  const message = process.env.build_result === 'success'
      ? `### Gradle build completed successfully! ✅\nPR is ready for review!`
      : `### Gradle build failed! ❌\nPR isn't ready for review! Please check Github Actions Workflow [Run #${run_number}](${url}) for more information`;

  try {
    await github.rest.issues.createComment({ owner, repo, issue_number, body: message });
  } catch (error) {
    console.error(`Error posting comment: ${error.message}`);
  }
}

module.exports = postComment;
