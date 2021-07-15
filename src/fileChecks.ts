import * as core from '@actions/core';
import * as fs from 'fs';
import { Octokit } from '@octokit/core';

export function readmeChecks(files: string[]){
    const includesReadme = files.includes('README.md');
    if(includesReadme){
        console.log('Success - README file is present');
        fs.readFile('./README.md', function (err, data) {
            //check example
            if(data.includes('Example')){
                console.log('Success - Example workflow is present in README');
            }
            else{
                core.setFailed('Please add Example workflow in README');
            }            
            //check contribution
            if(data.includes('Contribution') || data.includes('Contributing')){
                console.log('Success - Contribution Guidelines are present in README');
            }             
            else{
                core.setFailed('Please add Contribution in README');
            }
        });
    }
    else{
        core.setFailed('Please add README file');
    }
}
  
export function codeOwnerCheck(){
    fs.readdir('./.github', (err, files) => {
        const includesCodeOwners = files.includes('CODEOWNERS');
        if(includesCodeOwners){
            console.log('Success - CODEOWNERS file is present');
        }
        else{
            core.setFailed('Please add CODEOWNERS file');
        }
    })
}
  
function getExtension(filename: string) {
    return filename.substring(filename.lastIndexOf('.') + 1, filename.length)   
}
  
export function nodeModulesCheck(){
    fs.readdir('./src',(err, filelist ) => {
        for(let i = 0; i < filelist.length; i++){
            if(getExtension(filelist[i]) === 'ts'){
                fs.readdir('./', (err, files) => {
                    const includes_node_modules = files.includes('node_modules');
                    if(includes_node_modules){
                        core.setFailed('Please remove node_modules folder from master');
                    }
                    else{
                        console.log('Success - node_modules folder is not present in master');
                    }
                })
                break;
            }
        }
    })
}
  
export async function releasesNodeModulesCheck(repository: string, ownername: string, secret_token: string, octokit: Octokit){ 
    try{
        const result = await octokit.request('GET /repos/{owner}/{repo}/branches',{
        owner: ownername,
        repo: repository,
        headers : { Authorization: 'Bearer ' + secret_token
        }
        });
        for(let i=0;i<result.data.length;i++){
            if(result.data[i].name.substring(0,9) === 'releases/'){
                var branchname = result.data[i].name;
                const branch = await octokit.request('GET /repos/{owner}/{repo}/contents',{
                owner: ownername,
                repo: repository,
                ref: branchname,
                headers : { Authorization: 'Bearer ' + secret_token
                }
                })
                var flag=0;
                for(let j=0;j<branch.data.length;j++){
                    if(branch.data[j].name === 'node_modules'){
                        flag=1;
                        console.log('Success - node_modules folder is present in '+ branchname);
                    } 
                }
                if(flag===0){
                    core.setFailed('Please add node_modules to '+ branchname);
                }
            }
        }
    }
    catch(err){
        console.log(err);
    }       
}
