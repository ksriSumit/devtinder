// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

/*
ABOUT THIS NODE.JS EXAMPLE: This example works with the AWS SDK for JavaScript version 3 (v3),
which is available at https://github.com/aws/aws-sdk-js-v3. This example is in the 'AWS SDK for JavaScript v3 Developer Guide' at
https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/ses-examples.html.

Purpose:
sesClient.js is a helper function that creates an Amazon Simple Email Services (Amazon SES) service client.

*/
// snippet-start:[ses.JavaScript.createclientv3]
const { SESClient } = require("@aws-sdk/client-ses");
require("dotenv").config();
// Set the AWS Region.
const REGION = process.env.AWS_REGION;
// Create SES service object.
const sesClient = new SESClient({
  region: REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY, // Replace with your AWS key
    secretAccessKey: process.env.AWS_SECRET_KEY, // Replace with your AWS secret
  },
});
module.exports = { sesClient };
// snippet-end:[ses.JavaScript.createclientv3]
