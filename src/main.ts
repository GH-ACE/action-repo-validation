import * as core from '@actions/core';
import * as github from '@actions/github';
import * as fs from 'fs';
import { Octokit } from '@octokit/core';
import {readmeChecks, codeOwnerCheck, nodeModulesCheck, releasesNodeModulesCheck} from './fileChecks'
import {branchPermissionCheck} from './branchPermissionCheck'
import {vulnerabilityBotCheck} from './vulnerabilityBotCheck'
import {issueTemplateCheck} from './issueTemplateCheck'
import {standardLabelsCheck} from './standardLabelsCheck'

async function main() { 
  fs.readdir('./', (err, files) => {
    if (err){
      console.log(err);
    }
    else{
      var secret_token = core.getInput('GITHUB_TOKEN');
      const octokit = new Octokit({
      auth: secret_token,
      });
      const repository = github.context.repo.repo;
      const ownername = github.context.repo.owner;
      //Check for example and Contribution in README
      readmeChecks(files);
      //Check for CODEOWNERS file in .github folder
      codeOwnerCheck();
      //Check if nodemodules folder is present in master branch for typescript action
      nodeModulesCheck();
      //check for branch permissions in main/master and releases/*
      branchPermissionCheck(repository, ownername, secret_token, octokit);
      //check for nodemodules folder in releases/*
      releasesNodeModulesCheck(repository, ownername, secret_token, octokit);
      //check for security/vulnerability bot
      vulnerabilityBotCheck(repository, ownername, secret_token, octokit);
      //1. check whether issue-template has been set up and 2. default label is need-to-triage
      issueTemplateCheck();
      //Check whether standard labels have been set up
      standardLabelsCheck(repository, ownername, secret_token, octokit)
    }
  })
}

main();
