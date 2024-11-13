const {
  GoogleGenerativeAI,
  GoogleGenerativeAIResponseError,
} = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_KEY);
//create api for AI text.

exports.generateText = async (req, res) => {
  const { data } = req.body;
  //   console.log(data);
  let generatedText = "";

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    // const prompt = `${data}. Please write a comprehensive response without asking for additional details. Assume any necessary information.`;
    const prompt = `${data}. Please provide a concise response without headings, formatting, or additional suggestions.`;


    const result = await model.generateContent(prompt);
    const response = await result.response;
    generatedText = response.text();
    if (!generatedText) {
      //   throw new Error("Text was blocked due to safety concerns.");
      res.status(200).json({
        success: false,
        error:
          "The generated text was blocked due to safety concerns. Please try a different prompt.",
      });
    }

    // Limit the text to 100 words
    const wordLimit = 50;
    const words = generatedText.split(" ");
    if (words.length > wordLimit) {
      generatedText = words.slice(0, wordLimit).join(" ") + "...";
    }

    res.status(200).json({ success: true, text: generatedText });
  } catch (error) {
    if (error instanceof GoogleGenerativeAIResponseError) {
      // Specific handling for AI safety blocks
      res.status(200).json({
        success: false,
        error:
          "The generated text was blocked due to safety concerns. Please try a different prompt.",
      });
    } else {
      console.error("Error generating AI text:", error);
      res.status(500).json({ error: "Error generating text" });
    }
  }
};
