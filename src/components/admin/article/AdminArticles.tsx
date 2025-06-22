import { useEffect, useState } from 'react';
import styles from './AdminArticles.module.css';
// import { useNavigate } from 'react-router-dom';
import API from "../../../api/axios.ts";
import './AdminArticles.module.css'
import type {ArticleSummary} from "../../../types/article/ArticleSummary.ts";


const AdminArticles = () => {
    const [articles, setArticles] = useState<ArticleSummary[]>([]);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const limit = 10;
    // const navigate = useNavigate();

    const fetchArticles = async (currentPage: number) => {
        await API.get<{articles: ArticleSummary[], page: number, limit: number, pageCount: number, total: number}>(`/admin/articles?limit=${limit}&page=${currentPage}`)
            .then(res => {
                setArticles(res.data.articles);
                setTotal(res.data.total);
            })
            .catch(err => {
                console.error('Failed to fetch articles:', err);
            });
    };

    const deleteArticle = async (articleId: string) => {
        if (!confirm('Are you sure you want to delete this article?')) return;

        await API.delete(
            `/admin/article/${articleId}`
        ).then(res => {
            console.log(res.data.message);
        }).catch(err => {
            console.error('Error delete article:', err);
        });

        await fetchArticles(page);
    };

    useEffect(() => {
        fetchArticles(page);
    }, [page]);

    const totalPages = Math.ceil(total / limit);

    return (
        <div className={styles.container}>
            <h2>Admin – Article Management</h2>
            <div className={styles.tableWrapper}>
                <table className={styles.articleTable}>
                    <thead>
                    <tr>
                        <th>API</th>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Published At</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {articles.map(article => (
                        <tr key={article.article_id}>
                            <td>{article.extern_api}</td>
                            <td>{article.title}</td>
                            <td>{article.author?.name || article.source?.name}</td>
                            <td>{new Date(article.published_at || (new Date()).toLocaleDateString()).toLocaleString()}</td>
                            <td>
                                <button
                                    className={styles.deleteBtn}
                                    onClick={() => deleteArticle(article.article_id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    {articles.length === 0 && (
                        <tr>
                            <td colSpan={4} className={styles.noData}>No articles found.</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
            <div className={styles.pagination}>
                <button
                    onClick={() => setPage(p => p - 1)}
                    disabled={page === 1}
                    className={styles.pageBtn}
                >
                    Previous
                </button>
                <span className={styles.pageInfo}>Page {page} of {totalPages}</span>
                <button
                    onClick={() => setPage(p => p + 1)}
                    disabled={page === totalPages}
                    className={styles.pageBtn}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default AdminArticles;
