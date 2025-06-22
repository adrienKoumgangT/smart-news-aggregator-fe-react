import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Register.module.css';
import API from "../../api/axios.ts";

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        confirm_password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirm_password) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        await API.post<{success: string, message: string}>('/auth/register', {
            firstname: formData.firstname,
            lastname: formData.lastname,
            email: formData.email,
            password: formData.password,
            confirm_password: formData.confirm_password
        }).then((res) => {
            if(res.data.success) {
                console.log(res.data.message);
                navigate('/login');
            } else {
                console.error(res.data.message);
                alert(res.data.message);
            }
        }).catch((err) => {
            setError(err.response?.data?.message || 'Registration failed');
        }).finally(() => {
            setLoading(false);
        });
    };

    return (
        <div className={styles.container}>
            <h2>Create Account</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
                <input
                    type="text"
                    name="firstname"
                    placeholder="First Name"
                    value={formData.firstname}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="lastname"
                    placeholder="Last Name"
                    value={formData.lastname}
                    onChange={handleChange}
                    required
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="confirm_password"
                    placeholder="Confirm Password"
                    value={formData.confirm_password}
                    onChange={handleChange}
                    required
                />

                {error && <p className={styles.error}>{error}</p>}

                <button type="submit" disabled={loading}>
                    {loading ? 'Registering...' : 'Register'}
                </button>
            </form>

            <p className={styles.loginLink}>
                Already have an account? <a href="/login">Login here</a>
            </p>
        </div>
    );
};

export default Register;