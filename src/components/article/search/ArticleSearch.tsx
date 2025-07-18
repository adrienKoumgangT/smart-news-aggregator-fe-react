import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../latest/ArticlesLatest.css';
import API from '../../../api/axios.ts';
import type {ArticleSummary} from "../../../types/article/ArticleSummary.ts";


const ArticleSearch = () => {
    const [search, setSearch] = useState('');
    const [articles, setArticles] = useState<ArticleSummary[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 10;

    const handleSearch = async (resetPage = true) => {
        const currentPage = resetPage ? 1 : page;

        await API.get<{ articles: ArticleSummary[], page: number, limit: number, pageCount: number, total: number }>(
            `/article/search?q=${search}&limit=${limit}&page=${currentPage}`
        ).then(res => {
            const data = res.data.articles;
            setArticles(data);
            setTotalPages(Math.ceil(res.data.total / limit));
            if (resetPage) setPage(1);
        }).catch(err => {
            console.error('Search error:', err);
        });
    };

    useEffect(() => {
        handleSearch(false);
    }, [page]);

    // Format ISO date string into a human-readable format
    const formatDate = (isoDate: string) => {
        const date = new Date(isoDate);
        return date.toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <div className="articles-latest-container">
            <h2 className="section-title">Search Articles</h2>

            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <input
                    type="text"
                    placeholder="Enter keywords..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '6px',
                        border: '1px solid #ccc',
                        width: '60%',
                        maxWidth: '400px'
                    }}
                />
                <button
                    onClick={() => handleSearch()}
                    style={{
                        marginLeft: '0.5rem',
                        padding: '0.5rem 1rem',
                        borderRadius: '6px',
                        backgroundColor: '#0077ff',
                        color: 'white',
                        fontWeight: 500,
                        border: 'none',
                        cursor: 'pointer'
                    }}
                >
                    Search
                </button>
            </div>

            {articles.length === 0 ? (
                <p className="empty-state">No articles found.</p>
            ) : (
                <div className="article-list">
                    {articles.map((article) => (
                        <div key={article.article_id} className="article-card">
                            <h3 className="article-title">
                                <Link
                                    to={`/article/${article.article_id}`}
                                    className="article-title-link"
                                >
                                    {article.title}
                                </Link>
                            </h3>
                            <div className="article-meta">
                                <span>{formatDate(article.published_at || (new Date()).toLocaleDateString())}</span>
                                <span>{article.author?.name || article.source?.name || 'Unknown'}</span>
                            </div>
                            <p className="article-description">{article.description}</p>
                            <div className="article-footer">
                                <span className="article-source">{article.source?.name || article.author?.name || 'Unknown'}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {totalPages > 1 && (
                <div className="pagination">
                    <button disabled={page === 1} onClick={() => setPage(page - 1)}>
                        Previous
                    </button>
                    <span>Page {page} of {totalPages}</span>
                    <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default ArticleSearch;