(() => {
	const mq = window.matchMedia("(min-width: 56.25rem)");
	document.querySelectorAll("[data-nav-toggle]").forEach((btn) => {
		const nav = document.querySelector("[data-nav]");
		const setOpen = (open) => {
			if (nav) nav.classList.toggle("is-open", open);
			btn.setAttribute("aria-expanded", open ? "true" : "false");
		};
		btn.addEventListener("click", () => {
			const open = !nav?.classList.contains("is-open");
			setOpen(open);
		});
		nav?.querySelectorAll("a").forEach((a) => {
			a.addEventListener("click", () => {
				if (!mq.matches) setOpen(false);
			});
		});
		document.addEventListener("keydown", (e) => {
			if (e.key === "Escape") setOpen(false);
		});
		mq.addEventListener("change", (e) => {
			if (e.matches) setOpen(false);
		});
	});
})();
