import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      backgroundImage: {
        'custom-radial': 'radial-gradient(circle, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 46%, rgba(0,212,255,1) 100%)',
      },
    },
  },
  plugins: [],
};
export default config;
