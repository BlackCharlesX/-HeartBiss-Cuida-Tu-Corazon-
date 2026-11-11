import fs from 'fs'
import path from 'path'
import { sequelize } from '../src/config/database.js'
import AppRelease from '../src/models/AppRelease.js'

async function registerApk() {
  try {
    const apkPath = process.argv[2] || 'public/uploads/apk/jovenes-con-salud-latest.apk'
    const version = process.argv[3] || '2.0.0'
    const fullPath = path.resolve(apkPath)

    if (!fs.existsSync(fullPath)) {
      console.error('❌ Archivo APK no encontrado en:', fullPath)
      process.exit(1)
    }

    const stats = fs.statSync(fullPath)
    await sequelize.authenticate()
    await sequelize.sync()

    await AppRelease.update({ isActive: false }, { where: {} })
    await AppRelease.create({
      version,
      fileName: `jovenes-con-salud-v${version}.apk`,
      filePath: apkPath,
      fileSize: stats.size,
      mimeType: 'application/vnd.android.package-archive',
      releaseNotes: 'Versión oficial compilada y desplegada automáticamente desde GitHub.',
      isActive: true,
      downloadCount: 0,
    })

    console.log(`✅ APK v${version} (${(stats.size / (1024 * 1024)).toFixed(2)} MB) registrado y activado correctamente.`)
    process.exit(0)
  } catch (err) {
    console.error('❌ Error registrando APK:', err.message)
    process.exit(1)
  }
}

registerApk()
