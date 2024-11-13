const { GoogleGenerativeAIResponseError } = require("@google/generative-ai");
// const aiRepository = require("./aiRepository");
const aiRepository = require("./aiRepository")
//create api for AI text.

exports.generateText = async (data) => {
  try {
    const prompt = `${data}. Please write a comprehensive response without asking for additional details. Assume any necessary information and  provide a concise response without headings, formatting, or additional suggestions.`;
    let generatedText = await aiRepository.generateText(prompt);

    // Limit the text to 50 words
    const wordLimit = 50;
    const words = generatedText.split(" ");
    if (words.length > wordLimit) {
      generatedText = words.slice(0, wordLimit).join(" ") + "...";
    }

    return generatedText;
  } catch (error) {
    if (error instanceof GoogleGenerativeAIResponseError) {
      // Pass the error message up to the controller
      throw new Error(
        "The generated text was blocked due to safety concerns. Please try a different prompt."
      );
    }
    throw new Error("Error generating AI text");
  }
};
