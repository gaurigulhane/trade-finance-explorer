import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import FileUpload from '../components/FileUpload';
import { Link } from 'react-router-dom';

export default function Documents() {
    const [documents, setDocuments] = useState([]);
    const { user } = useAuth();

    const fetchDocuments = async () => {
        try {
            const response = await axios.get('/api/v1/documents/', {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setDocuments(response.data);
        } catch (error) {
            console.error("Failed to fetch documents", error);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, []);

    return (
        <div className="space-y-6">
            <FileUpload onUploadSuccess={fetchDocuments} />

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">My Trade Documents</h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">List of uploaded LOs, Invoices, and Certificates.</p>
                </div>
                <ul role="list" className="divide-y divide-gray-200">
                    {documents.map((doc) => (
                        <li key={doc.id}>
                            <Link to={`/documents/${doc.id}`} className="block hover:bg-gray-50">
                                <div className="px-4 py-4 sm:px-6">
                                    <div className="flex items-center justify-between">
                                        <p className="truncate text-sm font-medium text-indigo-600">{doc.doc_type} - {doc.doc_number}</p>
                                        <div className="ml-2 flex flex-shrink-0">
                                            <p className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                                                Active
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-2 sm:flex sm:justify-between">
                                        <div className="sm:flex">
                                            <p className="flex items-center text-sm text-gray-500">
                                                {doc.hash.substring(0, 16)}...
                                            </p>
                                        </div>
                                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                            <p>
                                                Issued on <time dateTime={doc.issued_at}>{new Date(doc.issued_at).toLocaleDateString()}</time>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </li>
                    ))}
                    {documents.length === 0 && (
                        <li className="px-4 py-12 text-center text-gray-500">No documents found. Upload one above.</li>
                    )}
                </ul>
            </div>
        </div>
    );
}
