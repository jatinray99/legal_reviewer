import React, { useState, useEffect, useCallback } from 'react';
import { LoadingSpinner } from './LoadingSpinner';
// --- MODIFICATION: Import an icon for the upload button ---
const UploadIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12v8M8 8l4-4 4 4"
    />
  </svg>
);
// --- END MODIFICATION ---

interface Contract {
  id: string;
  partyName: string;
  contractType: string;
  status: 'Active' | 'In Review' | 'Expired';
  // --- MODIFICATION: Add fileName to the interface ---
  fileName: string;
  // --- END MODIFICATION ---
}

const getStatusClass = (status: Contract['status']) => {
  switch (status) {
    case 'Active':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    case 'In Review':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    case 'Expired':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
  }
};

export const ContractsListView: React.FC = () => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- MODIFICATION: State for the upload form ---
  const [partyName, setPartyName] = useState('');
  const [contractType, setContractType] = useState('');
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  // --- END MODIFICATION ---

  // --- MODIFICATION: Refactor fetchContracts to useCallback ---
  const fetchContracts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:3001/api/contracts');
      if (!response.ok) {
        throw new Error('Failed to fetch contracts');
      }
      const data = await response.json();
      setContracts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContracts();
  }, [fetchContracts]);
  // --- END MODIFICATION ---

  // --- MODIFICATION: Handlers for file input and form submission ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileToUpload(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileToUpload || !partyName || !contractType) {
      setUploadError('All fields and a file are required.');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append('contractFile', fileToUpload);
    formData.append('partyName', partyName);
    formData.append('contractType', contractType);

    try {
      const response = await fetch('http://localhost:3001/api/contracts/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Upload failed');
      }

      // Success! Reset the form and refresh the contracts list
      setPartyName('');
      setContractType('');
      setFileToUpload(null);
      (document.getElementById('file-upload-input') as HTMLInputElement).value = ''; // Clear file input
      await fetchContracts(); // Refresh the list
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsUploading(false);
    }
  };
  // --- END MODIFICATION ---

  const renderContent = () => {
    if (loading && contracts.length === 0) {
      return (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner />
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center text-red-500 dark:text-red-400 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <p>Error loading contracts: {error}</p>
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-[var(--border-primary)]">
          <thead className="bg-[var(--bg-tertiary)]">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-[var(--text-primary)] uppercase tracking-wider"
              >
                Party Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-[var(--text-primary)] uppercase tracking-wider"
              >
                Contract Type
              </th>
              {/* --- MODIFICATION: Add File Name column --- */}
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-[var(--text-primary)] uppercase tracking-wider"
              >
                File Name
              </th>
              {/* --- END MODIFICATION --- */}
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-[var(--text-primary)] uppercase tracking-wider"
              >
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-[var(--bg-secondary)] divide-y divide-[var(--border-primary)]">
            {contracts.map((contract) => (
              <tr key={contract.id} className="hover:bg-[var(--bg-tertiary)] transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[var(--text-headings)]">
                  {contract.partyName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--text-primary)]">
                  {contract.contractType}
                </td>
                {/* --- MODIFICATION: Render file name --- */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--text-primary)] italic">
                  {contract.fileName}
                </td>
                {/* --- END MODIFICATION --- */}
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span
                    className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(
                      contract.status
                    )}`}
                  >
                    {contract.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* --- MODIFICATION: Upload Form --- */}
      <div className="bg-[var(--bg-secondary)] p-6 rounded-xl shadow-lg border border-[var(--border-primary)]">
        <h3 className="text-xl font-semibold text-[var(--text-headings)] mb-4">
          Upload New Contract
        </h3>
        <form onSubmit={handleUpload} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="partyName" className="block text-sm font-medium text-[var(--text-primary)]">
                Party Name
              </label>
              <input
                type="text"
                id="partyName"
                value={partyName}
                onChange={(e) => setPartyName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm"
                placeholder="e.g., Accuely Limited"
              />
            </div>
            <div>
              <label htmlFor="contractType" className="block text-sm font-medium text-[var(--text-primary)]">
                Contract Type
              </label>
              <input
                type="text"
                id="contractType"
                value={contractType}
                onChange={(e) => setContractType(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm"
                placeholder="e.g., Non-Disclosure Agreement"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)]">
              Contract File
            </label>
            <input
              id="file-upload-input"
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx"
              title="Upload contract document"
              placeholder="Choose a contract file"
              aria-label="Upload contract document"
              className="mt-1 block w-full text-sm text-[var(--text-primary)]
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-brand-blue/10 file:text-brand-blue
                        hover:file:bg-brand-blue/20"
            />
            {fileToUpload && <p className="mt-2 text-sm text-[var(--text-primary)]">Selected: {fileToUpload.name}</p>}
          </div>
          
          {uploadError && (
            <div className="text-sm text-red-500 dark:text-red-400">
              {uploadError}
            </div>
          )}

          <div className="text-right">
            <button
              type="submit"
              disabled={isUploading || !fileToUpload || !partyName || !contractType}
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brand-blue hover:bg-brand-blue-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? (
                <div className="h-5 w-5 mr-2 flex items-center justify-center">
                  <LoadingSpinner />
                </div>
              ) : (
                <UploadIcon className="h-5 w-5 mr-2" />
              )}
              {isUploading ? 'Uploading...' : 'Upload Contract'}
            </button>
          </div>
        </form>
      </div>
      {/* --- END MODIFICATION --- */}

      {/* Contract List */}
      <div className="bg-[var(--bg-secondary)] p-6 rounded-xl shadow-lg border border-[var(--border-primary)]">
        <h3 className="text-xl font-semibold text-[var(--text-headings)] mb-4">
          All Contracts
        </h3>
        {renderContent()}
      </div>
    </div>
  );
};

export interface LoadingSpinnerProps {
  className?: string;
}