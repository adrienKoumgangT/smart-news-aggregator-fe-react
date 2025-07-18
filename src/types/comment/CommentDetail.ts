import type {Author} from "../user/Author.ts";
import type {ArticleInfo} from "../article/ArticleInfo.ts";


export interface CommentDetail {
    comment_id?: string;
    user_id?: string;
    article_id?: string;
    comment_fk?: string;
    content?: string;
    author?: Author;

    article_info: ArticleInfo;
}