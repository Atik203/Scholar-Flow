"use client";

import { Extension } from "@tiptap/core";
import type { DecorationAttrs } from "@tiptap/pm/view";
import {
  defaultCursorBuilder,
  defaultSelectionBuilder,
  yCursorPlugin,
} from "@tiptap/y-tiptap";
import type { Awareness } from "y-protocols/awareness";

/**
 * Cursor extension for Tiptap v3 collaboration.
 *
 * `@tiptap/extension-collaboration-cursor@2.x` builds its plugin from
 * `y-prosemirror`, whose `ySyncPluginKey` is a different PluginKey instance
 * than the one used by `@tiptap/extension-collaboration@3.x` (which uses
 * `@tiptap/y-tiptap`). The cursor plugin then reads the sync binding as
 * undefined and crashes. This extension uses the same `@tiptap/y-tiptap`
 * plugin so the binding is found.
 */

export interface CollaborationCursorOptions {
  provider: { awareness: Awareness } | null;
  user: { name: string | null; color: string | null };
  render: (user: Record<string, unknown>) => HTMLElement;
  selectionRender: (user: Record<string, unknown>) => DecorationAttrs;
}

export const CollaborationCursor = Extension.create<CollaborationCursorOptions>(
  {
    name: "collaborationCursor",

    addOptions() {
      return {
        provider: null,
        user: { name: null, color: null },
        render: defaultCursorBuilder,
        selectionRender: defaultSelectionBuilder,
      };
    },

    addProseMirrorPlugins() {
      const awareness = this.options.provider?.awareness;

      if (!awareness) {
        return [];
      }

      awareness.setLocalStateField("user", this.options.user);

      return [
        yCursorPlugin(awareness, {
          cursorBuilder: this.options.render,
          selectionBuilder: this.options.selectionRender,
        }),
      ];
    },
  }
);
