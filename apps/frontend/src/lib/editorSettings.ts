export interface EditorSettings {
  autosaveIntervalMs: number;
  fontSize: number;
  spellCheck: boolean;
}

export const DEFAULT_EDITOR_SETTINGS: EditorSettings = {
  autosaveIntervalMs: 2000,
  fontSize: 16,
  spellCheck: true,
};

export const EDITOR_SETTINGS_STORAGE_KEY = "scholarflow:editor-settings";
export const EDITOR_SETTINGS_EVENT = "scholarflow:editor-settings-changed";

/**
 * Synchronous read so the editor can apply preferences on first paint,
 * before any network round-trip. Server persistence happens separately via
 * /user/preferences metadata.
 */
export function readEditorSettings(): EditorSettings {
  if (typeof window === "undefined") return DEFAULT_EDITOR_SETTINGS;
  try {
    const raw = window.localStorage.getItem(EDITOR_SETTINGS_STORAGE_KEY);
    if (!raw) return DEFAULT_EDITOR_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<EditorSettings>;
    return {
      autosaveIntervalMs:
        typeof parsed.autosaveIntervalMs === "number"
          ? parsed.autosaveIntervalMs
          : DEFAULT_EDITOR_SETTINGS.autosaveIntervalMs,
      fontSize:
        typeof parsed.fontSize === "number"
          ? parsed.fontSize
          : DEFAULT_EDITOR_SETTINGS.fontSize,
      spellCheck:
        typeof parsed.spellCheck === "boolean"
          ? parsed.spellCheck
          : DEFAULT_EDITOR_SETTINGS.spellCheck,
    };
  } catch {
    return DEFAULT_EDITOR_SETTINGS;
  }
}

export function writeEditorSettings(settings: EditorSettings): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    EDITOR_SETTINGS_STORAGE_KEY,
    JSON.stringify(settings)
  );
  window.dispatchEvent(
    new CustomEvent<EditorSettings>(EDITOR_SETTINGS_EVENT, {
      detail: settings,
    })
  );
}
