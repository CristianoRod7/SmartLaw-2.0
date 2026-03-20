// frontend/postcss.config.js
export default {
  plugins: {
    "@tailwindcss/postcss": {}, // 👈 여기가 핵심! 최신 버전용 이름이야.
    autoprefixer: {},
  },
}