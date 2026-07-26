const SCRIPT_TAG_WARNING =
  "Encountered a script tag while rendering React component";

if (typeof window !== "undefined" && process.env.NODE_ENV !== "production") {
  const origError = console.error.bind(console);
  console.error = (...args: unknown[]) => {
    if (
      typeof args[0] === "string" &&
      args[0].includes(SCRIPT_TAG_WARNING)
    ) {
      return;
    }
    origError(...args);
  };
}
