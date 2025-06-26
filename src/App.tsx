import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Login from './components/login/Login.tsx';
import ArticlesLatest from './components/article/latest/ArticlesLatest.tsx';
import History from './components/article/history/History.tsx';
import ArticleDetails from './components/article/details/ArticleDetails.tsx';
import TestPage from './components/TestPage.tsx';
import NavBar from './components/layout/NavBar.tsx'; // Assuming you put NavBar in this path
import { useEffect } from 'react';
import Profile from "./components/user/profile/Profile.tsx";
import Settings from "./components/user/settings/Settings.tsx";
import AdminUserList from "./components/admin/user/AdminUserList.tsx";
import AdminUserDetails from "./components/admin/user/AdminUserDetails.tsx";
import AdminArticles from "./components/admin/article/AdminArticles.tsx";
import AdminDashboard from "./components/admin/dashboard/AdminDashboard.tsx";
import AdminErrors from "./components/admin/errors/AdminErrors.tsx";
import Register from "./components/register/Register.tsx";
import LoginAlt from "./components/login/LoginAlt.tsx";


function App() {
    // const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // Simple auth check (based on localStorage token)
        // const token = localStorage.getItem('token');
        // setIsLoggedIn(!!token);
    }, []);

    return (
        <BrowserRouter>
            {/* Global Navigation Bar (hidden on login page) */}
            {window.location.pathname !== '/login' && window.location.pathname !== '/login-alt' && window.location.pathname !== '/register' && <NavBar />}

            {/* Main App Routes */}
            <Routes>
                <Route path="/" element={<Navigate to="/latest" />} />
                <Route path="/test" element={<TestPage />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/login-alt" element={<LoginAlt />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/latest" element={<ArticlesLatest />} />
                <Route path="/history" element={<History />} />
                <Route path="/article/:id" element={<ArticleDetails />} />

                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<AdminUserList />} />
                <Route path="/admin/users/:id" element={<AdminUserDetails />} />
                <Route path="/admin/articles" element={<AdminArticles />} />
                <Route path="/admin/errors" element={<AdminErrors />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;