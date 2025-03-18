import './env.mjs'
import { LiveExporter, toKebabCase } from '@inkdropapp/live-export'

const { INKDROP_USERNAME, INKDROP_PASSWORD, INKDROP_PORT, INKDROP_BOOKID_PROJECTS } =
  process.env

const liveExport = new LiveExporter({
  username: INKDROP_USERNAME,
  password: INKDROP_PASSWORD,
  port: Number(INKDROP_PORT)
})

const basePath = `./src/pages/projects`
const publicPath = `./public/projects`

await liveExport.start({
  live: true,
  bookId: INKDROP_BOOKID_PROJECTS,
  preProcessNote: ({ note, frontmatter, tags }) => {
    frontmatter.layout = '../../layouts/ProjectLayout.astro'
    frontmatter.title = note.title
    frontmatter.timestamp = new Date(note.createdAt).toISOString()
    frontmatter.tags = (() => {
        const t = tags.map(t => t.name)
        const tlen = t.length

        return tlen > 0 ? t : frontmatter.tags
    })()
    frontmatter.filename = toKebabCase(note.title)
    frontmatter.time = (() => {
        const count = note.body.trim().split(/\s+/).reduce((count) => count + 1, 0)
        const base = count < 200 ? 200 : count
        return Math.floor(base / 200)
    })()
    if (!frontmatter.slug) frontmatter.slug = toKebabCase(note.title)
  },
  pathForNote: ({ frontmatter }) => {
    if (frontmatter.public) {
      return `${basePath}/${frontmatter.slug}.md`
    } else return false
  },
  urlForNote: ({ note, frontmatter }) => {
    if (frontmatter.public) {
      if (!frontmatter.slug) frontmatter.slug = toKebabCase(note.title)
      return `/posts/${frontmatter.slug}`
    } else return false
  },
  pathForFile: ({ mdastNode, /* note, file, */ extension, frontmatter }) => {
    if (mdastNode.alt) {
      const fn = `${frontmatter.slug}_${toKebabCase(mdastNode.alt)}${extension}`
      const res = {
        filePath: `${publicPath}/${fn}`,
        url: `/posts/${fn}`
      }
      if (mdastNode.alt === 'thumbnail') {
        frontmatter.heroImage = res.url
      }
      return res
    } else return false
  },
  postProcessNote: ({ md }) => {
    // Remove the thumbnail from the note body
    const md2 = md.replace(/\!\[thumbnail\]\(.*\)\n/, '')
    return md2
  }
})
