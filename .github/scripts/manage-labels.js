module.exports = async function manageLabels(github, context) {
  const labels = [
    { name: 'build-success', color: '0E8A16', description: 'Build succeeded' },
    { name: 'build-failure', color: 'B60205', description: 'Build failed' }
  ];

  const resultLabel = process.env.build_result === 'success' ? 'build-success' : 'build-failure';
  const removeLabel = process.env.build_result === 'success' ? 'build-failure' : 'build-success';

  async function createOrUpdateLabel(github, owner, repo, label) {
    try {
      await github.rest.issues.updateLabel({
        owner,
        repo,
        name: label.name,
        color: label.color,
        description: label.description
      });
    } catch (error) {
      if (error.status === 404) {
        await github.rest.issues.createLabel({
          owner,
          repo,
          name: label.name,
          color: label.color,
          description: label.description
        });
      } else {
        console.error(`Failed to update or create label: ${error.message}`);
      }
    }
  }

  const issue_number = context.payload.pull_request.number;
  const { owner, repo } = context.repo;

  for (const label of labels) {
    await createOrUpdateLabel(github, owner, repo, label);
  }

  try {
    await github.rest.issues.removeLabel({
      owner,
      repo,
      issue_number,
      name: removeLabel
    });
  } catch (error) {
    console.log(`Failed to remove label: ${removeLabel}. It might not have been added yet.`);
  }

  await github.rest.issues.addLabels({
    owner,
    repo,
    issue_number,
    labels: [resultLabel]
  });
};
