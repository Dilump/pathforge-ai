/**
 * PathForge AI — Career Coach Lambda
 * Receives a chat message + learner context and responds using Amazon Bedrock (Claude 3.5 Sonnet).
 * 
 * Deployed as: AWS Lambda (Node.js 20.x)
 * Trigger:     API Gateway POST /api/v1/ai/coach
 * Permissions: bedrock:InvokeModel on Claude 3.5 Sonnet ARN
 */

import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

const client = new BedrockRuntimeClient({ region: process.env.AWS_REGION || "us-east-1" });

// CORS headers — update ALLOWED_ORIGIN with your Amplify domain after deployment
const CORS = {
  "Access-Control-Allow-Origin": process.env.ALLOWED_ORIGIN || "*",
  "Access-Control-Allow-Headers": "Content-Type,Authorization",
  "Access-Control-Allow-Methods": "POST,OPTIONS",
  "Content-Type": "application/json",
};

export const handler = async (event) => {
  // Handle CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers: CORS, body: "" };
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const { message, context } = body;

    if (!message || typeof message !== "string") {
      return {
        statusCode: 400,
        headers: CORS,
        body: JSON.stringify({ error: "message field is required" }),
      };
    }

    // Build a rich system prompt personalised to the learner's context
    const career = context?.careerGoal || "Software Engineer";
    const currentMission = context?.currentMission?.title || "current topic";
    const overallProgress = context?.stats?.overallProgress || 0;
    const streak = context?.stats?.currentStreak || 0;
    const skills = context?.skills || [];

    const systemPrompt = `You are PathForge AI Career Coach — an expert career advisor and technical mentor specialising in helping early-career learners transition into technology roles.

Current learner profile:
- Target career: ${career}
- Current learning mission: "${currentMission}"
- Overall roadmap progress: ${overallProgress}%
- Current learning streak: ${streak} days
- Skills being developed: ${skills.slice(0, 5).join(", ") || "various technology skills"}

Your role:
1. Give concrete, actionable advice tailored to this specific learner.
2. Reference their career goal (${career}) and current mission ("${currentMission}") in your answers.
3. Be encouraging but realistic — celebrate progress, surface gaps with solutions.
4. Keep responses focused: 3–5 sentences or bullet points max unless deep detail is needed.
5. Where relevant, mention real AWS services, industry tools, or interview expectations.
6. Always end with one actionable "next step" the learner can take today.

Respond in clear markdown with **bold** for key terms and - bullets for lists.`;

    const requestBody = {
      anthropic_version: "bedrock-2023-05-31",
      max_tokens: 600,
      temperature: 0.7,
      system: systemPrompt,
      messages: [{ role: "user", content: message }],
    };

    const command = new InvokeModelCommand({
      modelId: "anthropic.claude-3-5-sonnet-20240620-v1:0",
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify(requestBody),
    });

    const response = await client.send(command);
    const responseBody = JSON.parse(Buffer.from(response.body).toString("utf-8"));
    const reply = responseBody?.content?.[0]?.text || "I'm here to help! Please ask me anything about your learning journey.";

    return {
      statusCode: 200,
      headers: CORS,
      body: JSON.stringify({ reply, model: "claude-3-5-sonnet", source: "bedrock" }),
    };
  } catch (err) {
    console.error("Coach Lambda error:", err);
    return {
      statusCode: 500,
      headers: CORS,
      body: JSON.stringify({ error: "AI service temporarily unavailable. Please try again.", details: err.message }),
    };
  }
};
