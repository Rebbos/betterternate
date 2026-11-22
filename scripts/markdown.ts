import MarkdownIt from 'markdown-it'
import { parse as parseYaml } from 'yaml'

// html: false escapes any raw HTML in content; markdown-it also refuses
// javascript:/vbscript:/file: and non-image data: links by default.
const md = new MarkdownIt({ html: false, linkify: true })

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/

/** Split `---` YAML frontmatter from a Markdown file and render the body to safe HTML. */
export function parseMarkdownFile(raw: string): { data: unknown; html: string } {
  const match = FRONTMATTER.exec(raw)
  const data = match ? parseYaml(match[1]) : {}
  const body = match ? raw.slice(match[0].length) : raw
  return { data, html: md.render(body) }
}
