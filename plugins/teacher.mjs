// Sätteri hast plugin: a blockquote that opens with a teacher marker becomes a labeled,
// color-coded example of a teacher VLM's output (styled in src/pages/publications/[id].astro).
//
//   > [!teacher 4B] describe | Grounded robot + gripper state
//   >
//   > "… Its gripper is open. …"
//
// → <blockquote class="teacher teacher-large">
//     <p class="teacher-label"><span class="model">Teacher 4B</span> <span class="prompt">describe</span>
//        <span class="note">Grounded robot + gripper state</span></p>
//     <p>"… Its gripper is open. …"</p>
//   </blockquote>
//
// "0.8B" gets teacher-small, anything else teacher-large. The "| note" part is optional.
const MARKER = /^\[!teacher\s+([^\]]+)\]\s*([^|]*?)\s*(?:\|\s*(.*))?$/;
const escape = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

export const teacherPlugin = {
  name: 'teacher',
  element: {
    filter: ['blockquote'],
    visit(node, ctx) {
      const first = (node.children ?? []).find((c) => c.type === 'element');
      if (!first || first.tagName !== 'p') return;
      const m = ctx.textContent(first).trim().match(MARKER);
      if (!m) return;
      const [, model, prompt, note] = m;
      const size = model.trim() === '0.8B' ? 'teacher-small' : 'teacher-large';
      ctx.setProperty(node, 'className', ['teacher', size]);
      const label =
        `<p class="teacher-label"><span class="model">Teacher ${escape(model.trim())}</span>` +
        (prompt ? ` <span class="prompt">${escape(prompt)}</span>` : '') +
        (note ? ` <span class="note">${escape(note.trim())}</span>` : '') +
        `</p>`;
      ctx.replaceNode(first, { type: 'raw', value: label });
    },
  },
};
