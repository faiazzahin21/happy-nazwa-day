import { useEffect, useRef } from "react";

const REVEAL_OPTIONS = {
  rootMargin: "0px 0px -12% 0px",
  threshold: 0.12,
};

function observeRevealElements(observer, root = document) {
  const nodes = root.querySelectorAll("[data-reveal]:not(.is-visible)");
  nodes.forEach((node) => observer.observe(node));
}

export function useRevealObserver(enabled = true) {
  useEffect(() => {
    if (!enabled) return undefined;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const container = document.getElementById("site-main") ?? document;

    if (reducedMotion) {
      container.querySelectorAll("[data-reveal]").forEach((node) => {
        node.classList.add("is-visible");
      });
      return undefined;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, REVEAL_OPTIONS);

    observeRevealElements(observer, container);

    const scan = () => observeRevealElements(observer, container);
    const timers = [120, 600, 1500, 2800].map((ms) => window.setTimeout(scan, ms));
    const onScroll = () => scan();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, [enabled]);
}

export function useFinalSectionObserver(enabled = true) {
  useEffect(() => {
    if (!enabled) return undefined;

    const section = document.getElementById("final-birthday");
    if (!section) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        document.body.classList.toggle("is-final-section", entry.isIntersecting);
      },
      { threshold: 0.2, rootMargin: "0px 0px -80px 0px" },
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
      document.body.classList.remove("is-final-section");
    };
  }, [enabled]);
}

function sinceSectionIsInCueZone(section) {
  if (!section) return false;
  const rect = section.getBoundingClientRect();
  const vh = window.innerHeight || 1;
  // Fire when the section has meaningfully entered the viewport
  // (top above ~78% of screen, bottom still below ~10%)
  const entered = rect.top < vh * 0.78;
  const notFullyPast = rect.bottom > vh * 0.12;
  return entered && notFullyPast && rect.height > 0;
}

/**
 * Reliably cues the story score when Since enters view — once per page load.
 * Uses IntersectionObserver + scroll/resize fallback so it never misses.
 */
export function useSinceMusicCue(enabled = true, onCue) {
  const onCueRef = useRef(onCue);
  const triggeredRef = useRef(false);

  useEffect(() => {
    onCueRef.current = onCue;
  }, [onCue]);

  useEffect(() => {
    if (!enabled) return undefined;

    const section = document.getElementById("since-timeline");
    if (!section) return undefined;

    const fire = async () => {
      if (triggeredRef.current) return;
      triggeredRef.current = true;

      try {
        const result = await onCueRef.current?.();
        if (result === false) {
          // Failed before lock — allow another try on next scroll/check
          triggeredRef.current = false;
        }
      } catch {
        triggeredRef.current = false;
      }
    };

    const check = () => {
      if (triggeredRef.current) return;
      if (sinceSectionIsInCueZone(section)) fire();
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        // Any meaningful intersection is enough — don't depend on a high threshold
        if (entry.isIntersecting && entry.intersectionRatio >= 0.08) {
          fire();
        } else if (sinceSectionIsInCueZone(section)) {
          fire();
        }
      },
      {
        threshold: [0, 0.08, 0.15, 0.25, 0.4],
        rootMargin: "0px 0px -10% 0px",
      },
    );

    observer.observe(section);

    const onScroll = () => check();
    const onResize = () => check();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    // Catch cases where Since is already in view when cueing becomes enabled
    const timers = [0, 120, 400, 1000, 2000].map((ms) => window.setTimeout(check, ms));

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      timers.forEach(clearTimeout);
    };
  }, [enabled]);
}

/** @deprecated Section-level reveal — prefer data-reveal + useRevealObserver */
export default function useScrollReveal({ threshold = 0.12, once = true } = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      node.classList.add("is-revealed");
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          node.classList.add("is-revealed");
          if (once) observer.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -12% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, once]);

  return ref;
}
