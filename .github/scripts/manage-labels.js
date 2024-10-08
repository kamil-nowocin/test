const LABELS = [
  {name: 'wfe', color: 'FFFFFF', description: 'WFE Common'},
  {name: 'wfe-klasters', color: '0052CC', description: 'WFE Klasters'},
  {name: 'wfe-websters', color: '0052CC', description: 'WFE Websters'},
  {name: 'build-success', color: '00FF00', description: 'Build succeeded'},
  {name: 'build-failure', color: 'FF0000', description: 'Build failed'}
];

async function manageLabels(github, context) {
  const {owner, repo} = context.repo;
  const issue_number = context.payload.pull_request.number;
  const buildResult = process.env.build_result;

  const {data: files} = await github.rest.pulls.listFiles({
    owner, repo, pull_number: issue_number,
  });

  const labelsToAdd = new Set();

  files.forEach(file => {
    if (file.filename.startsWith('WFE_Common')) {
      labelsToAdd.add('wfe');
    }
    if (file.filename.startsWith('WFE_Klasters')) {
      labelsToAdd.add('wfe-klasters');
    }
    if (file.filename.startsWith('WFE_Websters')) {
      labelsToAdd.add('wfe-websters');
    }
  });

  const resultLabel = buildResult === 'success' ? 'build-success'
      : 'build-failure';
  const removeLabel = buildResult === 'success' ? 'build-failure'
      : 'build-success';

  labelsToAdd.add(resultLabel);

  await Promise.all(LABELS.map(async (label) => {
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
      }
    }
  }));

  try {
    await github.rest.issues.removeLabel(
        {owner, repo, issue_number, name: removeLabel});
  } catch (error) {
    console.log(`Label "${removeLabel}" might not exist: ${error.message}!`);
  }
  if (labelsToAdd.size > 0) {
    await github.rest.issues.addLabels(
        {owner, repo, issue_number, labels: Array.from(labelsToAdd),});
  }
}

module.exports = manageLabels;
