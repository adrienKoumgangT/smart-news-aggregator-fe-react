import type {ArticleSource} from "./ArticleSource.ts";


export interface ArticleInfo {
    title: string;
    description?: string;
    author?: ArticleSource;
    source?: ArticleSource;
    published_at?: string;
}

