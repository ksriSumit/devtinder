// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

/*
ABOUT THIS NODE.JS EXAMPLE: This example works with the AWS SDK for JavaScript version 3 (v3),
which is available at https://github.com/aws/aws-sdk-js-v3. This example is in the 'AWS SDK for JavaScript v3 Developer Guide' at
https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/s3-example-creating-buckets.html.

Purpose:
ses_sendemail.js demonstrates how to send an email using Amazon SES.

Running the code:
node ses_sendemail.js
*/

// snippet-start:[ses.JavaScript.email.sendEmailV3]
const { SendEmailCommand } = require("@aws-sdk/client-ses");
const { sesClient } = require("./sesClient"); // Updated path to same directory

const createSendEmailCommand = (toAddress, fromAddress, subject, body) => {
  return new SendEmailCommand({
    Destination: {
      ToAddresses: [toAddress],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: body,
        },
        Text: {
          Charset: "UTF-8",
          Data: body,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: subject,
      },
    },
    Source: fromAddress,
  });
};

const run = async (to, from, subject, body) => {
  const sendEmailCommand = createSendEmailCommand(to, from, subject, body);

  try {
    return await sesClient.send(sendEmailCommand);
  } catch (error) {
    if (error.name === "MessageRejected") {
      return error;
    }
    throw error;
  }
};

module.exports = { run }; // CommonJS export
// snippet-end:[ses.JavaScript.email.sendEmailV3]
