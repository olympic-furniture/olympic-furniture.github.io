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
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let cancelled = false;
    import("./room-scene")
      .then(({ createRoomScene }) => {
        if (cancelled || !host.current) return;
        try {
          const scene = createRoomScene(host.current);
          controller.current = scene;
          scene.setMotion(latest.current.motion);
          scene.setRoom(latest.current.room);
          scene.setFinish(latest.current.finish);
          setReady(true);
        } catch {
          // The matching assembled render remains visible without WebGL.
          host.current.dataset.renderer = "fallback";
        }
      })
      .catch(() => {
        if (host.current) host.current.dataset.renderer = "fallback";
      });
    return () => {
      cancelled = true;
      controller.current?.dispose();
      controller.current = null;
    };
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
  return (
    <div className="wood-room" aria-hidden="true" data-ready={ready}>
      <img
        src={`/images/wood-preview/${props.room}-${props.finish}.webp`}
        alt=""
        width="640"
        height="470"
      />
      <div className="wood-room-canvas" ref={host} />
    </div>
  );
}
