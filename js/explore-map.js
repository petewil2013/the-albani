(() => {
	const COLORS = {
		home: "#2a3d34",
		region: "#6b5340",
		air: "#9a7b4f",
		brew: "#4a5d4f",
	};

	document.addEventListener("DOMContentLoaded", () => {
		const el = document.getElementById("explore-map");
		const dataEl = document.getElementById("explore-map-data");
		if (!el || !dataEl || typeof L === "undefined") return;

		let markers;
		try {
			markers = JSON.parse((dataEl.textContent || "").trim() || "[]");
		} catch {
			return;
		}
		if (!Array.isArray(markers)) return;

		const map = L.map(el).setView([44.95, -69.25], 9);

		L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
			maxZoom: 19,
			attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
		}).addTo(map);

		const layers = [];
		for (const m of markers) {
			if (
				typeof m !== "object" ||
				m === null ||
				typeof m.name !== "string" ||
				typeof m.lat !== "number" ||
				typeof m.lng !== "number" ||
				typeof m.kind !== "string"
			) {
				continue;
			}
			const color = COLORS[m.kind];
			if (!color) continue;

			const icon = L.divIcon({
				className: "albani-marker",
				html: `<span style="display:block;width:12px;height:12px;border-radius:50%;background:${color};border:2px solid #f3f0e8;box-shadow:0 1px 3px rgba(0,0,0,.35);"></span>`,
				iconSize: [12, 12],
				iconAnchor: [6, 6],
			});

			const popupEl = document.createElement("div");
			const strong = document.createElement("strong");
			strong.textContent = m.name;
			popupEl.appendChild(strong);

			const marker = L.marker([m.lat, m.lng], { icon }).addTo(map).bindPopup(popupEl);
			layers.push(marker);
		}

		if (layers.length) {
			const group = L.featureGroup(layers);
			map.fitBounds(group.getBounds().pad(0.12));
		}
	});
})();
