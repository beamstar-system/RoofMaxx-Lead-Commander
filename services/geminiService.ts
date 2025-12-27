import { GoogleGenAI } from "@google/genai";
import { Lead } from "../types";
import { v4 as uuidv4 } from 'uuid'; // We will use a simple random ID generator if uuid not available, but for now custom implementation below.

const generateId = () => Math.random().toString(36).substr(2, 9);

interface SearchParams {
  apiKey: string;
  location: string;
  keywords: string[];
}

export const fetchLeadsFromGemini = async (params: SearchParams): Promise<Lead[]> => {
  if (!params.apiKey) throw new Error("API Key is required");

  const ai = new GoogleGenAI({ apiKey: params.apiKey });

  // We rotate keywords to simulate a broader scan if this function is called multiple times
  const query = `Find 15 unique commercial businesses in ${params.location} that match these types: ${params.keywords.join(", ")}. 
  Focus on large footprint buildings suitable for commercial roof restoration (Flat, TPO, Metal).
  
  For each business found, providing the following details in a strictly formatted JSON array. 
  
  Fields required per object:
  - businessName
  - address
  - businessType (e.g. Warehouse, Mall, Factory)
  - roofType (Infer based on building type: 'Flat', 'Sloped', 'Mixed')
  - estimatedSqFt (Estimate based on typical size for this business type, e.g. "10,000+")
  - leadScore (Number 1-100, based on likelihood of needing roof maintenance. Older/Industrial = Higher)
  - phone
  - website
  - rating
  - reviewCount
  - notes (Brief AI analysis of why this is a good lead)
  
  IMPORTANT: Return ONLY valid JSON. Do not use Markdown code blocks.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: query,
      config: {
        tools: [{ googleMaps: {} }],
        // responseMimeType and responseSchema are NOT allowed with googleMaps, 
        // so we must rely on the prompt to format the text and the grounding chunks for verification.
        systemInstruction: "You are an expert commercial roofing lead analyst. You extract data from Google Maps and format it as strict JSON.",
      }
    });

    const text = response.text || "";
    
    // Attempt to clean and parse JSON from the text response
    let cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
    // Sometimes the model adds extra text before/after
    const firstBracket = cleanJson.indexOf('[');
    const lastBracket = cleanJson.lastIndexOf(']');
    
    if (firstBracket !== -1 && lastBracket !== -1) {
      cleanJson = cleanJson.substring(firstBracket, lastBracket + 1);
    }

    let parsedData: any[] = [];
    try {
      parsedData = JSON.parse(cleanJson);
    } catch (e) {
      console.warn("JSON Parse failed, attempting raw text extraction fallback", e);
      // Fallback: If strict JSON fails, we might return an empty array or handle partials. 
      // For this demo, we throw to trigger a retry or show error.
      throw new Error("AI response was not valid JSON. Please try again.");
    }

    // Map to our Lead interface
    const leads: Lead[] = parsedData.map((item: any) => ({
      id: generateId(),
      businessName: item.businessName || "Unknown Business",
      address: item.address || "Unknown Address",
      businessType: item.businessType || "Commercial",
      roofType: item.roofType || "Unknown",
      estimatedSqFt: item.estimatedSqFt || "Unknown",
      leadScore: typeof item.leadScore === 'number' ? item.leadScore : 50,
      phone: item.phone,
      website: item.website,
      rating: item.rating,
      reviewCount: item.reviewCount,
      notes: item.notes,
      coordinates: {
         // In a full production app, we would cross-reference response.candidates[0].groundingMetadata.groundingChunks
         // to get exact Lat/Lng. For this MVP, we simulate or omit if not provided in JSON.
         lat: 0, 
         lng: 0
      }
    }));

    return leads;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
