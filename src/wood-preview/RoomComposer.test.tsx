import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { RoomComposer } from "./RoomComposer";

// Control semantics are tested here; the GPU scene is exercised in the browser.
vi.mock("./RoomScene", () => ({ RoomScene: () => null }));

describe("room design preview controls", () => {
  it("lets visitors choose one room and one illustrative finish at a time", async () => {
    const user = userEvent.setup();
    render(<RoomComposer motion="playing" />);
    const rooms = within(
      screen.getByRole("group", { name: "סוג החדר להמחשה" }),
    );
    expect(rooms.getByRole("button", { name: "סלון" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await user.click(rooms.getByRole("button", { name: "חדר שינה" }));
    expect(rooms.getByRole("button", { name: "חדר שינה" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(rooms.getByRole("button", { name: "סלון" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
    const finishes = within(
      screen.getByRole("group", { name: "גווני עץ להמחשה" }),
    );
    await user.click(finishes.getByRole("button", { name: "עץ בהיר" }));
    expect(finishes.getByRole("button", { name: "עץ בהיר" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(finishes.getByRole("button", { name: "אגוז חם" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
    expect(screen.getByText("עץ בהיר")).toBeVisible();
  });
  it("prevents replay when motion is paused or reduced", () => {
    const { rerender } = render(<RoomComposer motion="paused" />);
    expect(
      screen.getByRole("button", { name: "הרכבת החדר מחדש" }),
    ).toBeDisabled();
    rerender(<RoomComposer motion="off" />);
    expect(
      screen.getByRole("button", { name: "הרכבת החדר מחדש" }),
    ).toBeDisabled();
    rerender(<RoomComposer motion="playing" />);
    expect(
      screen.getByRole("button", { name: "הרכבת החדר מחדש" }),
    ).toBeEnabled();
  });
});
