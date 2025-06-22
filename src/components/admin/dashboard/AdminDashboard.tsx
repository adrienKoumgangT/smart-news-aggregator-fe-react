import { useEffect, useState } from 'react';
import styles from './AdminDashboard.module.css';
import API from "../../../api/axios.ts";
import type {DashboardStats} from "../../../types/admin/DashboardStats.ts";
import {useNavigate} from "react-router-dom";


const AdminDashboard = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [afterDate, setAfterDate] = useState<string | null>(null);
    const [beforeDate, setBeforeDate] = useState<string | null>(null);

    const navigate = useNavigate();

    const fetchStats = () => {
        setLoading(true);

        const params: Record<string, string> = {};
        if (afterDate) params.after_date = afterDate;
        if (beforeDate) params.before_date = beforeDate;

        API.get<DashboardStats>('/admin/dashboard/summary', { params })
            .then((res) => {
                setStats(res.data);
                setLoading(false);
            }).catch(err => {
            console.error('Error fetching dashboard stats:', err);
            setLoading(false);
        });
    };

    useEffect(() => {
        fetchStats();
    }, []); // Only on mount

    const handleApplyFilter = () => {
        fetchStats();
    };

    const clearFilter = () => {
        setAfterDate(null);
        setBeforeDate(null);
        fetchStats(); // reload without filters
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Admin Dashboard</h2>

            <div className={styles.filters}>
                <label>
                    After Date (Inclus):
                    <input
                        type="date"
                        value={afterDate ?? ''}
                        onChange={(e) => setAfterDate(e.target.value || null)}
                    />
                </label>
                <label>
                    Before Date (Exclus):
                    <input
                        type="date"
                        value={beforeDate ?? ''}
                        onChange={(e) => setBeforeDate(e.target.value || null)}
                    />
                </label>
                <button onClick={handleApplyFilter}>Apply Filters</button>
                {(afterDate || beforeDate) && (
                    <button onClick={clearFilter}>
                        Clear Filter
                    </button>
                )}
            </div>

            {loading ? (
                <p className={styles.loading}>Loading statistics...</p>
            ) : stats ? (
                <>
                    <div className={styles.grid}>
                        <div className={styles.card}>
                            <h3>Total Users</h3>
                            <p>{stats.total_users}</p>
                        </div>
                        <div className={styles.card}>
                            <h3>Total Articles</h3>
                            <p>{stats.total_articles}</p>
                        </div>
                        <div className={styles.card}>
                            <h3>Total Comments</h3>
                            <p>{stats.total_comments}</p>
                        </div>
                        <div className={styles.card}>
                            <h3>Total Interactions</h3>
                            <p>{stats.total_interactions}</p>
                        </div>
                        <div className={styles.card}>
                            <h3>Total Errors</h3>
                            <p>{stats.total_errors}</p>
                        </div>
                    </div>

                    <div className={styles.navigation}>
                        <button onClick={() => navigate('/admin/users')}>Manage Users</button>
                        <button onClick={() => navigate('/admin/articles')}>Manage Articles</button>
                        <button onClick={() => navigate('/admin/errors')}>View Errors</button>
                    </div>
                </>

            ) : (
                <p className={styles.error}>Failed to load statistics.</p>
            )}
        </div>
    );
};

export default AdminDashboard;