import * as core from '@actions/core';
import { Octokit } from '@octokit/core';

export async function readmeChecks(repository: string, validationResultRepo: any,  ownername: string, secret_token: string, octokit: Octokit) {
	try {
		const result = await octokit.request('GET /repos/{owner}/{repo}/readme', {
			repo: repository,
			owner: ownername,
			headers: {
				Authorization: 'Bearer ' + secret_token
			}
		});
		if (result.status == 200) {
			const current = await octokit.request('GET /repos/{owner}/{repo}/contents/README.md', {
				repo: repository,
				owner: ownername,
				headers: {
					Authorization: 'Bearer ' + secret_token
				}
			});
			let contents = Buffer.from(current.data.content, "base64").toString("utf8");
			if ((contents.includes('Example')) && (contents.includes('Contribution') || contents.includes('Contributing'))) {
				validationResultRepo['readme'] = 'pass';
			}
			else {
				validationResultRepo['readme'] = 'fail';
			}	
		}
		else {
			validationResultRepo['readme'] = 'fail';
		}
	}
	catch (err) {
		if(err.status == 404)
			validationResultRepo['readme'] = 'fail';
		else
			validationResultRepo['readme'] = err.status;	
	}
	return Promise.resolve(validationResultRepo);
}

export async function codeOwnerCheck(repository: string,  validationResultRepo: any, ownername: string, secret_token: string, octokit: Octokit) {
	try {
		const result = await octokit.request('GET /repos/{owner}/{repo}/contents/.github/CODEOWNERS', {
			repo: repository,
			owner: ownername,
			headers: {
				Authorization: 'Bearer ' + secret_token
			}
		});
		if (result.status === 200) {
			validationResultRepo['codeOwner'] = 'pass';
		}
		else {
			validationResultRepo['codeOwner'] = 'fail';
		}
	}
	catch (err) {
		if(err.status == 404)
			validationResultRepo['codeOwner'] = 'fail';
		else
			validationResultRepo['codeOwner'] = err.status;
	}
	return Promise.resolve(validationResultRepo);
}

export async function nodeModulesCheck(repository: string, validationResultRepo: any, ownername: string, secret_token: string, octokit: Octokit) {
	try {
		const result = await octokit.request('GET /repos/{owner}/{repo}/languages', {
			repo: repository,
			owner: ownername,
			headers: {
				Authorization: 'Bearer ' + secret_token
			}
		});
		if (result.data["TypeScript"] !== undefined) {
			try {
				const includes_node_modules = await octokit.request('GET /repos/{owner}/{repo}/contents/node_modules', {
					repo: repository,
					owner: ownername,
					headers: {
						Authorization: 'Bearer ' + secret_token
					}
				});
				if (includes_node_modules.status == 200) {
					validationResultRepo['nodeModules(.TS)'] = 'fail';
				}
			}
			catch (err) {
				if(err.status == 404)
					validationResultRepo['nodeModules(.TS)'] = 'pass';
			}
		}
		else{
			validationResultRepo['nodeModules(.TS)'] = 'NA';
		}
	}
	catch (err) {
		validationResultRepo['nodeModules(.TS)'] = err.status;
	}
	return Promise.resolve(validationResultRepo);
}

export async function releasesnodeModulesCheck(repository: string, validationResultRepo: any, ownername: string, secret_token: string, octokit: Octokit) {
	try {
		const result = await octokit.request('GET /repos/{owner}/{repo}/branches', {
			owner: ownername,
			repo: repository,
			headers: {
				Authorization: 'Bearer ' + secret_token
			}
		});
		let releaseFlag = false;
		for (let i = 0; i < result.data.length; i++) {
			if (result.data[i].name.substring(0, 9) === 'releases/') {
				releaseFlag=true;
				var branchname = result.data[i].name;
				try {
					const contents = await octokit.request('GET /repos/{owner}/{repo}/contents', {
						owner: ownername,
						repo: repository,
						ref: branchname,
						headers: {
							Authorization: 'Bearer ' + secret_token
						}
					})
					var nodeModulesFlag = false;
					for (let j = 0; j < contents.data.length; j++) {
						if (contents.data[j].name === 'node_modules') {
							nodeModulesFlag = true;
							validationResultRepo['releasesnodeModules(.TS)'] = 'pass';
						}
					}
					if(nodeModulesFlag == false)
					{
						validationResultRepo['releasesnodeModules(.TS)'] = 'fail';
						break;
					}
				}
				catch (err){
					validationResultRepo['releasesnodeModules(.TS)'] = err.status;
					Promise.resolve(validationResultRepo)
				}
			}	
		}
		if(!releaseFlag)
		{
			validationResultRepo['releasesnodeModules(.TS)'] = 'NA'
		}
	}
	catch (err) {
		validationResultRepo['releasesnodeModules(.TS)'] = err.status;
	}
	return Promise.resolve(validationResultRepo)
}