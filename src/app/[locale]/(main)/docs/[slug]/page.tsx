import { notFound } from 'next/navigation'
import { getDocBySlug, getDocCategories } from '@/lib/docs'
import DocsLayout from '@/components/docs/DocsLayout'
import DocContent from '@/components/docs/DocContent'

interface DocsSlugPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function DocsSlugPage({ params }: DocsSlugPageProps) {
  const { slug } = await params
  const [doc, categories] = await Promise.all([
    getDocBySlug(slug),
    getDocCategories()
  ])

  if (!doc) {
    notFound()
  }

  return (
    <DocsLayout
      categories={categories}
      currentSlug={doc.slug}
      headings={doc.headings}
      prevDoc={doc.prev}
      nextDoc={doc.next}
    >
      <DocContent doc={doc} />
    </DocsLayout>
  )
}

export async function generateStaticParams() {
  const categories = await getDocCategories()
  const slugs: string[] = []

  for (const group of categories) {
    for (const doc of group.docs) {
      slugs.push(doc.slug)
    }
  }

  return slugs.map(slug => ({ slug }))
}
