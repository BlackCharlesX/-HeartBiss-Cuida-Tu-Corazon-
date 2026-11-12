import { Router } from 'express'
import ModuleVisibility, { DEFAULT_MODULES, ensureDefaultModules } from '../models/ModuleVisibility.js'
import PlatformTheme, { DEFAULT_THEMES, ensureDefaultThemes } from '../models/PlatformTheme.js'

const router = Router()

// GET /api/settings/modules — public endpoint to get module visibility flags
router.get('/modules', async (_req, res, next) => {
  try {
    let rows = await ModuleVisibility.findAll({
      order: [['sortOrder', 'ASC'], ['key', 'ASC']]
    })

    if (rows.length === 0) {
      await ensureDefaultModules()
      rows = await ModuleVisibility.findAll({
        order: [['sortOrder', 'ASC'], ['key', 'ASC']]
      })
    }

    // Map into an easily accessible dictionary: { diseases: true, news: false, ... }
    const modulesMap = {}
    const list = []

    rows.forEach(r => {
      modulesMap[r.key] = r.isEnabled
      list.push({
        key: r.key,
        name: r.name,
        description: r.description,
        category: r.category,
        isEnabled: r.isEnabled,
        sortOrder: r.sortOrder,
      })
    })

    res.json({
      modules: modulesMap,
      list,
    })
  } catch (err) {
    // Return default enabled modules if DB is unavailable
    const fallbackMap = {}
    DEFAULT_MODULES.forEach(m => { fallbackMap[m.key] = m.isEnabled })
    res.json({
      modules: fallbackMap,
      list: DEFAULT_MODULES,
    })
  }
})

// GET /api/settings/themes — public endpoint to get active platform themes
router.get('/themes', async (_req, res) => {
  try {
    let rows = await PlatformTheme.findAll({
      where: { isActive: true },
      order: [['sortOrder', 'ASC'], ['createdAt', 'ASC']],
    })

    if (rows.length === 0) {
      await ensureDefaultThemes()
      rows = await PlatformTheme.findAll({
        where: { isActive: true },
        order: [['sortOrder', 'ASC'], ['createdAt', 'ASC']],
      })
    }

    res.json({ themes: rows })
  } catch (err) {
    res.json({ themes: DEFAULT_THEMES })
  }
})

export default router
