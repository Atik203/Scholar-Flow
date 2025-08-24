declare const _default: {
    env: string | undefined;
    port: string | undefined;
    jwt: {
        jwt_secret: string | undefined;
        expires_in: string | undefined;
        refresh_token_secret: string | undefined;
        refresh_token_expires_in: string | undefined;
        reset_pass_secret: string | undefined;
        reset_pass_token_expires_in: string | undefined;
    };
    reset_pass_link: string | undefined;
    emailSender: {
        email: string | undefined;
        app_pass: string | undefined;
    };
    openai: {
        api_key: string | undefined;
    };
    aws: {
        access_key_id: string | undefined;
        secret_access_key: string | undefined;
        bucket_name: string | undefined;
        region: string | undefined;
    };
    stripe: {
        secret_key: string | undefined;
        webhook_secret: string | undefined;
    };
    ssl: {
        storeId: string | undefined;
        storePass: string | undefined;
        successUrl: string | undefined;
        cancelUrl: string | undefined;
        failUrl: string | undefined;
        sslPaymentApi: string | undefined;
        sslValidationApi: string | undefined;
    };
};
export default _default;
//# sourceMappingURL=index.d.ts.map