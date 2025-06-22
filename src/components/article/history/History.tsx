import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './History.css';
import API from "../../../api/axios.ts";
import type {ArticleInteraction} from "../../../types/interaction/ArticleInteraction.ts";


const History = () => {
    const [history, setHistory] = useState<ArticleInteraction[]>([]);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const limit = 5;
    const emojiMap: Record<string, string> = {
        liked: '❤️',
        saved: '💾',
        shared: '🔗',
        report: '🚫',
    };
    const userLocale = navigator.language || 'en-GB';

    useEffect(() => {
        API.get<{interactions: ArticleInteraction[], page: number, limit: number, pageCount: number, total: number}>(`/article/history?page=${page}&limit=${limit}`)
            .then(res => {
                setHistory(res.data.interactions);
                setTotal(res.data.total);
            })
            .catch(err => {
                console.error('Failed to fetch history:', err);
            });
    }, [page]);

    const totalPages = Math.ceil(total / limit);

    const getInteractionContent = (type: string, item: ArticleInteraction)=> {
        if(type == 'liked') {
            return item.liked;
        }
        if(type == 'saved') {
            return item.saved;
        }
        if(type == 'shared') {
            return item.shared;
        }
        if(type == 'report') {
            return item.report;
        }
    }



    return (
        <div className="history-container">
            <h2>Your Reading History</h2>
            {history.length === 0 ? (
                <p>No articles read yet.</p>
            ) : (
                <>
                    <ul className="history-list">
                        {history.map((item, index) => (
                            <li key={index} className="history-item">
                                <Link to={`/article/${item.article_id}`}>
                                    <strong>{item.article_title}</strong>
                                </Link>
                                <p>Read at: {new Date(item.read_at).toLocaleString(userLocale)}</p>
                                {item.time_spent && <p>Number of times read: {item.time_spent} times</p>}

                                <div style={{ textAlign: 'center' }}>
                                    <div className="article-interactions">
                                        {['liked', 'saved', 'shared', 'report'].map((type) => (
                                            <div
                                                key={type}
                                                className={`interaction-btn ${getInteractionContent(type, item) ? 'active' : ''}`}
                                                title={type.charAt(0).toUpperCase() + type.slice(1)}
                                            >
                                                <span className="emoji">
                                                  {emojiMap[type] || '❔'}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {item.report && (
                                    <p className="feedback-text">
                                        <strong>Feedback:</strong> {item.report}
                                    </p>
                                )}
                            </li>
                        ))}
                    </ul>

                    <div className="pagination">
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
                </>
            )}
        </div>
    );
};

export default History;