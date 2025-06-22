import type {RequestData} from "./RequestData.ts";

export interface ServerErrorLog {
    server_error_log_id: string;
    request_data: RequestData;
    curl: string;
    exception_name: string;
    exception_message: string;
}