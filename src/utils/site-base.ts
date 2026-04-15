/** Trailing-slash base for joining paths (GitHub Pages project URLs). */
export function siteBase(): string {
	const b = import.meta.env.BASE_URL;
	return b.endsWith("/") ? b : `${b}/`;
}
