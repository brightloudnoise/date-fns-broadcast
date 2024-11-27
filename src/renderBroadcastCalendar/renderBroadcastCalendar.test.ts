import { describe, it, expect } from "vitest";
import { renderBroadcastCalendar } from "./index";

describe("Visual Test", () => {
  it(`${renderBroadcastCalendar(2023)}`, () => {
    expect("2023").toBeTruthy();
  });

  it(`${renderBroadcastCalendar(2024)}`, () => {
    expect("2024").toBeTruthy();
  });

  it(`${renderBroadcastCalendar(2025)}`, () => {
    expect("2025").toBeTruthy();
  });
});
