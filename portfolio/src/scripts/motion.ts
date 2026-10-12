import { animate, inView, scroll, hover, stagger } from "motion";

const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function reveals() {
  inView(
    "[data-reveal]",
    (el) => {
      const delay = Number((el as HTMLElement).dataset.reveal) || 0;
      animate(
        el,
        { opacity: [0, 1], y: [24, 0] },
        { duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] },
      );
    },
    { margin: "0px 0px -10% 0px" },
  );

  inView("[data-stagger]", (group) => {
    animate(
      group.children,
      { opacity: [0, 1], y: [20, 0] },
      { duration: 0.7, delay: stagger(0.07), ease: [0.16, 1, 0.3, 1] },
    );
  });
}

// Floating UI chips drift gently, each on its own rhythm.
function floaters() {
  document.querySelectorAll<HTMLElement>("[data-float]").forEach((el, i) => {
    const amp = Number(el.dataset.float) || 10;
    animate(
      el,
      { y: [0, -amp, 0], rotate: [0, i % 2 ? 1.5 : -1.5, 0] },
      { duration: 5 + (i % 4), repeat: Infinity, ease: "easeInOut", delay: i * 0.3 },
    );
  });
}

// Elements move against the scroll for depth.
function parallax() {
  document.querySelectorAll<HTMLElement>("[data-parallax]").forEach((el) => {
    const dist = Number(el.dataset.parallax) || 80;
    scroll(animate(el, { y: [0, dist] }, { ease: "linear" }), {
      target: el.closest("section") ?? undefined,
      offset: ["start start", "end start"],
    });
  });
}

// Cards tilt toward the pointer.
function tilts() {
  if (!window.matchMedia("(hover: hover)").matches) return;
  hover("[data-tilt]", (card) => {
    const el = card as HTMLElement;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      animate(el, { rotateY: x * 6, rotateX: -y * 6 }, { duration: 0.4 });
    };
    el.addEventListener("pointermove", onMove);
    return () => {
      el.removeEventListener("pointermove", onMove);
      animate(el, { rotateY: 0, rotateX: 0 }, { type: "spring", stiffness: 200, damping: 20 });
    };
  });
}

// Hero headline words rise in on load.
function intro() {
  const words = document.querySelectorAll("[data-intro] > *");
  if (!words.length) return;
  animate(
    words,
    { opacity: [0, 1], y: ["40%", "0%"] },
    { duration: 1, delay: stagger(0.08, { startDelay: 0.1 }), ease: [0.16, 1, 0.3, 1] },
  );
}

if (!reduce) {
  intro();
  reveals();
  floaters();
  parallax();
  tilts();
}
