# tg-virus-detector-page

Landing page for [@tg_virus_check_bot](https://t.me/tg_virus_check_bot), the Telegram bot that checks files with VirusTotal. Khmer and English.

Plain static files, so any static host works (Vercel, Netlify, Cloudflare Pages, GitHub Pages). No build step.

```
index.html      all content, in both languages
styles.css
script.js       language switch + the chat demo
assets/logo.svg
assets/fonts/   Koulen + Kantumruy Pro (self-hosted, no Google requests)
```

## Editing text

Every piece of text appears twice, once per language:

```html
<span class="km" lang="km">ខ្មែរ</span><span class="en" lang="en">English</span>
```

Change both. Khmer is shown by default; `?lang=en` opens the English version, and the visitor's choice is remembered.

The chat demo's bot replies (in `script.js`) are copied word-for-word from the bot's code. If the bot's wording changes, update them too. Only the EICAR sample links to a real VirusTotal report.

## Preview locally

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Vercel Web Analytics

The page includes Vercel's HTML analytics snippet. To collect data, enable
**Web Analytics** for the project in the Vercel dashboard, then deploy the
site. Analytics data appears in the project's **Analytics** dashboard after
visits to the deployed site. The snippet does not collect data from the local
preview.
