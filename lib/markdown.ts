import { marked } from "marked";
import sanitizeHtml from "sanitize-html";

marked.setOptions({ gfm: true, breaks: true });

const OPTS: sanitizeHtml.IOptions = {
  allowedTags: ["p", "br", "strong", "b", "em", "i", "u", "s", "a", "ul", "ol", "li", "h2", "h3", "h4", "blockquote", "hr", "img", "figure", "figcaption", "code", "pre", "sup", "sub"],
  allowedAttributes: { a: ["href", "title", "target", "rel"], img: ["src", "alt", "title", "width", "height", "loading"] },
  allowedSchemes: ["http", "https", "mailto"],
  allowedSchemesByTag: { img: ["http", "https"] },
  allowProtocolRelative: false,
  transformTags: {
    a: (tag, attribs) => ({
      tagName: "a",
      attribs: /^https?:/i.test(attribs.href || "") ? { ...attribs, target: "_blank", rel: "noopener noreferrer" } : attribs,
    }),
  },
};

/** Markdown -> HTML yang sudah disanitasi (whitelist tag & atribut). */
export function md(src: string): string {
  return sanitizeHtml(marked.parse(src || "", { async: false }) as string, OPTS);
}

export function mdInline(src: string): string {
  return md(src).replace(/^<p>|<\/p>\s*$/g, "");
}

export function slugify(s: string) {
  return (
    s
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80) || `item-${Date.now()}`
  );
}
