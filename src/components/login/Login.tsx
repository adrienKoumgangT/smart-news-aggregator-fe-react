import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../../api/axios.ts';
import styles from './Login.module.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await API.post(
                '/auth/login',
                { email, password },
                {
                    withCredentials: true,
                    headers: { 'Content-Type': 'application/json' },
                }
            );

            const authHeader: string | undefined = response.headers['authorization'] || response.headers['Authorization'];

            if (authHeader && authHeader.startsWith('Bearer ')) {
                const token = authHeader.split(' ')[1];
                localStorage.setItem('authToken', token);
                navigate('/latest');
            } else {
                alert('Login failed: token missing.');
            }
        } catch (err) {
            console.error('Login error:', err);
            alert('Login failed');
        }
    };

    const goToRegister = () => {
        navigate('/register');
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Login to Your Account</h2>
            <form onSubmit={handleLogin} className={styles.form}>
                <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    type="email"
                    required
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                />
                <button type="submit" className={styles.loginButton}>Login</button>

                <div className={styles.forgotPasswordWrapper}>
                    <Link to="/login-alt" className={styles.forgotPasswordLink}>
                        Forgot Password?
                    </Link>
                </div>
            </form>

            <div className={styles.footer}>
                <span>Don't have an account?</span>
                <button onClick={goToRegister} className={styles.registerButton}>
                    Register
                </button>
            </div>
        </div>
    );
};

export default Login;