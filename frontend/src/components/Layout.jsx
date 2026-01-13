import { Fragment } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { useAuth } from '../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function Layout({ children }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navigation = [
        { name: 'Dashboard', href: '/', current: false },
        { name: 'Documents', href: '/documents', current: false },
        { name: 'Transactions', href: '/transactions', current: false },
        { name: 'Ledger', href: '/documents', current: false },
    ]

    return (
        <div className="min-h-full">
            <Disclosure as="nav" className="bg-gradient-to-r from-slate-900 via-blue-900 to-cyan-900 shadow-lg">
                {({ open }) => (
                    <>
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <div className="flex h-16 items-center justify-between">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 text-white font-bold text-xl">
                                        🌐 TradeFin Explorer
                                    </div>
                                    <div className="hidden md:block">
                                        <div className="ml-10 flex items-baseline space-x-4">
                                            {navigation.map((item) => (
                                                <Link
                                                    key={item.name}
                                                    to={item.href}
                                                    className={classNames(
                                                        item.current
                                                            ? 'bg-cyan-700 text-white'
                                                            : 'text-cyan-100 hover:bg-cyan-800 hover:text-white',
                                                        'rounded-md px-3 py-2 text-sm font-medium transition-colors'
                                                    )}
                                                >
                                                    {item.name}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="hidden md:block">
                                    <div className="ml-4 flex items-center md:ml-6">
                                        <button onClick={handleLogout} className="text-cyan-100 hover:bg-cyan-800 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </Disclosure>

            <header className="bg-gradient-to-r from-white to-cyan-50 shadow">
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-900 to-cyan-700 bg-clip-text text-transparent">Dashboard</h1>
                </div>
            </header>
            <main>
                <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
                    {children}
                </div>
            </main>
        </div>
    )
}
