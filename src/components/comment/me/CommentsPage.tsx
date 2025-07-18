import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../../api/axios.ts';
import styles from './CommentsPage.module.css';
import type {CommentDetail} from "../../../types/comment/CommentDetail.ts";


const CommentsPage = () => {
    const [comments, setComments] = useState<CommentDetail[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const limit = 10;

    const navigate = useNavigate();

    const fetchComments = async () => {
        setLoading(true);
        await API.get<{ comments: CommentDetail[], page: number, limit: number, pageCount: number, total: number }>('/article/comment/me', {
            params: { page, limit },
        }).then((res) => {
            setComments(res.data.comments);
            setTotalPages(Math.ceil(res.data.total / limit));
        }).catch((error) => {
            console.error('Failed to fetch comments:', error);
        }).finally(() => {
            setLoading(false);
        });
    };

    const deleteComment = async (articleId: string, commentId: string) => {
        const confirmed = window.confirm('Are you sure you want to delete this comment?');
        if (!confirmed) return;

        try {
            await API.delete(`/article/${articleId}/comment/${commentId}`);
            setComments((prev) => prev.filter((c) => c.comment_id !== commentId));
        } catch (error) {
            console.error('Failed to delete comment:', error);
            alert('Failed to delete comment.');
        }
    };

    useEffect(() => {
        fetchComments();
    }, [page]);

    const goToArticleDetails = (articleId: string) => {
        navigate(`/article/${articleId}`);
    };

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
        <div className={styles.container}>
            <h2 className={styles.title}>My Comments</h2>
            {loading ? (
                <p className={styles.loading}>Loading comments...</p>
            ) : comments.length === 0 ? (
                <p className={styles.empty}>No comments found.</p>
            ) : (
                <ul className={styles.commentList}>
                    {comments.map((comment) => (
                        <li key={comment.comment_id} className={styles.commentItem}>
                            <div className={styles.articleMeta}>
                                <button
                                    className={styles.articleTitle}
                                    onClick={() => goToArticleDetails(comment.article_id || '')}
                                >
                                    {comment.article_info.title}
                                </button>
                                <span className={styles.articleDate}>
                                    {formatDate(comment.article_info.published_at || (new Date()).toLocaleDateString())}
                                </span>
                                {comment.article_info.source?.url && (
                                    <span className={styles.articleSource}>
                                        {comment.article_info.source.url}
                                    </span>
                                )}
                            </div>
                            <p className={styles.commentText}>{comment.content}</p>
                            <button
                                className={styles.deleteButton}
                                onClick={() => deleteComment(comment.article_id || '', comment.comment_id || '')}
                            >
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            {totalPages > 1 && (
                <div className={styles.pagination}>
                    <button
                        disabled={page === 1}
                        onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                    >
                        Previous
                    </button>
                    <span>Page {page} of {totalPages}</span>
                    <button
                        disabled={page === totalPages}
                        onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default CommentsPage;