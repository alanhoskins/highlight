export type ConsoleMessage = {
    value: string;
    time: number;
    type: string;
};

export type NetworkResourceContent = {
    endTime?: number;
    request?: HookRequest;
    response?: HookResponse;
};

export type HookRequest = {
    method: string;
    url: string;
    body: string;
    headers: string;
    timeout: number;
    type: string;
    withCredentials: string;
};

export type HookResponse = {
    status: string;
    statusText: string;
    text: string;
    headers: string;
    xml: any;
    data: any;
};

export type NetworkResourceTiming = PerformanceResourceTiming & {
    absoluteStart: number;
};
