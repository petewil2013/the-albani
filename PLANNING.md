# The Albani — Planning Document

**Site:** `thealbani.com` (Villa Sancti Albani · St. Albans, Maine)
**Repo layout:** Astro source on `source` branch; built output on `main` (GitHub Pages, custom domain).
**Authored:** 2026-06-03
**Status:** Awaiting decisions on PMS choice and Phase 1 green-light.

---

## 1. Goals

Two threads requested by the owner, plus two implicit goals:

1. Stand up a **real reservation system** that deposits to the operations company's bank account, blocks double-bookings, and produces a clean guest experience.
2. Refresh **photos and videos** of the property.
3. Optimize the site for **marketing** — maximize qualified leads via direct booking (vs. always paying OTA fees).
4. Optimize for **ease of use** — friction-free booking, and a clear post-booking experience covering arrival, stay, and departure.

Two specific content additions from this conversation:

- **Getting Here:** dedicated section featuring a Google Maps screenshot of the final approach.
- **Post-booking "Tips for your stay"** page (behind the guest sign-in), seeded with:
  - It's buggy — tick precautions, Thermacell bug deterrent, DEET.
  - Comfortable cool stay in summer — open windows only at night; draw blinds in the rear of the house.

---

## 2. Current state (recap)

- **Stack:** Astro 6 static site → GitHub Pages, custom domain `thealbani.com`, strict CSP.
- **Branches:** `source` (Astro project) → `main` (built output deployed by GitHub Pages).
- **Pages:** `index`, `book`, `explore`, `getting-here`, `faq`, `house-rules`, `reviews`.
- **Booking today:** Stripe Payment Link + Venmo profile link in `book.astro`. No calendar, no availability, no guest portal, no automated messaging, no auth.
- **Media:** 4 stills in `public/images/`. No videos.
- **Auth:** None. Static hosting cannot do real authentication without a backend.

---

## 3. Recommendation (one-property owner with operations company + bank account)

### 3.1 Reservation: **Hospitable Direct** (Property Management System)

**Runner-up:** OwnerRez (equally credible; stronger accounting hooks; pick this one if the bookkeeper prefers it).

**Why a hosted PMS over building it ourselves:**

| Concern | Custom (A1/A2) | Hosted PMS (A3) |
|---|---|---|
| Live availability calendar | Build it | Built-in |
| Double-booking protection | Need DB + locks | Built-in |
| iCal sync to Airbnb / VRBO | Build it | Built-in |
| Cleaning fee / tax / security deposit logic | Build it | Built-in |
| Automated guest messaging | Build & host it | Built-in |
| Guest portal (solves "tips behind sign-in") | Build auth (Auth0/Clerk + hosting move) | Built-in |
| Payouts to operations bank account | Stripe Connect setup | Built-in |
| Monthly cost | Hosting + DB ≈ $0–$20 | $20–$50 (or ~3% / booking) |
| Time-to-first-booking | Days of dev | Hours of setup |
| Risk of a single bug costing a booking | High | Low |

The cost of one mishandled double-booking dwarfs a year of PMS fees. For a single property being run as a real business, "buy" wins.

### 3.2 "Tips for your stay" gate: **Guest portal inside the PMS**

When a booking is confirmed, Hospitable issues the guest a private portal URL with check-in details, Wi-Fi, gate code, and a customizable guidebook. The "Tips for your stay" content lives there. No auth code on our side, no risk of leaked unguessable URLs, no third-party identity provider.

### 3.3 Hosting

**Stay on GitHub Pages** for the marketing site. PMS handles the booking widget and guest portal on its own domain (or `book.thealbani.com` via DNS). No infra migration required.

If/when we ever need server-side logic (form handling, A/B testing, custom flows), Cloudflare Pages is the easy upgrade — Astro deploys to it unchanged. Not needed for this scope.

---

## 4. Phased plan

### Phase 0 — Decisions (owner, ~30 min)

1. **Pick PMS:** Hospitable (recommended) or OwnerRez.
2. **Open merchant account** inside the PMS; verify the operations company bank account.
3. **Decide booking entry point:** `book.thealbani.com` subdomain vs. embedded widget on `/book`. (Recommendation: embed on `/book` so the marketing site keeps the conversion.)

### Phase 1 — Marketing site quick wins (no architecture change, ~2–3 hrs of dev time)

These don't depend on the PMS decision and survive any path:

