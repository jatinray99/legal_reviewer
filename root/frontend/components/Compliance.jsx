import React from 'react';
// FIX: Import from the new LegalAI.js file
import { generateContent } from './LegalAI.js';

export default function ComplianceTab({ selectedDoc }) {
  const [report, setReport] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const checkCompliance = async () => {
    if (!selectedDoc?.extractedText) return;
    setLoading(true);
    
    try {
        // Mock prompt call
        const prompt = `Analyze this text for GDPR compliance issues: ${selectedDoc.extractedText.substring(0, 5000)}`;
        const result = await generateContent(prompt);
        setReport(result);
    } catch (e) {
        console.error(e);
        setReport("Compliance check failed. Please try again.");
    } finally {
        setLoading(false);
    }
  };

  if (!selectedDoc) return <div className="text-center p-10 text-gray-500">Select a document to check compliance.</div>;

  return (
    <div className="h-full flex gap-6">
       <div className="w-1/2 bg-[var(--bg-primary)] p-4 rounded-lg border border-[var(--border-primary)] overflow-auto max-h-[600px]">
           <h3 className="font-bold mb-4 border-b pb-2">Document Text</h3>
           <div className="text-sm font-mono whitespace-pre-wrap">
               {selectedDoc.extractedText || "No text content available."}
           </div>
       </div>
       
       <div className="w-1/2 flex flex-col">
           <div className="bg-[var(--bg-tertiary)] p-6 rounded-lg border border-[var(--border-primary)] mb-4">
               <h3 className="text-lg font-bold mb-2">Regulatory Compliance Monitor</h3>
               <p className="text-sm text-gray-500 mb-4">Checks against GDPR, CCPA, and Standard Financial Regulations.</p>
               <button 
                  onClick={checkCompliance}
                  disabled={loading}
                  className="w-full bg-brand-blue text-white py-2 rounded hover:bg-blue-600 disabled:opacity-50"
               >
                  {loading ? "Scanning Regulations..." : "Run Compliance Check"}
               </button>
           </div>
           
           {report && (
               <div className="flex-grow bg-[var(--bg-primary)] p-4 rounded-lg border border-[var(--border-primary)] overflow-auto">
                   <h4 className="font-bold text-green-600 mb-3">Compliance Report</h4>
                   <div className="prose prose-sm max-w-none">
                       {report}
                   </div>
               </div>
           )}
       </div>
    </div>
  );
}