import { useEffect, useState } from "react"; // Import useEffect and useState from React
import { GenerateContentResult, GenerativeModel, GoogleGenerativeAI } from "@google/generative-ai"; // Import types and classes from Google Generative AI

// Function to generate the prompt for suggestions
const getSuggestionsPrompt = (text:string) => `You are a todo list app. The user is writting this: ${text.trim()}, generate a list of suggestions for the user to choose from. in a JSON format like this ["${text.trim()}_____","${text.trim()}_____"] avoid using ** or __ in the suggestions. `;

function useGemini (){
  const [model, setModel] = useState<null | GenerativeModel>(null); 

  useEffect(() => {
    // Effect to initialize the generative model
    const loadModel = async () => {
      try {
        const GEMINI_API_KEY = (import.meta as any).env.VITE_GEMINI_API_KEY; // Get the API key from environment variables
        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY); // Initialize GoogleGenerativeAI with the API key
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Get the generative model
        setModel(model); // Set the model state
      } catch (error) {
        console.error("Error on useGemini: ", error); // Log any errors
      }
    };

    loadModel(); // Load the model
  }, []); // Run this effect only once when the component mounts

  // Function to get suggestions based on the input text
  async function getSuggestions(text: string): Promise<string[]> {
    try {
      if (!model) {
        console.warn("Model is not loaded"); // Warn if the model is not loaded
        return [""]; // Return an empty suggestion
      }
      let result: GenerateContentResult;
      if (!text) {
        console.warn("Text is empty"); // Warn if the input text is empty
        return [""]; // Return an empty suggestion
      }
      result = await model.generateContent(getSuggestionsPrompt(text)); // Generate content using the model
      const responseText = result.response.text(); // Get the response text
      // Split the response text to extract the JSON array
      const parsedText = responseText.split("[")[1].split("]")[0];
      const suggestions = JSON.parse(`[${parsedText}]`); // Parse the JSON array
      return suggestions; // Return the suggestions
    } catch (error) {
      // Catch any errors
      if (error instanceof Error) {
        if ((error?.message || "" as string).includes("GoogleGenerativeAIFetchError")) {
          console.warn("Resource has been exhausted (e.g. check quota)."); // Warn if the resource has been exhausted
        }
        return [""]; // Return an empty suggestion
      }
      console.error("Error on useGemini: ", error); // Log any other errors
      return [""]; // Return an empty suggestion
    }
  };

  return { getSuggestions }; 
};

export default useGemini; 