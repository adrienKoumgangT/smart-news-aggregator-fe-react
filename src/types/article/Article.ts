import type {ArticleSummary} from "./ArticleSummary.ts";
import type {ArticleInteractionStats} from "../interaction/ArticleInteractionStats.ts";
import type {ArticleInteractionStatus} from "../interaction/ArticleInteractionStatus.ts";


export interface Article extends ArticleSummary {
    content?: string;
    url?: string;
    language?: string;
    country?: string;

    total_user_interaction?: ArticleInteractionStats;
    current_user_interaction?: ArticleInteractionStatus;
}
