/** Scroll suave hacia un id de sección. */
export function scrollToId(id: string) {
  const clean = id.replace(/^#/, "");
  const el = document.getElementById(clean);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}
