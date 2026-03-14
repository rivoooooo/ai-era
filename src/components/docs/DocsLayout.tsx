'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { DocCategoryGroup, DocMeta, Heading } from '@/types/docs'

interface DocsLayoutProps {
  children: React.ReactNode
  categories: DocCategoryGroup[]
  currentSlug?: string
  headings?: Heading[]
  prevDoc?: DocMeta
  nextDoc?: DocMeta
}

export default function DocsLayout({
  children,
  categories,
  currentSlug,
  headings = [],
  prevDoc,
  nextDoc,
}: DocsLayoutProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false)
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(categories.map(c => c.slug))
  )
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeHeadingId, setActiveHeadingId] = useState<string>('')
  const searchInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const pathname = usePathname()

  const allDocs = categories.flatMap(c => c.docs)
  const filteredDocs = searchQuery
    ? allDocs.filter(
        doc =>
          doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doc.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doc.slug.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allDocs

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isInputFocused =
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'

      if (e.key === '/' && !isInputFocused) {
        e.preventDefault()
        setIsSearchOpen(true)
      }

      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsSearchOpen(prev => !prev)
      }

      if (e.key === 'Escape') {
        setIsSearchOpen(false)
        setIsShortcutsOpen(false)
        setIsMobileMenuOpen(false)
      }

      if (e.key === '?' && !isInputFocused) {
        setIsShortcutsOpen(prev => !prev)
      }

      if (e.key === '[' && !isInputFocused && prevDoc) {
        router.push(`/docs/${prevDoc.slug}`)
      }

      if (e.key === ']' && !isInputFocused && nextDoc) {
        router.push(`/docs/${nextDoc.slug}`)
      }

      if (e.key === 'g' && !isInputFocused) {
        const now = Date.now()
        const lastG = (window as unknown as { _lastG?: number })._lastG || 0
        ;(window as unknown as { _lastG?: number })._lastG = now
        if (now - lastG < 500) {
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }
      }

      if (e.key === 'G' && !isInputFocused) {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
      }

      if (isSearchOpen && !isInputFocused) {
        if (e.key === 'ArrowDown') {
          e.preventDefault()
          setSelectedIndex(prev => Math.min(prev + 1, filteredDocs.length - 1))
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault()
          setSelectedIndex(prev => Math.max(prev - 1, 0))
        }
        if (e.key === 'Enter' && filteredDocs[selectedIndex]) {
          router.push(`/docs/${filteredDocs[selectedIndex].slug}`)
          setIsSearchOpen(false)
          setSearchQuery('')
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isSearchOpen, filteredDocs, selectedIndex, prevDoc, nextDoc, router])

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isSearchOpen])

  useEffect(() => {
    setSelectedIndex(0)
  }, [searchQuery])

  useEffect(() => {
    if (headings.length === 0) return

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveHeadingId(entry.target.id)
          }
        })
      },
      { rootMargin: '-80px 0px -80% 0px' }
    )

    headings.forEach(h => {
      const element = document.getElementById(h.id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [headings])

  const toggleCategory = (slug: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev)
      if (next.has(slug)) {
        next.delete(slug)
      } else {
        next.add(slug)
      }
      return next
    })
  }

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const groupedFilteredDocs = searchQuery
    ? categories.map(cat => ({
        ...cat,
        docs: cat.docs.filter(
          doc =>
            doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doc.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doc.slug.toLowerCase().includes(searchQuery.toLowerCase())
        ),
      })).filter(cat => cat.docs.length > 0)
    : categories

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed top-4 right-4 z-40 md:hidden">
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="flex items-center gap-2 px-3 py-2 bg-card border border-border text-sm font-mono"
        >
          DOCS <span className="text-xs">▼</span>
        </button>
      </div>

      <div className="max-w-7xl mx-auto flex">
        <aside className="hidden md:block w-[260px] shrink-0 border-r border-border sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="py-5">
            <div className="bg-primary text-primary-foreground px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider">
              ─── DOCS ───
            </div>
            <div className="px-4 py-3 text-primary text-xs font-bold font-mono">
              {'>'} tree ./docs/
            </div>
            <div className="px-4 text-[11px] text-muted-foreground font-mono mb-2">
              ./docs/
            </div>

            {categories.map(category => (
              <div key={category.slug} className="mb-1">
                <button
                  onClick={() => toggleCategory(category.slug)}
                  className="w-full flex items-center gap-1 px-4 py-1 text-left hover:bg-muted/30 transition-colors"
                >
                  <span className="text-xs text-secondary mr-1">
                    {expandedCategories.has(category.slug) ? '▼' : '▶'}
                  </span>
                  <span className="text-[12px] text-primary font-bold uppercase">
                    {category.name}/
                  </span>
                  {!expandedCategories.has(category.slug) && (
                    <span className="text-[10px] text-muted-foreground">
                      [{category.docs.length}]
                    </span>
                  )}
                </button>

                {expandedCategories.has(category.slug) && (
                  <div className="ml-2">
                    {category.docs.map((doc, idx) => (
                      <Link
                        key={doc.slug}
                        href={`/docs/${doc.slug}`}
                        className={`flex items-center gap-1 px-4 py-1 text-[12px] font-mono transition-colors border-l-2 ${
                          currentSlug === doc.slug
                            ? 'border-l-primary text-foreground bg-primary/8 font-bold'
                            : 'border-l-transparent text-muted-foreground hover:text-foreground hover:bg-muted/20'
                        }`}
                      >
                        <span className="text-border w-3 text-xs">
                          {idx === category.docs.length - 1 ? '└' : '│'}
                        </span>
                        <span className="text-border mx-0.5">
                          {idx === category.docs.length - 1 ? '──' : '├─'}
                        </span>
                        {doc.slug}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="border-t border-dashed border-border px-4 py-3 text-[10px] text-muted-foreground italic">
            Press / to search
          </div>
        </aside>

        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div
              className="absolute inset-0 bg-background/85 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <div className="absolute left-0 top-0 bottom-0 w-[280px] bg-background border-r border-border overflow-y-auto animate-in slide-in-from-left">
              <div className="flex justify-between items-center p-4 border-b border-border">
                <span className="text-xs font-bold uppercase">DOCS</span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-lg"
                >
                  ×
                </button>
              </div>
              <div className="py-4">
                {categories.map(category => (
                  <div key={category.slug} className="mb-1">
                    <button
                      onClick={() => toggleCategory(category.slug)}
                      className="w-full flex items-center gap-1 px-4 py-1 text-left hover:bg-muted/30"
                    >
                      <span className="text-xs text-secondary">
                        {expandedCategories.has(category.slug) ? '▼' : '▶'}
                      </span>
                      <span className="text-xs text-primary font-bold uppercase">
                        {category.name}/
                      </span>
                    </button>
                    {expandedCategories.has(category.slug) && (
                      <div className="ml-2">
                        {category.docs.map((doc, idx) => (
                          <Link
                            key={doc.slug}
                            href={`/docs/${doc.slug}`}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`flex items-center gap-1 px-4 py-1 text-xs font-mono ${
                              currentSlug === doc.slug
                                ? 'text-foreground font-bold'
                                : 'text-muted-foreground'
                            }`}
                          >
                            <span className="text-border">
                              {idx === category.docs.length - 1 ? '└' : '│'}
                            </span>
                            <span className="text-border mx-0.5">
                              {idx === category.docs.length - 1 ? '──' : '├─'}
                            </span>
                            {doc.slug}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <main className="flex-1 min-w-0 px-6 py-8 md:px-12">
          {children}
        </main>

        <aside className="hidden lg:block w-[200px] shrink-0 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto pl-4 border-l border-border">
          <div className="py-5">
            <div className="bg-primary text-primary-foreground px-3 py-1 text-[10px] font-bold uppercase tracking-wider mb-4">
              ── ON THIS PAGE ──
            </div>

            {headings.length > 0 ? (
              <>
                {headings.map(heading => (
                  <button
                    key={heading.id}
                    onClick={() => scrollToHeading(heading.id)}
                    className={`block w-full text-left py-1 px-2 text-xs font-mono transition-colors ${
                      heading.level === 3 ? 'pl-5' : ''
                    } ${
                      activeHeadingId === heading.id
                        ? 'text-primary font-bold border-l-2 border-primary pl-1'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {heading.text}
                  </button>
                ))}
              </>
            ) : (
              <p className="text-xs text-muted-foreground px-2">No headings</p>
            )}

            <div className="border-t border-dashed border-border mt-4 pt-3 px-2">
              <div className="flex gap-2">
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="text-[10px] text-muted-foreground hover:text-foreground border border-border px-2 py-1"
                >
                  gg top
                </button>
                <button
                  onClick={() =>
                    window.scrollTo({
                      top: document.body.scrollHeight,
                      behavior: 'smooth',
                    })
                  }
                  className="text-[10px] text-muted-foreground hover:text-foreground border border-border px-2 py-1"
                >
                  G bottom
                </button>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {isSearchOpen && (
        <div className="fixed inset-0 z-[500] bg-background/85 backdrop-blur-sm flex items-start justify-center pt-[15vh]">
          <div className="w-[90%] max-w-[600px] max-h-[70vh] bg-card border border-border font-mono animate-in fade-in slide-in-from-top-3">
            <div className="border-b border-border p-4">
              <div className="flex items-center gap-2 text-primary text-sm font-bold">
                <span className="text-secondary">{'>'}</span> find ./docs/ -name &quot;_
                <span className="animate-pulse">|</span>
              </div>
            </div>

            <div className="p-2">
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search docs..."
                className="w-full bg-transparent border-none outline-none text-sm px-2 py-1 font-mono placeholder:text-muted-foreground"
              />
            </div>

            <div className="border-t border-border max-h-[50vh] overflow-y-auto">
              {groupedFilteredDocs.map(group => (
                <div key={group.slug}>
                  <div className="px-4 py-2 text-[10px] text-muted-foreground uppercase border-b border-border/50">
                    {group.name}
                  </div>
                  {group.docs.map((doc, idx) => {
                    const globalIdx = allDocs.findIndex(d => d.slug === doc.slug)
                    return (
                      <Link
                        key={doc.slug}
                        href={`/docs/${doc.slug}`}
                        onClick={() => {
                          setIsSearchOpen(false)
                          setSearchQuery('')
                        }}
                        className={`flex items-center gap-2 px-4 py-2 text-sm transition-colors ${
                          globalIdx === selectedIndex
                            ? 'bg-primary/10 border-l-2 border-primary'
                            : 'hover:bg-muted/20'
                        }`}
                      >
                        <span
                          className={`text-xs ${
                            globalIdx === selectedIndex
                              ? 'text-primary'
                              : 'text-muted-foreground'
                          }`}
                        >
                          ●
                        </span>
                        <span className="text-foreground">{doc.title}</span>
                        <span className="text-muted-foreground text-xs ml-auto">
                          {doc.summary}
                        </span>
                      </Link>
                    )
                  })}
                </div>
              ))}

              {filteredDocs.length === 0 && (
                <div className="p-4 text-center text-muted-foreground text-sm">
                  No results found
                </div>
              )}
            </div>

            <div className="border-t border-border px-4 py-2 text-[10px] text-muted-foreground flex gap-4">
              <span>↑↓ navigate</span>
              <span>Enter open</span>
              <span>Esc close</span>
            </div>
          </div>
        </div>
      )}

      {isShortcutsOpen && (
        <div className="fixed inset-0 z-[500] bg-background/85 backdrop-blur-sm flex items-center justify-center">
          <div className="w-[90%] max-w-[500px] bg-card border border-border font-mono p-6 animate-in fade-in zoom-in-95">
            <div className="bg-primary text-primary-foreground px-3 py-1 text-[10px] font-bold uppercase tracking-wider mb-4 inline-block">
              ─── KEYBOARD SHORTCUTS ───
            </div>

            <div className="space-y-4">
              <div>
                <div className="text-[10px] text-muted-foreground uppercase mb-2">
                  SEARCH & NAVIGATION
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">/ Cmd+K</span>
                    <span>open search</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">↑ ↓</span>
                    <span>navigate results</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Enter</span>
                    <span>open selected</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Esc</span>
                    <span>close / back</span>
                  </div>
                </div>
              </div>

              <div>
                <div className="text-[10px] text-muted-foreground uppercase mb-2">
                  READING
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">[</span>
                    <span>previous document</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">]</span>
                    <span>next document</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">g g</span>
                    <span>scroll to top</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">G</span>
                    <span>scroll to bottom</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 text-center text-[10px] text-muted-foreground">
                press ? or Esc to close
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
