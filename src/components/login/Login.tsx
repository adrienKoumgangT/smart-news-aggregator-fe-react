import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import API from '../../api/axios.ts';


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
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            // Access Authorization header (case-insensitive in Axios)
            const authHeader: string | undefined = response.headers['authorization'] || response.headers['Authorization'];
            // console.log(authHeader);
            if (authHeader && authHeader.startsWith('Bearer ')) {
                const token = authHeader.split(' ')[1];
                localStorage.setItem('authToken', token);
                // alert('Logged in!');

                navigate('/latest');
            } else {
                console.error('Login failed:', 'Authorization token not found in response headers');
                // alert('Authorization token not found in response headers');
                alert('Login failed');
            }
        } catch (err) {
            console.error('Login error:', err);
            alert('Login failed');
        }
    };

    return (
        <form onSubmit={handleLogin}>
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
            <button type="submit">Login</button>
        </form>
    );
};

export default Login;