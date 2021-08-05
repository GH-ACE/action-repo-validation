import * as core from '@actions/core';
import * as github from '@actions/github';
import { Octokit } from '@octokit/core';
import { readmeChecks, codeOwnerCheck, nodeModulesCheck, releasesnodeModulesCheck } from './fileChecks'
import { branchPermissionCheck } from './branchPermissionCheck'
import { vulnerabilityBotCheck } from './vulnerabilityBotCheck'
import { issueTemplateCheck } from './issueTemplateCheck'
import { standardLabelsCheck } from './standardLabelsCheck'

async function main() {

    var secret_token = core.getInput('GITHUB_TOKEN');
    const octokit = new Octokit({
        auth: secret_token,
    });
    var repositories = core.getInput('repositories');
    var repositories_list = repositories.split(',');
    // const ownername = 'azure';//github.context.repo.owner;
    var repositoryName = '';
    var repository='';
    var ownerName='';
    var validationResult = [];
    for (var i = 0; i < repositories_list.length; i++) {
        repositoryName = repositories_list[i];
        repository = repositoryName.split('/')[1];
        ownerName = repositoryName.split('/')[0];
        console.log('*******' + repository + '*******');
        var validationResultRepo: any = {
            "repoName": repository,
            "readme": "unknown",
            "codeOwner": "unknown",
            "branchPermission": "unknown",
            "vulnerabilityBot": "unknown",
            "issueTemplate": "unknown",
            "standardLabels": "unknown",
            "nodeModules(.TS)": "unknown",
            "releasesnodeModules(.TS)": "unknown",
        }
        // Check for example and Contribution in README
        validationResultRepo = await readmeChecks(repository, validationResultRepo, ownername, secret_token, octokit);
        //Check for CODEOWNERS file in .github folder
        validationResultRepo = await codeOwnerCheck(repository, validationResultRepo, ownername, secret_token, octokit);
        //Check if nodemodules folder is present in master branch for typescript action
        validationResultRepo = await nodeModulesCheck(repository, validationResultRepo, ownername, secret_token, octokit);
        //check for branch permissions in main/master and releases/*
        validationResultRepo = await branchPermissionCheck(repository, validationResultRepo, ownername, secret_token, octokit);
        //check for nodemodules folder in releases/*
        validationResultRepo = await releasesnodeModulesCheck(repository, validationResultRepo, ownername, secret_token, octokit);
        //check for security/vulnerability bot
        validationResultRepo = await vulnerabilityBotCheck(repository, validationResultRepo, ownername, secret_token, octokit);
        //1. check whether issue-template has been set up and 2. default label is need-to-triage
        validationResultRepo = await issueTemplateCheck(repository, validationResultRepo, ownername, secret_token, octokit);
        //Check whether standard labels have been set up
        validationResultRepo = await standardLabelsCheck(repository, validationResultRepo, ownername, secret_token, octokit)
        validationResult.push(validationResultRepo);
    }
    console.log(JSON.parse(JSON.stringify(validationResult)));
    var result = JSON.stringify(validationResult, null, '\t').replace(/\\"/g, '"');
    core.setOutput("validationResult", result);
}

main();
