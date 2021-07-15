import * as core from '@actions/core';
import { Octokit } from '@octokit/core';

export async function standardLabelsCheck(repository: string, validationResultRepo: any, ownername: string, secret_token: string, octokit: Octokit){
    try{
      const result = await octokit.request('GET /repos/{owner}/{repo}/labels',{
        repo: repository,
        owner: ownername,
        headers : { 
          Authorization: 'Bearer ' + secret_token,
        },
      }); 
      let labelArray = result.data;
      var existingLabels = new Set();
      var absentLabels = new Array();
      for(let i=0; i<labelArray.length; i++){
        existingLabels.add(labelArray[i].name);
      }
      const standardLabelsArray = ['need-to-triage', 'idle', 'question', 'bug', 'P0', 'P1', 'enhancement', 'documentation', 'backlog', 'performance-issue', 'waiting-for-customer']
      for(let i=0; i<standardLabelsArray.length; i++){
        let label = standardLabelsArray[i];
        if(!existingLabels.has(label)){
          absentLabels.push(label);
        }
      }
      if(absentLabels.length==0){
        //console.log('Success - Standard labels are present')
        validationResultRepo['standardLabelsCheck'] = 'Yes';
      }
      else{
        let errorOutput = absentLabels[0];
        for(let i=1; i<absentLabels.length; i++){
          errorOutput = errorOutput + ', ' + absentLabels[i];
        }
        //core.setFailed('Please add standard labels: '+ errorOutput);
        validationResultRepo['standardLabelsCheck'] = 'No';
      }
    }
    catch(err){
      //console.log(err);
      validationResultRepo['standardLabelsCheck'] = 'No';
    }
    return Promise.resolve(validationResultRepo)
  }