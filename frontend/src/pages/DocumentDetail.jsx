import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LedgerTimeline from '../components/LedgerTimeline';

export default function DocumentDetail() {
    const { id } = useParams();
    const [document, setDocument] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const fetchDoc = async () => {
            try {
                const response = await axios.get(`/api/v1/documents/${id}`, {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                setDocument(response.data);
            } catch (error) {
                console.error("Failed to fetch document", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDoc();
    }, [id, user.token]);

    if (loading) return <div>Loading...</div>;
    if (!document) return <div>Document not found</div>;

    return (
        <div className="space-y-6">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Document Details</h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">{document.doc_type} - {document.doc_number}</p>
                </div>
                <div className="border-t border-gray-200">
                    <dl>
                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Hash (SHA-256)</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 font-mono break-all">{document.hash}</dd>
                        </div>
                        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Issued At</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{new Date(document.issued_at).toLocaleString()}</dd>
                        </div>
                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">File</dt>
                            <dd className="mt-1 text-sm text-indigo-600 sm:col-span-2 sm:mt-0">
                                {/* Placeholder for download link */}
                                <a href="#" className="hover:underline">Download / View (Mock)</a>
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>

            <div className="bg-white shadow sm:rounded-lg p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-6">Ledger History</h3>
                <LedgerTimeline entries={document.ledger_entries} />
            </div>
        </div>
    );
}
