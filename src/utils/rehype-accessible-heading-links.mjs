function headingText(node) {
  if (node.type === 'text') return node.value;
  if (!Array.isArray(node.children)) return '';
  return node.children.map(headingText).join('');
}

function walk(node) {
  if (!Array.isArray(node.children)) return;

  for (const child of node.children) {
    if (
      child.type === 'element' &&
      /^h[2-4]$/.test(child.tagName) &&
      typeof child.properties?.id === 'string'
    ) {
      child.children.push({
        type: 'element',
        tagName: 'a',
        properties: {
          className: ['heading-anchor'],
          href: `#${child.properties.id}`,
          ariaLabel: `链接到「${headingText(child)}」`,
        },
        children: [{ type: 'text', value: '#' }],
      });
    }
    walk(child);
  }
}

export function rehypeAccessibleHeadingLinks() {
  return walk;
}
