"use client";

import React, { useState } from "react";
import { createWorker } from "tesseract.js";

export default function TestSimpleOCRPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [ocrText, setOcrText] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setOcrText("");
    }
  };

  const processOCR = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    try {
      console.log("🔍 Starting OCR...");

      // Create worker with Vietnamese language
      const worker = await createWorker("vie", 1, {
        logger: (m) => console.log(m),
      });

      console.log("🔍 Worker created, processing image...");

      const {
        data: { text, confidence },
      } = await worker.recognize(selectedFile);

      console.log("🔍 OCR completed!");
      console.log("🔍 Confidence:", confidence);
      console.log("🔍 Raw text:", text);

      setOcrText(text);

      await worker.terminate();
    } catch (error) {
      console.error("OCR Error:", error);
      setOcrText("Error: " + String(error));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Simple OCR Test</h1>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Select Image:
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="w-full p-2 border rounded"
          />
        </div>

        {selectedFile && (
          <div>
            <h3 className="text-lg font-medium mb-2">Preview:</h3>
            <img
              src={URL.createObjectURL(selectedFile)}
              alt="Preview"
              className="max-w-md max-h-64 object-contain border rounded"
            />
          </div>
        )}

        <div>
          <button
            onClick={processOCR}
            disabled={!selectedFile || isProcessing}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            {isProcessing ? "Processing OCR..." : "Extract Text"}
          </button>
        </div>

        {ocrText && (
          <div className="mt-6 p-4 border rounded bg-gray-50">
            <h3 className="text-lg font-medium mb-2">Extracted Text:</h3>
            <pre className="whitespace-pre-wrap text-sm bg-white p-2 border rounded">
              {ocrText}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
