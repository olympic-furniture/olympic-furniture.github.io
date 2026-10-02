import { RoomScene } from "./RoomScene";
import type { Motion } from "./room-presets";

export function RoomComposer({ motion }: { motion: Motion }) {
  return (
    <figure
      className="wood-room-composer"
      role="img"
      aria-label="המחשה תלת־ממדית של רהיטים המתחברים לסלון"
    >
      <RoomScene motion={motion} />
    </figure>
  );
}
