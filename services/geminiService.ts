import { GoogleGenAI } from "@google/genai";

// Helper to convert File to Base64 (stripping the data URL prefix for the API)
export const fileToGenerativePart = async (file: File): Promise<{ mimeType: string; data: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Extract the base64 data part (remove "data:image/jpeg;base64,")
      const base64Data = base64String.split(',')[1];
      resolve({
        mimeType: file.type,
        data: base64Data,
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const generateTryOnImage = async (
  personImage: File,
  garmentImage: File
): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const personPart = await fileToGenerativePart(personImage);
    const garmentPart = await fileToGenerativePart(garmentImage);

    // Using gemini-2.5-flash-image for general image generation/editing tasks
    const model = 'gemini-2.5-flash-image';

    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          { text: "Generate a high-quality, photorealistic image of the person in the first image wearing the garment shown in the second image. Preserve the person's pose, body shape, and the background of the first image. Ensure the garment fits naturally." },
          { inlineData: personPart },
          { inlineData: garmentPart },
        ],
      },
    });

    // Check for image in response parts
    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
    
    throw new Error("No image generated.");
  } catch (error) {
    console.error("Error generating try-on image:", error);
    throw error;
  }
};
