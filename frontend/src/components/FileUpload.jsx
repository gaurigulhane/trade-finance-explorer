import { useState, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function FileUpload({ onUploadSuccess }) {
    const [file, setFile] = useState(null);
    const [docType, setDocType] = useState('INVOICE');
    const [docNumber, setDocNumber] = useState('');
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);
    const { user } = useAuth();

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        if (e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file || !docNumber) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('doc_type', docType);
        formData.append('doc_number', docNumber);

        try {
            const response = await axios.post('/api/v1/documents/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${user.token}`
                }
            });
            setUploading(false);
            setFile(null);
            setDocNumber('');
            if (onUploadSuccess) onUploadSuccess(response.data);
            alert('Document uploaded successfully!');
        } catch (error) {
            console.error("Upload failed", error);
            setUploading(false);
            alert('Upload failed.');
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Upload New Document</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Document Type</label>
                        <select
                            value={docType}
                            onChange={(e) => setDocType(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                        >
                            <option value="LOC">Letter of Credit (LoC)</option>
                            <option value="INVOICE">Invoice</option>
                            <option value="BILL_OF_LADING">Bill of Lading</option>
                            <option value="PO">Purchase Order</option>
                            <option value="COO">Certificate of Origin</option>
                            <option value="INSURANCE_CERT">Insurance Certificate</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Document Number</label>
                        <input
                            type="text"
                            value={docNumber}
                            onChange={(e) => setDocNumber(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                            placeholder="e.g. INV-2024-001"
                            required
                        />
                    </div>
                </div>

                <div
                    className="flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6 hover:bg-gray-50 transition-colors"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                >
                    <div className="space-y-1 text-center">
                        {file ? (
                            <div className="text-sm text-gray-600">
                                <p className="font-medium text-indigo-600">{file.name}</p>
                                <p>{(file.size / 1024).toFixed(2)} KB</p>
                                <button type="button" onClick={() => setFile(null)} className="text-red-500 text-xs mt-2 underline">Remove</button>
                            </div>
                        ) : (
                            <>
                                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <div className="flex text-sm text-gray-600 justify-center">
                                    <label htmlFor="file-upload" className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500">
                                        <span>Upload a file</span>
                                        <input id="file-upload" name="file-upload" type="file" className="sr-only" ref={fileInputRef} onChange={handleFileChange} />
                                    </label>
                                    <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-gray-500">PDF, PNG, JPG up to 10MB</p>
                            </>
                        )}
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={uploading || !file}
                        className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
                    >
                        {uploading ? 'Uploading...' : 'Upload Document'}
                    </button>
                </div>
            </form>
        </div>
    );
}
