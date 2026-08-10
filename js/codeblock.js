(() => {
  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch {
      /* fall through */
    }

    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    ta.remove();
  }

  function wireCopy(block, valueSelector, buttonSelector) {
    const valueEl = block.querySelector(valueSelector);
    const button = block.querySelector(buttonSelector);
    if (!valueEl || !button) return;

    button.addEventListener("click", async () => {
      const text = valueEl.textContent?.trim() ?? "";
      if (!text) return;

      await copyText(text);
      const previous = button.getAttribute("aria-label") || "Copy";
      button.dataset.copied = "true";
      button.textContent = "Copied";
      button.setAttribute("aria-label", "Copied to clipboard");
      window.setTimeout(() => {
        button.dataset.copied = "false";
        button.textContent = "Copy";
        button.setAttribute("aria-label", previous);
      }, 1600);
    });
  }

  document.querySelectorAll(".codeblock").forEach((block) => {
    wireCopy(block, "code", ".codeblock__copy");
  });

  document.querySelectorAll(".redirect").forEach((block) => {
    wireCopy(block, ".redirect__value", ".redirect__copy");
  });
})();
