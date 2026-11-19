# Only for you

A private, phone-first romantic proposal experience built with vanilla HTML, CSS, JavaScript, and Vite.

## Run locally

```bash
npm install
npm run dev
```

Open the local address shown in the terminal on an iPhone-sized browser window.

## Before you share it

To change the WhatsApp recipient later, update the international-format number in `src/scenes/ask.js` (no `+`, spaces, or punctuation). For example, `919876543210`.

## Deploy to Netlify

1. Push this folder to a Git repository.
2. In Netlify, choose **Add new site** and import that repository.
3. Use `npm run build` as the build command and `dist` as the publish directory.
4. Deploy, then open the secure site URL on the phone.

## Deploy to Vercel

1. Import the repository in Vercel.
2. Select the Vite framework preset if it is not detected automatically.
3. Deploy with the default `npm run build` command and `dist` output directory.
4. Open the deployed URL on the phone.

## Add it to an iPhone Home Screen

1. Open the deployed site in Safari.
2. Tap **Share**.
3. Choose **Add to Home Screen**.
4. Open it from the new icon for the full-screen experience.
