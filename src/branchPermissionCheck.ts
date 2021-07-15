import * as core from '@actions/core';
import { Octokit } from '@octokit/core';

export async function branchPermissionCheck(repository: string, validationResultRepo: any, ownername: string, secret_token: string, octokit: Octokit){
    try{
        const result = await octokit.request('GET /repos/{owner}/{repo}/branches',{
        owner: ownername,
        repo: repository,
        headers : { Authorization: 'Bearer ' + secret_token
        }
        });
        for(let i=0;i<result.data.length;i++){
            if(result.data[i].name.substring(0,9) === 'releases/' || result.data[i].name === 'main' || result.data[i].name === 'master' ){
                var branchname = result.data[i].name;
                branchPermissionCheckHelper(branchname, validationResultRepo, repository, ownername, secret_token, octokit);
            }
        }
    }
    catch(err){
        console.log(err);
    }
    return Promise.resolve(validationResultRepo)
}

async function branchPermissionCheckHelper(branchname: string, validationResultRepo: any, repository: string, ownername: string, secret_token: string, octokit: Octokit){ 
    try{
        const result = await octokit.request('GET /repos/{owner}/{repo}/branches/{branch}/protection/required_pull_request_reviews',{
        repo: repository,
        owner: ownername,
        branch: branchname,
        headers : { Authorization: 'Bearer ' + secret_token
        }
        }); 
        if(result.data.require_code_owner_reviews === false){
            //core.setFailed('Please enable Require review from Code Owners for '+ branchname)
            validationResultRepo['branchPermissionCheck'] = 'No';
        }
        else{
            //console.log('Success - Require pull request reviews before merging is enabled for '+ branchname);
            validationResultRepo['branchPermissionCheck'] = 'Yes';
        }
    } 
    catch(err){
        //core.setFailed('Please enable Require review from Code Owners for '+ branchname)
        validationResultRepo['branchPermissionCheck'] = 'No';
    }        
}