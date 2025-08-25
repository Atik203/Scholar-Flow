type BaseMetadata = {
    title?: string;
    description?: string;
    canonical?: string;
};
declare const buildSeo: ({ title, description, canonical }: BaseMetadata) => {
    title: string;
    description: string;
    alternates: {
        canonical: string;
    } | undefined;
};

export { type BaseMetadata, buildSeo };
