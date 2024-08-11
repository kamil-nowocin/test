const LABELS = [
  { name: 'build-success', color: '0E8A16', description: 'Build succeeded' },
  { name: 'build-failure', color: 'B60205', description: 'Build failed' }
];

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
      console.error(`Error updating/creating label "${label.name}": ${error.message}`);
    }
  }
}

async function manageLabels(github, context) {
  const { owner, repo } = context.repo;
  const issue_number = context.payload.pull_request.number;

  const resultLabel = process.env.build_result === 'success' ? 'build-success' : 'build-failure';
  const removeLabel = process.env.build_result === 'success' ? 'build-failure' : 'build-success';

  for (const label of LABELS) {
    await createOrUpdateLabel(github, owner, repo, label);
  }

  await manageIssueLabels(github, owner, repo, issue_number, resultLabel, removeLabel);
}

async function manageIssueLabels(github, owner, repo, issue_number, resultLabel, removeLabel) {
  try {
    await github.rest.issues.removeLabel({
      owner,
      repo,
      issue_number,
      name: removeLabel
    });
  } catch (error) {
    console.log(`Label "${removeLabel}" might not exist on the issue: ${error.message}`);
  }

  try {
    await github.rest.issues.addLabels({
      owner,
      repo,
      issue_number,
      labels: [resultLabel]
    });
  } catch (error) {
    console.error(`Error adding label "${resultLabel}": ${error.message}`);
  }
}

module.exports = manageLabels;
