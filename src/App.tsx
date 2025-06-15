import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'
import Login from "./components/login/Login.tsx";
import ArticlesLatest from "./components/article/latest/ArticlesLatest.tsx";
import ArticleDetails from "./components/article/details/ArticleDetails.tsx";
import TestPage from "./components/TestPage.tsx";

function App() {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/test" element={<TestPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/latest" element={<ArticlesLatest />} />
                <Route path="/article/:id" element={<ArticleDetails />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App
