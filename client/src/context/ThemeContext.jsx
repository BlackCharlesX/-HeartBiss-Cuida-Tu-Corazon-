import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import api from '../services/api'

const ThemeContext = createContext(null)

export const DEFAULT_PLATFORM_THEMES = [
  {
    key: 'principal',
    name: 'Principal',
    description: 'Diseño cálido natural HeartBliss — Crema suave (#F8F4EB), Cacao profundo (#3A241F), Dorado miel (#C89953) y Verde hoja (#5A7B43).',
    preset: 'principal',
    swatches: ['#F8F4EB', '#7A433A', '#C89953', '#5A7B43', '#1F1210'],
    colors: ['#7A433A', '#C89953', '#5A7B43'],
    customVariables: null,
    isProtected: true,
    isDefault: true,
    isActive: true,
    sortOrder: 1,
  },
  {
    key: 'orion',
    name: 'Orion N5',
    description: 'Sistema táctico aeroespacial HUD (Nova Dynamics / ID350) — Verde salvia técnico (#C9D6CA / #88A28E), Naranja aeroespacial (#FF5A1F) y Carbón (#1A1A1A).',
    preset: 'orion',
    swatches: ['#C9D6CA', '#FF5A1F', '#88A28E', '#1A1A1A'],
    colors: ['#FF5A1F', '#88A28E', '#1A1A1A'],
    customVariables: null,
    isProtected: false,
    isDefault: false,
    isActive: true,
    sortOrder: 2,
  },
  {
    key: 'yakusa',
    name: 'Yakusa',
    description: 'Tema Sakura / Japonés (Sakura de Día & Yozakura de Noche) — Rosa cerezo (#D14D6B / #FF3D73), Crema sakura (#FFF3F3 / #FAD5D5), Ciruela nocturno (#1D1120 / #2D1A33) y Dorado japonés (#EAA05E / #F8B14B).',
    preset: 'yakusa',
    swatches: ['#D14D6B', '#FAD5D5', '#3C1C22', '#FF3D73', '#1D1120', '#F8B14B'],
    colors: ['#D14D6B', '#FAD5D5', '#3C1C22'],
    customVariables: null,
    isProtected: false,
    isDefault: false,
    isActive: true,
    sortOrder: 3,
  },
]

const STORAGE_THEMES_LIST_KEY = 'jcs_platform_themes_list'
const STORAGE_ACTIVE_THEME_KEY = 'jcs_active_theme'
const STORAGE_YAKUSA_SEEDED_KEY = 'jcs_yakusa_theme_seeded_v1'

