(() => {
  const RELEASES_FALLBACK = "https://github.com/stuartromanek/louis/releases/latest";
  const RELEASE_API = "https://api.github.com/repos/stuartromanek/louis/releases/latest";

  const LABELS = {
    "mac-arm64": "Download for Mac (Apple Silicon)",
    "mac-x64": "Download for Mac (Intel)",
    windows: "Download for Windows",
  };

  const MATCHERS = {
    "mac-arm64": (name) => /arm64\.dmg$/i.test(name),
    "mac-x64": (name) => /x64\.dmg$/i.test(name) && !/arm64/i.test(name),
    windows: (name) => /Setup-.*\.exe$/i.test(name) || /\.exe$/i.test(name),
  };

  function isMac(ua, platform) {
    return /Mac|iPhone|iPad|iPod/.test(ua) || /mac/i.test(platform);
  }

  function isWindows(ua, platform) {
    return /Win/.test(ua) || /win/i.test(platform);
  }

  function gpuLooksAppleSilicon() {
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl");
      if (!gl) return false;
      const ext = gl.getExtension("WEBGL_debug_renderer_info");
      if (!ext) return false;
      const renderer = gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) || "";
      return /Apple/i.test(renderer) && !/Intel/i.test(renderer);
    } catch {
      return false;
    }
  }

  async function detectPlatform() {
    const ua = navigator.userAgent || "";
    const platform = navigator.platform || "";

    if (isWindows(ua, platform)) return "windows";
    if (!isMac(ua, platform)) return null;

    // iOS / iPadOS — no desktop installer
    if (/iPhone|iPad|iPod/.test(ua) || (platform === "MacIntel" && navigator.maxTouchPoints > 1)) {
      return null;
    }

    if (navigator.userAgentData?.getHighEntropyValues) {
      try {
        const { architecture } = await navigator.userAgentData.getHighEntropyValues([
          "architecture",
        ]);
        if (architecture === "arm") return "mac-arm64";
        if (architecture === "x86") return "mac-x64";
      } catch {
        /* fall through */
      }
    }

    if (/Intel/.test(ua)) return "mac-x64";
    if (gpuLooksAppleSilicon()) return "mac-arm64";

    // Default modern Macs to Apple Silicon
    return "mac-arm64";
  }

  async function fetchAssets() {
    const res = await fetch(RELEASE_API, {
      headers: { Accept: "application/vnd.github+json" },
    });
    if (!res.ok) throw new Error(`release api ${res.status}`);
    const data = await res.json();
    return {
      tag: data.tag_name || "",
      assets: Array.isArray(data.assets) ? data.assets : [],
    };
  }

  function pickAsset(assets, platform) {
    const match = MATCHERS[platform];
    if (!match) return null;
    return assets.find((a) => match(a.name)) || null;
  }

  function applyPlatformLinks(assets) {
    document.querySelectorAll("[data-platform]").forEach((el) => {
      const key = el.getAttribute("data-platform");
      const asset = pickAsset(assets, key);
      if (!asset) return;

      const fileEl = el.querySelector("[data-platform-file]");
      if (fileEl) fileEl.textContent = asset.name;

      if (el.tagName === "A") {
        el.href = asset.browser_download_url;
      } else {
        const link = el.querySelector("a[data-platform-link]");
        if (link) link.href = asset.browser_download_url;
      }
    });
  }

  function highlightRecommended(platform) {
    if (!platform) return;
    document.querySelectorAll("[data-platform]").forEach((el) => {
      const isMatch = el.getAttribute("data-platform") === platform;
      el.classList.toggle("platform--recommended", isMatch);
      if (isMatch) {
        let badge = el.querySelector(".platform__badge");
        if (!badge) {
          badge = document.createElement("span");
          badge.className = "platform__badge";
          badge.textContent = "For you";
          const meta = el.querySelector(".platform__meta");
          if (meta) meta.append(badge);
          else el.prepend(badge);
        }
      }
    });
  }

  function updateHeroCta(platform, asset) {
    const cta = document.querySelector("[data-download-cta]");
    if (!cta) return;

    const label = cta.querySelector(".maru-button__label");
    if (platform && LABELS[platform]) {
      if (label) label.textContent = LABELS[platform];
      cta.setAttribute("aria-label", LABELS[platform]);
    }

    if (asset?.browser_download_url) {
      cta.href = asset.browser_download_url;
    } else {
      cta.href = RELEASES_FALLBACK;
    }

    if (platform) cta.setAttribute("data-platform", platform);
  }

  const GUIDE = {
    "mac-arm64": {
      href: "#install-mac",
      title: "Installing on macOS",
      blurb: "Download started. Gatekeeper will try to stop you — follow the macOS guide next.",
    },
    "mac-x64": {
      href: "#install-mac",
      title: "Installing on macOS",
      blurb: "Download started. Gatekeeper will try to stop you — follow the macOS guide next.",
    },
    windows: {
      href: "#install-windows",
      title: "Installing on Windows",
      blurb: "Download started. SmartScreen will try to stop you — follow the Windows guide next.",
    },
  };

  function showInstallToast(platform) {
    const guide = GUIDE[platform];
    const host = document.getElementById("toast-host");
    if (!guide || !host) return;

    host.replaceChildren();

    const toast = document.createElement("div");
    toast.className = "toast";
    toast.setAttribute("role", "region");
    toast.setAttribute("aria-label", "Download next steps");
    toast.setAttribute("tabindex", "-1");

    const title = document.createElement("p");
    title.className = "toast__title";
    title.id = "toast-title";
    title.textContent = "Thanks for downloading Louis!";

    const text = document.createElement("p");
    text.className = "toast__text";
    text.textContent = guide.blurb;

    const link = document.createElement("a");
    link.className = "toast__link";
    link.href = guide.href;
    link.textContent = `Open ${guide.title}`;

    const close = document.createElement("button");
    close.type = "button";
    close.className = "toast__close";
    close.setAttribute("aria-label", "Dismiss download message");
    close.innerHTML = '<span aria-hidden="true">×</span>';

    close.addEventListener("click", () => {
      toast.classList.remove("toast--in");
      window.setTimeout(() => toast.remove(), 220);
    });

    toast.append(title, text, link, close);
    host.append(toast);
    requestAnimationFrame(() => {
      toast.classList.add("toast--in");
      toast.focus({ preventScroll: true });
    });
  }

  function wireDownloadToasts() {
    document.querySelectorAll("a[data-platform]").forEach((el) => {
      el.addEventListener("click", () => {
        const platform = el.getAttribute("data-platform");
        if (platform) showInstallToast(platform);
      });
    });
  }

  async function init() {
    const platform = await detectPlatform();
    highlightRecommended(platform);

    let assets = [];
    try {
      const release = await fetchAssets();
      assets = release.assets;
      applyPlatformLinks(assets);
    } catch {
      /* keep release-page fallbacks */
    }

    const asset = platform ? pickAsset(assets, platform) : null;
    updateHeroCta(platform, asset);
    wireDownloadToasts();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
