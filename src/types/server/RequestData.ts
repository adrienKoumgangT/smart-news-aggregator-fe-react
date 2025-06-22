export interface RequestData {
    url: string;
    method: string;
    body?: object;
    args?: object;
    headers?: object;
    form?: object;
}