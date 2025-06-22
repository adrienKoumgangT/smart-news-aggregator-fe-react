import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../../api/axios.ts';
import './ArticleDetails.css';
import type { Article } from "../../../types/article/Article.ts";
import type { Comment } from '../../../types/comment/Comment.ts';
import type { ArticleInteractionStatus } from "../../../types/interaction/ArticleInteractionStatus.ts";
import type { ArticleInteractionStats } from "../../../types/interaction/ArticleInteractionStats.ts";


const ArticleDetails = () => {
    const { id } = useParams(); // expects route like /article/:id
    const navigate = useNavigate();
    const [article, setArticle] = useState<Article | null>(null);
    const [loading, setLoading] = useState(true);
    const [comments, setComments] = useState<Comment[]>([]);
    const [commentPage, setCommentPage] = useState(1);
    const [isLastCommentPage, setIsLastCommentPage] = useState(false);
    const commentLimit = 5;
    const [newComment, setNewComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const interactionKeys = ['liked', 'saved', 'shared', 'report'] as const;
    type InteractionType = typeof interactionKeys[number];
    const emojiMap: Record<InteractionType, string> = {
        liked: '❤️',
        saved: '💾',
        shared: '🔗',
        report: '🚫'
    };
    const [userInteraction, setUserInteraction] = useState<ArticleInteractionStatus>(article?.current_user_interaction || {
        liked: false,
        saved: false,
        shared: false,
        report: false
    });
    const [interactionCount, setInteractionCount] = useState<ArticleInteractionStats>(article?.total_user_interaction || {
        liked: 0,
        saved: 0,
        shared: 0,
        report: 0
    });
    const [loadingInteraction, setLoadingInteraction] = useState<InteractionType | null>(null);


    // Fetch the article details using the provided id
    useEffect(() => {
        API.get<Article>(`/article/${id}`)
            .then((res) => {
                const article = res.data;
                setArticle(article);
                if(article.current_user_interaction) {
                    setUserInteraction(article.current_user_interaction);
                }
                if(article.total_user_interaction) {
                    setInteractionCount(article.total_user_interaction);
                }
            })
            .catch((error) => {
                console.error('Error fetching article details:', error);
            })
            .finally(() => setLoading(false));
    }, [id]);

    useEffect(() => {
        if (!id) return;

        API.get<{ comments: Comment[] }>(
            `/article/${id}/comment?page=${commentPage}&limit=${commentLimit}`
        )
            .then((res) => {
                const commentList = res.data.comments;
                setComments(commentList);
                setIsLastCommentPage(commentList.length < commentLimit);
            })
            .catch((err) => {
                console.error('Failed to fetch comments:', err);
            });
    }, [id, commentPage]);

    // Format ISO date string into a human-readable format
    const formatDate = (isoDate: string) => {
        const date = new Date(isoDate);
        return date.toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const handleInteraction = async (type: InteractionType) => {
        if (loadingInteraction) return;

        const newValue = !userInteraction[type];
        setLoadingInteraction(type);

        try {
            await API.post(`/article/${id}/interaction`, {
                type,
                value: newValue
            }).then((res) => {
                const result = res.data;
                if (result) {
                    if(result?.success) {
                        setUserInteraction((prev) => ({ ...prev, [type]: newValue }));
                        setInteractionCount((prev) => ({
                            ...prev,
                            [type]: prev[type] + (newValue ? 1 : -1)
                        }));
                    } else {
                        console.error(`Interaction failed: ${type}`, result?.message);
                    }
                }
            });


        } catch (err) {
            console.error(`Interaction failed: ${type}`, err);
        } finally {
            setLoadingInteraction(null);
        }
    };

    if (loading) {
        return <p className="loading">Loading article...</p>;
    }

    if (!article) {
        console.log(article);
        return <p className="error">Article not found.</p>;
    }

    const handleSubmitComment = async () => {
        if (!newComment.trim()) return;
        setSubmitting(true);

        try {
            await API.post(`/article/${id}/comment`, {
                content: newComment,
            });

            setNewComment('');
            setCommentPage(1); // go to page 1 if you want new comments on top
            // Option A: Fetch again
            API.get<{ comments: Comment[] }>(
                `/article/${id}/comment?page=1&limit=${commentLimit}`
            ).then((res) => {
                setComments(res.data.comments);
                setIsLastCommentPage(res.data.comments.length < commentLimit);
            });
        } catch (err) {
            console.error('Failed to post comment:', err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleBack = () => {
        navigate(-1);
    }

    return (
        <div className="article">
            <div className="article-details-container">
                <button className="back-button" onClick={() => handleBack()}>
                    ← Back
                </button>
                <div className="article-header">
                    <h1 className="article-title">{article.title}</h1>
                    <p className="article-meta">
                        Published on {formatDate(article.published_at || (new Date()).toLocaleDateString())} by {article.author?.name || article.source?.name}
                    </p>
                </div>
                {article.image_url && (
                    <div className="article-image-container">
                        <img src={article.image_url} alt={article.title} className="article-image" />
                    </div>
                )}
                <div className="article-content">
                    <p>{article.description}</p>
                </div>
                {article.tags && article.tags.length > 0 && (
                    <div className="article-tags">
                        {article.tags.map((tag, idx) => (
                            <span key={idx} className="article-tag">{tag}</span>
                        ))}
                    </div>
                )}
                {article.source?.url && article.source.url.startsWith('http') && (
                    <div className="read-original-link">
                        <a href={article.source.url} target="_blank" rel="noopener noreferrer">
                            🔗 Read on the source website
                        </a>
                    </div>
                )}
                <div style={{ textAlign: 'center' }}>
                    <div className="article-interactions">
                        {interactionKeys.map((type) => (
                            <div
                                key={type}
                                className={`interaction-btn ${userInteraction[type] ? 'active' : ''}`}
                                onClick={() => handleInteraction(type)}
                            >
                                <span className="emoji">{emojiMap[type]}</span>
                                <span className="count">{interactionCount[type]}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="comment-section">
                <h3>💬 Comments</h3>

                {comments.length === 0 ? (
                    <p>No comments yet.</p>
                ) : (
                    <ul className="comment-list">
                        {comments.map((c, idx) => (
                            <li key={c.comment_id || idx} className="comment-card">
                                <p className="comment-line">
                                    <strong>
                                        {c.author
                                            ? `${c.author.firstname} ${c.author.lastname}`
                                            : 'Anonymous'}
                                    </strong>
                                    : {c.content}
                                </p>
                            </li>
                        ))}
                    </ul>
                )}

                <div className="pagination">
                    <button onClick={() => setCommentPage((p) => Math.max(p - 1, 1))} disabled={commentPage === 1}>
                        ← Previous
                    </button>
                    <span>Page {commentPage}</span>
                    <button
                        onClick={() => setCommentPage((p) => p + 1)}
                        disabled={isLastCommentPage}
                    >
                        Next →
                    </button>
                </div>
            </div>

            <div className="comment-form">
                <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Write your comment..."
                      rows={3}
                      disabled={submitting}
                />
                <button onClick={handleSubmitComment} disabled={submitting || !newComment.trim()}>
                    {submitting ? 'Submitting...' : 'Post Comment'}
                </button>
            </div>
        </div>
    );
};

export default ArticleDetails;
