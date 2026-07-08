import { marked } from 'marked';

const renderer = new marked.Renderer();

renderer.link = ({ href, text }) => {
  return `<a href="${href}" target="_blank" rel="noopener noreferrer">${text}</a>`;
};

marked.setOptions({
  renderer,
  breaks: true,
  gfm: true,
});

export function renderMd(text: string): string {
  if (!text) return '';
  return marked.parse(text) as string;
}
