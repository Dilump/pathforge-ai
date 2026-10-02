/**
 * PathForge AI — Quiz Generator Lambda
 * Generates a 5-question multiple-choice quiz using Amazon Bedrock for any topic.
 * 
 * Deployed as: AWS Lambda (Node.js 20.x)
 * Trigger:     API Gateway POST /api/v1/ai/generate-quiz
 * Permissions: bedrock:InvokeModel
 */

import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

const client = new BedrockRuntimeClient({ region: process.env.AWS_REGION || "us-east-1" });

const CORS = {
  "Access-Control-Allow-Origin": process.env.ALLOWED_ORIGIN || "*",
  "Access-Control-Allow-Headers": "Content-Type,Authorization",
  "Access-Control-Allow-Methods": "POST,OPTIONS",
  "Content-Type": "application/json",
};

export const handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers: CORS, body: "" };
  }

  try {
    const { topic, difficulty = "Intermediate", careerGoal } = JSON.parse(event.body || "{}");

    if (!topic) {
      return {
        statusCode: 400,
        headers: CORS,
        body: JSON.stringify({ error: "topic is required" }),
      };
    }

    const prompt = `Generate exactly 5 multiple-choice quiz questions about "${topic}" at ${difficulty} level for someone studying to become a ${careerGoal || "software engineer"}.

Return ONLY a valid JSON array (no markdown, no explanation). Each object must have:
{
  "id": "q1" (q1 through q5),
  "question": "Clear technical question string",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctIndex": 0,
  "explanation": "Why the correct answer is right (1-2 sentences)",
  "concept": "The concept being tested (2-4 words)"
}

Requirements:
- Questions should test real understanding, not memorisation
- Options must be plausible (not obviously wrong)
- correctIndex is 0-based index into options array
- Mix conceptual, architectural, and practical questions
- Progressively increase difficulty from q1 to q5`;

    const command = new InvokeModelCommand({
      modelId: "anthropic.claude-3-5-sonnet-20240620-v1:0",
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify({
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: 2000,
        temperature: 0.6,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const res = await client.send(command);
    const resBody = JSON.parse(Buffer.from(res.body).toString("utf-8"));
    const rawText = resBody?.content?.[0]?.text || "[]";

    let questions;
    try {
      questions = JSON.parse(rawText);
    } catch {
      const match = rawText.match(/\[[\s\S]*\]/);
      questions = match ? JSON.parse(match[0]) : [];
    }

    // Validate and sanitize questions
    const sanitized = questions.slice(0, 5).map((q, idx) => ({
      id: q.id || `q${idx + 1}`,
      question: q.question || `Question ${idx + 1} about ${topic}`,
      options: Array.isArray(q.options) && q.options.length === 4 ? q.options : [
        "Option A", "Option B", "Option C", "Option D"
      ],
      correctIndex: typeof q.correctIndex === "number" ? q.correctIndex : 0,
      explanation: q.explanation || "See topic documentation for details.",
      concept: q.concept || topic,
    }));

    return {
      statusCode: 200,
      headers: CORS,
      body: JSON.stringify({
        topic,
        difficulty,
        totalQuestions: sanitized.length,
        questions: sanitized,
        timeLimitMinutes: 10,
        source: "bedrock",
      }),
    };
  } catch (err) {
    console.error("Quiz Lambda error:", err);
    return {
      statusCode: 500,
      headers: CORS,
      body: JSON.stringify({ error: "Quiz generation failed", details: err.message }),
    };
  }
};
