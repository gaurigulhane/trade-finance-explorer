import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function Transactions() {
    const [transactions, setTransactions] = useState([]);
    const { user } = useAuth();

    const fetchTransactions = async () => {
        try {
            const response = await axios.get('/api/v1/transactions/', {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setTransactions(response.data);
        } catch (error) {
            console.error("Failed to fetch transactions", error);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">Transactions</h2>
                <Link to="/transactions/new" className="bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 rounded-md">
                    New Transaction
                </Link>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul role="list" className="divide-y divide-gray-200">
                    {transactions.map((tx) => (
                        <li key={tx.id}>
                            <div className="px-4 py-4 sm:px-6">
                                <div className="flex items-center justify-between">
                                    <p className="truncate text-sm font-medium text-indigo-600">
                                        Deal #{tx.id} - {tx.description || "No description"}
                                    </p>
                                    <div className="ml-2 flex flex-shrink-0">
                                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${tx.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                tx.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {tx.status}
                                        </span>
                                    </div>
                                </div>
                                <div className="mt-2 sm:flex sm:justify-between">
                                    <div className="sm:flex">
                                        <p className="flex items-center text-sm text-gray-500">
                                            Amount: {tx.currency} {tx.amount}
                                        </p>
                                    </div>
                                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                        <p>
                                            Created <time dateTime={tx.created_at}>{new Date(tx.created_at).toLocaleDateString()}</time>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))}
                    {transactions.length === 0 && (
                        <li className="px-4 py-12 text-center text-gray-500">No active trade checks found.</li>
                    )}
                </ul>
            </div>
        </div>
    );
}
