import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './AdminUserDetails.module.css';
import API from "../../../api/axios.ts";
import type {User} from "../../../types/user/User.ts";
import type {Account} from "../../../types/user/Account.ts";


const AdminUserDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        API.get(`/admin/user/${id}`)
            .then(res => setUser(res.data))
            .catch(err => console.error(err));
    }, [id]);

    const handleInputChange = (field: keyof User, value: string) => {
        if (!user) return;
        setUser({ ...user, [field]: value });
    };

    const handleAccountChange = (field: keyof Account, value: string) => {
        if (!user) return;
        setUser({ ...user, account: { ...user.account, [field]: value } });
    };

    const handleSave = () => {
        if (!user) return;
        setLoading(true);
        API.put(`/admin/user/${user.user_id}`, user)
            .then(() => navigate(`/admin/users/${user.user_id}`))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    };

    const handleDelete = () => {
        if (!user) return;
        if (confirm("Are you sure you want to delete this user?")) {
            API.delete(`/admin/user/${user.user_id}`)
                .then(() => navigate('/admin/users'))
                .catch(err => console.error(err));
        }
    };

    if (!user) return <p className={styles.loading}>Loading user...</p>;

    return (
        <div className={styles.container}>
            <button className="back-button" onClick={() => navigate('/admin/users')}>
                ← Back
            </button>
            <h2>Edit User: {user.firstname} {user.lastname}</h2>
            <div className={styles.formGroup}>
                <label>Email</label>
                <input
                    type="email"
                    value={user.email}
                    onChange={e => handleInputChange('email', e.target.value)}
                />
            </div>

            <div className={styles.formGroup}>
                <label>First Name</label>
                <input
                    type="text"
                    value={user.firstname}
                    onChange={e => handleInputChange('firstname', e.target.value)}
                />
            </div>

            <div className={styles.formGroup}>
                <label>Last Name</label>
                <input
                    type="text"
                    value={user.lastname}
                    onChange={e => handleInputChange('lastname', e.target.value)}
                />
            </div>

            <div className={styles.formGroup}>
                <label>Role</label>
                <select
                    value={user.account.role}
                    onChange={e => handleAccountChange('role', e.target.value)}
                >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                </select>
            </div>

            <div className={styles.formGroup}>
                <label>Status</label>
                <select
                    value={user.account.status}
                    onChange={e => handleAccountChange('status', e.target.value)}
                >
                    <option value="active">Active</option>
                    <option value="disabled">Disabled</option>
                </select>
            </div>

            <div className={styles.actions}>
                <button className={styles.saveBtn} onClick={handleSave} disabled={loading}>
                    {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button className={styles.deleteBtn} onClick={handleDelete}>
                    Delete User
                </button>
            </div>
        </div>
    );
};

export default AdminUserDetails;