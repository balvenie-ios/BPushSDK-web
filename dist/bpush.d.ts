export declare const BPush: {
    registerToken: (props: {
        pushToken: string;
        appKey: string;
        bundleID: string;
        appVersion?: string;
    }) => Promise<Response>;
};
