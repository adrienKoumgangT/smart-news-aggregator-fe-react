import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AdminUserList.module.css';
import API from "../../../api/axios.ts";
import type {User} from "../../../types/user/User.ts";


const AdminUserList: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const navigate = useNavigate();

    const handleBack = () => {
        navigate(-1);
    }

    const limit = 5;

    // const userLocale = navigator.language || 'en-GB';

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await API.get<{ users: User[], page: number, limit: number, pageCount: number, total: number}>(`/admin/users?limit=${limit}&page=${page}`);
            setUsers(res.data.users);
            setTotal(res.data.total);
        } catch (err) {
            console.error('Failed to fetch history:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [page]);

    const totalPages = Math.ceil(total / limit);

    const goToUserDetails = (userId: string) => {
        navigate(`/admin/users/${userId}`);
    };

    if (loading) {
        return <p className="loading">Loading users...</p>;
    }

    return (
        <div className={styles.container}>
            <button className="back-button" onClick={() => handleBack()}>
                ← Back
            </button>
            <h2>Admin – User Management</h2>
            <div className={styles.tableWrapper}>
                <table className={styles.userTable}>
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map(user => (
                        <tr key={user.user_id}>
                            <td>{user.firstname} {user.lastname}</td>
                            <td>{user.email}</td>
                            <td>{user.account.role}</td>
                            <td>{user.account.status}</td>
                            <td>
                                <button
                                    className={styles.viewBtn}
                                    onClick={() => goToUserDetails(user.user_id)}
                                >
                                    View
                                </button>
                            </td>
                        </tr>
                    ))}
                    {users.length === 0 && (
                        <tr>
                            <td colSpan={5} className={styles.noData}>No users found.</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            <div className={styles.pagination}>
                <button onClick={() => setPage((p) => p - 1)} disabled={page === 1}>
                    Previous
                </button>
                <span>
                    Page {page} of {totalPages}
                </span>
                <button onClick={() => setPage((p) => p + 1)} disabled={page === totalPages}>
                    Next
                </button>
            </div>
        </div>
    );
};

export default AdminUserList;