import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { cacheLife, cacheTag } from 'next/cache'
import { Doc, DocCategory, DocCategoryGroup, DocMeta, Heading } from '@/types/docs'

const DOCS_DIR = path.join(process.cwd(), 'src', 'docs')

const CATEGORY_MAP: Record<string, DocCategory> = {
  guides: 'guides',
  challenges: 'challenges',
  reference: 'reference',
}

const CATEGORY_ORDER: DocCategory[] = ['guides', 'challenges', 'reference']

function getAllDocFiles(): string[] {
  const categories = Object.keys(CATEGORY_MAP)
  const files: string[] = []

  for (const category of categories) {
    const categoryDir = path.join(DOCS_DIR, category)
    if (fs.existsSync(categoryDir)) {
      const categoryFiles = fs.readdirSync(categoryDir)
        .filter(f => f.endsWith('.md'))
        .map(f => path.join(categoryDir, f))
      files.push(...categoryFiles)
    }
  }

  return files
}

function parseFrontmatter(filePath: string): DocMeta | null {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    const { data } = matter(fileContent)

    const relativePath = path.relative(DOCS_DIR, filePath)
    const category = CATEGORY_MAP[relativePath.split(path.sep)[0]]

    if (!category) return null

    const slug = path.basename(filePath, '.md')

    return {
      slug,
      title: data.title || slug,
      summary: data.summary || '',
      category,
      readTime: data.readTime || 5,
      updatedAt: data.updatedAt || new Date().toISOString().split('T')[0],
      order: data.order || 999,
    }
  } catch {
    return null
  }
}

function extractHeadings(content: string): Heading[] {
  const headings: Heading[] = []
  const lines = content.split('\n')

  for (const line of lines) {
    const h2Match = line.match(/^## (.+)$/)
    if (h2Match) {
      headings.push({
        id: h2Match[1].toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, ''),
        text: h2Match[1],
        level: 2,
      })
    }

    const h3Match = line.match(/^### (.+)$/)
    if (h3Match) {
      headings.push({
        id: h3Match[1].toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, ''),
        text: h3Match[1],
        level: 3,
      })
    }
  }

  return headings
}

export async function getAllDocs(): Promise<DocMeta[]> {
  'use cache'
  cacheLife('hours')
  cacheTag('docs-list')

  const files = getAllDocFiles()
  const docs: DocMeta[] = []

  for (const file of files) {
    const meta = parseFrontmatter(file)
    if (meta) {
      docs.push(meta)
    }
  }

  return docs.sort((a, b) => {
    if (a.category !== b.category) {
      return CATEGORY_ORDER.indexOf(a.category) - CATEGORY_ORDER.indexOf(b.category)
    }
    return a.order - b.order
  })
}

export async function getDocBySlug(slug: string): Promise<Doc | null> {
  'use cache'
  cacheTag('docs-list', `doc-${slug}`)
  cacheLife('hours')

  const allDocs = await getAllDocs()
  const docMeta = allDocs.find(d => d.slug === slug)

  if (!docMeta) return null

  const filePath = path.join(DOCS_DIR, docMeta.category, `${slug}.md`)

  if (!fs.existsSync(filePath)) return null

  const fileContent = fs.readFileSync(filePath, 'utf-8')
  const { content } = matter(fileContent)
  const headings = extractHeadings(content)

  const currentIndex = allDocs.findIndex(d => d.slug === slug)
  const prev = currentIndex > 0 ? allDocs[currentIndex - 1] : undefined
  const next = currentIndex < allDocs.length - 1 ? allDocs[currentIndex + 1] : undefined

  return {
    ...docMeta,
    content,
    headings,
    prev,
    next,
  }
}

export async function getDocCategories(): Promise<DocCategoryGroup[]> {
  'use cache'
  cacheTag('docs-categories')
  cacheLife('hours')

  const allDocs = await getAllDocs()
  const groups: DocCategoryGroup[] = []

  for (const category of CATEGORY_ORDER) {
    const docs = allDocs
      .filter(d => d.category === category)
      .sort((a, b) => a.order - b.order)

    if (docs.length > 0) {
      groups.push({
        name: category.charAt(0).toUpperCase() + category.slice(1),
        slug: category,
        docs,
      })
    }
  }

  return groups
}

export async function searchDocs(query: string): Promise<DocMeta[]> {
  'use cache'
  cacheTag('docs-search', `search-${query}`)
  cacheLife('minutes')

  if (!query.trim()) {
    return getAllDocs()
  }

  const allDocs = await getAllDocs()
  const lowerQuery = query.toLowerCase()

  return allDocs.filter(doc =>
    doc.title.toLowerCase().includes(lowerQuery) ||
    doc.summary.toLowerCase().includes(lowerQuery) ||
    doc.slug.toLowerCase().includes(lowerQuery)
  )
}
