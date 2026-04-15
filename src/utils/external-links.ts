/**
 * Build-time validation for env-driven external URLs (defense in depth:
 * malicious or mistaken .env values must not become javascript: or unexpected origins).
 */

const STRIPE_PAYMENT_HOSTS = new Set([
	"buy.stripe.com",
	"checkout.stripe.com",
	"pay.stripe.com",
	"payments.stripe.com",
	"billing.stripe.com",
	"invoice.stripe.com",
	"donate.stripe.com",
	"stripe.com",
]);

/** Venmo public usernames: conservative ASCII subset. */
const VENMO_USER_RE = /^[a-zA-Z0-9_-]{2,50}$/;

export function getSafeStripePaymentLink(raw: string | undefined): string {
	const s = raw?.trim() ?? "";
	if (!s) return "";
	let url: URL;
	try {
		url = new URL(s);
	} catch {
		return "";
	}
	if (url.protocol !== "https:") return "";
	if (!STRIPE_PAYMENT_HOSTS.has(url.hostname)) return "";
	if (url.username || url.password) return "";
	return url.href;
}

export function getSafeVenmoProfileUrl(raw: string | undefined): string {
	const user = raw?.trim().replace(/^@/, "") ?? "";
	if (!user || !VENMO_USER_RE.test(user)) return "";
	return `https://account.venmo.com/u/${encodeURIComponent(user)}`;
}
