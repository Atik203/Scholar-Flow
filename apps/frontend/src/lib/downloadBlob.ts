import { getApiBaseUrl } from "@/lib/apiUrl";

/**
 * Download a backend file endpoint (Content-Disposition attachment) as a
 * blob with the JWT attached. RTK Query can't handle binary downloads
 * well, so this is the sanctioned exception to the "no raw fetch" rule —
 * same pattern the settings/export page uses.
 */
export async function downloadAuthenticatedFile(
  path: string,
  token: string | null,
  fallbackName: string
): Promise<void> {
  const res = await fetch(`${getApiBaseUrl()}${path}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) {
    throw new Error(`Download failed (${res.status})`);
  }
  const disposition = res.headers.get("Content-Disposition") ?? "";
  const match = /filename="?([^";]+)"?/.exec(disposition);
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = match?.[1] ?? fallbackName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
