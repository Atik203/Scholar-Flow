export type BaseMetadata = {
  title?: string;
  description?: string;
  canonical?: string;
};

export const buildSeo = ({ title, description, canonical }: BaseMetadata) => ({
  title: title || "Scholar-Flow",
  description: description || "AI-Powered Research Paper Collaboration Hub",
  alternates: canonical ? { canonical } : undefined,
});
