import type {ArticleSource} from "./ArticleSource.ts";

export interface ArticleSummary {
    article_id: string;
    extern_id?: string;
    extern_api?: string;

    title: string;
    description?: string;
    author?: ArticleSource;
    source?: ArticleSource;
    image_url?: string;

    published_at?: string;

    tags?: string[];
}