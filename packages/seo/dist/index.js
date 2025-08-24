// metadata.ts
var buildSeo = ({ title, description, canonical }) => ({
  title: title || "Scholar-Flow",
  description: description || "AI-Powered Research Paper Collaboration Hub",
  alternates: canonical ? { canonical } : void 0
});
export {
  buildSeo
};
