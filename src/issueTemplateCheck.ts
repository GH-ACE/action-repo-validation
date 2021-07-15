import * as core from '@actions/core';
import { Octokit } from '@octokit/core';

export async function issueTemplateCheck(repository: string, validationResultRepo: any, ownername: string, secret_token: string, octokit: Octokit) {
	try {
		const result = await octokit.request('GET /repos/{owner}/{repo}/contents/.github/ISSUE_TEMPLATE', {
			repo: repository,
			owner: ownername,
			headers: {
				Authorization: 'Bearer ' + secret_token
			}
		});
		if (result.status == 200) {
			//console.log('Success - ISSUE_TEMPLATE is set up');
			validationResultRepo['issueTemplateCheck'] = 'Yes';
      defaultLabelCheck(repository, ownername, secret_token, octokit);
		}
		else {
			//core.setFailed('Please set up ISSUE_TEMPLATE');
			validationResultRepo['issueTemplateCheck'] = 'No';
		}
	}
	catch (err) {
		//core.setFailed('Please set up ISSUE_TEMPLATE');
		validationResultRepo['issueTemplateCheck'] = 'No';
	}
	return Promise.resolve(validationResultRepo)
}
  
async function defaultLabelCheck(repository: string, ownername: string, secret_token: string, octokit: Octokit){
  try {
		const result = await octokit.request('GET /repos/{owner}/{repo}/contents/.github/ISSUE_TEMPLATE/custom.md', {
			repo: repository,
			owner: ownername,
			headers: {
				Authorization: 'Bearer ' + secret_token
			}
		});
    let contents = Buffer.from(result.data.content, "base64").toString("utf8");
			if (contents.includes('need-to-triage')) {
				//console.log('Success - Default label is need-to-triage');
			}
			else {
				//core.setFailed('Please set default label as need-to-triage')
			}
	}
	catch (err) {
		//console.log(err);
	}
}
