export default [
  {
    topicPrefix: "aws.mdct.hcbs",
    version: ".v0",
    numPartitions: 1,
    replicationFactor: 3,
    topics: [
      ".qms-reports",
      ".tacm-reports",
      ".ci-reports",
      ".pcp-reports",
      ".wwl-reports",
    ],
  },
];
