import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography' // <-- We import it here instead

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [
    typography, // <-- And use it here
  ],
}
export default config
