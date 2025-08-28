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
    (e: Event) => {
      const keyboardEvent = e as KeyboardEvent;
      const pressedKeys = [
        keyboardEvent.ctrlKey && "Ctrl",
        keyboardEvent.altKey && "Alt",
        keyboardEvent.shiftKey && "Shift",
        keyboardEvent.metaKey && "Meta",
        keyboardEvent.key !== "Control" &&
          keyboardEvent.key !== "Alt" &&
          keyboardEvent.key !== "Shift" &&
          keyboardEvent.key !== "Meta" &&
          keyboardEvent.key,
      ].filter(Boolean) as string[];

      const isMatch =
        keys.every((key) => pressedKeys.includes(key)) &&
        pressedKeys.length === keys.length;

      if (isMatch) {
        if (preventDefault) {
          keyboardEvent.preventDefault();
        }
        if (stopPropagation) {
          keyboardEvent.stopPropagation();
        }
        handler(keyboardEvent);
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
