# ui-auth

## Configuration - AWS Secrets Manager

Look in `deployment/deployment-config.ts` and look at the `DeploymentConfigProperties` interface which should give you a sense of which values are being injected into the app. The values must either be in `hcbs-default` secret or `hcbs-STAGE` to be picked up. The secrets are json objects so they contain multiple values each.

No values should be specified in both secrets. Just don't do it. Ok if that did ever happen the stage value would supercede. But really I promise you don't need it.

## Adding a Test User

Test users are defined in `services/ui-auth/libs/users.json`. On each deploy to the configured environments, a Lambda triggered by CDK reads this file and creates or updates the corresponding users in the environment's Cognito User Pool.

### Add an entry to `users.json`

```json
{
  "username": "newuser@test.com",
  "attributes": [
    { "Name": "email", "Value": "newuser@test.com" },
    { "Name": "given_name", "Value": "First" },
    { "Name": "family_name", "Value": "Last" },
    { "Name": "email_verified", "Value": "true" },
    { "Name": "custom:cms_roles", "Value": "mdcthcbs-state-user" },
    { "Name": "custom:cms_state", "Value": "TX" }
  ]
}
```

The CDK Trigger Lambda (`createUsers.js`) will automatically create the user; no manual Cognito console steps are needed.

`custom:cms_state` is only required for state roles (`mdcthcbs-state-user`, `mdcthcbs-appr`).

### Available roles

| Role value               | Description                                                                                                                        |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| `mdcthcbs-bor`           | Business Owner Representative (Admin)                                                                                              |
| `mdcthcbs-appr`          | Approver                                                                                                                           |
| `mdcthcbs-hd`            | Help Desk                                                                                                                          |
| `mdcthcbs-internal-user` | Internal User                                                                                                                      |
| `mdcthcbs-state-user`    | State User                                                                                                                         |
| `mdcthcbs-state-rep`     | State Rep - present in `users.json` since the initial commit but has never been defined in the `UserRoles` enum. Requires cleanup? |

### Passwords

The user's password is set from the `bootstrapUsersPassword` key stored in AWS Secrets Manager. Each environment has its own secret (`hcbs-default` or `hcbs-<stage>`), so **passwords differ between environments**. Check the relevant Secrets Manager secret for the password to use when logging in.
