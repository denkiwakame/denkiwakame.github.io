// Sätteri hast plugin: render math with KaTeX at build time (no client JS).
// With `features.math`, Sätteri emits
//   inline  $…$   → <code class="language-math math-inline">…</code>
//   display $$…$$ → <pre><code class="language-math math-display">…</code></pre>
// and this plugin swaps those for KaTeX HTML as raw hast nodes, which stay where they are
// (an mdast-level replacement gets re-parsed and splits the surrounding paragraph).
import katex from 'katex';

const render = (tex, displayMode) =>
  katex.renderToString(tex, { displayMode, throwOnError: true, output: 'htmlAndMathml', strict: 'warn' });

const classes = (node) => {
  const c = node.properties?.className ?? node.properties?.class ?? [];
  return Array.isArray(c) ? c : String(c).split(/\s+/);
};
const text = (node) => (node.children ?? []).map((c) => (c.type === 'text' ? c.value : text(c))).join('');

export const katexPlugin = {
  name: 'katex',
  element: {
    filter: ['code', 'pre'],
    visit(node, ctx) {
      if (node.tagName === 'code' && classes(node).includes('math-inline')) {
        ctx.replaceNode(node, { type: 'raw', value: render(text(node), false) });
      } else if (node.tagName === 'pre') {
        const code = (node.children ?? []).find((c) => c.type === 'element' && c.tagName === 'code');
        if (code && classes(code).includes('math-display'))
          ctx.replaceNode(node, { type: 'raw', value: `<div class="math-display">${render(text(code), true)}</div>` });
      }
    },
  },
};
