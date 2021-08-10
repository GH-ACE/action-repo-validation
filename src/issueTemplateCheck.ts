import * as core from '@actions/core';
import { Octokit } from '@octokit/core';

export async function issueTemplateCheck(repository: string, validationResultRepo: any, ownerName: string, secret_token: string, octokit: Octokit) {
	try {
		const result = await octokit.request('GET /repos/{owner}/{repo}/contents/.github/ISSUE_TEMPLATE', {
			repo: repository,
			owner: ownerName,
			headers: {
				Authorization: 'Bearer ' + secret_token
			}
		});
		if (result.status == 200) {
     		if(defaultLabelCheck(repository, ownerName, validationResultRepo, secret_token, octokit))
				validationResultRepo['issueTemplate'] = 'pass';
			else
				validationResultRepo['issueTemplate'] = 'fail';
			
		}
		else {
			validationResultRepo['issueTemplate'] = 'fail';
		}
	}
	catch (err) {
		if(err.status == 404)
			validationResultRepo['issueTemplate'] = 'fail';
		else
			validationResultRepo['issueTemplate'] = err.status;
	}
	return Promise.resolve(validationResultRepo)
}
  
async function defaultLabelCheck(repository: string, ownerName: string, validationResultRepo:any, secret_token: string, octokit: Octokit){
  try {
		const result = await octokit.request('GET /repos/{owner}/{repo}/contents/.github/ISSUE_TEMPLATE', {
			repo: repository,
			owner: ownerName,
			headers: {
				Authorization: 'Bearer ' + secret_token
			}
		});
		console.log(result);
		let repoContents = result.data
		for (let i = 0; i < repoContents.length; i++) {
			const fileResult = await octokit.request('GET /repos/{owner}/{repo}/contents/'+repoContents.path, {
				repo: repository,
				owner: ownerName,
				headers: {
					Authorization: 'Bearer ' + secret_token
				}
			});
			let contents = Buffer.from(fileResult.data.content, "base64").toString("utf8");
			if (contents.includes('need-to-triage')) {
				return true;
			}
		}
    	return false;
	}
	catch (err) {
		if(err.status == 404)
			validationResultRepo['issueTemplate'] = 'fail';
		else
			validationResultRepo['issueTemplate'] = err.status;
	}
}
