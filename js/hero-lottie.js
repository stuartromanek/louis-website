(() => {
  const LOTTIE_PATH = "/splash/louis.json";
  const stage = document.querySelector("[data-hero-lottie]");
  const slot = document.querySelector(".hero__player-slot");
  const mark = document.querySelector(".hero__player--mark");
  if (!stage || !slot || typeof lottie === "undefined") return;

  if (stage.__louisHeroLottie) {
    stage.__louisHeroLottie.resync();
    return;
  }

  const controller = {
    booted: false,
    loadToken: 0,
    anim: null,
    syncScheduled: false,
    loading: false,
    loadedSize: { w: 0, h: 0 },
    stage,
    slot,
    mark,
    mobileLockup: window.matchMedia("(max-width: 599px)"),
    reduced: window.matchMedia("(prefers-reduced-motion: reduce)"),

    bumpToken() {
      this.loadToken += 1;
      return this.loadToken;
    },

    isCurrent(token) {
      return token === this.loadToken;
    },

    showSlot() {
      this.slot.dataset.heroReady = "true";
    },

    showMark() {
      this.stage.removeAttribute("data-ready");
      this.slot.removeAttribute("data-lottie-ready");
      this.stage.style.removeProperty("width");
      this.stage.style.removeProperty("height");
      if (this.mark) this.mark.hidden = false;
      if (this.mobileLockup.matches) this.showSlot();
    },

    destroyAnim() {
      this.bumpToken();
      this.loading = false;
      if (this.anim) {
        this.anim.destroy();
        this.anim = null;
      }
      this.stage.replaceChildren();
      this.stage.removeAttribute("data-ready");
      this.slot.removeAttribute("data-lottie-ready");
    },

    sizeStage() {
      const { width, height } = this.slot.getBoundingClientRect();
      if (width <= 0 || height <= 0) return false;
      this.stage.style.width = `${width}px`;
      this.stage.style.height = `${height}px`;
      return true;
    },

    primeFrame() {
      if (!this.anim) return;
      if (this.reduced.matches) {
        this.anim.goToAndStop(this.anim.totalFrames - 1, true);
        return;
      }
      this.anim.goToAndStop(0, true);
    },

    revealAndPlay(token) {
      if (!this.isCurrent(token) || !this.anim) return;

      this.loading = false;
      this.loadedSize = {
        w: this.slot.getBoundingClientRect().width,
        h: this.slot.getBoundingClientRect().height,
      };

      const finishReveal = () => {
        if (!this.isCurrent(token)) return;
        this.stage.dataset.ready = "true";
        this.slot.dataset.lottieReady = "true";
        this.showSlot();
      };

      if (this.reduced.matches) {
        finishReveal();
        return;
      }

      this.anim.play();
      requestAnimationFrame(() => {
        if (!this.isCurrent(token)) return;
        this.sizeStage();
        this.anim.resize();
        requestAnimationFrame(() => {
          if (!this.isCurrent(token)) return;
          finishReveal();
        });
      });
    },

    load() {
      if (this.loading) return;
      this.destroyAnim();
      this.loading = true;
      const token = this.loadToken;
      this.showMark();

      const start = () => {
        if (!this.isCurrent(token)) return;
        if (!this.sizeStage()) {
          requestAnimationFrame(start);
          return;
        }

        this.anim = lottie.loadAnimation({
          container: this.stage,
          renderer: "svg",
          loop: false,
          autoplay: false,
          path: LOTTIE_PATH,
          rendererSettings: {
            preserveAspectRatio: "xMidYMid meet",
            progressiveLoad: false,
          },
        });

        this.anim.addEventListener("DOMLoaded", () => {
          if (!this.isCurrent(token)) return;
          this.sizeStage();
          this.anim.resize();
          requestAnimationFrame(() => {
            if (!this.isCurrent(token)) return;
            this.sizeStage();
            this.anim.resize();
            this.primeFrame();
            requestAnimationFrame(() => {
              if (!this.isCurrent(token)) return;
              this.revealAndPlay(token);
            });
          });
        });

        this.anim.addEventListener("complete", () => {
          if (!this.isCurrent(token) || !this.anim) return;
          this.anim.goToAndStop(this.anim.totalFrames - 1, true);
        });

        this.anim.addEventListener("data_failed", () => {
          if (!this.isCurrent(token)) return;
          this.destroyAnim();
          this.showMark();
          this.showSlot();
          this.stage.classList.add("hero__player--failed");
        });
      };

      start();
    },

    syncNow() {
      if (this.mobileLockup.matches) {
        this.destroyAnim();
        this.showMark();
        this.showSlot();
        this.loadedSize = { w: 0, h: 0 };
        return;
      }

      const { width, height } = this.slot.getBoundingClientRect();
      const sizeStable =
        this.anim &&
        !this.loading &&
        Math.abs(width - this.loadedSize.w) < 2 &&
        Math.abs(height - this.loadedSize.h) < 2 &&
        this.stage.hasAttribute("data-ready");

      if (sizeStable || this.loading) return;
      this.load();
    },

    scheduleSync() {
      if (this.syncScheduled) return;
      this.syncScheduled = true;
      requestAnimationFrame(() => {
        this.syncScheduled = false;
        this.syncNow();
      });
    },

    waitForStableSlot(then) {
      let lastKey = "";
      let stableMs = 0;
      let lastTs = 0;
      const needMs = 450;

      const tick = (ts) => {
        const { width, height } = this.slot.getBoundingClientRect();
        const key = `${Math.round(width)}x${Math.round(height)}`;
        if (width > 0 && key === lastKey) {
          stableMs += lastTs ? ts - lastTs : 0;
        } else {
          stableMs = 0;
          lastKey = key;
        }
        lastTs = ts;

        if (stableMs >= needMs) {
          then();
          return;
        }
        requestAnimationFrame(tick);
      };

      const boot = () => requestAnimationFrame(tick);
      if (document.fonts?.ready) document.fonts.ready.then(boot);
      else boot();
    },

    resync() {
      if (this.stage.hasAttribute("data-ready") && this.anim && !this.loading) return;
      this.scheduleSync();
    },

    init() {
      if (this.booted) {
        this.scheduleSync();
        return;
      }
      this.booted = true;
      this.mobileLockup.addEventListener("change", () => this.scheduleSync());
      this.waitForStableSlot(() => this.scheduleSync());
    },
  };

  stage.__louisHeroLottie = controller;
  controller.init();
})();