- **Getting Here — Final approach (visual)** section with the supplied Google Maps screenshot, proper alt text, responsive sizing, and tightened copy around the placeholder gate/parking lines.
- **"Tips for your stay" page drafted now**, published at a non-discoverable URL (`/stay-tips` with `noindex, nofollow`, not linked from nav), seeded with:
  - Bug section (ticks, Thermacell, DEET), with practical do/don't lists.
  - Summer cooling protocol (windows at night, blinds drawn in rear during day).
  - Stub sections for: Wi-Fi, trash/recycling day, nearest grocery/hardware/pharmacy, hospital/urgent care, on-site amenities (kayaks/grills/etc.), quiet hours, on-call number.
  This content will move into the PMS guest portal in Phase 2; the draft is the source of truth either way.
- **SEO & social:**
  - Open Graph + Twitter card meta on every page.
  - JSON-LD `LodgingBusiness` structured data on the homepage.
  - `sitemap.xml` and `robots.txt`.
  - Tighter meta descriptions and page titles targeting actual queries ("vacation rental central Maine", "St. Albans Maine rental", "Bangor Augusta vacation rental", "Great Moose Lake rental").
- **Email capture** ("Tell me when summer dates open") — Netlify Forms, Formspree, or simple `mailto:` — converts visitors who aren't ready to book yet. Highest-ROI marketing change on the page.
- **Media performance:**
  - Convert hero + gallery to `.webp` / `.avif` with `<picture>` fallbacks.
  - Proper `srcset` and `sizes`.
  - Explicit `width`/`height` to prevent layout shift.
