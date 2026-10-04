import { createRequire } from 'module';

var require = createRequire(import.meta.url);
var module = { exports: {} };

/** @type {import('postcss-load-config').Config} */const config = {  plugins: {    "@tailwindcss/postcss": {},  },};export default config;