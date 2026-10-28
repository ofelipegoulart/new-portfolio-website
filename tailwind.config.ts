import type { Config } from 'tailwindcss';
const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: { extend: { colors: { ink: 'var(--ink)', paper: 'var(--paper)', violet: 'var(--violet)', lime: 'var(--lime)', coral: 'var(--coral)' }, fontFamily: { display: ['var(--font-schibsted-grotesk)', 'sans-serif'], sans: ['var(--font-manrope)', 'sans-serif'], mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'] } } },
  plugins: [],
};
export default config;
