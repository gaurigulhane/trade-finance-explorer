import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Layout from './components/Layout';
import Documents from './pages/Documents';
import DocumentDetail from './pages/DocumentDetail';
import Transactions from './pages/Transactions';
import Dashboard from './pages/Dashboard';
import CreateTransaction from './pages/CreateTransaction';

const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/login" />;
};

function App() {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/" element={
                        <PrivateRoute>
                            <Layout>
                                <Dashboard />
                            </Layout>
                        </PrivateRoute>
                    } />
                    <Route path="/documents" element={
                        <PrivateRoute>
                            <Layout>
                                <Documents />
                            </Layout>
                        </PrivateRoute>
                    } />
                    <Route path="/documents/:id" element={
                        <PrivateRoute>
                            <Layout>
                                <DocumentDetail />
                            </Layout>
                        </PrivateRoute>
                    } />
                    <Route path="/transactions" element={
                        <PrivateRoute>
                            <Layout>
                                <Transactions />
                            </Layout>
                        </PrivateRoute>
                    } />
                    <Route path="/transactions/new" element={
                        <PrivateRoute>
                            <Layout>
                                <CreateTransaction />
                            </Layout>
                        </PrivateRoute>
                    } />
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;
