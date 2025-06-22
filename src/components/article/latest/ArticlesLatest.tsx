import { useEffect, useState } from 'react';
import API from '../../../api/axios.ts';
import type { ArticleSummary } from '../../../types/article/ArticleSummary.ts';
import './ArticlesLatest.css';
import { Link } from "react-router-dom";


const ArticlesLatest = () => {
    const [articles, setArticles] = useState<ArticleSummary[]>([]);
    // const [searchParams, setSearchParams] = useSearchParams();
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [isLastPage, setIsLastPage] = useState(false);

    const limit = 5;

    const fetchArticles = async (pageNum: number) => {
        await API.get<{ articles: ArticleSummary[], page: number, limit: number, pageCount: number, total: number }>(
            `/article/latest?limit=${limit}&page=${pageNum}`
        ).then(res => {
            const data = res.data.articles;
            setArticles(data);
            setTotal(res.data.total);
            setIsLastPage(data.length < limit);
        }).catch(err => {
            console.error('Error fetching article details:', err);
        });
    };

    useEffect(() => {
        fetchArticles(page);
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

    const totalPages = Math.ceil(total / limit);

    return (
        <div className="articles-latest-container">
            <h2 className="section-title">Latest Articles</h2>

            {articles.length === 0 ? (
                <p className="empty-state">No articles found.</p>
            ) : (
                <div className="article-list">
                    {articles.map((a, i) => (
                        <div className="article-card" key={i}>
                            <Link to={`/article/${a.article_id}`} className="article-title-link">
                                {a.title}
                            </Link>

                            <div className="article-meta">
                                <span className="article-author">By {a.author?.name || a.source?.name || 'Unknown'}</span>
                                <span className="article-date"> {formatDate(a.published_at || (new Date()).toLocaleDateString())} </span>
                            </div>

                            <p className="article-description">{a.description}</p>

                            {a.tags && a.tags.length > 0 && (
                                <div className="article-tags">
                                    {a.tags.map((tag, idx) => (
                                        <span key={idx} className="article-tag"> #{tag} </span>
                                    ))}
                                </div>
                            )}

                            <div className="article-footer">
                                {a.source?.name && (
                                    <span className="article-source"> {a.source.name} </span>
                                )}
                                <Link to={`/article/${a.article_id}`} className="read-more-btn">
                                    Read more →
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="pagination">
                <button onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1}>
                    ← Previous
                </button>
                <span>Page {page} of {totalPages}</span>
                <button onClick={() => {setPage((p) => p + 1)}} disabled={isLastPage}>
                    Next →
                </button>
            </div>
        </div>
    );
};

export default ArticlesLatest;