import type {Account} from "./Account.ts";
import type {Address} from "./Address.ts";

export interface User {
    user_id: string;
    firstname: string;
    lastname: string;
    email: string;
    account: Account;
    address?: Address;
}