# GitHub Action for Validating Action Repositories
A GitHub Action to validate action repositories. There are certain validations that need to be checked in an Action repository. For instance, it is ideal for an Action repository to have a README file with an Example workflow and Contribution Guidelines.

With this Action, you can check for essential [Validations for an Action repository](https://github.com/Azure/actions/blob/main/docs/validations-action-repo.md). For every check, either a success message will be displayed or an error will be thrown.   

## Input
`GITHUB_TOKEN`: Personal access token of your repository. Uses your access token PAT_TOKEN.

## Output
All required validations will be run and a success mesage or an error will be shown in the console as output.

## Example
```yml
name: "build"

on:
  pull_request:
  push:
    branches:
      - main

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v1
    - name: Testing action
      uses: ishitachawla/action-repo-validation@releases/1
      with:
        GITHUB_TOKEN: ${{ secrets.PAT_Token }}
```

# Contributing

This project welcomes contributions and suggestions.  Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.opensource.microsoft.com.

When you submit a pull request, a CLA bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., status check, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.
