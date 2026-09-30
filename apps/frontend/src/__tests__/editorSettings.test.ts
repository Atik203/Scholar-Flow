import { describe, expect, it } from "@jest/globals";
import {
  DEFAULT_EDITOR_SETTINGS,
  readEditorSettings,
} from "@/lib/editorSettings";

describe("editor settings", () => {
  it("falls back to safe defaults without browser storage", () => {
    expect(readEditorSettings()).toEqual(DEFAULT_EDITOR_SETTINGS);
    expect(DEFAULT_EDITOR_SETTINGS.autosaveIntervalMs).toBe(2000);
    expect(DEFAULT_EDITOR_SETTINGS.fontSize).toBe(16);
  });

  it("recovers from corrupted local storage", () => {
    type GlobalWithWindow = { window?: unknown };
    (globalThis as GlobalWithWindow).window = {
      localStorage: { getItem: () => "{not-valid-json" },
    };

    try {
      expect(readEditorSettings()).toEqual(DEFAULT_EDITOR_SETTINGS);
    } finally {
      delete (globalThis as GlobalWithWindow).window;
    }
  });
});
