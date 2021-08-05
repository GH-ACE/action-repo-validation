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
                if(validationResultRepo['branchPermission'] == 'fail')
                    break;
            }
        }
    }
    catch(err){
        validationResultRepo['branchPermission'] = err.status;

    return Promise.resolve(validationResultRepo);
}

async function branchPermissionCheckHelper(branchname: string, validationResultRepo: any, repository: string, ownername: string, secret_token: string, octokit: Octokit){ 
    
    try{
        const result = await octokit.request('GET /repos/{owner}/{repo}/branches/{branch}/protection/',{
        repo: repository,
        owner: ownername,
        branch: branchname,
        headers : { Authorization: 'Bearer ' + secret_token , accept: 'application/vnd.github.luke-cage-preview+json'},
        }); 
      
        if(result.status == 200){
            validationResultRepo['branchPermission'] = 'pass';
        }
        else{
            validationResultRepo['branchPermission'] = 'fail';
        }      
    } 
    catch(err){
        if(err.status == 404)
            validationResultRepo['branchPermission'] = 'fail';
        else
            validationResultRepo['branchPermission'] = err.status;
    }        
}
