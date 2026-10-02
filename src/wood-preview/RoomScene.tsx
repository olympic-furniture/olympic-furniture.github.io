import { useEffect, useRef, useState } from "react";
import type { createRoomScene } from "./room-scene";
import type { Motion, Room } from "./room-presets";

type Controller = ReturnType<typeof createRoomScene>;
type Props = { room: Room; finish: number; replay: number; motion: Motion };
export function RoomScene(props: Props) {
  const host = useRef<HTMLDivElement>(null);
  const controller = useRef<Controller | null>(null);
  const latest = useRef(props);
  latest.current = props;
  const [renderer, setRenderer] = useState<"pending" | "webgl" | "fallback">(
    "pending",
  );
  const [loadedSprite, setLoadedSprite] = useState<string>();
  const [visible, setVisible] = useState(true);
  const sprite = `/images/wood-preview/${props.room}-${props.finish}-assembly.webp`;
  useEffect(() => {
    let cancelled = false;
    let canvas: HTMLCanvasElement | undefined;
    function useFallback() {
      if (cancelled || !host.current) return;
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
          scene.setRoom(latest.current.room);
          scene.setFinish(latest.current.finish);
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
    if (renderer !== "fallback") return;
    let cancelled = false;
    const image = new Image();
    image.onload = () => {
      if (!cancelled) setLoadedSprite(sprite);
    };
    image.src = sprite;
    return () => {
      cancelled = true;
      image.onload = null;
    };
  }, [renderer, sprite]);
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
    controller.current?.setRoom(props.room);
  }, [props.room]);
  useEffect(() => {
    controller.current?.setFinish(props.finish);
  }, [props.finish]);
  useEffect(() => {
    controller.current?.setMotion(props.motion);
  }, [props.motion]);
  useEffect(() => {
    if (props.replay) controller.current?.replay();
  }, [props.replay]);
  const animatedFallback = renderer === "fallback" && loadedSprite === sprite;
  return (
    <div
      className="wood-room"
      aria-hidden="true"
      data-renderer={renderer}
      data-room={props.room}
      data-finish={props.finish}
      data-motion={props.motion}
      data-visible={visible}
    >
      <img
        className="wood-room-still"
        data-visible={renderer !== "webgl" && !animatedFallback}
        src={`/images/wood-preview/${props.room}-${props.finish}.webp`}
        alt=""
        width="640"
        height="470"
      />
      {animatedFallback && (
        <div
          key={`${sprite}-${props.replay}`}
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
