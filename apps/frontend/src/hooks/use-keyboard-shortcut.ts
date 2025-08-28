import { useCallback, useEffect } from "react";

export type KeyCombo = string[];
export type KeyboardShortcutHandler = (e: KeyboardEvent) => void;

export interface KeyboardShortcutOptions {
  preventDefault?: boolean;
  stopPropagation?: boolean;
  target?: EventTarget;
}

export function useKeyboardShortcut(
  keys: KeyCombo,
  handler: KeyboardShortcutHandler,
  options: KeyboardShortcutOptions = {}
) {
  const {
    preventDefault = true,
    stopPropagation = false,
    target = document,
  } = options;

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const pressedKeys = [
        e.ctrlKey && "Ctrl",
        e.altKey && "Alt",
        e.shiftKey && "Shift",
        e.metaKey && "Meta",
        e.key !== "Control" &&
          e.key !== "Alt" &&
          e.key !== "Shift" &&
          e.key !== "Meta" &&
          e.key,
      ].filter(Boolean) as string[];

      const isMatch =
        keys.every((key) => pressedKeys.includes(key)) &&
        pressedKeys.length === keys.length;

      if (isMatch) {
        if (preventDefault) {
          e.preventDefault();
        }
        if (stopPropagation) {
          e.stopPropagation();
        }
        handler(e);
      }
    },
    [keys, handler, preventDefault, stopPropagation]
  );

  useEffect(() => {
    target.addEventListener("keydown", handleKeyDown);
    return () => target.removeEventListener("keydown", handleKeyDown);
  }, [target, handleKeyDown]);
}

// Convenience hooks for common shortcuts
export function useCtrlK(handler: () => void) {
  useKeyboardShortcut(["Ctrl", "k"], () => handler());
}

export function useEscape(handler: () => void) {
  useKeyboardShortcut(["Escape"], () => handler());
}

export function useEnter(handler: () => void) {
  useKeyboardShortcut(["Enter"], () => handler());
}

export function useDelete(handler: () => void) {
  useKeyboardShortcut(["Delete"], () => handler());
}

export function useBackspace(handler: () => void) {
  useKeyboardShortcut(["Backspace"], () => handler());
}
