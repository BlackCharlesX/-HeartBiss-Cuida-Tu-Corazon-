import { DataTypes } from 'sequelize'
import { sequelize } from '../config/database.js'

export const DEFAULT_THEMES = [
  {
    key: 'principal',
    name: 'Principal',
    description: 'Diseño cálido natural HeartBliss — Crema suave (#F8F4EB), Cacao profundo (#3A241F), Dorado miel (#C89953) y Verde hoja (#5A7B43).',
    preset: 'principal',
    swatches: ['#F8F4EB', '#7A433A', '#C89953', '#5A7B43', '#1F1210'],
    customVariables: null,
    isProtected: true,
    isActive: true,
    sortOrder: 1,
  },
  {
    key: 'orion',
    name: 'Orion N5',
    description: 'Sistema táctico aeroespacial HUD (Nova Dynamics / ID350) — Verde salvia técnico (#C9D6CA / #88A28E), Naranja aeroespacial (#FF5A1F) y Carbón (#1A1A1A).',
    preset: 'orion',
    swatches: ['#C9D6CA', '#FF5A1F', '#88A28E', '#1A1A1A'],
    customVariables: null,
    isProtected: false,
    isActive: true,
    sortOrder: 2,
  },
]

const PlatformTheme = sequelize.define('PlatformTheme', {
  key: {
    type: DataTypes.STRING(100),
    primaryKey: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING(150),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  preset: {
    type: DataTypes.STRING(80),
    defaultValue: 'custom', // 'principal' | 'orion' | 'custom'
  },
  swatches: {
    type: DataTypes.JSONB,
    defaultValue: ['#F8F4EB', '#7A433A', '#C89953', '#5A7B43'],
  },
  customVariables: {
    type: DataTypes.JSONB,
    allowNull: true,
  },
  isProtected: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  sortOrder: {
    type: DataTypes.INTEGER,
    defaultValue: 10,
  },
}, {
  tableName: 'platform_themes',
  timestamps: true,
  underscored: true,
})

export async function ensureDefaultThemes() {
  try {
    const count = await PlatformTheme.count()
    if (count === 0) {
      for (const theme of DEFAULT_THEMES) {
        await PlatformTheme.create(theme)
      }
    } else {
      // Ensure 'principal' always exists
      const principal = await PlatformTheme.findByPk('principal')
      if (!principal) {
        await PlatformTheme.create(DEFAULT_THEMES[0])
      }
    }
  } catch (err) {
    console.warn('Could not ensure default platform themes:', err.message)
  }
}

export default PlatformTheme
