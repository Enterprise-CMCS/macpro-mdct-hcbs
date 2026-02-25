# MDCT-HCBS

[![CodeQL](https://github.com/Enterprise-CMCS/macpro-mdct-hcbs/actions/workflows/codeql-analysis.yml/badge.svg?branch=main)](https://github.com/Enterprise-CMCS/macpro-mdct-hcbs/actions/workflows/codeql-analysis.yml)
[![Maintainability](https://qlty.sh/badges/5213e13f-d38a-4a72-aa4c-87979bb19c6b/maintainability.svg)](https://qlty.sh/gh/Enterprise-CMCS/projects/macpro-mdct-hcbs)
[![Code Coverage](https://qlty.sh/badges/5213e13f-d38a-4a72-aa4c-87979bb19c6b/test_coverage.svg)](https://qlty.sh/gh/Enterprise-CMCS/projects/macpro-mdct-hcbs)

### Integration Environment Deploy Status:

| Branch     | Build Status                                                                                                            |
| ---------- | ----------------------------------------------------------------------------------------------------------------------- |
| main       | ![deploy](https://github.com/Enterprise-CMCS/macpro-mdct-hcbs/actions/workflows/deploy.yml/badge.svg)                   |
| val        | ![deploy](https://github.com/Enterprise-CMCS/macpro-mdct-hcbs/actions/workflows/deploy.yml/badge.svg?branch=val)        |
| production | ![deploy](https://github.com/Enterprise-CMCS/macpro-mdct-hcbs/actions/workflows/deploy.yml/badge.svg?branch=production) |

HCBS is the CMCS MDCT application for collecting state data related to Home- and Community-Based Services (HCBS) programs and performance. The collected data assists CMCS in monitoring, managing, and better understanding Medicaid and CHIP programs.

HCBS are types of person-centered care delivered in the home and community which address the needs of people with functional limitations who need assistance with everyday activities. They are often designed to enable people to stay in their homes, rather than moving to a facility for care. The programs generally fall into two categories: health services (which meet medical needs) and human services (which support activities of daily living).

## Table of Contents

- [Quick Start](#quick-start)
- [Testing](#testing)
- [Deployments](#deployments)
- [Architecture](#architecture)
- [Copyright and license](#copyright-and-license)

## Quick Start

### Running MDCT Workspace Setup

Team members are encouraged to setup all MDCT Products using the script located in the [MDCT Tools Repository](https://github.com/Enterprise-CMCS/macpro-mdct-tools). Please refer to the README for instructions running the MDCT Workspace Setup. After Running workspace setup team members can refer to the Running the project locally section below to proceed with running the application.

### One time only

**If you have run the MDCT Setup Script this section can be skipped**

Before starting the project we're going to install some tools. We recommend having Homebrew installed if you haven't already to install other dependencies. Open up terminal on your mac and run the following:

- (Optional) Install [Homebrew](https://brew.sh/): `/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`

- Install nvm: `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.37.2/install.sh | bash`
- Install specified version of node. We enforce using a specific version of node, specified in the file `.nvmrc`. This version matches the Lambda runtime. We recommend managing node versions using [NVM](https://github.com/nvm-sh/nvm#installing-and-updating): `nvm install`, then `nvm use`
- Install pre-commit on your machine with either: `pip install pre-commit` or `brew install pre-commit`

### Setting up the project locally

**If you have run the MDCT Setup Script this section can be skipped**

1. Clone the repo: `git clone https://github.com/Enterprise-CMCS/macpro-mdct-hcbs.git`
2. Ensure you either have a 1Password account and have 1Password CLI installed. Alternatively, reach out to the team for an example of .env files
3. In the root directory run `pre-commit install`

### Running the project locally

In the root of the project run `./run local --update-env` to pull in values from 1Password and run the project. Alternatively, if you do not have a 1Password account you will need to reach out to an MDCT team member for values for your `.env `. Then you can run `./run local` to use a static manually populated `.env` file.

### Logging in

(Make sure you've finished setting up the project locally above before moving on to this step!)

Once you've run `./run local` you'll find yourself on a login page at localhost:3000. For local development there is a list of users that can be found at services/ui-auth/libs/users.json. That's where you can grab an email to fill in.

For a password to that user, please ask a fellow developer.

### Running DynamoDB locally

In order to run DynamoDB locally you will need to have java installed on your system. The MDCT Workspace Setup script installs that for you.

If you cannot run the MDCT Workspace setup script see below for manual instructions:

M1 Mac users can download [java from azul](https://www.azul.com/downloads/?version=java-18-sts&os=macos&architecture=x86-64-bit&package=jdk). _Note that you'll need the x86 architecture Java for this to work_. You can verify the installation with `java --version`. Otherwise [install java from here](https://java.com/en/download/).

To view your database after the application is up and running you can install the [dynamodb-admin tool](https://www.npmjs.com/package/dynamodb-admin).

- Install and run `DYNAMO_ENDPOINT=http://localhost:4566 dynamodb-admin` in a new terminal window

#### DynamoDB Local failed to start with code 1

If you're getting an error such as `inaccessible host: 'localhost' at port '4566'`, some steps to try:

- confirm that you're on the right Java version -- if you have an M1 mac, you need an [x86 install](https://www.azul.com/downloads/?version=java-18-sts&os=macos&architecture=x86-64-bit&package=jdk#zulu)
- delete your `services/database/.dynamodb` directory and then run `dev local` in your terminal

### Local Development Additional Info

Local dev is configured as a Typescript project. The entrypoint in `./src/run.ts` manages running the moving pieces locally: the API, database, filestore, and frontend.

Local dev is built around the cdk setup which gets run locally by Localstack.

Local authorization uses Cognito from the main/master stack in dev. The credentials are injected locally by the `./run update-env` command which fetches values from 1password and puts them into a gitignored `.env` file.

## Testing

### Unit Testing

We use Jest for unit tests.

To run all frontend unit tests:

```
cd services/ui-src/
yarn test
```

To run all backend unit tests:

```
cd services/app-api/
yarn test
```

In either of these directories you can also check code coverage with

```
yarn coverage
```

Live reload all tests

```
yarn test --watch
```

### Integration Testing

We use Playwright for integration tests. See the `tests/playwright` directory.

### Accessibility Testing

We use [axe](https://www.deque.com/axe/) and [pa11y](https://github.com/pa11y/pa11y) for primary accessibility testing.

Unit tests use [jest-axe](https://github.com/nickcolley/jest-axe), [pa11y](https://github.com/pa11y/pa11y), and [HTML Code Sniffer](https://squizlabs.github.io/HTML_CodeSniffer/).

Integration tests use [@axe-core/playwright](https://github.com/dequelabs/axe-core-npm).

### oxfmt

---

This repo uses the code formatter [oxfmt](https://oxc.rs/docs/guide/usage/formatter.html). The formatter is run automatically in a pre-commit hook. Additionally, oxfmt can be run on file save in many IDEs or run ad hoc from the command line.

#### oxc with VS Code

---

The oxc extension can be downloaded from the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=oxc.oxc-vscode).

Once installed, open VS Code's Preferences. Search for "Format on Save". Clicking the checkbox should engage the oxfmt formatter on file save.

VS Code is used almost ubiquitously across the current development team, generally speaking this tools should also work for most other IDEs.

#### oxfmt CLI

---

Using this command, or a variant of it, will format all matching files in the codebase and write the changes. oxfmt has complete [CLI documentation](https://oxc.rs/docs/guide/usage/formatter.html) on their website.

```bash
yarn oxfmt
```

### oxlint CLI

All changed files will also be checked for formatting via the pre-commit hook.

oxlint works in a similar manner to oxfmt for all code linting.

```bash
yarn oxlint --deny-warnings
```

### Github Action Script Checks

On a push to the repository or opening a pull request the [deploy.yml](https://github.com/Enterprise-CMCS/macpro-mdct-hcbs/blob/main/.github/workflows/deploy.yml) file runs. This script sets up and does a number of things. For a simple push it's mostly checking code coverage.

Upon opening a pull request into the main branch the scripts will also trigger a Playwright E2E and an A11y step to ensure that the code quality is still passing the End-to-End and accessibility tests.

## Deployments

This application is built and deployed via GitHub Actions.

### Deployment Steps

**Please Note: Do Not Squash Your Merge Into val Or production When Submitting Your Pull Request.**

We have 3 main branches that we work out of:

- Main (Pointed to [https://mdcthcbsdev.cms.gov/](https://mdcthcbsdev.cms.gov/)) is our development branch
- Val (Pointed to [https://mdcthcbsval.cms.gov/](https://mdcthcbsval.cms.gov/)) is our beta branch
- Production (Pointed to [http://mdcthcbs.cms.gov/](http://mdcthcbs.cms.gov/)) is our release branch

When a pull request is approved and merged into main the deploy script will spin up and upon completion will deploy to [https://mdcthcbsdev.cms.gov/](https://mdcthcbsdev.cms.gov/). If a user wants to deploy to val they can initiate the [Create Deployment PR action](https://github.com/Enterprise-CMCS/macpro-mdct-hcbs/actions/workflows/create-pr.yml) in GitHub actions, setting the target_branch variable to the destination environment. Once that pull request is approved, the deploy script will run again and upon completion will deploy to [https://mdcthcbsval.cms.gov/](https://mdcthcbsval.cms.gov/). So to quickly break it down:

- Submit pull request of your code to main
- Approve pull request and merge into main
- Deploy script runs and will deploy to [https://mdcthcbsdev.cms.gov/](https://mdcthcbsdev.cms.gov/)
- [Create Deployment PR action](https://github.com/Enterprise-CMCS/macpro-mdct-hcbs/actions/workflows/create-pr.yml) into val
- Approve pull request and **DO NOT SQUASH YOUR MERGE**, just merge it into val
- Deploy script runs and will deploy to [https://mdcthcbsval.cms.gov/](https://mdcthcbsval.cms.gov/)
- [Create Deployment PR action](https://github.com/Enterprise-CMCS/macpro-mdct-hcbs/actions/workflows/create-pr.yml) into production
- Approve pull request and **DO NOT SQUASH YOUR MERGE**, just merge it into production
- Deploy script runs and will deploy to [http://mdcthcbs.cms.gov/](http://mdcthcbs.cms.gov/).

If you have a PR that needs Product/Design input, the easiest way to get it to them is to use the cloudfront site from Github. Go to your PR and the `Checks` tab, then `Deploy` tab. Click `Summary` and you will find the cloudfront URL in the deploy summary (once that step completes).

## BigMac Kafka Integration

HCBS pipes updates from the report object tables to BigMac for downstream consumption. To add a topic for a new report type, update the following locations:

- `deployment/topics.ts`
  - Any new table with come with streaming (tables are defined here: `deployment/data.ts`)
- `services/app-api/handlers/kafka/post/postKafkaData.ts` - Add the bucket and table names into the appropriate arrays. They will be parsed with their event types accordingly.
- `services/topics/createTopics.js` - Declare the new topic names. Both the stream name for the bucket and table should be added here.

## Architecture

![Architecture Diagram](./.images/architecture.svg?raw=true)

**General Structure** - React frontend that renders a form for a user to fill out, Node backend that uses Dynamo to store and validate forms.
Dropdown and dynamic fields are not currently supported as nested child fields. All other field types are.

## GitHub Actions Secret Management

- Secrets are added to GitHub secrets by GitHub Admins
- Development secrets are maintained in a 1Password vault

## Copyright and license

[![License](https://img.shields.io/badge/License-CC0--1.0--Universal-blue.svg)](https://creativecommons.org/publicdomain/zero/1.0/legalcode)

See [LICENSE](LICENSE.md) for full details.

```text
As a work of the United States Government, this project is
in the public domain within the United States.

Additionally, we waive copyright and related rights in the
work worldwide through the CC0 1.0 Universal public domain dedication.
```
