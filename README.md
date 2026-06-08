# The Albani — marketing site

Static site for **Villa Sancti Albani** at 160 Gerald's Way, St. Albans, Maine. Built with [Astro](https://astro.build/).

## Local development

```bash
npm install
npm run dev
```

## Booking (OwnerRez)

1. Copy `.env.example` to `.env`.
2. Follow **[OWNERREZ_SETUP.md](./OWNERREZ_SETUP.md)** to configure rates, rules, and widgets in OwnerRez.
3. Paste your widget IDs into `.env` and run `npm run build`.

Replace placeholder email addresses in `src/pages` when your inbox is ready.

## GitHub

```bash
git init
git add .
git commit -m "Initial site"
gh repo create thealbani-site --private --source=. --push
```

Connect **thealbani.com** in your host (GitHub Pages, Cloudflare Pages, or Netlify) when DNS is pointed.

## Assets

Logo and photos are copied into `public/` from `MTN_House`; add or swap images under `public/images/`.
