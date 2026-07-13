import { aws_ses as ses, aws_sns as sns, Stack } from "aws-cdk-lib";

/*
 * SES resources are account-level singletons (the cms.hhs.gov domain identity
 * can only exist once per account), so they belong to the once-per-account
 * prerequisites stack rather than the per-stage application stack. The
 * configuration set is attached to the identity as its default, so every
 * email sent from the domain reports rejects, bounces, and complaints to the
 * alert topic.
 */
export function addAdditionalPrerequisites(stack: Stack) {
  const project = process.env.PROJECT!;

  const emailEventTopic = new sns.Topic(stack, "EmailEventTopic");
  new sns.Subscription(stack, "EmailEventSubscription", {
    topic: emailEventTopic,
    endpoint: "mdct-integrations@coforma.io",
    protocol: sns.SubscriptionProtocol.EMAIL,
  });

  const configurationSet = new ses.ConfigurationSet(
    stack,
    "EmailConfigurationSet",
    {
      configurationSetName: `${project}-email-configuration-set`,
      sendingEnabled: true,
      reputationMetrics: true,
    }
  );

  configurationSet.addEventDestination("sns", {
    destination: ses.EventDestination.snsTopic(emailEventTopic),
    configurationSetEventDestinationName: `${project}-email-events`,
    enabled: true,
    events: [
      ses.EmailSendingEvent.REJECT,
      ses.EmailSendingEvent.BOUNCE,
      ses.EmailSendingEvent.COMPLAINT,
    ],
  });

  new ses.EmailIdentity(stack, "SenderDomainIdentity", {
    identity: ses.Identity.domain("cms.hhs.gov"),
    configurationSet,
  });
}
