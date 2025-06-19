"use client";

import React, { useState } from "react";
import {
  ocrService,
  DocumentValidationResult,
} from "../../services/ocrService";

export default function TestOCRPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [ocrResult, setOcrResult] = useState<DocumentValidationResult | null>(
    null
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [testName, setTestName] = useState("NGUYỄN VÔ ANH KHOA");

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setOcrResult(null);
    }
  };

  const testCCCD = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    try {
      const result = await ocrService.validateCCCD(selectedFile, testName);
      setOcrResult(result);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const testDriverLicense = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    try {
      const result = await ocrService.validateDriverLicense(
        selectedFile,
        testName
      );
      setOcrResult(result);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Test OCR Service</h1>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Test Name:</label>
          <input
            type="text"
            value={testName}
            onChange={(e) => setTestName(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter name to compare"
          />
        </div>

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

        <div className="flex gap-4">
          <button
            onClick={testCCCD}
            disabled={!selectedFile || isProcessing}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            {isProcessing ? "Processing..." : "Test CCCD"}
          </button>

          <button
            onClick={testDriverLicense}
            disabled={!selectedFile || isProcessing}
            className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
          >
            {isProcessing ? "Processing..." : "Test Driver License"}
          </button>
        </div>

        {ocrResult && (
          <div className="mt-6 p-4 border rounded bg-gray-50">
            <h3 className="text-lg font-medium mb-2">OCR Result:</h3>
            <pre className="whitespace-pre-wrap text-sm">
              {JSON.stringify(ocrResult, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
