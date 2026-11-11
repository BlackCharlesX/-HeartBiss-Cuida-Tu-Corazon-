import { Sequelize } from 'sequelize'
import dotenv from 'dotenv'

dotenv.config()

// Database configuration
// Supports DATABASE_URL (Neon, Supabase, Cloud SQL TCP) and individual env vars (local or Cloud SQL Unix Socket)
const dbHost = process.env.INSTANCE_UNIX_SOCKET || process.env.DB_HOST || 'localhost'
const isUnixSocket = dbHost.startsWith('/cloudsql/')
const useSsl = !isUnixSocket && (
  process.env.DB_SSL === 'true' ||
  (Boolean(process.env.DATABASE_URL) && process.env.DB_SSL !== 'false' && !process.env.DATABASE_URL.includes('localhost'))
)

const sequelize = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
      dialectOptions: {
        ssl: useSsl ? {
          require: true,
          rejectUnauthorized: false,
        } : false,
      },
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
    })
  : new Sequelize(
      process.env.DB_NAME || 'jovenes_con_salud_dev',
      process.env.DB_USER || 'postgres',
      process.env.DB_PASSWORD || 'postgres',
      {
        host: dbHost,
        port: isUnixSocket ? undefined : (process.env.DB_PORT || 5432),
        dialect: 'postgres',
        logging: process.env.NODE_ENV === 'development' ? console.log : false,
        dialectOptions: {
          ...(isUnixSocket ? { socketPath: dbHost } : {}),
          ...(useSsl ? {
            ssl: {
              require: true,
              rejectUnauthorized: false,
            },
          } : {}),
        },
        pool: {
          max: 5,
          min: 0,
          acquire: 30000,
          idle: 10000,
        },
      }
    )

export { sequelize }
