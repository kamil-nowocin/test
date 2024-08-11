async function postComment(github, context) {
  const { owner, repo } = context.repo;
  const issue_number = context.issue.number;
  const url = `${process.env.GITHUB_SERVER_URL}/${owner}/${repo}/actions/runs/${context.runId}`;
  const message = process.env.build_result === 'success'
      ? 'VOL3: Gradle build completed successfully without any issues! PR is ready for review! ✅'
      : `VOL3:The Gradle build failed! PR isn't ready for review! ❌\nPlease check [Github Actions Workflow Run](${url}) for more information`;

  try {
    await github.rest.issues.createComment({ owner, repo, issue_number, body: message });
  } catch (error) {
    console.error(`Error posting comment: ${error.message}`);
  }
}

module.exports = postComment;
