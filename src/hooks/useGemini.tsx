import { useEffect, useState } from "react";
import { GenerateContentResult, GenerativeModel, GoogleGenerativeAI } from "@google/generative-ai";

const getSuggestionsPrompt = (text:string)=>`You are a todo list app. The user is writting this: ${text.trim()}, generate a list of suggestions for the user to choose from. in a JSON format like this ["${text.trim()}_____","${text.trim()}_____"] avoid using markdown`


const useGemini = () => {
  const [model, setModel] = useState<null | GenerativeModel>(null);

  useEffect(() => {
    const loadModel = async () => {
      try {
        const GEMINI_API_KEY = (import.meta as any).env.VITE_GEMINI_API_KEY;
        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        setModel(model);
      } catch (error) {
        console.error("Error on useGemini: ",error);
      }
    };

    loadModel();
  }, []);

  async function getSuggestions (text: string): Promise<string[]> {
    try {
      if (!model) {
        console.warn("Model is not loaded");
        return [""];
      }
      let result: GenerateContentResult;
      if (!text) {
        console.warn("Text is empty");
        return [""];
      }
      result = await model.generateContent(getSuggestionsPrompt(text));
      const responseText = result.response.text();
      // split from [ and ]
      const parsedText = responseText.split("[")[1].split("]")[0];
      const suggestions = JSON.parse(`[${parsedText}]`);
      return suggestions;
    } catch (error) {
      // catch the error useGemini.tsx:45 Error on useGemini:  GoogleGenerativeAIFetchError: [GoogleGenerativeAI Error]: Error fetching from https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent: [429 ] Resource has been exhausted (e.g. check quota).
      if (error instanceof Error) {
        if((error?.message || "" as string).includes("GoogleGenerativeAIFetchError")){
          console.warn("Resource has been exhausted (e.g. check quota).");        
        }
        return [""];
        
      }
      
      console.error("Error on useGemini: ",error);
      return [""];
    }
  };

  return { getSuggestions };
};

export default useGemini;