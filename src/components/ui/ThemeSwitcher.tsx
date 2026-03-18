'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { THEME_COLORS, applyThemeColor, getStoredThemeColor, type ThemeColorId } from '@/lib/theme'

export function ThemeSwitcher() {
  const [open, setOpen] = useState(false)
  const [current, setCurrent] = useState<ThemeColorId>('phosphor')
  const [mounted, setMounted] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
    setCurrent(getStoredThemeColor())
  }, [])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSelect = (id: ThemeColorId) => {
    applyThemeColor(id)
    setCurrent(id)
    setOpen(false)
  }

  if (!mounted) {
    return (
      <div style={{ marginTop: '12px' }}>
        <div style={{ color: 'var(--primary)', fontSize: 12, fontWeight: 700 }}>
          {'> theme.config'}
        </div>
        <div style={{ fontSize: 11, marginTop: 2, color: 'var(--muted-foreground)' }}>
          {'  '}<span>●</span>{' '}PHOSPHOR
        </div>
      </div>
    )
  }

  const currentTheme = THEME_COLORS.find(t => t.id === current)!

  return (
    <div ref={ref} style={{ position: 'relative', marginTop: '12px' }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
          textAlign: 'left',
          fontFamily: 'var(--font-jetbrains), JetBrains Mono, monospace',
        }}
      >
        <div style={{ color: 'var(--primary)', fontSize: 12, fontWeight: 700 }}>
          {'> theme.config'}
        </div>
        <div style={{ fontSize: 11, marginTop: 2, color: 'var(--muted-foreground)' }}>
          {'  '}
          <span style={{ color: currentTheme.dot }}>●</span>
          {' '}
          {currentTheme.name}
        </div>
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            bottom: 'calc(100% + 8px)',
            left: 0,
            width: 280,
            zIndex: 200,
            border: '1px solid var(--border)',
            background: 'var(--card)',
            fontFamily: 'var(--font-jetbrains), JetBrains Mono, monospace',
            animation: 'themePopIn 150ms ease-out',
          }}
        >
          <div style={{
            background: 'var(--primary)',
            color: 'var(--primary-foreground)',
            padding: '5px 12px',
            fontSize: 10,
            fontWeight: 700,
          }}>
            +─── THEME.CONFIG ───+
          </div>

          <div style={{ padding: '12px 16px' }}>
            <div style={{ color: 'var(--muted-foreground)', fontSize: 10, marginBottom: 10 }}>
              Select color scheme:
            </div>

            {THEME_COLORS.map(theme => {
              const isActive = theme.id === current

              return (
                <button
                  key={theme.id}
                  onClick={() => handleSelect(theme.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    width: '100%',
                    padding: '6px 8px',
                    cursor: 'pointer',
                    background: isActive
                      ? 'color-mix(in srgb, var(--primary) 10%, transparent)'
                      : 'transparent',
                    border: 'none',
                    textAlign: 'left',
                    fontFamily: 'var(--font-jetbrains), JetBrains Mono, monospace',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--muted)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = isActive
                      ? 'color-mix(in srgb, var(--primary) 10%, transparent)'
                      : 'transparent'
                  }}
                >
                  <span style={{
                    display: 'inline-block',
                    width: 8,
                    height: 8,
                    background: theme.dot,
                    flexShrink: 0,
                    animation: isActive ? 'blink 1s step-end infinite' : 'none',
                  }} />

                  <span style={{
                    color: 'var(--foreground)',
                    fontSize: 12,
                    fontWeight: 700,
                    flex: 1,
                  }}>
                    {theme.name}
                  </span>

                  <span style={{
                    color: 'var(--muted-foreground)',
                    fontSize: 10,
                    fontStyle: 'italic',
                  }}>
                    {'// ' + theme.comment}
                  </span>
                </button>
              )
            })}

            <button
              onClick={() => setOpen(false)}
              style={{
                width: '100%',
                marginTop: 10,
                paddingTop: 10,
                borderTop: '1px dashed var(--border)',
                background: 'transparent',
                border: 'none',
                borderTopWidth: '1px',
                borderTopStyle: 'dashed',
                borderTopColor: 'var(--border)',
                color: 'var(--muted-foreground)',
                fontSize: 10,
                cursor: 'pointer',
                fontFamily: 'var(--font-jetbrains), JetBrains Mono, monospace',
                textAlign: 'center',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--primary)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--muted-foreground)'
              }}
            >
              [ CLOSE ]
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
