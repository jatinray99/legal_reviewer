import React, { useRef, useState } from 'react';
import { uploadBytes, getDownloadURL, ref } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, storage } from '../../firebase.js';
import { useAuth } from '../../context/AuthContext.jsx';
import * as pdfjsLib from 'pdfjs-dist'; 
// Note: In a real setup, you might need to set the worker source for pdfjs

export default function RepositoryTab({ documents, onSelect, selectedId }) {
  const { currentUser } = useAuth();
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const extractTextFromPDF = async (file) => {
    // Basic stub for text extraction - fully implementing requires worker setup
    // For now, we'll just return a placeholder or basic text if possible
    return "Extracted text content placeholder for: " + file.name;
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !currentUser) return;

    setUploading(true);
    try {
      // 1. Upload File
      const storageRef = ref(storage, `users/${currentUser.uid}/documents/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      // 2. Extract Text (Mocked for now to ensure stability)
      const text = await extractTextFromPDF(file);

      // 3. Save Metadata to Firestore
      await addDoc(collection(db, 'users', currentUser.uid, 'documents'), {
        fileName: file.name,
        fileUrl: url,
        extractedText: text,
        uploadedAt: serverTimestamp(),
        type: file.type
      });

    } catch (error) {
      console.error("Upload failed", error);
      alert("Upload failed!");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-lg font-semibold">Document Repository</h3>
        <div className="relative">
            <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden" 
                accept=".pdf,.docx,.txt"
            />
            <button 
                onClick={() => fileInputRef.current.click()}
                disabled={uploading}
                className="bg-brand-blue text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
                {uploading ? 'Uploading...' : 'Upload Contract'}
            </button>
        </div>
      </div>

      <div className="flex-grow overflow-auto bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-lg">
        {documents.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No documents found. Upload one to get started.</div>
        ) : (
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-[var(--bg-tertiary)] border-b border-[var(--border-primary)]">
                        <th className="p-3 font-medium text-sm">Name</th>
                        <th className="p-3 font-medium text-sm">Date</th>
                        <th className="p-3 font-medium text-sm">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {documents.map(doc => (
                        <tr 
                            key={doc.id} 
                            onClick={() => onSelect(doc)}
                            className={`cursor-pointer hover:bg-[var(--bg-tertiary)] border-b border-[var(--border-primary)] last:border-0 ${selectedId === doc.id ? 'bg-[var(--bg-secondary)] border-l-4 border-l-brand-blue' : ''}`}
                        >
                            <td className="p-3 text-sm font-medium truncate max-w-[200px]">{doc.fileName}</td>
                            <td className="p-3 text-sm text-gray-500">
                                {doc.uploadedAt?.seconds ? new Date(doc.uploadedAt.seconds * 1000).toLocaleDateString() : 'Pending'}
                            </td>
                            <td className="p-3 text-sm">
                                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Processed</span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        )}
      </div>
    </div>
  );
}