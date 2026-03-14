import fs from 'fs'
import path from 'path'
import { cacheLife, cacheTag } from 'next/cache'
import { Doc, DocCategory, DocCategoryGroup, DocMeta, Heading } from '@/types/docs'

const DOCS_DIR = path.join(process.cwd(), 'src', 'docs')

const SUPPORTED_LOCALES = ['en', 'zh', 'ja'] as const
type Locale = (typeof SUPPORTED_LOCALES)[number]

const CATEGORY_ORDER: DocCategory[] = ['guides', 'challenges', 'reference']

function isValidLocale(locale: string): locale is Locale {
  return SUPPORTED_LOCALES.includes(locale as Locale)
}

function getDocFilesByLocale(locale: Locale): string[] {
  const localeDir = path.join(DOCS_DIR, locale)
  if (!fs.existsSync(localeDir)) {
    return []
  }

  const files: string[] = []
  const categories = fs.readdirSync(localeDir)

  for (const category of categories) {
    const categoryDir = path.join(localeDir, category)
    if (fs.statSync(categoryDir).isDirectory()) {
      const categoryFiles = fs.readdirSync(categoryDir)
        .filter(f => f.endsWith('.mdx') || f.endsWith('.md'))
        .map(f => path.join(categoryDir, f))
      files.push(...categoryFiles)
    }
  }

  return files
}

function parseDocSlug(filePath: string, locale: Locale): { slug: string; category: DocCategory } | null {
  const relativePath = path.relative(path.join(DOCS_DIR, locale), filePath)
  const parts = relativePath.split(path.sep)

  if (parts.length < 2) return null

  const category = parts[0] as DocCategory
  if (!CATEGORY_ORDER.includes(category)) return null

  const slug = path.basename(filePath, path.extname(filePath))

  return { slug, category }
}

function getDocMetadata(filePath: string, locale: Locale): DocMeta | null {
  try {
    const parsed = parseDocSlug(filePath, locale)
    if (!parsed) return null

    const fileContent = fs.readFileSync(filePath, 'utf-8')

    const exportMatch = fileContent.match(/export\s+const\s+metadata\s*=\s*\{([\s\S]+?)\}/)
    if (!exportMatch) {
      return {
        slug: parsed.slug,
        title: parsed.slug,
        summary: '',
        category: parsed.category,
        readTime: 5,
        updatedAt: new Date().toISOString().split('T')[0],
        order: 999,
      }
    }

    const metadataStr = exportMatch[1]
    const titleMatch = metadataStr.match(/title:\s*['"]([^'"]+)['"]/)
    const summaryMatch = metadataStr.match(/summary:\s*['"]([^'"]+)['"]/)
    const readTimeMatch = metadataStr.match(/readTime:\s*(\d+)/)
    const updatedAtMatch = metadataStr.match(/updatedAt:\s*['"]([^'"]+)['"]/)
    const orderMatch = metadataStr.match(/order:\s*(\d+)/)

    return {
      slug: parsed.slug,
      title: titleMatch ? titleMatch[1] : parsed.slug,
      summary: summaryMatch ? summaryMatch[1] : '',
      category: parsed.category,
      readTime: readTimeMatch ? parseInt(readTimeMatch[1]) : 5,
      updatedAt: updatedAtMatch ? updatedAtMatch[1] : new Date().toISOString().split('T')[0],
      order: orderMatch ? parseInt(orderMatch[1]) : 999,
    }
  } catch {
    return null
  }
}

function extractHeadingsFromFile(filePath: string): Heading[] {
  const headings: Heading[] = []
  const seenIds = new Map<string, number>()
  const fileContent = fs.readFileSync(filePath, 'utf-8')
  const lines = fileContent.split('\n')

  for (const line of lines) {
    const h2Match = line.match(/^##\s+(.+)$/)
    if (h2Match) {
      const text = h2Match[1]
      let id = text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
      
      if (seenIds.has(id)) {
        const count = seenIds.get(id)! + 1
        seenIds.set(id, count)
        id = `${id}-${count}`
      } else {
        seenIds.set(id, 1)
      }
      
      headings.push({
        id,
        text,
        level: 2,
      })
    }

    const h3Match = line.match(/^###\s+(.+)$/)
    if (h3Match) {
      const text = h3Match[1]
      let id = text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
      
      if (seenIds.has(id)) {
        const count = seenIds.get(id)! + 1
        seenIds.set(id, count)
        id = `${id}-${count}`
      } else {
        seenIds.set(id, 1)
      }
      
      headings.push({
        id,
        text,
        level: 3,
      })
    }
  }

  return headings
}

export async function getAllDocs(locale: string): Promise<DocMeta[]> {
  'use cache'
  cacheLife('hours')
  cacheTag(`docs-list-${locale}`)

  if (!isValidLocale(locale)) {
    return []
  }

  const files = getDocFilesByLocale(locale)
  const docs: DocMeta[] = []

  for (const file of files) {
    const meta = getDocMetadata(file, locale)
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

export async function getDocBySlug(locale: string, slug: string): Promise<Doc | null> {
  'use cache'
  cacheTag(`docs-list-${locale}`, `doc-${locale}-${slug}`)
  cacheLife('hours')

  if (!isValidLocale(locale)) {
    return null
  }

  const allDocs = await getAllDocs(locale)
  const docMeta = allDocs.find(d => d.slug === slug)

  if (!docMeta) return null

  const localeDir = path.join(DOCS_DIR, locale)
  const filePath = path.join(localeDir, docMeta.category, `${slug}.mdx`)

  if (!fs.existsSync(filePath)) {
    const mdFilePath = path.join(localeDir, docMeta.category, `${slug}.md`)
    if (!fs.existsSync(mdFilePath)) return null
  }

  const headings = extractHeadingsFromFile(filePath)

  const currentIndex = allDocs.findIndex(d => d.slug === slug)
  const prev = currentIndex > 0 ? allDocs[currentIndex - 1] : undefined
  const next = currentIndex < allDocs.length - 1 ? allDocs[currentIndex + 1] : undefined

  return {
    ...docMeta,
    content: filePath,
    headings,
    prev,
    next,
  }
}

export async function getDocCategories(locale: string): Promise<DocCategoryGroup[]> {
  'use cache'
  cacheTag(`docs-categories-${locale}`)
  cacheLife('hours')

  if (!isValidLocale(locale)) {
    return []
  }

  const allDocs = await getAllDocs(locale)
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

export async function searchDocs(locale: string, query: string): Promise<DocMeta[]> {
  'use cache'
  cacheTag(`docs-search-${locale}`, `search-${locale}-${query}`)
  cacheLife('minutes')

  if (!isValidLocale(locale)) {
    return []
  }

  if (!query.trim()) {
    return getAllDocs(locale)
  }

  const allDocs = await getAllDocs(locale)
  const lowerQuery = query.toLowerCase()

  return allDocs.filter(doc =>
    doc.title.toLowerCase().includes(lowerQuery) ||
    doc.summary.toLowerCase().includes(lowerQuery) ||
    doc.slug.toLowerCase().includes(lowerQuery)
  )
}
