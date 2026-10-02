import { useEffect, useRef } from "react";

export function usePageMotion() {
  const root = useRef<HTMLDivElement>(null);
  const progress = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let frame = 0;
    function updateProgress() {
      frame = 0;
      const available = document.documentElement.scrollHeight - innerHeight;
      const fraction =
        available > 0 ? Math.min(1, Math.max(0, scrollY / available)) : 0;
      if (progress.current)
        progress.current.style.transform = `scaleX(${fraction})`;
    }
    function schedule() {
      if (!frame) frame = requestAnimationFrame(updateProgress);
    }
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    const resize = new ResizeObserver(schedule);
    if (root.current) resize.observe(root.current);
    updateProgress();
    const family =
      root.current?.querySelector<HTMLElement>(".wood-story figure");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || !family) return;
        if (root.current?.dataset.motion === "playing")
          family.dataset.inView = "true";
        observer.disconnect();
      },
      { threshold: 0.2 },
    );
    if (family) observer.observe(family);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      resize.disconnect();
      observer.disconnect();
    };
  }, []);
  return { root, progress };
}
