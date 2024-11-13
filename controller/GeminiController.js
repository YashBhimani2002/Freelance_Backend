
const {
    GoogleGenerativeAI,
    GoogleGenerativeAIResponseError,
  } = require("@google/generative-ai");
  
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_KEY);

// AI text api
exports.generateText = async (req, res) => {
    const { data } = req.body;
    
    try {
        const generatedText = await generateTextServices(data);
  
      if (!generatedText) {
        return res.status(200).json({
          success: false,
          error:
            "The generated text was blocked due to safety concerns. Please try a different prompt.",
        });
      }
  
      res.status(200).json({ success: true, text: generatedText });
    } catch (error) {
      if (error.message.includes("safety concerns")) {
        return res.status(200).json({
          success: false,
          error: error.message,
        });
      }
      console.log("Error generating AI text:", error);
      res.status(500).json({ success: false, error: `Error generating text ${error}` });
    }
};


//create api for AI text.

const generateTextServices = async (data) => {
  try {

    const prompt = `${data}. Please write a comprehensive response without asking for additional details. Assume any necessary information and  provide a concise response without headings, formatting, or additional suggestions.`;
      let generatedText = await generateTextRepository(prompt);

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


const generateTextRepository = async (prompt) => {
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
        console.log("Error in AI repository:", error);
          throw new Error(`Error generating text repository ${error}`);
      }
    }
  };
