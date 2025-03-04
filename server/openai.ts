import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Generate a response to a study participant's question using OpenAI
 */
export async function generateStudyResponse(
  question: string,
  studyName: string,
  studyDetails: {
    primaryMetric: string;
    percentChange: number;
    significance: number;
    totalDays: number;
    goalValue: number;
  }
): Promise<string> {
  try {
    const systemPrompt = `You are an AI assistant for a health study platform called Tryvital. Your role is to answer questions from study participants about their health metrics and study results.

Study Information:
- Study Name: ${studyName}
- Primary Metric: ${studyDetails.primaryMetric}
- Study Duration: ${studyDetails.totalDays} days
- Percent Change in Primary Metric: ${studyDetails.percentChange}%
- Statistical Significance: p = ${studyDetails.significance}
- Goal Value: ${studyDetails.goalValue}

Guidelines:
1. Be conversational, friendly, and encouraging
2. Explain technical concepts in simple terms that non-medical participants can understand
3. Use evidence-based information when answering health questions
4. When discussing study results, emphasize what the numbers mean practically for their health
5. If you don't know something specific about their personal health data, be honest and suggest they consult with a healthcare professional
6. Keep responses concise, generally 2-4 sentences
7. Never make up information about the study that wasn't provided

IMPORTANT: Remember that your answers affect how participants understand their health. Be accurate, evidence-based, and responsible with your explanations.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: question }
      ],
      max_tokens: 350,
      temperature: 0.7,
    });

    return response.choices[0].message.content || "I apologize, but I couldn't generate a response. Please try asking your question differently.";
  } catch (error) {
    console.error("Error generating study response:", error);
    return "I'm sorry, there was an issue processing your question. Our team has been notified. Please try again later.";
  }
}

/**
 * Generate a list of suggested questions relevant to the study
 */
export async function generateSuggestedQuestions(
  studyName: string,
  primaryMetric: string,
  category: string
): Promise<string[]> {
  try {
    const prompt = `Based on a health study called "${studyName}" with a primary metric of "${primaryMetric}" in the category of "${category}", generate 5 questions that a study participant might want to ask. Make the questions specific, practical, and focused on understanding their results or how to improve their health in this area. Each question should be a single sentence and focus only on ${primaryMetric} or related ${category} metrics.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 250,
      temperature: 0.8,
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content;
    try {
      const parsedResponse = JSON.parse(content || "{}");
      if (Array.isArray(parsedResponse.questions)) {
        return parsedResponse.questions.slice(0, 5);
      } else {
        // If the structure is different than expected
        const text = content || "";
        return text
          .split(/\d+\.\s+/)
          .filter(q => q.trim().length > 0)
          .slice(0, 5);
      }
    } catch (e) {
      console.error("Error parsing OpenAI response:", e);
      // Fallback parsing method
      const text = content || "";
      return text
        .split(/\d+\.\s+/)
        .filter(q => q.trim().length > 0)
        .slice(0, 5);
    }
  } catch (error) {
    console.error("Error generating suggested questions:", error);
    return [
      `How can I improve my ${primaryMetric}?`,
      `What does ${primaryMetric} tell me about my health?`,
      `Are my ${primaryMetric} results normal?`,
      `How often should I monitor my ${primaryMetric}?`,
      `What lifestyle changes affect ${primaryMetric} the most?`
    ];
  }
}