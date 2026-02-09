import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { genAI, genAIModel } from "@/app/lib/google";
import cloudinary from "@/app/lib/cloudinary";  
export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const formData = await request.formData();
    const file = formData.get("receipt");
    if (!file) {
      return NextResponse.json(
        { error: "No receipt image uploaded" },
        { status: 400 }
      );
    }
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type" },
        { status: 400 }
      );
    }
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File too large. Max 5MB" },
        { status: 400 }
      );
    }
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Upload to Cloudinary
    let receiptUrl = null;
    try {
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({
          folder: "receipts",
          resource_type: "image"
        }, (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }).end(buffer);
      });
      receiptUrl = uploadResult.secure_url;
      console.log('Receipt uploaded to Cloudinary:', receiptUrl);
    } catch (uploadError) {
      console.error('Cloudinary upload error:', uploadError);
    }
    const base64String = btoa(
      String.fromCharCode(...new Uint8Array(arrayBuffer))
    );
    const receiptPrompt = `Analyze this receipt image and extract transaction information. Return ONLY valid JSON with the following structure:
    {
      "title": "string",
      "amount": "number",
      "date": "YYYY-MM-DD",
      "description": "string",
      "category": "string",
      "paymentMethod": "CASH|CARD|DIGITAL",
      "type": "EXPENSE"
    }`;
    let receiptData;
    try {
      const result = await genAI.models.generateContent({
        model: genAIModel,
        contents: [
          {
            parts: [
              { text: receiptPrompt },
              {
                inlineData: {
                  mimeType: file.type,
                  data: base64String
                }
              }
            ]
          }
        ],
        config: {
          temperature: 0,
          topP: 1,
          responseMimeType: "application/json",
        }
      });
      if (!result.text) {
        return NextResponse.json(
          { error: "No text response from AI" },
          { status: 503 }
        );
      }
      const cleanedText = result.text.replace(/```(?:json)?\n?/g, "").trim();
      if (!cleanedText) {
        return NextResponse.json(
          { error: "Could not read receipt content" },
          { status: 422 }
        );
      }
      receiptData = JSON.parse(cleanedText);
      if (!receiptData.amount || !receiptData.date) {
        return NextResponse.json(
          { error: "Receipt missing required information" },
          { status: 422 }
        );
      }
    } catch (error) {
      console.error('Receipt scan error:', error);
      return NextResponse.json(
        { error: "Receipt scanning service unavailable" },
        { status: 503 }
      );
    }
    if (!receiptData.amount || receiptData.amount <= 0) {
      return NextResponse.json(
        { error: "Invalid amount detected" },
        { status: 422 }
      );
    }
    if (!receiptData.date) {
      receiptData.date = new Date().toISOString().split("T")[0];
    }
    const transactionData = {
      title: receiptData.title || "Receipt Transaction",
      type: "EXPENSE",
      amount: parseFloat(receiptData.amount),
      category: receiptData.category || "Other",
      date: receiptData.date,
      description: receiptData.description || "Scanned from receipt",
      paymentMethod: receiptData.paymentMethod || "CASH",
      isRecurring: false,
      receiptUrl: receiptUrl,
      extractedItems: receiptData.items || [],
      aiConfidence: receiptData.confidence || 0.8,
      scannedAt: new Date().toISOString(),
    };
    return NextResponse.json({
      success: true,
      data: transactionData,
    });
  } catch (error) {
    console.error("Receipt scan error:", error);
    return NextResponse.json(
      { error: "Receipt scanning failed" },
      { status: 500 }
    );
  }
}
