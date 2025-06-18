// lib/aws/sns.ts
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
  throw new Error("AWS credentials are not properly configured");
}

if (!process.env.AWS_SNS_TOPIC_ARN) {
  throw new Error("AWS SNS Topic ARN is not configured");
}

const sns = new SNSClient({
  region: "eu-north-1", // Example: "ap-south-1"
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export const sendSignupEmail = async (email: string) => {
  if (!email) {
    throw new Error("Email is required");
  }

  try {
    console.log(
      `Attempting to send SNS notification to topic: ${process.env.AWS_SNS_TOPIC_ARN}`
    );

    const command = new PublishCommand({
      TopicArn: process.env.AWS_SNS_TOPIC_ARN,
      Subject: "🎉 New User Signup",
      Message: `A new user just signed up with the email: ${email}`,
    });

    const response = await sns.send(command);
    console.log(`✅ Email sent to SNS for ${email}`);
    console.log("SNS Response:", JSON.stringify(response, null, 2));
    return response;
  } catch (error) {
    console.error("❌ SNS Error Details:", {
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      email,
      topicArn: process.env.AWS_SNS_TOPIC_ARN,
    });
    throw error;
  }
};
