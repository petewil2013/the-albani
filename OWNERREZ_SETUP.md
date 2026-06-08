# OwnerRez setup for thealbani.com

This site embeds OwnerRez widgets on `/book`. Payments and confirmations run in OwnerRez (connected to your bank account).

## Part 1 — OwnerRez account (you do this in the dashboard)

Work through these in order. OwnerRez’s widget guide: [Setting up widgets](https://www.ownerrez.com/support/articles/widgets).

### 1. Property basics

In **Settings → Properties → [Villa Sancti Albani]**:

| Field | Suggested value |
|---|---|
| **Name** | Villa Sancti Albani (or The Albani) |
| **Website URL** | `https://thealbani.com/book` |
| **Address** | 160 Gerald's Way, St. Albans, ME (your exact address) |
| **Bedrooms** | 3 |
| **Sleeps max** | 6 (comfortably 4 on fixed beds) |
| **Beds** | 1 king, 2 twins |
| **Description** | Ridge-top home, western mountain views, minutes from Great Moose Lake |

Upload your best photos (hero drone shots, deck views, interior, fire pit).

### 2. Rates & seasons

In **Settings → Rates** (or property Pricing):

Create seasons aligned with our pricing research:

| Season | Dates (example) | Nightly | Notes |
|---|---|---|---|
| **Peak** | Jul 1 – Aug 15 + holiday weekends | $265–$285 | Fri/Sat can be +10–15% |
| **Shoulder** | Jun, late Aug, Sep, Oct | $235–$255 | |
| **Off-season** | Nov–Apr | $150–$175 or closed | Optional |

Also set:

- **Cleaning fee:** $125–$150  
- **Minimum stay:** 3 nights (4 on July 4 / Labor Day weeks)  
- **Weekly discount:** 10% for 7+ nights  
- **Security deposit:** $500–$750  

### 3. Rules & guest screening

In property **Rules** and **Booking** settings:

- Max guests: **6** (describe as “comfortably sleeps 4” in marketing copy)  
- No parties / no events  
- Quiet hours: 9 PM – 8 AM  
- **Request to Book** or **Inquiry first** if you want to vet guests before confirming (recommended for launch)  
- Turn off **Instant Book** until you have review history  

### 4. Payments (you said this is done)

Confirm under **Settings → Payments**:

- Bank account connected and verified  
- Credit card processing enabled  
- Payout schedule understood  

### 5. Google Calendar (you can keep using it)

**You do not have to stop using Google Calendar.** OwnerRez does not plug in via a Google API button — it uses **iCal feeds**, which is the standard way every PMS syncs calendars. Google Calendar speaks iCal natively.

**Recommended setup: OwnerRez is the master calendar** (bookings live there first). Google Calendar subscribes to OwnerRez so you see everything in the app you already use.

#### Show OwnerRez bookings in Google Calendar

1. In OwnerRez: **Properties → Villa Sancti Albani → Calendars → Calendar Export**  
2. Click **+ Export Calendar**, save, copy the **iCal URL**  
3. In Google Calendar: **Other calendars → + → From URL**  
4. Paste the OwnerRez export URL  

OwnerRez bookings and blocks will appear in Google. Updates can take a few hours on Google's side ([OwnerRez calendar export docs](https://www.ownerrez.com/support/articles/channel-management-calendar-import-export-common-issues-questions)).

#### Block personal dates from Google Calendar in OwnerRez

If you block time on a **personal** Google Calendar (family visits, maintenance), OwnerRez needs to **import** those blocks:

1. In Google Calendar: open the calendar → **Settings → Integrate calendar**  
2. Copy the **Secret address in iCal format** (ends in `.ics`)  
3. In OwnerRez: **Settings → Channels → Calendar Import/Export → Import**  
4. Paste the Google iCal URL, name it "Personal Google Calendar", enable for Villa Sancti Albani  
5. Click **Sync Now** after adding  

OwnerRez will pull blocked dates from Google and close those nights to guests.

**Do not** try to run bookings only in Google Calendar — OwnerRez won't see them and you risk double-booking. All guest reservations should flow through OwnerRez (or import from Airbnb/VRBO into OwnerRez).

### 6. Channel calendar (when you list on Airbnb/VRBO)

**Settings → Channels → Calendar Import/Export:**

- Import Airbnb/VRBO iCal URLs **into** OwnerRez  
- Export OwnerRez iCal **out** to those platforms  

### 7. Guest portal & emails

- **Guest portal:** enable; add check-in instructions, gate code (when ready), Wi-Fi, link to stay tips  
- **Email templates:** customize booking confirmation, pre-arrival (7 days), day-of with portal link  
- **Redirect after booking:** set to `https://thealbani.com/book` or a thank-you note (see [Redirect after booking](https://www.ownerrez.com/support/articles/redirect-back-to-your-website-after-booking))  

### 8. Create widgets

Go to **Settings → Widgets → + Create Widget**.

#### A. Book Now widget (required for `/book`)

1. Type: **Booking / Inquiry** (Book Now)  
2. Property: **Villa Sancti Albani** (this property only)  
3. Mode: start with **Inquiry Only** if you want to approve every guest; switch to **Book Now** when ready  
4. Quoting: **Allow Quote and Show Errors** (guests see price + availability feedback)  
5. Fields: show Adults; hide Children/Pets if not allowed  
6. Copy the **Embed Code** — you need `data-widget-id`, `data-property-id`, and `data-widget-type`  

#### B. Multiple Month Calendar (homepage — create this next)

1. **Settings → Widgets → + Create Widget**  
2. Type: **Multiple Month Calendar**  
3. Property: Villa Sancti Albani  
4. Months to show: **3** (good for mobile)  
5. Copy embed code — paste into `.env`:

```env
PUBLIC_OWNERREZ_CALENDAR_WIDGET_ID=your_calendar_data_widget_id
PUBLIC_OWNERREZ_CALENDAR_PROPERTY_ID=51806aec9a3f485ea644a98e05f3c349
PUBLIC_OWNERREZ_CALENDAR_WIDGET_TYPE=Multiple Month Calendar
```

`WIDGET_TYPE` must match OwnerRez exactly (copy from embed code).  

---

## Part 2 — Connect to this website

### 1. Copy widget IDs from embed code

Your embed code looks roughly like:

```html
<div class="ownerrez-widget"
  data-property-id="abc123..."
  data-widget-type="Booking/Inquiry"
  data-widget-id="def456..."></div>
<script src="https://app.ownerrez.com/widget.js"></script>
```

Copy the three `data-*` values into `.env`:

```env
PUBLIC_OWNERREZ_WIDGET_ID=your_data_widget_id_here
PUBLIC_OWNERREZ_PROPERTY_ID=your_data_property_id_here
PUBLIC_OWNERREZ_WIDGET_TYPE=Booking/Inquiry
```

`PUBLIC_OWNERREZ_WIDGET_TYPE` must match OwnerRez **exactly** (including spaces and slashes).

### 2. Build and deploy

```bash
cd C:\Users\petew\Source\MTN_House_source
npm run build
# then deploy dist/ to main branch (see PLANNING.md §13)
```

### 3. Verify

1. Open `https://thealbani.com/book`  
2. Widget loads (date picker + guest fields)  
3. Test inquiry with fake dates — quote appears  
4. Complete a test booking with a real card, then refund in OwnerRez  

If the widget is blank, check the browser console for CSP errors — the site allows `app.ownerrez.com` in CSP.

---

## Part 3 — What changed on the site

- `/book` — OwnerRez booking widget replaces Stripe/Venmo deposit flow  
- CSP updated for `app.ownerrez.com`  
- Stripe/Venmo env vars are no longer used on the book page (can remove from `.env`)  

## Stessa

Keep Stessa for accounting. OwnerRez does not replace it — export payouts or connect bank feeds in Stessa for tax tracking.
