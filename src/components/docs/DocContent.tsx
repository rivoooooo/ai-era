'use client'

import { useEffect, useState, type ReactElement } from 'react'
import Link from 'next/link'
import { Doc, DocMeta } from '@/types/docs'

interface DocContentProps {
  doc: Doc
}

export default function DocContent({ doc }: DocContentProps) {
  const [renderedContent, setRenderedContent] = useState<ReactElement[]>([])

  useEffect(() => {
    const lines = doc.content.split('\n')
    const elements: ReactElement[] = []
    let inCodeBlock = false
    let codeContent: string[] = []
    let codeLanguage = ''
    let inList = false
    let listItems: string[] = []
    let listType: 'ul' | 'ol' | '' = ''

    const flushList = () => {
      if (listItems.length > 0) {
        if (listType === 'ul') {
          elements.push(
            <ul key={`ul-${elements.length}`} className="ul-docs">
              {listItems.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          )
        } else if (listType === 'ol') {
          elements.push(
            <ol key={`ol-${elements.length}`} className="ol-docs">
              {listItems.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ol>
          )
        }
        listItems = []
        listType = ''
        inList = false
      }
    }

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]

      if (line.startsWith('```')) {
        if (!inCodeBlock) {
          flushList()
          inCodeBlock = true
          codeLanguage = line.slice(3).trim() || 'text'
          codeContent = []
        } else {
          elements.push(
            <pre
              key={`code-${elements.length}`}
              data-lang={codeLanguage}
              className="code-block"
            >
              <code>{codeContent.join('\n')}</code>
            </pre>
          )
          inCodeBlock = false
        }
        continue
      }

      if (inCodeBlock) {
        codeContent.push(line)
        continue
      }

      if (line.match(/^(\d+\.|- |\* )/)) {
        const item = line.replace(/^(\d+\.|- |\* )/, '')
        if (!inList) {
          flushList()
          inList = true
          listType = line.match(/^\d+\./) ? 'ol' : 'ul'
        }
        listItems.push(item)
        continue
      } else if (inList) {
        flushList()
      }

      if (line.startsWith('---')) {
        elements.push(<hr key={`hr-${elements.length}`} className="hr-docs" />)
        continue
      }

      if (line.startsWith('# ')) {
        flushList()
        elements.push(
          <h1 key={`h1-${elements.length}`} id={line.slice(2).toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')}>
            {line.slice(2)}
          </h1>
        )
        continue
      }

      if (line.startsWith('## ')) {
        flushList()
        elements.push(
          <h2 key={`h2-${elements.length}`} id={line.slice(3).toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')}>
            {line.slice(3)}
          </h2>
        )
        continue
      }

      if (line.startsWith('### ')) {
        flushList()
        elements.push(
          <h3 key={`h3-${elements.length}`} id={line.slice(4).toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')}>
            {line.slice(4)}
          </h3>
        )
        continue
      }

      if (line.trim() === '') {
        flushList()
        continue
      }

      let processedLine = line
      processedLine = processedLine.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>')
      processedLine = processedLine.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      processedLine = processedLine.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="doc-link">$1</a>')

      flushList()
      elements.push(
        <p
          key={`p-${elements.length}`}
          dangerouslySetInnerHTML={{ __html: processedLine }}
        />
      )
    }

    flushList()
    setRenderedContent(elements)
  }, [doc.content])

  return (
    <div className="max-w-2xl mx-auto">
      <div className="doc-frontmatter">
        <span>category: {doc.category}</span>
        <span className="border-l border-border pl-4">read: {doc.readTime} min</span>
        <span className="border-l border-border pl-4">updated: {doc.updatedAt}</span>
      </div>

      <article className="doc-content">{renderedContent}</article>

      {(doc.prev || doc.next) && (
        <div className="doc-pagination">
          <hr className="border-t border-border mb-6" />
          <div className="flex justify-between gap-4">
            {doc.prev ? (
              <Link
                href={`/docs/${doc.prev.slug}`}
                className="pagination-card flex-1 group"
              >
                <span className="pagination-label">
                  ← PREV
                </span>
                <span className="pagination-title">{doc.prev.title}</span>
              </Link>
            ) : (
              <div className="flex-1" />
            )}

            {doc.next ? (
              <Link
                href={`/docs/${doc.next.slug}`}
                className="pagination-card flex-1 text-right group"
              >
                <span className="pagination-label">
                  NEXT →
                </span>
                <span className="pagination-title">{doc.next.title}</span>
              </Link>
            ) : (
              <div className="flex-1" />
            )}
          </div>
          <p className="text-center text-[11px] text-muted-foreground mt-3">
            Press [ for prev, ] for next
          </p>
        </div>
      )}
    </div>
  )
}
