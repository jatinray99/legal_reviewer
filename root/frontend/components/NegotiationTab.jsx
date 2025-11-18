import React, { useState } from 'react';
// FIX: Using standard relative path with explicit extension
import { generateContent } from '../../services/geminiService.js';

// NOTE: To enable Word Export in production:
// 1. Run: npm install docx file-saver
// 2. Uncomment the imports below
/*
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';
*/

export default function NegotiationTab({ selectedDoc }) {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const runAnalysis = async () => {
    // Mock text for preview if no doc is selected or no text extracted
    if (!selectedDoc?.extractedText) {
         if(!selectedDoc) {
             setAnalysis([
                 { original: "Example Clause 1", suggestion: "Better Clause 1", comment: "Select a document to see real analysis." }
             ]);
             return;
         }
    }

    setLoading(true);
    try {
      const prompt = `Act as a tough corporate lawyer. Review this contract text. Identify 3-5 clauses that are risky or unfavorable. For each, provide: 
      1. The original text snippet.
      2. A suggested 'redline' or counter-proposal.
      3. A brief comment explaining why.
      Return ONLY a JSON array: [{ "original": "...", "suggestion": "...", "comment": "..." }]
      
      Contract Text: ${selectedDoc?.extractedText ? selectedDoc.extractedText.substring(0, 30000) : "No text provided"}`;

      const result = await generateContent(prompt);
      // Simple cleanup to ensure we parse JSON correctly
      const cleanJson = result.replace(/```json/g, '').replace(/```/g, '');
      setAnalysis(JSON.parse(cleanJson));
    } catch (e) {
      console.error("Analysis failed", e);
      alert("AI Analysis failed. Please check your API key or try again.");
    } finally {
      setLoading(false);
    }
  };

  const exportToWord = async () => {
    if (!analysis) return;

    // --- PRODUCTION CODE (Uncomment after installing 'docx' and 'file-saver') ---
    /*
    const docChildren = [
      new Paragraph({
        children: [
          new TextRun({
            text: "Contract Negotiation Review - AI Generated",
            bold: true,
            size: 32,
          }),
        ],
      }),
      new Paragraph({ text: "Original File: " + selectedDoc.fileName }),
      new Paragraph({ text: "" }), // Spacer
    ];

    analysis.forEach((item, index) => {
      docChildren.push(
        new Paragraph({
          children: [
            new TextRun({ text: `Issue #${index + 1}: `, bold: true, color: "FF0000" }),
            new TextRun({ text: "Clause: " + item.original, italics: true }),
          ]
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "AI Suggestion: ", bold: true }),
            new TextRun({ text: item.suggestion }),
          ]
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Strategy Comment: ", bold: true }),
            new TextRun({ text: item.comment, color: "0000FF" }),
          ]
        }),
        new Paragraph({ text: "---------------------------------------------------" })
      );
    });
    
    const doc = new Document({
      sections: [{
        properties: {},
        children: docChildren,
      }],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `Negotiated_${selectedDoc.fileName}.docx`);
    */
   
    // --- FALLBACK FOR PREVIEW ---
    alert("To enable Word Export:\n1. Run: npm install docx file-saver\n2. Uncomment imports in NegotiationTab.jsx");
    console.log("Analysis Data to Export:", analysis);
  };

  if (!selectedDoc) return (
    <div className="text-center p-10 flex flex-col items-center justify-center h-full opacity-50">
        <p>Select a document from the Repository to begin negotiation analysis.</p>
    </div>
  );

  return (
    <div className="h-full flex gap-6">
      {/* Left: Document Text */}
      <div className="w-1/2 bg-[var(--bg-primary)] p-4 rounded-lg border border-[var(--border-primary)] overflow-y-auto max-h-[600px] text-sm whitespace-pre-wrap font-mono">
        {selectedDoc.extractedText || "No text extracted from this document. Upload a new file to test."}
      </div>

      {/* Right: AI Controls */}
      <div className="w-1/2 flex flex-col gap-4">
        <div className="bg-[var(--bg-tertiary)] p-4 rounded-lg border border-[var(--border-primary)]">
          <h3 className="font-bold text-lg mb-2">AI Negotiation Assistant</h3>
          <p className="text-sm opacity-70 mb-4">Identify risky clauses and generate redlines automatically.</p>
          
          {!analysis ? (
            <button 
              onClick={runAnalysis}
              disabled={loading}
              className="w-full bg-brand-blue hover:bg-blue-600 text-white py-2 rounded flex items-center justify-center gap-2 transition-colors"
            >
              {loading ? "Analyzing..." : "Run Risk Analysis"}
            </button>
          ) : (
            <div className="space-y-2">
                <button 
                onClick={exportToWord}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded flex items-center justify-center gap-2 transition-colors"
                >
                Download .docx with Redlines
                </button>
                <button 
                onClick={() => setAnalysis(null)}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 rounded flex items-center justify-center gap-2 transition-colors text-sm"
                >
                Reset Analysis
                </button>
            </div>
          )}
        </div>

        {/* Results List */}
        <div className="flex-grow overflow-y-auto space-y-3 pr-2">
            {analysis && analysis.map((item, idx) => (
                <div key={idx} className="bg-[var(--bg-primary)] p-3 rounded border border-l-4 border-l-red-500 border-[var(--border-primary)] shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                        <div className="text-xs text-red-400 font-bold uppercase">Risk Detected #{idx + 1}</div>
                    </div>
                    <p className="text-sm italic opacity-80 mb-3 border-l-2 border-gray-300 pl-2">
                        "{item.original.length > 150 ? item.original.substring(0, 150) + '...' : item.original}"
                    </p>
                    <div className="bg-[var(--bg-secondary)] p-3 rounded text-sm space-y-2">
                        <div>
                            <span className="font-bold text-brand-blue block text-xs uppercase mb-1">Suggestion</span>
                            {item.suggestion}
                        </div>
                        <div className="border-t border-[var(--border-primary)] pt-2 mt-2">
                             <span className="font-bold text-green-600 block text-xs uppercase mb-1">Reasoning</span>
                             <span className="text-[var(--text-secondary)]">{item.comment}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
}