export function cleanUpText(text = "") {
  return text
    .replace(/\s+/g, " ")
    .replace(/-+/g, "-")
    .replace(/\/+/g, "/")
    .replace(/'+/g, "'")
    .replace(/\.+/g, ".")
    .trim();
}