- **Gallery + hero refresh** with whatever new photos the owner provides.
- **Videos:** embed from unlisted YouTube (or Cloudflare Stream / Mux). Add a small CSP allowance. Do **not** commit raw MP4s — they break GitHub Pages limits.
- **FAQ tightening** to remove pre-booking friction (cancellation window, pet policy, what's included, who to contact).

### Phase 2 — Reservation system (after PMS chosen, ~3–4 hrs of dev time + setup wizard)

1. Owner completes PMS signup, identity / bank verification, listing details, photos, rate sheet ($250 standard, $188 early, 10% additional weekly), seasonality, taxes, cleaning fee, security deposit, minimum stay, check-in/out times.
2. iCal sync **in** from any future Airbnb/VRBO listing.
3. iCal sync **out** to anywhere else the property is listed.
4. Embed the booking widget on `/book.astro` (replaces the manual Stripe + Venmo block; keep email contact as fallback).
5. Configure guest portal: check-in instructions, gate code, Wi-Fi, "Tips for your stay" guidebook, departure checklist.
6. Configure automated messages: booking confirmation, 7-day pre-arrival, day-of with portal link, post-stay review request.
7. End-to-end test booking with a real card + refund before announcing.

### Phase 3 — Marketing lift (after live booking exists, ~1–2 hrs of dev time)

- Persistent "Reserve" CTA in the header.
- Availability preview block on the homepage hero (live from PMS).
- Google Business Profile + Apple Business Connect listings (both free, both drive map searches).
- Initial SEO content pieces: "Day trips from The Albani," "What to pack for a Maine woodland stay," etc. Each ranks for long-tail queries and reinforces direct booking.
- Optional: Google Analytics 4 + a simple conversion event on booking-widget interactions.

### Phase 4 — Optional, later

- Migrate hosting to Cloudflare Pages **only if** we want server-side form handling, A/B testing, or a custom booking flow.
- Add additional properties or seasons.
- Add a "Returning guests" page with a 10% rebook code.

---

## 5. Estimates

| Phase | Owner time | Dev time | Recurring $/mo |
|---|---|---|---|
| 0  Decisions | ~30 min | — | — |
| 1  Marketing site quick wins | Send photos/video/screenshot | ~2–3 hrs | $0 |
| 2  Reservation system | ~2 hrs PMS wizard | ~3–4 hrs | $20–$50 |
| 3  Marketing lift | Approve copy | ~1–2 hrs | $0 |

Phase 4 is only undertaken if there's a concrete reason.

---

## 6. Information needed from the owner

| # | Item | Status |
|---|---|---|
| 1 | PMS choice: Hospitable / OwnerRez / "compare in detail first" | **needed** |
| 2 | Green-light to start Phase 1 | **needed** |
| 3 | Google Maps screenshot (PNG/JPG) + desired caption | needed for the new section |
| 4 | New photos — drop into `media-incoming/` (or list filenames). Indicate hero vs. gallery, plus captions/alt text. | needed |
| 5 | Videos — host on YouTube Unlisted and send URLs, or send files and I'll recommend a host. | needed |
| 6 | Real contact email (to replace `stay@thealbani.com` placeholder) — or keep it as-is | needed |
| 7 | "Tips for your stay" extras beyond bugs + cooling: Wi-Fi handling, trash day, nearest grocery/hardware/pharmacy/hospital, on-site amenities, quiet hours, on-call number | needed |
| 8 | Marketing positioning — lean into family reunions / work retreats / hunters / peak-fall foliage / ski-adjacent winter / etc. | helpful, not blocking |

---

## 7. Out of scope (intentionally)

- Multi-property management.
- Mobile app.
- Custom-built booking engine.
- Real-time chat / on-site live agent.
- Pricing optimization tools (PriceLabs, Wheelhouse) — defer until there's enough booking history to tune against.

---

## 8. Risks & mitigations

| Risk | Mitigation |
|---|---|
| Double-booking from manual Stripe Payment Link era | Remove the link from `/book` the moment Phase 2 ships. |
| PMS lock-in | Hospitable + OwnerRez both export iCal and guest data on demand; tax/booking history is exportable. |
| GitHub Pages CSP blocks the booking widget | Update `script-src` / `frame-src` / `connect-src` to the PMS host(s) in `BaseLayout.astro` and re-validate. |
| Photos committed at full DSLR resolution bloating the repo | Resize/optimize in Phase 1 build step; commit only the optimized variants. |
| Videos committed as raw files exceeding GitHub's 100 MB file cap | Host on YouTube (Unlisted) or Cloudflare Stream; embed only. |
| "Tips for your stay" leaked URL prior to PMS portal cutover | Use `noindex, nofollow`, no nav link, and rotate the slug if it ever leaks. After Phase 2, content lives only inside the authenticated portal. |
| `stay@thealbani.com` not yet receiving mail | Set up the mailbox before Phase 1 ships so contact CTAs aren't a dead end. |

---

## 9. Decision log

| Date | Decision | Notes |
|---|---|---|
| 2026-06-03 | Draft plan authored | — |
| 2026-06-03 | Phase 1 quick wins built | See section 11. |
| 2026-06-03 | Videos → unlisted YouTube | Owner uploads; URLs go in `src/pages/videos.astro`. |
| 2026-06-03 | Photo curation → owner-delegated; agent picked 13 from 28 supplied | See section 11. |
| 2026-06-03 | Map → custom SVG diagram + PDF download fallback | Original PDF preserved at `/getting-here/final-approach.pdf`. |
|  | PMS choice (Hospitable vs OwnerRez) | _pending_ |
|  | Tips page \u2192 PMS guest portal migration | _pending Phase 2_ |

---

## 11. What shipped in Phase 1 (2026-06-03)

All changes are on the `source` branch worktree at `C:\Users\petew\Source\MTN_House_source`. The build (`npm run build`) succeeds and produces `dist/`. Nothing has been committed or deployed yet — that's the next step the owner approves.

### Content & marketing changes

- **Homepage rewritten** (`src/pages/index.astro`):
  - New hero image: `IMG_20260528_123611_1.jpg` (golden-hour drone shot of the home on the ridge with sunset over the western mountains).
  - New hero copy that leads with the view: *"A modern home on a Maine ridge, with sunsets that go for miles."* Replaced the prior "tucked into the woods" framing, which was burying the property's main selling point.
  - Curated 9-photo gallery (drone, deck-with-view in spring + fall, fire pit, screened porch at dusk, interior great room, wood stove).
  - Email-capture CTA at the bottom (mailto: with prefilled subject — no third-party form service required).
  - JSON-LD `LodgingBusiness` structured data (location, geo, amenities, image set) so Google can show the property in maps/knowledge panels.
- **Getting Here page rewritten** (`src/pages/getting-here.astro`):
  - New "Final approach \u2014 please read" section featuring a custom SVG map.
  - The SVG shows Saint Albans, Rte. 152, the Bigelow Rd. branch (red \u2717, "do not take"), the 4.1-mile continuation, and the left onto Bryant Rd. (green arrow, "left after 4.1 mi") to the property. Matches site typography and colors; scales fluidly on mobile.
  - Original `Map.pdf` preserved at `/getting-here/final-approach.pdf` with a "Download printable map" button.
- **Stay Tips page created** (`src/pages/stay-tips.astro`, slug `/stay-tips`):
  - Published with `<meta name="robots" content="noindex,nofollow,noarchive">` and not linked from the nav or any public page.
  - `robots.txt` also disallows the path.
  - Content includes the two specifically requested sections (bug season prep — DEET, picaridin, Thermacell, permethrin clothing, tick-check protocol; and summer cooling protocol \u2014 open windows at night, draw rear blinds in the morning) plus stubs for Wi-Fi, trash, quiet hours, fire pit, wood stove, on-site amenities, emergency & medical contacts, departure checklist.
  - This content will move into the PMS guest portal in Phase 2; in the meantime the URL is share-able with confirmed guests (the unguessable-URL model from option B1).

### SEO & infrastructure

- **`src/layouts/BaseLayout.astro`** updated:
  - Open Graph (`og:title`, `og:description`, `og:url`, `og:image`, `og:site_name`, `og:type`, `og:locale`) and Twitter card meta on every page.
  - `<link rel="canonical">` per page.
  - `theme-color` and `noindex` prop (used by `/stay-tips`).
  - CSP `frame-src` extended to `https://www.youtube-nocookie.com` and `https://www.youtube.com` for the videos page.
- **`public/robots.txt`** added (allows crawl, disallows `/stay-tips`, points to sitemap).
- **`public/sitemap.xml`** added (8 public URLs with `changefreq` + `priority` hints).
- **Header navigation**: added a "Videos" entry.

### Videos

- **`src/pages/videos.astro`** scaffold added.
  - Accepts either 11-char YouTube IDs or full URLs (parser handles `youtu.be`, `youtube.com/watch?v=`, `youtube.com/embed/`, `youtube.com/shorts/`).
  - Embeds via `youtube-nocookie.com` (privacy-preserving; matches CSP allow-list).
  - Currently empty (`videos = []`), so the page shows a "Video tour coming soon" placeholder.
  - **TODO (owner):** upload the ~15 MP4s currently in `MTN_House_Public/videos/` to an Unlisted YouTube channel. Pick 4\u20136 of the best for the public videos page. Paste their IDs/URLs into the `videos` array in `src/pages/videos.astro`. Keep the rest unlisted for share-by-link or move them to the PMS guest portal in Phase 2.

### Photo curation

- **Curated set (13 photos, all in `public/images/`):**
  | File | Used as |
  |---|---|
  | `IMG_20260528_123611_1.jpg` | Hero (homepage) |
  | `IMG_20260528_123610.jpg` | Gallery |
  | `IMG_20260528_123611.jpg` | Gallery |
  | `IMG_20260528_123611_3.jpg` | Gallery |
  | `PXL_20210513_142141643.jpg` | Gallery |
  | `PXL_20211017_212802601.jpg` | Gallery |
  | `IMG_20200704_200855614_HDR.jpg` | Gallery |
  | `PXL_20230730_235231078.MP.jpg` | Gallery |
  | `PXL_20230604_213210719.jpg` | Gallery |
  | `PXL_20260406_164106703.MP.jpg` | Gallery |
  | `PXL_20260408_224509006.PANO.jpg` | Reserved (former hero, available) |
  | `PXL_20230514_234259659.PORTRAIT.ORIGINAL.jpg` | Reserved (available) |
  | `PXL_20250914_210622621.ACTION_PAN-01.COVER.jpg` | Reserved (available) |
- **Skipped from the gallery on purpose:**
  - `IMG_20260528_123610 (1)/(2)/(3).jpg` \u2014 show what appears to be a **second, smaller building** on the ridge with different siding/roof. Pending owner confirmation: is this also on the property and rentable? If yes, it's a marketing opportunity (a second structure). If no, including it would confuse guests.
  - `PXL_20211011_215351759.jpg`, `PXL_20211018_174038014.jpg` \u2014 clawfoot tub + toilet sitting on an outdoor slab. Unclear marketing framing (intentional outdoor bath? construction staging?). Skipped pending owner direction.
  - `IMG_20190803_143330634.jpg` \u2014 kitchen during construction (raw materials, exposed studs). Not a finished look.
  - `PXL_20211120_210351309.jpg`, `PXL_20220405_204151053.jpg`, `PXL_20220424_231121910.jpg`, `PXL_20220424_231142889.jpg`, `PXL_20220501_173508740.jpg`, `PXL_20220525_222829266.MP.jpg`, `PXL_20220828_224726881.MP.jpg`, `PXL_20210507_234342189.jpg` \u2014 fine photos but redundant with stronger picks. Held in `MTN_House_Public/images/` as the owner's local library.
- **Image performance heads-up:** photos are committed at original resolution (3\u20137 MB each). The hero alone is 4.2 MB. This is acceptable for launch but is a performance/SEO opportunity for Phase 1.5: pre-compress to web-sized variants (`.webp` ~1024 px wide, ~150\u2013250 KB each), or move imports into `src/assets/` and use Astro's `<Image>` component for auto-optimization. Not blocking.

### Copy / positioning

The site's hero and homepage copy now matches the photos: a ridge-top home with western mountain and lake views, between Bangor and Augusta, an hour from the coast. The previous "tucked into the woods" framing has been removed from the homepage. Other pages (book, faq, house-rules, explore) are unchanged and still consistent.

---

## 12. Outstanding items the owner needs to act on

These all block further forward progress. None are urgent today, but Phase 2 can't start until #1.

1. **Pick a PMS** \u2014 Hospitable (recommended) or OwnerRez. Open the trial; verify the operations company bank account.
2. **Confirm or correct: is there a second building on the property?** The May 2026 drone shots show what looks like a smaller, separately-sided structure on the ridge. If it's part of the rental, send a couple of stills and we'll add it to the gallery and copy.
3. **YouTube setup:** create an unlisted channel, upload the videos in `MTN_House_Public/videos/`, send back the URLs (or IDs) you want featured. The page is wired up to accept either format.
4. **Real contact email.** The site uses `stay@thealbani.com`. If that mailbox doesn't yet exist, either set it up (Google Workspace, Fastmail, etc.) or tell us what to swap it for.
5. **Stay-tips content fill-ins:** Wi-Fi network details (or "given on arrival"), trash/recycling specifics, quiet hours confirmation, fire-pit / wood-stove instructions, on-site amenity list (kayaks, grills, etc.), nearest hospital/urgent-care/pharmacy/grocery/hardware with rough drive times, on-call number.
6. **Gate code and parking instructions** for the existing placeholder in `getting-here.astro`.
7. **Pre-launch review:** read the new homepage hero copy and tell us if the "modern home on a Maine ridge" positioning is the angle you want. We can dial it more "rustic Maine retreat" or more "design-forward escape" depending on the guests you most want to attract.

---

## 13. How to deploy what was just built

The build output is at `C:\Users\petew\Source\MTN_House_source\dist\`. The site uses the two-branch pattern: source on `source`, deployed output on `main`.

**Recommended steps (owner runs, or asks the agent to):**

```bash
# In the source worktree: commit the source changes.
cd C:\Users\petew\Source\MTN_House_source
git add -A
git commit -m "Phase 1: new hero + gallery, final-approach SVG, stay-tips, SEO"
git push origin source

# In the main worktree: replace the deployed output with the new build.
cd C:\Users\petew\Source\MTN_House_Public
# Remove old generated content, keeping CNAME, .nojekyll, logo.png, favicon.*
# (Or: nuke everything and re-copy from dist; the dist already contains CNAME, .nojekyll, etc.)
git rm -rqf .                                # caution: removes everything tracked
Copy-Item -Recurse -Force C:\Users\petew\Source\MTN_House_source\dist\* .
git add -A
git commit -m "Deploy: Phase 1 site update"
git push origin main
```

The "what is on disk in `MTN_House_Public` and not tracked" \u2014 the user-added photos, videos, `Map.pdf`, `Map.pptx` \u2014 stay on local disk as a working library. They are not, and should not be, on the deployed `main` branch (which is regenerated from `dist/` on every deploy).

If the owner prefers, the agent can run the deploy steps above on request. We won't auto-commit anything without explicit approval.


---

## 10. Glossary

- **PMS (Property Management System):** A hosted service (e.g., Hospitable, OwnerRez, Lodgify) that handles calendar, payments, messaging, and guest experience for short-term rentals.
- **OTA (Online Travel Agency):** Airbnb, VRBO, Booking.com. They take a per-booking fee. Direct booking via the site avoids that fee.
- **iCal sync:** Standard calendar feed format used to keep availability synced across PMS, Airbnb, VRBO, Google Calendar, etc.
- **CSP (Content Security Policy):** Browser-enforced allowlist for which origins the site may load scripts, styles, frames, and connections from. Currently strict; will need narrow additions to permit the PMS booking widget.
- **JSON-LD:** Structured data format Google reads to populate map and knowledge-panel results for businesses.
