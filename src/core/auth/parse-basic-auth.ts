export type Credentials = { username: string; password: string };

export const parseBasicAuth = (header?: string): Credentials | null => {
  if (!header) return null;

  const [scheme, token] = header.trim().split(/\s+/);

  if (scheme?.toLowerCase() !== "basic" || !token) return null;

  const decoded = Buffer.from(token, "base64").toString("utf8");
  const sep = decoded.indexOf(":");
  if (sep === -1) return null;

  return { username: decoded.slice(0, sep), password: decoded.slice(sep + 1) };
};
