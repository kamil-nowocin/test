module.exports = async function postComment(github, context) {
  const url = `${process.env.GITHUB_SERVER_URL}/${context.repo.owner}/${context.repo.repo}/actions/runs/${context.runId}`;
  const message = process.env.build_result === 'success'
      ? '✅ KAAAAAAAAAAAThe Gradle build completed successfully without any issues!'
      : `❌ KAAAAAAAAAAAAThe Gradle build failed!\nPlease check the details: [View Workflow Run](${url})`;

  await github.rest.issues.createComment({
    issue_number: context.issue.number,
    owner: context.repo.owner,
    repo: context.repo.repo,
    body: message
  });
};
