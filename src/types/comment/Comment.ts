import type {Author} from "../user/Author.ts";

export interface Comment {
    comment_id?: string;
    user_id?: string;
    article_id?: string;
    comment_fk?: string;
    content?: string;
    author?: Author;
}