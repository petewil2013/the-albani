/**
 * Build-time validation for OwnerRez widget embed IDs (defense in depth).
 * Widget IDs and property keys are opaque hex strings from the OwnerRez dashboard.
 */

const OR_ID_RE = /^[a-f0-9]{32}$/i;

/** Widget type labels are copied verbatim from Settings > Widgets in OwnerRez. */
const OR_WIDGET_TYPE_RE = /^[a-zA-Z0-9 /_-]{3,80}$/;

export interface OwnerRezWidgetConfig {
	widgetId: string;
	propertyId: string;
	widgetType: string;
}

export function getSafeOwnerRezWidgetId(raw: string | undefined): string {
	const s = raw?.trim() ?? "";
	return OR_ID_RE.test(s) ? s : "";
}

export function getSafeOwnerRezPropertyId(raw: string | undefined): string {
	const s = raw?.trim() ?? "";
	return OR_ID_RE.test(s) ? s : "";
}

export function getSafeOwnerRezWidgetType(raw: string | undefined): string {
	const s = raw?.trim() ?? "";
	return OR_WIDGET_TYPE_RE.test(s) ? s : "";
}

/** Returns a config only when widget id + type are valid. Property id is optional. */
export function getOwnerRezWidgetConfig(
	widgetIdRaw: string | undefined,
	propertyIdRaw: string | undefined,
	widgetTypeRaw: string | undefined,
): OwnerRezWidgetConfig | null {
	const widgetId = getSafeOwnerRezWidgetId(widgetIdRaw);
	const widgetType = getSafeOwnerRezWidgetType(widgetTypeRaw);
	if (!widgetId || !widgetType) return null;

	const propertyId = getSafeOwnerRezPropertyId(propertyIdRaw);
	return { widgetId, propertyId, widgetType };
}
