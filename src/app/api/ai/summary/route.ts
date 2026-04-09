import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { fileUrl } = await req.json();

    if (!fileUrl) {
      return NextResponse.json({ error: "No fileUrl provided" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Fallback simple summary
      return NextResponse.json({ 
        summary: "Notice: Please add GEMINI_API_KEY to your .env to enable real AI summaries. This is a fallback mock summary: The uploaded medical record appears to contain standard diagnostic metrics which fall within normal ranges based on general observations."
      }, { status: 200 });
    }

    // Fetch the file from the cloud URL (Vercel Blob)
    const fileRes = await fetch(fileUrl);
    if (!fileRes.ok) throw new Error("Failed to fetch file from storage");
    const arrayBuffer = await fileRes.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const filename = fileUrl.split("/").pop() || "";
    const ext = filename.split(".").pop()?.toLowerCase();
    let mimeType = "image/jpeg";
    if (ext === "pdf") mimeType = "application/pdf";
    if (ext === "png") mimeType = "image/png";

    const ai = new GoogleGenAI({ apiKey });
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        "Analyze this medical record and provide a brief, easy-to-understand 2-3 sentence summary of the key findings. Only use the content provided in the image.",
        {
          inlineData: {
            data: buffer.toString("base64"),
            mimeType,
          }
        }
      ],
    });

    return NextResponse.json({ summary: response.text }, { status: 200 });
  } catch (error) {
    console.error("AI Summary error:", error);
    return NextResponse.json(
      { error: "Error generating summary" },
      { status: 500 }
    );
  }
}

