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
        // console.log('please print something');
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
        // console.log(err);
        validationResultRepo['branchPermission'] = 'Access reqd';
    }
    return Promise.resolve(validationResultRepo);
}

async function branchPermissionCheckHelper(branchname: string, validationResultRepo: any, repository: string, ownername: string, secret_token: string, octokit: Octokit){ 
    
    try{
        const result = await octokit.request('GET /repos/{owner}/{repo}/branches/{branch}/protection/required_pull_request_reviews',{
        repo: repository,
        owner: ownername,
        branch: branchname,
        headers : { Authorization: 'Bearer ' + secret_token , accept: 'application/vnd.github.luke-cage-preview+json'},
        }); 
        console.log(result);
        var approval_count = result.data.required_approving_review_count;
        console.log(approval_count + '---->' + repository)
        if(approval_count != 0 && approval_count != undefined ){
            //core.setFailed('Please enable Require review from Code Owners for '+ branchname)
            // console.log(repository + branchname + '-->fail');
            validationResultRepo['branchPermission'] = 'pass';
        }
        else{
            //console.log('Success - Require pull request reviews before merging is enabled for '+ branchname);
            // console.log(repository + branchname + '-->pass');
            validationResultRepo['branchPermission'] = 'fail';
        }
        
    } 
    catch(err){
        //core.setFailed('Please enable Require review from Code Owners for '+ branchname)
        console.log(err);
        if(err.status == 404 && err.response.data.message == 'Branch not protected'){
            validationResultRepo['branchPermission'] = 'fail';
        }
        else
            validationResultRepo['branchPermission'] = 'Access reqd';
    }        
}
