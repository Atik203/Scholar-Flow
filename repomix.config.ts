import { defineConfig } from 'repomix';

export default defineConfig({
  output: {
    filePath: 'repomix-output.xml',
    style: 'xml',
    removeComments: true,
    removeEmptyLines: true,
    showLineNumbers: true,
    topFilesLength: 20,
  },
  ignore: {
    useGitignore: true,
    useDefaultPatterns: true,
    customPatterns: [
      // Build artifacts
      '**/dist/**',
      '**/.next/**',
      '**/out/**',
      '**/.turbo/**',
      // Package managers
      '**/node_modules/**',
      '**/.yarn/**',
      '**/.pnp.*',
      // Version control
      '**/.git/**',
      // IDE & tooling
      '**/.vscode/**',
      '**/.cursor/**',
      '**/.agents/**',
      '**/.figma/**',
      // Deployment
      '**/.vercel/**',
      // Media & assets
      '**/images/**',
      '**/response_image/**',
      '**/scholar-flow-overleaf/**',
      '**/*.png',
      '**/*.jpg',
      '**/*.jpeg',
      '**/*.gif',
      '**/*.svg',
      '**/*.ico',
      '**/*.pdf',
      '**/*.docx',
      '**/*.doc',
      '**/*.zip',
      '**/*.tar.gz',
      // Large/generated files
      '**/repomix-output.xml',
      '**/CHANGELOG.md',
      '**/LICENSE.md',
      '**/CODE_OF_CONDUCT.md',
      '**/CONTRIBUTING.md',
      '**/SECURITY.md',
      // Logs & coverage
      '**/*.log',
      '**/coverage/**',
      // Prisma generated
      '**/apps/backend/node_modules/**',
      '**/apps/frontend/node_modules/**',
      '**/apps/backend/dist/**',
    ],
  },
  include: [
    '**/*.ts',
    '**/*.tsx',
    '**/*.js',
    '**/*.jsx',
    '**/*.css',
    '**/*.scss',
    '**/*.json',
    '**/*.md',
    '**/*.prisma',
    '**/*.sql',
    '**/*.yml',
    '**/*.yaml',
  ],
});
