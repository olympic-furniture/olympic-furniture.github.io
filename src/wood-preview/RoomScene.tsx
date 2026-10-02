import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { createRoomScene } from "./room-scene";
import type { Motion } from "./room-presets";
import { roomMotion } from "./room-motion";

type Controller = ReturnType<typeof createRoomScene>;
type Props = { motion: Motion };
export function RoomScene(props: Props) {
  const host = useRef<HTMLDivElement>(null);
  const controller = useRef<Controller | null>(null);
  const latest = useRef(props);
  latest.current = props;
  const [renderer, setRenderer] = useState<"pending" | "webgl" | "fallback">(
    "pending",
  );
  const [loadedSprite, setLoadedSprite] = useState<string>();
  const [fallbackCompleted, setFallbackCompleted] = useState(false);
  const [visible, setVisible] = useState(true);
  const sprite = "/images/wood-preview/living-hero-assembly.webp";
  useEffect(() => {
    let cancelled = false;
    let canvas: HTMLCanvasElement | undefined;
    function useFallback() {
      if (cancelled || !host.current) return;
      setFallbackCompleted(!!controller.current);
      controller.current?.dispose();
      controller.current = null;
      host.current.dataset.renderer = "fallback";
      setRenderer("fallback");
    }
    function contextLost(event: Event) {
      event.preventDefault();
      useFallback();
    }
    import("./room-scene")
      .then(({ createRoomScene }) => {
        if (cancelled || !host.current) return;
        try {
          const scene = createRoomScene(host.current);
          controller.current = scene;
          scene.setMotion(latest.current.motion);
          scene.setRoom("living");
          scene.setFinish(1);
          canvas = host.current.querySelector("canvas") ?? undefined;
          canvas?.addEventListener("webglcontextlost", contextLost);
          setRenderer("webgl");
        } catch {
          useFallback();
        }
      })
      .catch(useFallback);
    return () => {
      cancelled = true;
      canvas?.removeEventListener("webglcontextlost", contextLost);
      controller.current?.dispose();
      controller.current = null;
    };
  }, []);
  useEffect(() => {
    if (renderer !== "fallback" || props.motion === "off" || fallbackCompleted)
      return;
    let cancelled = false;
    const image = new Image();
    image.onload = () => {
      if (!cancelled) setLoadedSprite(sprite);
    };
    image.onerror = () => {
      if (!cancelled) setFallbackCompleted(true);
    };
    image.src = sprite;
    return () => {
      cancelled = true;
      image.onload = null;
      image.onerror = null;
    };
  }, [renderer, sprite, props.motion, fallbackCompleted]);
  useEffect(() => {
    const element = host.current;
    if (!element || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) =>
      setVisible(entry.isIntersecting),
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    controller.current?.setMotion(props.motion);
  }, [props.motion]);
  const animatedFallback =
    renderer === "fallback" &&
    !fallbackCompleted &&
    loadedSprite === sprite &&
    props.motion !== "off";
  return (
    <div
      className="wood-room"
      aria-hidden="true"
      data-renderer={renderer}
      data-motion={props.motion}
      data-visible={visible}
      style={{ "--room-duration": `${roomMotion.duration}ms` } as CSSProperties}
    >
      <img
        className="wood-room-still"
        data-visible={renderer !== "webgl" && !animatedFallback}
        src={
          props.motion === "off" || fallbackCompleted
            ? "/images/wood-preview/living-hero.webp"
            : "/images/wood-preview/living-hero-start.webp"
        }
        alt=""
        width="640"
        height="470"
      />
      {animatedFallback && (
        <div
          className="wood-room-flipbook"
          style={{ backgroundImage: `url("${sprite}")` }}
        />
      )}
      <div
        className="wood-room-canvas"
        data-visible={renderer === "webgl"}
        ref={host}
      />
    </div>
  );
}
