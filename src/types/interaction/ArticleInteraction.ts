export interface ArticleInteraction {
    interaction_id: string;

    level_interaction: string;

    user_id: string;
    article_id: string;
    comment_id?: string;

    article_title: string;

    read_at: string;
    time_spent: number;
    liked: boolean;
    shared: boolean;
    saved: boolean;
    report: boolean;
}