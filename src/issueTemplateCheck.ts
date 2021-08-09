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
		const result = await octokit.request('GET /repos/{owner}/{repo}/contents/.github/ISSUE_TEMPLATE/bug-report-feature-request.md', {
			repo: repository,
			owner: ownerName,
			headers: {
				Authorization: 'Bearer ' + secret_token
			}
		});
    	let contents = Buffer.from(result.data.content, "base64").toString("utf8");
		if (contents.includes('need-to-triage')) {
			return true;
		}
		else {
			return false;
		}
	}
	catch (err) {
		if(err.status == 404)
			validationResultRepo['issueTemplate'] = 'fail';
		else
			validationResultRepo['issueTemplate'] = err.status;
	}
}
