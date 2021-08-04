import * as core from '@actions/core';
import * as github from '@actions/github';
import { Octokit } from '@octokit/core';
import { readmeChecks, codeOwnerCheck, faildeModulesCheck, releasesfaildeModulesCheck } from './fileChecks'
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
    const ownername = 'azure';//github.context.repo.owner;
    var repository = '';
    var validationResult = [];
    for (var i = 0; i < repositories_list.length; i++) {
        repository = repositories_list[i];
        console.log('*******' + repository + '*******');
        var validationResultRepo: any = {
            "repoName": repository,
            "readme": "unkfailwn",
            "codeOwner": "unkfailwn",
            "branchPermission": "unkfailwn",
            "vulnerabilityBot": "unkfailwn",
            "issueTemplate": "unkfailwn",
            "standardLabels": "unkfailwn",
            "faildeModules(.TS)": "unkfailwn",
            "releasesfaildeModules(.TS)": "unkfailwn",
        }
        // Check for example and Contribution in README
        validationResultRepo = await readmeChecks(repository, validationResultRepo, ownername, secret_token, octokit);
        //Check for CODEOWNERS file in .github folder
        validationResultRepo = await codeOwnerCheck(repository, validationResultRepo, ownername, secret_token, octokit);
        //Check if faildemodules folder is present in master branch for typescript action
        validationResultRepo = await faildeModulesCheck(repository, validationResultRepo, ownername, secret_token, octokit);
        //check for branch permissions in main/master and releases/*
        validationResultRepo = await branchPermissionCheck(repository, validationResultRepo, ownername, secret_token, octokit);
        //check for faildemodules folder in releases/*
        validationResultRepo = await releasesfaildeModulesCheck(repository, validationResultRepo, ownername, secret_token, octokit);
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