export function ThemeProvider({ children }) {
  // 1. Dark Mode state
  const [dark, setDark] = useState(() => {
    try {
      return localStorage.getItem('jcs_dark_mode') === 'true'
    } catch {
      return false
    }
  })

  // 2. Available Themes list (persisted in DB + cached in localStorage)
  const [themes, setThemes] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_THEMES_LIST_KEY)
      const yakusaSeeded = localStorage.getItem(STORAGE_YAKUSA_SEEDED_KEY) === 'true'
      if (saved) {
        let parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Ensure 'principal' is always present
          if (!parsed.some(t => t.key === 'principal')) {
            parsed = [DEFAULT_PLATFORM_THEMES[0], ...parsed]
          }
          // Auto-seed 'yakusa' once if upgrading from an earlier local cache
          if (!yakusaSeeded && !parsed.some(t => t.key === 'yakusa')) {
            const yakusaTheme = DEFAULT_PLATFORM_THEMES.find(t => t.key === 'yakusa')
            if (yakusaTheme) parsed = [...parsed, yakusaTheme]
            localStorage.setItem(STORAGE_YAKUSA_SEEDED_KEY, 'true')
            localStorage.setItem(STORAGE_THEMES_LIST_KEY, JSON.stringify(parsed))
          }
          return parsed
        }
      }
      localStorage.setItem(STORAGE_YAKUSA_SEEDED_KEY, 'true')
    } catch { /* ignore */ }
    return DEFAULT_PLATFORM_THEMES
  })

  // 3. Active Theme key ('principal', 'orion', etc.)
  const [activeTheme, setActiveTheme] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_ACTIVE_THEME_KEY) || 'principal'
    } catch {
      return 'principal'
    }
  })

  // Fetch themes from backend on mount
  const refreshThemes = useCallback(async () => {
    try {
      const res = await api.get('/settings/themes')
      if (res.data?.themes && Array.isArray(res.data.themes) && res.data.themes.length > 0) {
        setThemes(res.data.themes)
        try {
          localStorage.setItem(STORAGE_THEMES_LIST_KEY, JSON.stringify(res.data.themes))
        } catch { /* ignore */ }
      }
    } catch {
      // Fallback to localStorage / defaults silently
    }
  }, [])

  useEffect(() => {
    refreshThemes()
  }, [refreshThemes])

  // Ensure activeTheme exists in themes list; if deleted, fallback to 'principal'
  useEffect(() => {
    if (!themes.some(t => t.key === activeTheme)) {
      setActiveTheme('principal')
      try {
        localStorage.setItem(STORAGE_ACTIVE_THEME_KEY, 'principal')
      } catch { /* ignore */ }
    }
  }, [themes, activeTheme])

  const activeThemeObj = themes.find(t => t.key === activeTheme) || themes[0] || DEFAULT_PLATFORM_THEMES[0]
  const activePreset = activeThemeObj?.preset || (activeTheme === 'orion' ? 'orion' : activeTheme === 'yakusa' ? 'yakusa' : 'principal')

  // Apply 'dark' class and 'data-theme' attribute on <html>
  useEffect(() => {
    const root = document.documentElement
    if (dark) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    try {
      localStorage.setItem('jcs_dark_mode', String(dark))
    } catch { /* ignore */ }
  }, [dark])

  useEffect(() => {
    const root = document.documentElement
    root.setAttribute('data-theme', activePreset)
    root.setAttribute('data-theme-key', activeTheme)

    // Remove previous custom inline variables if any
    const customVarKeys = [
      '--color-surface-50',
      '--color-surface-100',
      '--color-surface-200',
      '--color-surface-900',
      '--color-primary-500',
      '--color-accent-500',
      '--color-secondary-500',
      '--color-health-pill',
      '--color-admin-pill',
    ]
    customVarKeys.forEach(k => root.style.removeProperty(k))

    // Apply custom variables if this is a custom theme with overrides
    if (activeThemeObj?.customVariables) {
      const modeVars = dark
        ? (activeThemeObj.customVariables.dark || activeThemeObj.customVariables)
        : (activeThemeObj.customVariables.light || activeThemeObj.customVariables)
      if (modeVars && typeof modeVars === 'object') {
        Object.entries(modeVars).forEach(([k, v]) => {
          if (typeof v === 'string' && k.startsWith('--')) {
            root.style.setProperty(k, v)
          }
        })
      }
    }

    try {
      localStorage.setItem(STORAGE_ACTIVE_THEME_KEY, activeTheme)
    } catch { /* ignore */ }
  }, [activeTheme, activePreset, activeThemeObj, dark])

  const toggleDark = useCallback(() => {
    setDark(d => {
      const nextDark = !d
      try {
        localStorage.setItem('jcs_dark_mode', String(nextDark))
      } catch (e) { /* ignore */ }

      const isTranslated = document.documentElement.classList.contains('translated-ltr') ||
                           document.documentElement.classList.contains('translated-rtl') ||
                           (document.cookie.includes('googtrans') && !document.cookie.includes('googtrans=/es/es') && !document.cookie.includes('googtrans=/es/'));

      if (isTranslated) {
        window.location.reload()
      }
      return nextDark
    })
  }, [])

  const selectTheme = useCallback((themeKey) => {
    setActiveTheme(themeKey)
    try {
      localStorage.setItem(STORAGE_ACTIVE_THEME_KEY, themeKey)
    } catch { /* ignore */ }
  }, [])

  // Local store helpers so AdminPanel updates reflect immediately even if offline
  const syncThemesLocally = useCallback((nextThemes) => {
    setThemes(nextThemes)
    try {
      localStorage.setItem(STORAGE_THEMES_LIST_KEY, JSON.stringify(nextThemes))
    } catch { /* ignore */ }
  }, [])

  return (
    <ThemeContext.Provider value={{
      dark,
      toggleDark,
      activeTheme,
      activePreset,
      activeThemeObj,
      themes,
      selectTheme,
      refreshThemes,
      syncThemesLocally,
    }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider')
  return ctx
}
