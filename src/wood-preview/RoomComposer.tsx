import { useState } from "react";
import { ArrowCounterClockwiseIcon } from "@phosphor-icons/react";
import { RoomScene } from "./RoomScene";
import { finishes, type Room } from "./room-presets";
const rooms = [
  { id: "living", label: "סלון" },
  { id: "bedroom", label: "חדר שינה" },
  { id: "office", label: "פינת עבודה" },
] as const;

export function RoomComposer({
  motion,
}: {
  motion: "playing" | "paused" | "off";
}) {
  const [room, setRoom] = useState<Room>("living");
  const [finish, setFinish] = useState(1);
  const [replay, setReplay] = useState(0);
  const wood = finishes[finish];
  return (
    <div className="wood-room-composer">
      <div className="wood-room-tabs" role="group" aria-label="סוג החדר להמחשה">
        {rooms.map((option) => (
          <button
            key={option.id}
            aria-pressed={room === option.id}
            onClick={() => setRoom(option.id)}
          >
            {option.label}
          </button>
        ))}
      </div>
      <RoomScene room={room} finish={finish} replay={replay} motion={motion} />
      <div className="wood-room-tools">
        <div
          className="wood-finish-options"
          role="group"
          aria-label="גווני עץ להמחשה"
        >
          {finishes.map((option, index) => (
            <button
              key={option.label}
              aria-label={option.label}
              aria-pressed={finish === index}
              title={option.label}
              onClick={() => setFinish(index)}
            >
              <span style={{ backgroundColor: option.color }} />
            </button>
          ))}
        </div>
        <span className="wood-finish-label">{wood.label}</span>
        <button
          className="wood-replay"
          aria-label="הרכבת החדר מחדש"
          disabled={motion !== "playing"}
          onClick={() => setReplay((value) => value + 1)}
        >
          <ArrowCounterClockwiseIcon size={20} aria-hidden />
        </button>
      </div>
      <p className="wood-room-disclaimer">
        המחשה עיצובית. את הרהיטים עצמם תמצאו בגלריה.
      </p>
    </div>
  );
}
