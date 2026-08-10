(() => {
  const dialog = document.getElementById("lightbox");
  const img = dialog?.querySelector(".lightbox__img");
  const closeBtn = dialog?.querySelector(".lightbox__close");
  if (!dialog || !img) return;

  function close() {
    dialog.close();
  }

  function openFrom(thumb) {
    const storedAlt = thumb.dataset.fullAlt || thumb.alt || "";
    img.src = thumb.currentSrc || thumb.src;
    img.alt = storedAlt;
    dialog.showModal();
    closeBtn?.focus();
  }

  document.querySelectorAll(".guide__figure").forEach((figure) => {
    const thumb = figure.querySelector("img");
    if (!thumb) return;

    // Keep full alt for the lightbox; hide decorative duplicate from the button name.
    thumb.dataset.fullAlt = thumb.alt || "";
    figure.classList.add("guide__figure--zoomable");
    figure.setAttribute("role", "button");
    figure.setAttribute("tabindex", "0");
    figure.setAttribute(
      "aria-label",
      thumb.dataset.fullAlt
        ? `View larger: ${thumb.dataset.fullAlt}`
        : "View larger screenshot",
    );
    thumb.setAttribute("aria-hidden", "true");
    thumb.alt = "";

    figure.addEventListener("click", () => openFrom(thumb));
    figure.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openFrom(thumb);
      }
    });
  });

  closeBtn?.addEventListener("click", close);

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) close();
  });

  dialog.addEventListener("close", () => {
    img.removeAttribute("src");
    img.alt = "";
  });
})();
