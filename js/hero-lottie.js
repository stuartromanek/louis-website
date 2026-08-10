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
    stage.hidden = true;
    if (mark) mark.hidden = false;
  }

  function showLottie() {
    stage.hidden = false;
    if (mark) mark.hidden = true;
  }

  function destroy() {
    if (!anim) return;
    anim.destroy();
    anim = null;
    stage.replaceChildren();
  }

  function load() {
    // Hide the mark immediately so it can't peek beside the desktop Lottie
    // while the animation is still fetching.
    showLottie();

    if (anim) return;

    anim = lottie.loadAnimation({
      container: stage,
      renderer: "svg",
      loop: false,
      autoplay: false,
      path: LOTTIE_PATH,
    });

    anim.addEventListener("DOMLoaded", () => {
      if (reduced.matches) {
        // Show the finished pose immediately.
        anim.goToAndStop(anim.totalFrames - 1, true);
        return;
      }
      anim.play();
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
