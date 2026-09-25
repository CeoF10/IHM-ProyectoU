const base = typeof import.meta.env === "undefined" ? "/" : import.meta.env.BASE_URL;

export function assetUrl(path) {
  return `${base}${path.replace(/^\/+/, "")}`;
}
