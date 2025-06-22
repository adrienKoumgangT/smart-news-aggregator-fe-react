import { useEffect, useState } from 'react';
import styles from './AdminErrors.module.css';
import API from '../../../api/axios';
import type {ServerErrorLog} from "../../../types/server/ServerErrorLog.ts";


const AdminErrors = () => {
    const [errors, setErrors] = useState<ServerErrorLog[]>([]);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);

    const limit = 10;

    useEffect(() => {
        fetchErrors();
    }, [page]);

    const fetchErrors = () => {
        setLoading(true);
        API.get<{errors: ServerErrorLog[], total: number, page: number, limit: number, pageCount: number}>(`/admin/dashboard/errors`, { params: { page, limit } })
            .then(res => {
                setErrors(res.data.errors);
                setTotal(res.data.total);
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to fetch errors', err);
                setLoading(false);
            });
    };

    const deleteError = (error_id: string) => {
        API.delete(`/admin/dashboard/errors/${error_id}`)
            .then(() => {
                fetchErrors();
            })
            .catch(err => {
                console.error('Failed to delete error', err);
            });
    };

    const totalPages = Math.ceil(total / limit);

    return (
        <div className={styles.container}>
            <h2>Admin - Error Logs</h2>
            {loading ? (
                <p>Loading...</p>
            ) : errors.length === 0 ? (
                <p>No errors found.</p>
            ) : (
                <>
                    <ul className={styles.errorList}>
                        {errors.map(error => (
                            <li key={error.server_error_log_id} className={styles.errorItem}>
                                <div className={styles.header}>
                                    <strong>{error.exception_name}</strong>
                                    <button onClick={() => deleteError(error.server_error_log_id)} className={styles.deleteBtn}>Delete</button>
                                </div>
                                <p className={styles.message}>{error.exception_message}</p>
                                <pre className={styles.curl}>{error.curl}</pre>
                                <details className={styles.details}>
                                    <summary>Request Data</summary>
                                    <pre>{JSON.stringify(error.request_data, null, 2)}</pre>
                                </details>
                            </li>
                        ))}
                    </ul>

                    <div className={styles.pagination}>
                        <button onClick={() => setPage(p => p - 1)} disabled={page === 1}>Previous</button>
                        <span> Page {page} of {totalPages} </span>
                        <button onClick={() => setPage(p => p + 1)} disabled={page === totalPages}>Next</button>
                    </div>
                </>
            )}
        </div>
    );
};

export default AdminErrors;