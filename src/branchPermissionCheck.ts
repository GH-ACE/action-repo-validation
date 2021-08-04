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
            }
        }
    }
    catch(err){
        // console.log(err);
        validationResultRepo['branchPermission'] = 'Access reqd';
    }
    return Promise.resolve(validationResultRepo)
}

async function branchPermissionCheckHelper(branchname: string, validationResultRepo: any, repository: string, ownername: string, secret_token: string, octokit: Octokit){ 
    
    try{
        const result = await octokit.request('GET /repos/{owner}/{repo}/branches/{branch}/protection/required_pull_request_reviews',{
        repo: repository,
        owner: ownername,
        branch: branchname,
        headers : { Authorization: 'Bearer ' + secret_token },
        dismissal_restrictions: {
           
          }
        }); 
        // console.log(result);
        var approval_count = result.data.required_approving_review_count;
        if(approval_count === 0 ){
            //core.setFailed('Please enable Require review from Code Owners for '+ branchname)
            // console.log(repository + branchname + '-->no');
            validationResultRepo['branchPermission'] = 'No';
        }
        else{
            //console.log('Success - Require pull request reviews before merging is enabled for '+ branchname);
            // console.log(repository + branchname + '-->yes');
            validationResultRepo['branchPermission'] = 'Yes';
        }
        
    } 
    catch(err){
        //core.setFailed('Please enable Require review from Code Owners for '+ branchname)
        validationResultRepo['branchPermission'] = 'Access reqd';
    }        
}
