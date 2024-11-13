const {
  GoogleGenerativeAI,
  GoogleGenerativeAIResponseError,
} = require("@google/generative-ai");

// const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_KEY);
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_KEY);

//create api for AI text.

exports.generateText = async (prompt) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;

    const generatedText = response.text();
    if (!generatedText) {
      throw new GoogleGenerativeAIResponseError(
        "Text was blocked due to safety concerns."
      );
    }

    return generatedText;
  } catch (error) {
    if (error instanceof GoogleGenerativeAIResponseError) {
      throw error;
    } else {
      console.error("Error in AI repository:", error);
      throw new Error("Error generating text");
    }
  }
};
