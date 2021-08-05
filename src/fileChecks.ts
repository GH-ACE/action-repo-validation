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
			//console.log('Success - README file is present');
			const current = await octokit.request('GET /repos/{owner}/{repo}/contents/README.md', {
				repo: repository,
				owner: ownername,
				headers: {
					Authorization: 'Bearer ' + secret_token
				}
			});
			let contents = Buffer.from(current.data.content, "base64").toString("utf8");
			if (contents.includes('Example')) {
				//console.log('Success - Example workflow is present in README')
			}
			else {
				//core.setFailed('Please add Example workflow in README');
			}
			if (contents.includes('Contribution') || contents.includes('Contributing')) {
				//console.log('Success - Contribution Guidelines are present in README');
			}
			else {
				//core.setFailed('Please add Contribution Guidelines in README');
			}
			validationResultRepo['readme'] = 'pass';
		}
		else {
			//core.setFailed('Please add README file')
			validationResultRepo['readme'] = 'fail';
		}
	}
	catch (err) {
		if(err.status == 404)
			validationResultRepo['readme'] = 'fail';
		else
			validationResultRepo['readme'] = 'Access reqd';
	}
	return Promise.resolve(validationResultRepo)

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
			//console.log('Success - CODEOWNERS file is present');
			validationResultRepo['codeOwner'] = 'pass';
		}
		else {
			//core.setFailed('Please add CODEOWNERS file');
			validationResultRepo['codeOwner'] = 'fail';
		}
	}
	catch (err) {
		//core.setFailed('Please add CODEOWNERS file');
		if(err.status === 404) 
			validationResultRepo['codeOwner'] = 'fail';
		else 
			validationResultRepo['codeOwner'] = 'Access reqd';
	}
	return Promise.resolve(validationResultRepo)
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
					//core.setFailed('Please remove node_modules folder from master');
					validationResultRepo['nodeModules(.TS)'] = 'fail';
				}
				// else {
				// 	//console.log('Success - node_modules folder is failt present in master');
				// 	validationResultRepo['nodeModules(.TS)'] = 'pass';
				// }
			}
			catch (err) {
				//console.log('Success - node_modules folder is failt present in master');
				if(err.status == 404)
					validationResultRepo['nodeModules(.TS)'] = 'pass';
				else
					validationResultRepo['nodeModules(.TS)'] = 'Access reqd1';
			}
		}
		else{
			validationResultRepo['nodeModules(.TS)'] = 'NA';
		}
	}
	catch (err) {
		console.log(err);
		validationResultRepo['nodeModules(.TS)'] = 'Access reqd2';
	}
	return Promise.resolve(validationResultRepo)
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
		let release_flag = false;
		for (let i = 0; i < result.data.length; i++) {
			if (result.data[i].name.substring(0, 9) === 'releases/') {
				release_flag=true;
				var branchname = result.data[i].name;
				try {
					const branch = await octokit.request('GET /repos/{owner}/{repo}/contents', {
						owner: ownername,
						repo: repository,
						ref: branchname,
						headers: {
							Authorization: 'Bearer ' + secret_token
						}
					})
				
					var flag = 0;
					for (let j = 0; j < branch.data.length; j++) {
						if (branch.data[j].name === 'node_modules') {
							flag = 1;
							//console.log('Success - node_modules folder is present in ' + branchname);
							validationResultRepo['releasesnodeModules(.TS)'] = 'pass';
						}
					}
					if (flag === 0) {
						//core.setFailed('Please add node_modules to ' + branchname);
						validationResultRepo['releasesnodeModules(.TS)'] = 'fail';
					}
				}
				catch (err){
					console.log(err);
					validationResultRepo['releasesnodeModules(.TS)'] = 'Access reqd1';
					return Promise.resolve(validationResultRepo)
				}
			}	
		}
		if(!release_flag)
		{
			validationResultRepo['releasesnodeModules(.TS)'] = 'NA'
		}
	}
	catch (err) {
		validationResultRepo['releasesnodeModules(.TS)'] = 'Access reqd2';
		console.log(err);
	}
	return Promise.resolve(validationResultRepo)
}