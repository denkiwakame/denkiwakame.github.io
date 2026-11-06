// Sätteri mdast plugin: a paragraph that is only a remote or public/ image becomes a captioned figure.
//   ![Caption text](https://example.com/fig.png)   or   ![Caption text](/papers/<id>/fig.webp)
// → <figure><img …><figcaption>Caption text</figcaption></figure>
// An optional numeric title sets the max display width in px (so in-figure text has a consistent size):
//   ![Caption text](https://example.com/fig.png "520")
// Root-relative paths are files in public/ (served as-is). Relative paths are left to Astro's image pipeline.
const escape = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

export const figurePlugin = {
  name: 'figure',
  paragraph(node, ctx) {
    const [child, ...rest] = node.children ?? [];
    if (!child || rest.length > 0 || child.type !== 'image' || !/^(https?:)?\//.test(child.url)) return;
    const caption = escape(child.alt ?? '');
    const width = /^\d+$/.test(child.title ?? '') ? ` style="--fig-width: ${child.title}px"` : '';
    ctx.replaceNode(node, {
      type: 'html',
      value: `<figure${width}><img src="${escape(child.url)}" alt="${caption}" loading="lazy" decoding="async"><figcaption>${caption}</figcaption></figure>`,
    });
  },
};
