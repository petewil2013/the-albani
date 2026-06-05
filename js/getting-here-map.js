// Interactive Leaflet map for /getting-here. Companion to the stylized
// SVG hero above it. Uses OpenStreetMap tiles (whitelisted in the CSP)
// and the brand palette so it feels native to the rest of the site.
(() => {
	const C = {
		forestDeep: "#1e2b25",
		forest: "#2a3d34",
		routeAmber: "#e7b765",
		routeAmberDeep: "#a87a36",
		routeCream: "#d8c6a3",
		routeCreamDeep: "#9c8c6e",
		gold: "#c89b5a",
		goldDeep: "#9a7b4f",
		wrongRed: "#c34230",
		wrongRedDeep: "#7e2a1d",
		bone: "#f3eedd",
	};

	document.addEventListener("DOMContentLoaded", () => {
		const el = document.getElementById("approach-map");
		const dataEl = document.getElementById("approach-map-data");
		if (!el || !dataEl || typeof L === "undefined") return;

		let data;
		try {
			data = JSON.parse((dataEl.textContent || "").trim() || "{}");
		} catch {
			return;
		}
		if (!data || !data.routes || !data.markers) return;

		const map = L.map(el, { scrollWheelZoom: false }).setView(
			[44.94, -69.43],
			12,
		);

		L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
			maxZoom: 18,
			attribution:
				'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
		}).addTo(map);

		function casedRoute(latLngs, color, weight = 6) {
			L.polyline(latLngs, {
				color: C.forestDeep,
				weight: weight + 3,
				opacity: 0.9,
				lineCap: "round",
				lineJoin: "round",
			}).addTo(map);
			return L.polyline(latLngs, {
				color,
				weight,
				opacity: 1,
				lineCap: "round",
				lineJoin: "round",
			}).addTo(map);
		}

		casedRoute(data.routes.rte152, C.routeAmber, 6);
		casedRoute(data.routes.bryant, C.routeCream, 5);
		casedRoute(data.routes.devils, C.routeCream, 5);
		L.polyline(data.routes.geralds, {
			color: C.routeAmber,
			weight: 4,
			dashArray: "6 4",
			lineCap: "round",
		}).addTo(map);

		L.polyline(data.routes.bigelow, {
			color: C.wrongRedDeep,
			weight: 9,
			opacity: 0.95,
			lineCap: "round",
		}).addTo(map);
		L.polyline(data.routes.bigelow, {
			color: C.wrongRed,
			weight: 6,
			opacity: 1,
			lineCap: "round",
		}).addTo(map);
		L.polyline(data.routes.bigelow, {
			color: "white",
			weight: 3,
			dashArray: "8 6",
			opacity: 0.9,
			lineCap: "round",
		}).addTo(map);

		function numberedIcon(n, fill) {
			return L.divIcon({
				className: "albani-marker",
				html: `<div style="display:flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:50%;background:${fill};color:${C.bone};font-family:'Cinzel',serif;font-weight:600;font-size:17px;border:3px solid ${C.bone};box-shadow:0 2px 6px rgba(30,43,37,.35);">${n}</div>`,
				iconSize: [34, 34],
				iconAnchor: [17, 17],
			});
		}
		const xIcon = L.divIcon({
			className: "albani-marker",
			html: `<div style="display:flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:50%;background:${C.wrongRed};color:${C.bone};font-family:'Cinzel',serif;font-weight:700;font-size:22px;border:3px solid ${C.bone};box-shadow:0 2px 6px rgba(125,43,32,.5);">&times;</div>`,
			iconSize: [38, 38],
			iconAnchor: [19, 19],
		});
		const villageIcon = L.divIcon({
			className: "albani-marker",
			html: `<div style="width:14px;height:14px;border-radius:50%;background:${C.forestDeep};border:3px solid ${C.bone};box-shadow:0 1px 3px rgba(30,43,37,.45);"></div>`,
			iconSize: [14, 14],
			iconAnchor: [7, 7],
		});
		const cabinIcon = L.divIcon({
			className: "albani-marker",
			html: `<div style="display:flex;align-items:center;justify-content:center;width:30px;height:30px;background:${C.forestDeep};color:${C.bone};border:3px solid ${C.bone};border-radius:4px;box-shadow:0 2px 6px rgba(30,43,37,.45);font-family:serif;font-size:15px;">&#9968;</div>`,
			iconSize: [30, 30],
			iconAnchor: [15, 15],
		});

		const iconFor = {
			turn: (m) => numberedIcon(m.n, C.gold),
			gate: (m) => numberedIcon(m.n, C.gold),
			warn: () => xIcon,
			village: () => villageIcon,
			cabin: () => cabinIcon,
		};

		for (const m of data.markers) {
			const make = iconFor[m.kind];
			if (!make) continue;
			const marker = L.marker([m.lat, m.lng], { icon: make(m) }).addTo(map);
			const popupEl = document.createElement("div");
			popupEl.style.fontFamily =
				"'Libre Baskerville', Georgia, serif";
			popupEl.style.fontSize = "13px";
			popupEl.style.color = "#1a1918";
			popupEl.textContent = m.name;
			marker.bindPopup(popupEl);
		}

		if (Array.isArray(data.bounds)) {
			map.fitBounds(data.bounds, { padding: [20, 20] });
		}
	});
})();
