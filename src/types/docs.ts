export type DocCategory = 'guides' | 'challenges' | 'reference'

export interface DocMeta {
  slug: string
  title: string
  summary: string
  category: DocCategory
  readTime: number
  updatedAt: string
  order: number
}

export interface Heading {
  id: string
  text: string
  level: 2 | 3
}

export interface Doc extends DocMeta {
  content: string
  headings: Heading[]
  prev?: DocMeta
  next?: DocMeta
}

export interface DocCategoryGroup {
  name: string
  slug: DocCategory
  docs: DocMeta[]
}
