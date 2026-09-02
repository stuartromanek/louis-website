(() => {
  const LOTTIE_PATH = "/splash/louis.json";
  const stage = document.querySelector("[data-hero-lottie]");
  const mark = document.querySelector(".hero__player--mark");
  if (!stage || typeof lottie === "undefined") return;

  // Mobile lockup uses the static mark; Lottie only on the two-column desktop hero.
  const mobileLockup = window.matchMedia("(max-width: 599px)");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  let anim = null;

  function showMark() {
    stage.removeAttribute("data-ready");
    if (mark) mark.hidden = false;
  }

  function revealLottie() {
    stage.dataset.ready = "true";
    if (mark) mark.hidden = true;
  }

  function destroy() {
    if (!anim) return;
    anim.destroy();
    anim = null;
    stage.replaceChildren();
    stage.removeAttribute("data-ready");
  }

  function primeFrame() {
    if (!anim) return;
    if (reduced.matches) {
      anim.goToAndStop(anim.totalFrames - 1, true);
      return;
    }
    anim.goToAndStop(0, true);
  }

  function playLottie() {
    if (!anim || reduced.matches) return;
    anim.play();
  }

  function waitForLayout(then) {
    requestAnimationFrame(() => {
      requestAnimationFrame(then);
    });
  }

  function load() {
    showMark();
    if (anim) return;

    anim = lottie.loadAnimation({
      container: stage,
      renderer: "svg",
      loop: false,
      autoplay: false,
      path: LOTTIE_PATH,
    });

    anim.addEventListener("DOMLoaded", () => {
      primeFrame();
      waitForLayout(() => {
        revealLottie();
        playLottie();
      });
    });

    // loop:false already holds the last frame; this makes the intent explicit.
    anim.addEventListener("complete", () => {
      anim.goToAndStop(anim.totalFrames - 1, true);
    });

    anim.addEventListener("data_failed", () => {
      destroy();
      showMark();
      stage.classList.add("hero__player--failed");
    });
  }

  function sync() {
    if (mobileLockup.matches) {
      destroy();
      showMark();
      return;
    }
    load();
  }

  mobileLockup.addEventListener("change", sync);
  sync();
})();
