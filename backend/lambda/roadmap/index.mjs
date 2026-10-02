/**
 * PathForge AI — Roadmap Generator Lambda
 * Generates a personalised week-by-week learning roadmap using Amazon Bedrock.
 * 
 * Deployed as: AWS Lambda (Node.js 20.x)
 * Trigger:     API Gateway POST /api/v1/ai/generate-roadmap
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
    const { profile, skillGapAnalysis } = JSON.parse(event.body || "{}");
    if (!profile?.careerGoal) {
      return {
        statusCode: 400,
        headers: CORS,
        body: JSON.stringify({ error: "profile.careerGoal is required" }),
      };
    }

    const totalWeeks = profile.roadmapDuration || 8;
    const weeklyHours = profile.weeklyHours || 8;
    const majorGaps = skillGapAnalysis?.majorGaps?.join(", ") || "core fundamentals";
    const strong = skillGapAnalysis?.strong?.join(", ") || "none identified";

    const prompt = `Generate a ${totalWeeks}-week learning roadmap for someone becoming a ${profile.careerGoal}.

Learner context:
- Weekly study time: ${weeklyHours} hours
- Strong skills: ${strong}
- Skills needing work: ${majorGaps}
- Learning style: ${profile.learningStyle || "self-paced"}

Return ONLY a valid JSON array (no markdown, no explanation) with exactly ${totalWeeks} objects, each having:
{
  "week": number,
  "title": "Mission title (3-6 words)",
  "objective": "What the learner will be able to do after this week (1 sentence)",
  "skills": ["skill1", "skill2"],
  "difficulty": "Beginner|Intermediate|Advanced",
  "estimatedHours": ${weeklyHours},
  "keyTopics": ["topic1", "topic2", "topic3"]
}

Make each week build progressively. Start with foundations, end with a capstone project.`;

    const command = new InvokeModelCommand({
      modelId: "anthropic.claude-3-5-sonnet-20240620-v1:0",
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify({
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: 2000,
        temperature: 0.5,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const res = await client.send(command);
    const resBody = JSON.parse(Buffer.from(res.body).toString("utf-8"));
    const rawText = resBody?.content?.[0]?.text || "[]";

    // Parse the JSON array from Claude's response
    let weeks;
    try {
      weeks = JSON.parse(rawText);
    } catch {
      // Fallback: extract JSON array from response text
      const match = rawText.match(/\[[\s\S]*\]/);
      weeks = match ? JSON.parse(match[0]) : [];
    }

    // Enrich with full mission structure expected by the frontend
    const missions = weeks.map((w, idx) => ({
      id: `mission-${w.week}`,
      week: w.week,
      title: w.title,
      status: idx === 0 ? "current" : "locked",
      estimatedHours: w.estimatedHours || weeklyHours,
      progress: 0,
      skills: w.skills || [],
      objective: w.objective,
      difficulty: w.difficulty || "Intermediate",
      remainingTime: `${w.estimatedHours || weeklyHours}h remaining`,
      tasks: (w.keyTopics || []).slice(0, 5).map((topic, ti) => ({
        id: `t${w.week}-${ti + 1}`,
        title: topic,
        completed: false,
      })),
      resources: [
        { title: `${w.title} Documentation`, url: "#", type: "Documentation" },
        { title: `${w.skills?.[0] || w.title} Guide`, url: "#", type: "Architecture Reference" },
        { title: "Hands-on Lab", url: "#", type: "Hands-on Lab" },
      ],
      challenge: {
        title: `Practical Challenge: ${w.title}`,
        description: `Build a project demonstrating ${w.skills?.join(" and ") || w.title}.`,
        requirements: ["Modular project structure", "Documentation", "Automated tests"],
        completed: false,
      },
      assessmentId: `assessment-${w.week}`,
    }));

    return {
      statusCode: 200,
      headers: CORS,
      body: JSON.stringify({
        careerGoal: profile.careerGoal,
        duration: totalWeeks,
        weeklyHours,
        progress: 0,
        missions,
        generatedAt: new Date().toISOString(),
        source: "bedrock",
      }),
    };
  } catch (err) {
    console.error("Roadmap Lambda error:", err);
    return {
      statusCode: 500,
      headers: CORS,
      body: JSON.stringify({ error: "Roadmap generation failed", details: err.message }),
    };
  }
};
