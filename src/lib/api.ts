import { SUPPORTED_LOCALES } from "@/i18n";
import { ensureIpResolved } from "./ip";
import { getSession } from "./session";

const DEFAULT_LOCALE = "en";

// Backend scopes locale-specific content by x-host. The canonical English
// site lives at the root, so `/quiz` -> `16types.ai`; non-default locales
// live under a path segment, so `/ja/quiz` -> `16types.ai/ja`. Reading the
// pathname at request time (not boot time) keeps the header correct after
// a LanguageSwitcher click without requiring any context plumbing.
function buildXHost(): string {
  const base = import.meta.env.VITE_X_HOST;
  const first =
    typeof window !== "undefined"
      ? window.location.pathname.split("/").filter(Boolean)[0]
      : undefined;
  const isLocaleSegment =
    !!first &&
    first !== DEFAULT_LOCALE &&
    (SUPPORTED_LOCALES as readonly string[]).includes(first);
  return isLocaleSegment ? `${base}/${first}` : base;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export class NetworkError extends Error {
  constructor(message = "Network request failed") {
    super(message);
    this.name = "NetworkError";
  }
}

interface Envelope<T> {
  meta: { success: boolean; message: string; status: number };
  data: T;
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
): Promise<T> {
  const base = import.meta.env.VITE_API_BASE_URL;
  const url = `${base}${path}`;

  // Backend's pricing logic is geo-based; a missing `ip_address` header
  // quietly returns wrong prices. Await the shared ipify resolution so
  // the first request on a fresh session never goes out header-less.
  await ensureIpResolved();

  let res: Response;
  try {
    res = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
        "x-host": buildXHost(),
        ip_address: getSession().ipAddress ?? "",
        "Content-Type": "application/json",
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch (e) {
    throw new NetworkError((e as Error).message);
  }

  let payload: Envelope<T>;
  try {
    payload = await res.json();
  } catch {
    throw new NetworkError("Invalid JSON from server");
  }

  if (!payload.meta?.success) {
    throw new ApiError(
      payload.meta?.message ?? "Request failed",
      payload.meta?.status ?? res.status,
    );
  }
  return payload.data;
}

export const apiGet = <T>(path: string) => request<T>("GET", path);
export const apiPost = <T>(path: string, body?: unknown) =>
  request<T>("POST", path, body);
export const apiPut = <T>(path: string, body?: unknown) =>
  request<T>("PUT", path, body);
