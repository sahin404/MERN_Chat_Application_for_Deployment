# React + Vite + Tailwind CSS + DaisyUI Starter Project

This is a complete boilerplate React project using:

- ⚛️ React (via Vite)
- 🎨 Tailwind CSS v3.4.17
- 🌼 DaisyUI v5.0.46
- 🧭 React Router DOM v6.30.1
- 🧠 localforage, match-sorter, sort-by

Anyone can clone this repo and start the project immediately.
Or can setup Manually.

```bash
To cloning this project:
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
npm install
npm run dev
---



🛠️ Setup Instructions

1️⃣ Create React Project (Vite + React)


npm create vite@latest name-of-your-project -- --template react
cd name-of-your-project

2️⃣ Install Router and Utility Libraries

npm install react-router-dom
npm install localforage match-sorter sort-by

3️⃣ Install Tailwind CSS (v3.4.17)

npm install -D tailwindcss@3 postcss autoprefixer
npx tailwindcss init -p

4️⃣ Configure tailwind.config.js

import daisyui from 'daisyui';
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
}

5️⃣ Add Tailwind Directives in index.css
@tailwind base;
@tailwind components;
@tailwind utilities;

6️⃣ Install DaisyUI (v5.0.46)
npm i -D daisyui@latest

▶️ Run the Project

