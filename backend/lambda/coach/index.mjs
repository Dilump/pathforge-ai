/**
 * PathForge AI — Career Coach Lambda
 * Uses Amazon Bedrock with Amazon Nova Micro.
 *
 * Runtime: AWS Lambda Node.js 20.x
 * Trigger: API Gateway POST /api/v1/ai/coach
 */

import {
  BedrockRuntimeClient,
  ConverseCommand,
} from "@aws-sdk/client-bedrock-runtime";

const client = new BedrockRuntimeClient({
  region: "us-west-2",
});

const CORS = {
  "Access-Control-Allow-Origin": process.env.ALLOWED_ORIGIN || "*",
  "Access-Control-Allow-Headers": "Content-Type,Authorization",
  "Access-Control-Allow-Methods": "POST,OPTIONS",
  "Content-Type": "application/json",
};

export const handler = async (event) => {
  // Handle CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: CORS,
      body: "",
    };
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const { message, context } = body;

    if (!message || typeof message !== "string") {
      return {
        statusCode: 400,
        headers: CORS,
        body: JSON.stringify({
          error: "message field is required",
        }),
      };
    }

    // Learner context
    const career = context?.careerGoal || "Software Engineer";
    const currentMission =
      context?.currentMission?.title || "current topic";
    const overallProgress =
      context?.stats?.overallProgress || 0;
    const streak =
      context?.stats?.currentStreak || 0;
    const skills =
      context?.skills || [];

    const systemPrompt = `You are PathForge AI Career Coach — an expert career advisor and technical mentor specialising in helping early-career learners transition into technology roles.

Current learner profile:
- Target career: ${career}
- Current learning mission: "${currentMission}"
- Overall roadmap progress: ${overallProgress}%
- Current learning streak: ${streak} days
- Skills being developed: ${
      skills.slice(0, 5).join(", ") ||
      "various technology skills"
    }

Your role:
1. Give concrete, actionable advice tailored to this specific learner.
2. Reference their career goal (${career}) and current mission ("${currentMission}") when relevant.
3. Be encouraging but realistic.
4. Keep responses focused and concise.
5. Where relevant, mention real AWS services, industry tools, or interview expectations.
6. End with one actionable next step the learner can take today.

Respond in clear markdown.`;

    const command = new ConverseCommand({
      modelId: "amazon.nova-micro-v1:0",

      system: [
        {
          text: systemPrompt,
        },
      ],

      messages: [
        {
          role: "user",
          content: [
            {
              text: message,
            },
          ],
        },
      ],

      inferenceConfig: {
        maxTokens: 600,
        temperature: 0.7,
      },
    });

    const response = await client.send(command);

    const reply =
      response?.output?.message?.content?.[0]?.text ||
      "I'm here to help! Please ask me anything about your learning journey.";

    return {
      statusCode: 200,
      headers: CORS,
      body: JSON.stringify({
        reply,
        model: "amazon.nova-micro-v1:0",
        source: "bedrock",
      }),
    };
  } catch (err) {
    console.error("Coach Lambda error:", err);

    return {
      statusCode: 500,
      headers: CORS,
      body: JSON.stringify({
        error: "AI service temporarily unavailable. Please try again.",
        details: err.message,
      }),
    };
  }
};
