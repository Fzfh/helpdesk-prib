import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { description } = await req.json();

    // PAKE MODEL YANG BENER: gemini-pro (ini yang support generateContent)
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    const prompt = `
      Analisis masalah helpdesk berikut dan berikan rekomendasi:
      
      Deskripsi: "${description}"
      
      Berikan response dalam format JSON EXACTLY seperti ini:
      {
        "summary": "Ringkasan masalah dalam 1 kalimat",
        "category": "salah satu dari: Hardware, Software, Jaringan, Akun & Akses, Lainnya",
        "priority": "salah satu dari: Low, Medium, High"
      }
      
      Hanya balas dengan JSON, tanpa teks lain.
    `;

    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    // Bersihin response dari markdown kalo ada
    const cleanResponse = response.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    const suggestion = JSON.parse(cleanResponse);
    
    return NextResponse.json(suggestion);
    
  } catch (error) {
    console.error("AI Error:", error);
    // Fallback kalo AI error
    return NextResponse.json({
      summary: "Mohon tinjau manual deskripsi masalah",
      category: "Lainnya",
      priority: "Medium"
    });
  }
}