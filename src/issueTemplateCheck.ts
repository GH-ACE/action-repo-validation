import * as core from '@actions/core';
import * as fs from 'fs';

export function issueTemplateCheck() {
    fs.readdir('./.github',(err, folders ) => {
      const includesISSUE_TEMPLATE = folders.includes('ISSUE_TEMPLATE');
      if(includesISSUE_TEMPLATE){
        console.log('Success - ISSUE_TEMPLATE is set up');
        defaultLabelCheck();
      }
      else{
        core.setFailed('Please set up ISSUE_TEMPLATE');
      }
    })
}
  
function defaultLabelCheck(){
    fs.readdir('./.github/ISSUE_TEMPLATE',(err, filelist ) => {
      let i=0;
      while( i < filelist.length ){
        if(getExtension(filelist[i]) === 'md'){
          let data = fs.readFileSync('./.github/ISSUE_TEMPLATE/'+filelist[i]) 
            if(data.includes('need-to-triage')){
              console.log('Success - Default label is need-to-triage');
              break;
            }
        }
        i++;
      }
      if(i==filelist.length)
        core.setFailed('Please set default label as need-to-triage')
    })
}

function getExtension(filename: string) {
    return filename.substring(filename.lastIndexOf('.') + 1, filename.length)   
}
