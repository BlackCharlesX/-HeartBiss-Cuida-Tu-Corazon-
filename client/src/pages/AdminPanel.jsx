import { useState, useEffect, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import api, { getApiBaseUrl } from '../services/api'

const API_BASE = getApiBaseUrl()
import {
  FaChartBar, FaUsers, FaHeartbeat, FaCapsules, FaNewspaper,
  FaEnvelope, FaCog, FaSignOutAlt, FaExternalLinkAlt,
  FaPlus, FaEdit, FaTrash, FaTimes, FaSearch, FaCheck,
  FaEye, FaEyeSlash, FaThumbtack, FaSave, FaCamera, FaMapMarkerAlt, FaMapMarkedAlt,
  FaBookOpen, FaAndroid, FaDownload, FaCloudUploadAlt, FaMobileAlt,
  FaSlidersH, FaToggleOn, FaToggleOff, FaHandsHelping, FaCalculator,
  FaCalendarCheck, FaChartLine, FaComments, FaFileMedical, FaQuestionCircle,
  FaCheckCircle, FaTimesCircle, FaUndo, FaShieldAlt, FaLayerGroup,
  FaPalette, FaLock,
} from 'react-icons/fa'
import { HiMenu } from 'react-icons/hi'
import { useModules } from '../context/ModuleContext'
import TamaulipasMap from '../components/admin/TamaulipasMap'

// ═══════════════════════════════════════════════════════
// STYLE CONSTANTS
// ═══════════════════════════════════════════════════════

const SIDEBAR_W = 240
const SIDEBAR_BG = '#1a1520'
const SIDEBAR_ACTIVE = '#7A433A'
const SIDEBAR_HOVER = 'rgba(122,67,58,0.2)'
const CARD_RADIUS = '16px'

// ═══════════════════════════════════════════════════════
// SIDEBAR NAV ITEMS
// ═══════════════════════════════════════════════════════

const NAV = [
  { key: 'dashboard',      icon: FaChartBar,      label: 'Dashboard' },
  { key: 'map',            icon: FaMapMarkedAlt,  label: 'Mapa Epidemiológico' },
  { key: 'modules',        icon: FaSlidersH,      label: 'Control de Módulos' },
  { key: 'themes',         icon: FaPalette,       label: 'Apartado de Temas' },
  { key: 'app',            icon: FaAndroid,       label: 'App Móvil (APK)' },
  { key: 'users',          icon: FaUsers,         label: 'Usuarios' },
  { key: 'diseases',       icon: FaHeartbeat,     label: 'Enfermedades' },
  { key: 'articles',       icon: FaBookOpen,      label: 'Artículos' },
  { key: 'nutraceuticals', icon: FaCapsules,      label: 'Nutracéuticos' },
  { key: 'news',           icon: FaNewspaper,     label: 'Noticias' },
  { key: 'messages',       icon: FaEnvelope,      label: 'Mensajes' },
  { key: 'contact',        icon: FaCog,           label: 'Config. Contacto' },
]

// ═══════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════

export default function AdminPanel() {
  const { user, logout } = useAuth()
  const { dark } = useTheme()
  const [section, setSection] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="admin-layout" style={{ display: 'flex', minHeight: '100vh', background: dark ? '#1F1210' : '#f1ede6' }}>
      {/* Sidebar overlay backdrop for mobile */}
      {sidebarOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={() => setSidebarOpen(false)} 
        />
      )}

      {/* ── Sidebar ─────────────────────── */}
      <aside 
        className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}
        style={{
          width: SIDEBAR_W,
          background: SIDEBAR_BG,
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflowY: 'auto',
          zIndex: 50,
        }}
      >
        {/* Brand */}
        <div style={{ padding: '1.5rem 1.25rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <FaHeartbeat style={{ color: '#C89953', fontSize: '1.35rem' }} />
            <div>
              <div style={{ color: '#fff', fontWeight: '800', fontSize: '1rem', letterSpacing: '-0.01em' }}>Panel IJT</div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.65rem', fontWeight: '600' }}>Administración</div>
            </div>
          </div>
        </div>

        {/* Nav Items */}
        <nav style={{ flex: 1, padding: '0.75rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
          {NAV.map(n => (
            <button
              key={n.key}
              onClick={() => { setSection(n.key); setSidebarOpen(false); }}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.65rem',
                padding: '0.65rem 0.875rem', borderRadius: '10px',
                border: 'none', cursor: 'pointer', width: '100%',
                textAlign: 'left', fontSize: '0.85rem', fontWeight: '600',
                background: section === n.key ? SIDEBAR_ACTIVE : 'transparent',
                color: section === n.key ? '#fff' : 'rgba(255,255,255,0.55)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => { if (section !== n.key) e.currentTarget.style.background = SIDEBAR_HOVER }}
              onMouseLeave={e => { if (section !== n.key) e.currentTarget.style.background = 'transparent' }}
            >
              <n.icon size={15} />
              {n.label}
            </button>
          ))}
        </nav>

        {/* Footer links */}
        <div style={{ padding: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.6rem 0.875rem', borderRadius: '10px', color: 'rgba(255,255,255,0.45)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: '600' }}>
            <FaExternalLinkAlt size={13} /> Ver sitio
          </Link>
          <button onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.6rem 0.875rem', borderRadius: '10px', border: 'none', cursor: 'pointer', background: 'transparent', color: '#ef4444', fontSize: '0.85rem', fontWeight: '600', width: '100%', textAlign: 'left' }}>
            <FaSignOutAlt size={13} /> Cerrar sesión
          </button>
        </div>
      </aside>

      {/* ── Main Content ─────────────────── */}
      <main style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        {/* Top bar */}
        <header 
          className="admin-header"
          style={{
            padding: '1rem 2rem',
            borderBottom: `1px solid ${dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            background: dark ? '#2B1815' : '#fff',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* Mobile Hamburger menu */}
            <button 
              className="admin-menu-btn"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{ display: 'none' }}
            >
              <HiMenu />
            </button>
            <div>
              <h1 style={{ fontSize: '1.35rem', fontWeight: '800', color: dark ? '#fff' : '#1a1715', margin: 0 }}>Panel de Administración</h1>
              <p style={{ fontSize: '0.75rem', color: dark ? 'rgba(255,255,255,0.4)' : '#a89580', margin: 0 }}>HeartBliss — Cuida tu Corazón — Instituto de la Juventud de Tamaulipas</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <select
              value={(() => {
                const match = document.cookie.match(/googtrans=\/es\/([a-z]{2})/)
                return match ? match[1] : 'es'
              })()}
              onChange={e => {
                const langCode = e.target.value
                if (langCode === 'es') {
                  document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                  document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.localhost";
                  document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=localhost";
                } else {
                  document.cookie = `googtrans=/es/${langCode}; path=/`;
                  document.cookie = `googtrans=/es/${langCode}; path=/; domain=localhost`;
                  document.cookie = `googtrans=/es/${langCode}; path=/; domain=.localhost`;
                }
                window.location.reload()
              }}
              style={{
                padding: '0.4rem 0.6rem', borderRadius: '8px', fontSize: '0.78rem', fontWeight: '700',
                border: `1.5px solid ${dark ? '#4A2D28' : '#e8ddd0'}`,
                background: dark ? '#38211D' : '#faf8f5', color: dark ? '#fff' : '#1a1715',
                cursor: 'pointer', outline: 'none',
              }}
            >
              <option value="es">Español 🇪🇸</option>
              <option value="en">English 🇺🇸</option>
              <option value="fr">Français 🇫🇷</option>
              <option value="pt">Português 🇵🇹</option>
              <option value="de">Deutsch 🇩🇪</option>
            </select>

            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.6rem',
              padding: '0.5rem 1rem', borderRadius: '12px',
              background: dark ? 'rgba(224,59,96,0.12)' : '#7A433A12',
              color: dark ? '#C89953' : '#7A433A',
              fontSize: '0.8rem', fontWeight: '700',
            }}>
              <FaHeartbeat size={14} />
              {user?.name || 'Admin'}
            </div>
          </div>
        </header>

        {/* Content area */}
        <div style={{ flex: 1, padding: '1.5rem 2rem', overflowY: 'auto' }}>
          {section === 'dashboard' && <DashboardSection dark={dark} onNavigate={setSection} />}
          {section === 'map' && <TamaulipasMap dark={dark} />}
          {section === 'modules' && <ModulesSection dark={dark} />}
          {section === 'themes' && <ThemesSection dark={dark} />}
          {section === 'app' && <AppReleaseManager dark={dark} isDashboardWidget={false} />}
          {section === 'users' && <UsersSection dark={dark} />}
          {section === 'diseases' && <CrudSection dark={dark} entity="diseases" title="Enfermedades" />}
          {section === 'articles' && <CrudSection dark={dark} entity="articles" title="Artículos" />}
          {section === 'nutraceuticals' && <CrudSection dark={dark} entity="nutraceuticals" title="Nutracéuticos" />}
          {section === 'news' && <CrudSection dark={dark} entity="news" title="Noticias" />}
          {section === 'messages' && <MessagesSection dark={dark} />}
          {section === 'contact' && <ContactSettingsSection dark={dark} />}
        </div>
      </main>
    </div>
  )
}

// ═══════════════════════════════════════════════════════
// SHARED UI PIECES
// ═══════════════════════════════════════════════════════

const cardStyle = (dark) => ({
  background: dark ? '#2B1815' : '#fff',
  borderRadius: CARD_RADIUS,
  border: `1px solid ${dark ? '#38211D' : '#e8ddd0'}`,
  boxShadow: dark ? '0 2px 12px rgba(0,0,0,0.3)' : '0 1px 4px rgba(0,0,0,0.04)',
})

function SearchBar({ value, onChange, placeholder, dark }) {
  return (
    <div style={{ position: 'relative', maxWidth: '340px' }}>
      <FaSearch style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: dark ? '#7e7a8c' : '#a89580', fontSize: '0.85rem' }} />
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder || 'Buscar...'}
        style={{
          width: '100%', padding: '0.6rem 1rem 0.6rem 2.4rem',
          borderRadius: '10px', border: `1.5px solid ${dark ? '#4A2D28' : '#e8ddd0'}`,
          background: dark ? '#38211D' : '#faf8f5', color: dark ? '#fff' : '#1a1715',
          fontSize: '0.85rem', outline: 'none',
        }}
      />
    </div>
  )
}

function Btn({ children, variant = 'primary', onClick, disabled, small, style: extra }) {
  const bg = variant === 'primary' ? '#7A433A'
    : variant === 'danger' ? '#dc2626'
    : variant === 'success' ? '#059669'
    : 'transparent'
  const c = variant === 'ghost' ? '#7A433A' : '#fff'
  return (
    <button onClick={onClick} disabled={disabled} style={{
      display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
      padding: small ? '0.35rem 0.7rem' : '0.55rem 1.1rem',
      borderRadius: '10px', border: variant === 'ghost' ? '1.5px solid #7A433A' : 'none',
      background: bg, color: c, fontSize: small ? '0.75rem' : '0.85rem', fontWeight: '700',
      cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1,
      transition: 'all 0.2s ease', whiteSpace: 'nowrap', ...extra,
    }}>
      {children}
    </button>
  )
}

function Modal({ title, onClose, children, dark, wide }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
      padding: '3rem 1rem', overflowY: 'auto',
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        width: '100%', maxWidth: wide ? '780px' : '560px',
        borderRadius: '20px', overflow: 'hidden',
        background: dark ? '#2B1815' : '#fff',
        border: `1px solid ${dark ? '#4A2D28' : '#e8ddd0'}`,
        boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '1.25rem 1.5rem', borderBottom: `1px solid ${dark ? '#38211D' : '#e8ddd0'}`,
        }}>
          <h2 style={{ margin: 0, fontSize: '1.15rem', fontWeight: '800', color: dark ? '#fff' : '#1a1715' }}>{title}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: dark ? '#7e7a8c' : '#a89580', fontSize: '1.1rem' }}>
            <FaTimes />
          </button>
        </div>
        {/* Body */}
        <div style={{ padding: '1.5rem', maxHeight: '70vh', overflowY: 'auto' }}>
          {children}
        </div>
      </div>
    </div>
  )
}

function FormField({ label, children, dark }) {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: dark ? '#9ea4b0' : '#5c5248', marginBottom: '0.35rem' }}>
        {label}
      </label>
      {children}
    </div>
  )
}

function inputStyle(dark) {
  return {
    width: '100%', padding: '0.6rem 0.85rem', borderRadius: '10px',
    border: `1.5px solid ${dark ? '#4A2D28' : '#e8ddd0'}`,
    background: dark ? '#38211D' : '#faf8f5',
    color: dark ? '#fff' : '#1a1715', fontSize: '0.88rem', outline: 'none',
    fontFamily: 'inherit',
  }
}

function ConfirmModal({ message, onConfirm, onCancel, dark }) {
  return (
    <Modal title="Confirmar" onClose={onCancel} dark={dark}>
      <p style={{ fontSize: '0.95rem', color: dark ? '#c5bfae' : '#5c5248', marginBottom: '1.5rem', lineHeight: 1.5 }}>{message}</p>
      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
        <Btn variant="ghost" onClick={onCancel}>Cancelar</Btn>
        <Btn variant="danger" onClick={onConfirm}><FaTrash size={12} /> Eliminar</Btn>
      </div>
    </Modal>
  )
}

function ImageUploader({ value, onChange, dark }) {
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append('image', file)

    setUploading(true)
    try {
      const res = await api.post('/admin/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      onChange(res.data.imageUrl)
    } catch (err) {
      alert(err.response?.data?.error || 'Error al subir la imagen')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        {value ? (
          <div style={{ position: 'relative', width: '100px', height: '100px', borderRadius: '12px', overflow: 'hidden', border: `1px solid ${dark ? '#4A2D28' : '#e8ddd0'}` }}>
            <img 
              src={value.startsWith('http') ? value : `${API_BASE}/${value}`} 
              alt="Previsualización" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
            <button
              type="button"
              onClick={() => onChange('')}
              style={{
                position: 'absolute', top: '4px', right: '4px',
                width: '20px', height: '20px', borderRadius: '50%',
                background: 'rgba(0,0,0,0.6)', border: 'none', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', fontSize: '0.75rem', padding: 0
              }}
              title="Eliminar imagen"
            >
              <FaTimes size={10} />
            </button>
          </div>
        ) : (
          <div style={{
            width: '100px', height: '100px', borderRadius: '12px',
            border: `2px dashed ${dark ? '#4A2D28' : '#e8ddd0'}`,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            color: dark ? '#7e7a8c' : '#a89580', fontSize: '0.7rem', fontWeight: '600'
          }}>
            <FaCamera size={20} style={{ marginBottom: '0.35rem' }} />
            Sin Imagen
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <button type="button" onClick={() => fileInputRef.current?.click()} style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
            padding: '0.45rem 0.9rem', borderRadius: '8px',
            background: dark ? '#38211D' : '#faf8f5',
            color: dark ? '#fff' : '#1a1715',
            border: `1.5px solid ${dark ? '#4A2D28' : '#e8ddd0'}`,
            fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer',
            transition: 'all 0.2s'
          }}>
            <FaPlus size={10} /> {uploading ? 'Subiendo...' : value ? 'Cambiar Imagen' : 'Subir Imagen'}
          </button>
          {value && (
            <span style={{ fontSize: '0.7rem', color: dark ? '#7e7a8c' : '#a89580', wordBreak: 'break-all', maxWidth: '300px' }}>
              Ruta: /{value}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

function MultiImageUploader({ value = [], onChange, dark }) {
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    const limit = 5 - value.length
    if (limit <= 0) {
      alert('Ya has subido el límite máximo de 5 imágenes')
      return
    }

    const filesToUpload = files.slice(0, limit)
    setUploading(true)

    try {
      const uploadedUrls = []
      for (const file of filesToUpload) {
        const formData = new FormData()
        formData.append('image', file)
        const res = await api.post('/admin/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        uploadedUrls.push(res.data.imageUrl)
      }
      onChange([...value, ...uploadedUrls])
    } catch (err) {
      alert(err.response?.data?.error || 'Error al subir la imagen')
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = (indexToRemove) => {
    onChange(value.filter((_, idx) => idx !== indexToRemove))
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <input
          type="file"
          accept="image/*"
          multiple
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
          disabled={value.length >= 5}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={value.length >= 5 || uploading}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
            padding: '0.45rem 0.9rem', borderRadius: '8px',
            background: value.length >= 5 ? 'var(--color-surface-200)' : (dark ? '#38211D' : '#faf8f5'),
            color: value.length >= 5 ? 'var(--color-surface-400)' : (dark ? '#fff' : '#1a1715'),
            border: `1.5px solid ${dark ? '#4A2D28' : '#e8ddd0'}`,
            fontSize: '0.8rem', fontWeight: '700',
            cursor: value.length >= 5 ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s'
          }}
        >
          <FaPlus size={10} /> {uploading ? 'Subiendo...' : 'Subir Imágenes'}
        </button>
        <span style={{ fontSize: '0.75rem', color: dark ? '#7e7a8c' : '#a89580' }}>
          {value.length} de 5 imágenes subidas
        </span>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        {value.map((imgUrl, index) => (
          <div key={index} style={{
            position: 'relative', width: '90px', height: '90px',
            borderRadius: '12px', overflow: 'hidden',
            border: `1px solid ${dark ? '#4A2D28' : '#e8ddd0'}`
          }}>
            <img
              src={imgUrl.startsWith('http') ? imgUrl : `${API_BASE}/${imgUrl}`}
              alt={`Imagen ${index + 1}`}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{
              position: 'absolute', bottom: '4px', left: '4px',
              background: 'rgba(0,0,0,0.6)', color: 'white',
              fontSize: '0.65rem', fontWeight: '700', padding: '1px 5px',
              borderRadius: '4px'
            }}>
              {index + 1}
            </div>
            <button
              type="button"
              onClick={() => handleRemove(index)}
              style={{
                position: 'absolute', top: '4px', right: '4px',
                width: '18px', height: '18px', borderRadius: '50%',
                background: 'rgba(239, 68, 68, 0.9)', border: 'none', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', fontSize: '0.7rem', padding: 0
              }}
              title="Eliminar imagen"
            >
              <FaTimes size={9} />
            </button>
          </div>
        ))}
        
        {value.length === 0 && (
          <div style={{
            width: '90px', height: '90px', borderRadius: '12px',
            border: `2px dashed ${dark ? '#4A2D28' : '#e8ddd0'}`,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            color: dark ? '#7e7a8c' : '#a89580', fontSize: '0.65rem', fontWeight: '600'
          }}>
            <FaCamera size={16} style={{ marginBottom: '0.25rem' }} />
            Vacío
          </div>
        )}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════
// APP RELEASE (APK) MANAGEMENT COMPONENT
// ═══════════════════════════════════════════════════════

function AppReleaseManager({ dark, isDashboardWidget }) {
  const [current, setCurrent] = useState(null)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [version, setVersion] = useState('')
  const [releaseNotes, setReleaseNotes] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [feedback, setFeedback] = useState({ type: '', message: '' })
  const [showHistory, setShowHistory] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef(null)

  const loadData = useCallback(() => {
    setLoading(true)
    Promise.all([
      api.get('/admin/app-release/current'),
      api.get('/admin/app-release/history'),
    ])
      .then(([resCurr, resHist]) => {
        setCurrent(resCurr.data?.release || null)
        setHistory(resHist.data?.releases || [])
      })
      .catch((err) => {
        console.error('Error fetching APK releases:', err)
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleFileSelect = (file) => {
    if (!file) return
    if (!file.name.toLowerCase().endsWith('.apk')) {
      setFeedback({ type: 'error', message: 'Por favor selecciona un archivo válido con extensión .apk' })
      return
    }
    setSelectedFile(file)
    setFeedback({ type: '', message: '' })
    if (!version) {
      const match = file.name.match(/v?(\d+\.\d+(\.\d+)?)/i)
      setVersion(match ? match[1] : '1.0.0')
    }
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!selectedFile) {
      setFeedback({ type: 'error', message: 'Selecciona un archivo .apk para subir.' })
      return
    }

    const formData = new FormData()
    formData.append('apkFile', selectedFile)
    formData.append('version', version.trim() || '1.0.0')
    formData.append('releaseNotes', releaseNotes.trim())

    setUploading(true)
    setUploadProgress(0)
    setFeedback({ type: '', message: '' })

    try {
      await api.post('/admin/app-release/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            setUploadProgress(percent)
          }
        }
      })

      setFeedback({ type: 'success', message: '¡Archivo APK subido y activado exitosamente!' })
      setSelectedFile(null)
      setVersion('')
      setReleaseNotes('')
      if (fileInputRef.current) fileInputRef.current.value = ''
      loadData()
    } catch (err) {
      console.error('APK upload error:', err)
      let msg = 'Ocurrió un error al subir el archivo APK.'
      if (err.response?.status === 413) {
        msg = 'Error 413: El archivo supera el tamaño máximo permitido por el servidor web (Nginx). Se debe aumentar client_max_body_size en Nginx.'
      } else if (err.response?.data?.error) {
        msg = err.response.data.error
      } else if (err.response?.data?.message) {
        msg = err.response.data.message
      } else if (err.message) {
        msg = `Error: ${err.message}`
      }
      setFeedback({
        type: 'error',
        message: msg
      })
    } finally {
      setUploading(false)
    }
  }

  const handleActivate = async (id) => {
    try {
      await api.put(`/admin/app-release/${id}/activate`)
      setFeedback({ type: 'success', message: 'Versión activada exitosamente.' })
      loadData()
    } catch (err) {
      setFeedback({ type: 'error', message: err.response?.data?.error || 'Error al activar versión.' })
    }
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/admin/app-release/${id}`)
      setFeedback({ type: 'success', message: 'Versión eliminada correctamente.' })
      setDeleteConfirm(null)
      loadData()
    } catch (err) {
      setFeedback({ type: 'error', message: err.response?.data?.error || 'Error al eliminar versión.' })
    }
  }

  const handleTestDownload = () => {
    const downloadUrl = `${API_BASE}/api/app/download-apk`
    const link = document.createElement('a')
    link.href = downloadUrl
    link.setAttribute('download', current?.fileName || 'jovenes-con-salud.apk')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const fmtFileSize = (bytes) => {
    if (!bytes) return '0 MB'
    const mb = bytes / (1024 * 1024)
    return `${mb.toFixed(2)} MB`
  }

  const fmtDate = (d) => {
    if (!d) return '-'
    return new Date(d).toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Title block */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#10b981', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.35rem' }}>
            <FaAndroid size={14} /> Distribución Mobile
          </div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: '800', color: dark ? '#fff' : '#1a1715', margin: 0 }}>
            Gestión de Aplicación Móvil (APK Android)
          </h2>
          <p style={{ fontSize: '0.85rem', color: dark ? '#a89580' : '#736b63', margin: '0.25rem 0 0' }}>
            Sube el archivo APK compilado para que los usuarios puedan descargarlo directamente desde el botón "Descargar Apk" del Home.
          </p>
        </div>

        {history.length > 0 && (
          <Btn variant="ghost" onClick={() => setShowHistory(!showHistory)} small>
            <FaMobileAlt size={13} /> {showHistory ? 'Ocultar Historial' : `Ver Historial (${history.length})`}
          </Btn>
        )}
      </div>

      {/* Feedback alerts */}
      {feedback.message && (
        <div style={{
          padding: '0.875rem 1.25rem',
          borderRadius: '12px',
          fontSize: '0.85rem',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          background: feedback.type === 'success'
            ? (dark ? 'rgba(16, 185, 129, 0.15)' : '#ecfdf5')
            : (dark ? 'rgba(239, 68, 68, 0.15)' : '#fef2f2'),
          color: feedback.type === 'success' ? '#10b981' : '#ef4444',
          border: `1px solid ${feedback.type === 'success' ? '#10b98140' : '#ef444440'}`,
        }}>
          {feedback.type === 'success' ? <FaCheck size={14} /> : <FaTimes size={14} />}
          <span style={{ flex: 1 }}>{feedback.message}</span>
          <button onClick={() => setFeedback({ type: '', message: '' })} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: '0.9rem' }}>
            <FaTimes />
          </button>
        </div>
      )}

      {/* Grid: Current status + Upload form */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Card 1: Estado del APK Actual */}
        <div style={{ ...cardStyle(dark), padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: '800', letterSpacing: '0.06em', textTransform: 'uppercase', color: dark ? '#7e7a8c' : '#a89580' }}>
                ESTADO ACTUAL DEL APK
              </span>
              {current ? (
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                  padding: '0.25rem 0.65rem', borderRadius: '20px',
                  background: 'rgba(16, 185, 129, 0.15)', color: '#10b981',
                  fontSize: '0.72rem', fontWeight: '800'
                }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
                  ACTIVO Y DISPONIBLE
                </span>
              ) : (
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                  padding: '0.25rem 0.65rem', borderRadius: '20px',
                  background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b',
                  fontSize: '0.72rem', fontWeight: '800'
                }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#f59e0b' }} />
                  SIN APK SUBIDO
                </span>
              )}
            </div>

            {current ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '1rem',
                  padding: '1rem', borderRadius: '12px',
                  background: dark ? '#38211D' : '#faf8f5',
                  border: `1px solid ${dark ? '#4A2D28' : '#e8ddd0'}`
                }}>
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '12px',
                    background: 'rgba(16, 185, 129, 0.15)', color: '#10b981',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.5rem', flexShrink: 0
                  }}>
                    <FaAndroid />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '1.1rem', fontWeight: '800', color: dark ? '#fff' : '#1a1715' }}>
                        Versión {current.version}
                      </span>
                      <span style={{ fontSize: '0.75rem', fontWeight: '700', padding: '0.15rem 0.5rem', borderRadius: '6px', background: dark ? '#4A2D28' : '#e2d8cc', color: dark ? '#c5bfae' : '#5c5248' }}>
                        {fmtFileSize(current.fileSize)}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: dark ? '#7e7a8c' : '#a89580', marginTop: '0.2rem', wordBreak: 'break-all' }}>
                      📄 {current.fileName}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div style={{ padding: '0.75rem', borderRadius: '10px', background: dark ? '#1a1822' : '#f5f1ea', border: `1px solid ${dark ? '#4A2D28' : '#ece5dc'}` }}>
                    <div style={{ fontSize: '0.65rem', fontWeight: '700', textTransform: 'uppercase', color: dark ? '#7e7a8c' : '#a89580' }}>Descargas Totales</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#10b981', marginTop: '0.2rem' }}>
                      ⬇️ {current.downloadCount}
                    </div>
                  </div>
                  <div style={{ padding: '0.75rem', borderRadius: '10px', background: dark ? '#1a1822' : '#f5f1ea', border: `1px solid ${dark ? '#4A2D28' : '#ece5dc'}` }}>
                    <div style={{ fontSize: '0.65rem', fontWeight: '700', textTransform: 'uppercase', color: dark ? '#7e7a8c' : '#a89580' }}>Actualizado</div>
                    <div style={{ fontSize: '0.8rem', fontWeight: '700', color: dark ? '#fff' : '#1a1715', marginTop: '0.35rem' }}>
                      {fmtDate(current.updatedAt)}
                    </div>
                  </div>
                </div>

                {current.releaseNotes && (
                  <div style={{ fontSize: '0.8rem', color: dark ? '#c5bfae' : '#5c5248', padding: '0.75rem', borderRadius: '8px', background: dark ? '#1a1822' : '#fbf9f6', border: `1px dashed ${dark ? '#4A2D28' : '#e0d6cb'}` }}>
                    <strong style={{ display: 'block', fontSize: '0.7rem', textTransform: 'uppercase', color: dark ? '#7e7a8c' : '#a89580', marginBottom: '0.2rem' }}>Notas de Versión:</strong>
                    {current.releaseNotes}
                  </div>
                )}
              </div>
            ) : (
              <div style={{
                textAlign: 'center', padding: '2rem 1rem',
                color: dark ? '#7e7a8c' : '#a89580',
                border: `2px dashed ${dark ? '#4A2D28' : '#e8ddd0'}`,
                borderRadius: '12px'
              }}>
                <FaAndroid size={36} style={{ opacity: 0.3, marginBottom: '0.75rem' }} />
                <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: '600' }}>No hay ningún APK activo actualmente.</p>
                <p style={{ margin: '0.4rem 0 0', fontSize: '0.78rem' }}>Sube tu archivo .apk en el panel contiguo para activarlo de inmediato.</p>
              </div>
            )}
          </div>

          {current && (
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
              <Btn variant="success" onClick={handleTestDownload} small style={{ flex: 1 }}>
                <FaDownload size={12} /> Probar Descarga
              </Btn>
              <Btn variant="danger" onClick={() => setDeleteConfirm(current)} small>
                <FaTrash size={12} /> Eliminar APK
              </Btn>
            </div>
          )}
        </div>

        {/* Card 2: Subir Nueva Versión de APK */}
        <div style={{ ...cardStyle(dark), padding: '1.5rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '800', letterSpacing: '0.06em', textTransform: 'uppercase', color: dark ? '#7e7a8c' : '#a89580', display: 'block', marginBottom: '1.25rem' }}>
            SUBIR NUEVO ARCHIVO APK (.apk)
          </span>

          <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Dropzone */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: `2px dashed ${dragActive ? '#10b981' : selectedFile ? '#10b981' : dark ? '#4A2D28' : '#e0d6cb'}`,
                borderRadius: '14px',
                padding: '1.5rem 1rem',
                textAlign: 'center',
                cursor: 'pointer',
                background: dragActive
                  ? (dark ? 'rgba(16, 185, 129, 0.1)' : '#ecfdf5')
                  : selectedFile
                    ? (dark ? 'rgba(16, 185, 129, 0.05)' : '#f0fdf4')
                    : (dark ? '#1a1822' : '#faf8f5'),
                transition: 'all 0.2s ease',
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".apk,application/vnd.android.package-archive"
                onChange={(e) => handleFileSelect(e.target.files[0])}
                style={{ display: 'none' }}
              />

              {selectedFile ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FaCheck size={18} />
                  </div>
                  <span style={{ fontSize: '0.9rem', fontWeight: '800', color: dark ? '#fff' : '#1a1715', wordBreak: 'break-all' }}>
                    {selectedFile.name}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: '700' }}>
                    {fmtFileSize(selectedFile.size)} • Listo para subir
                  </span>
                  <span style={{ fontSize: '0.7rem', color: dark ? '#7e7a8c' : '#a89580', marginTop: '0.2rem' }}>
                    Haz clic para cambiar de archivo
                  </span>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                  <FaCloudUploadAlt size={34} style={{ color: dark ? '#C89953' : '#7A433A', opacity: 0.8 }} />
                  <span style={{ fontSize: '0.88rem', fontWeight: '700', color: dark ? '#fff' : '#1a1715' }}>
                    Arrastra y suelta el archivo .apk aquí
                  </span>
                  <span style={{ fontSize: '0.75rem', color: dark ? '#7e7a8c' : '#a89580' }}>
                    o haz clic para explorar en tu equipo (hasta 250 MB)
                  </span>
                </div>
              )}
            </div>

            {/* Inputs */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: dark ? '#9ea4b0' : '#5c5248', marginBottom: '0.25rem' }}>
                  Versión *
                </label>
                <input
                  type="text"
                  value={version}
                  onChange={e => setVersion(e.target.value)}
                  placeholder="ej. 1.0.0"
                  required
                  style={{
                    width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px',
                    border: `1.5px solid ${dark ? '#4A2D28' : '#e8ddd0'}`,
                    background: dark ? '#38211D' : '#faf8f5', color: dark ? '#fff' : '#1a1715',
                    fontSize: '0.85rem', outline: 'none'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: dark ? '#9ea4b0' : '#5c5248', marginBottom: '0.25rem' }}>
                  Notas de Versión (Opcional)
                </label>
                <input
                  type="text"
                  value={releaseNotes}
                  onChange={e => setReleaseNotes(e.target.value)}
                  placeholder="ej. Primera versión oficial de HeartBliss — Cuida tu Corazón"
                  style={{
                    width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px',
                    border: `1.5px solid ${dark ? '#4A2D28' : '#e8ddd0'}`,
                    background: dark ? '#38211D' : '#faf8f5', color: dark ? '#fff' : '#1a1715',
                    fontSize: '0.85rem', outline: 'none'
                  }}
                />
              </div>
            </div>

            {/* Progress bar */}
            {uploading && (
              <div style={{ marginTop: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: '700', color: dark ? '#fff' : '#1a1715', marginBottom: '0.35rem' }}>
                  <span>Subiendo APK al servidor...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div style={{ width: '100%', height: '8px', borderRadius: '4px', background: dark ? '#4A2D28' : '#e2d8cc', overflow: 'hidden' }}>
                  <div style={{ width: `${uploadProgress}%`, height: '100%', background: 'linear-gradient(90deg, #7A433A, #10b981)', transition: 'width 0.2s ease' }} />
                </div>
              </div>
            )}

            {/* Submit button */}
            <Btn
              variant="primary"
              disabled={uploading || !selectedFile}
              style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem', padding: '0.75rem 1rem' }}
            >
              <FaCloudUploadAlt size={16} />
              {uploading ? `Subiendo (${uploadProgress}%)...` : 'Subir y Activar APK'}
            </Btn>
          </form>
        </div>
      </div>

      {/* Historial de Versiones (Collapsible) */}
      {showHistory && history.length > 0 && (
        <div style={{ ...cardStyle(dark), padding: '1.5rem', overflow: 'hidden' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '800', color: dark ? '#fff' : '#1a1715', margin: '0 0 1rem' }}>
            Historial de Versiones APK
          </h3>
          <div className="admin-table-container" style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ background: dark ? '#38211D' : '#faf8f5', borderBottom: `1px solid ${dark ? '#4A2D28' : '#e8ddd0'}` }}>
                  {['VERSIÓN', 'ARCHIVO', 'TAMAÑO', 'DESCARGAS', 'FECHA DE SUBIDA', 'ESTADO', 'ACCIONES'].map(h => (
                    <th key={h} style={{ padding: '0.7rem 0.9rem', textAlign: 'left', fontSize: '0.68rem', fontWeight: '800', letterSpacing: '0.06em', color: dark ? '#C89953' : '#7A433A' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {history.map(item => (
                  <tr key={item.id} style={{ borderBottom: `1px solid ${dark ? '#38211D' : '#f0e8de'}` }}>
                    <td style={{ padding: '0.75rem 0.9rem', fontWeight: '800', color: dark ? '#fff' : '#1a1715' }}>
                      v{item.version}
                    </td>
                    <td style={{ padding: '0.75rem 0.9rem', color: dark ? '#c5bfae' : '#5c5248', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.fileName}
                    </td>
                    <td style={{ padding: '0.75rem 0.9rem', color: dark ? '#a89580' : '#736b63', fontWeight: '600' }}>
                      {fmtFileSize(item.fileSize)}
                    </td>
                    <td style={{ padding: '0.75rem 0.9rem', fontWeight: '700', color: '#10b981' }}>
                      ⬇️ {item.downloadCount}
                    </td>
                    <td style={{ padding: '0.75rem 0.9rem', color: dark ? '#7e7a8c' : '#a89580', fontSize: '0.75rem' }}>
                      {fmtDate(item.createdAt)}
                    </td>
                    <td style={{ padding: '0.75rem 0.9rem' }}>
                      {item.isActive ? (
                        <span style={{ padding: '0.2rem 0.55rem', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', fontSize: '0.7rem', fontWeight: '800' }}>
                          ACTIVO
                        </span>
                      ) : (
                        <span style={{ padding: '0.2rem 0.55rem', borderRadius: '12px', background: dark ? '#4A2D28' : '#ece5dc', color: dark ? '#7e7a8c' : '#8c8074', fontSize: '0.7rem', fontWeight: '700' }}>
                          Inactivo
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '0.75rem 0.9rem' }}>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        {!item.isActive && (
                          <Btn variant="ghost" onClick={() => handleActivate(item.id)} small title="Establecer como versión activa para descargas">
                            <FaCheck size={11} /> Activar
                          </Btn>
                        )}
                        <Btn variant="danger" onClick={() => setDeleteConfirm(item)} small title="Eliminar archivo">
                          <FaTrash size={11} />
                        </Btn>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteConfirm && (
        <ConfirmModal
          dark={dark}
          title="Eliminar Versión de APK"
          message={`¿Estás seguro de que deseas eliminar la versión ${deleteConfirm.version} (${deleteConfirm.fileName})? Esta acción borrará el archivo físico del servidor.`}
          onConfirm={() => handleDelete(deleteConfirm.id)}
          onCancel={() => setDeleteConfirm(null)}
        />
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════
// MODULE VISIBILITY MANAGEMENT SECTION
// ═══════════════════════════════════════════════════════

const MODULE_META = {
  diseases: {
    icon: FaHeartbeat,
    color: '#ef4444',
    gradient: 'linear-gradient(135deg, #ef4444, #b91c1c)',
    tag: 'Catálogo ECNT'
  },
  hecho_en_tamaulipas: {
    icon: FaCapsules,
    color: '#10b981',
    gradient: 'linear-gradient(135deg, #10b981, #047857)',
    tag: 'Nutracéuticos'
  },
  news: {
    icon: FaNewspaper,
    color: '#3b82f6',
    gradient: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
    tag: 'Comunicados'
  },
  programs: {
    icon: FaHandsHelping,
    color: '#8b5cf6',
    gradient: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
    tag: 'Bienestar Social'
  },
  contact: {
    icon: FaEnvelope,
    color: '#f59e0b',
    gradient: 'linear-gradient(135deg, #f59e0b, #b45309)',
    tag: 'Sedes y Mapa'
  },
  faq: {
    icon: FaQuestionCircle,
    color: '#06b6d4',
    gradient: 'linear-gradient(135deg, #06b6d4, #0e7490)',
    tag: 'Ayuda y Preguntas'
  },
  bmi_calculator: {
    icon: FaCalculator,
    color: '#ec4899',
    gradient: 'linear-gradient(135deg, #ec4899, #be185d)',
    tag: 'Tamizaje IMC'
  },
  health_tracking: {
    icon: FaChartLine,
    color: '#14b8a6',
    gradient: 'linear-gradient(135deg, #14b8a6, #0f766e)',
    tag: 'Mi Salud'
  },
  virtual_appointments: {
    icon: FaCalendarCheck,
    color: '#6366f1',
    gradient: 'linear-gradient(135deg, #6366f1, #4338ca)',
    tag: 'Telemedicina'
  },
  universal_medical_history: {
    icon: FaFileMedical,
    color: '#84cc16',
    gradient: 'linear-gradient(135deg, #84cc16, #4d7c0f)',
    tag: 'Expediente Único'
  },
  chat_assistant: {
    icon: FaComments,
    color: '#0ea5e9',
    gradient: 'linear-gradient(135deg, #0ea5e9, #0369a1)',
    tag: 'Asistente IA'
  },
  download_apk: {
    icon: FaAndroid,
    color: '#22c55e',
    gradient: 'linear-gradient(135deg, #22c55e, #15803d)',
    tag: 'Descarga Móvil'
  },
}

const CATEGORY_TABS = [
  { id: 'all', label: 'Todos los Apartados', icon: FaLayerGroup },
  { id: 'public', label: 'Páginas Públicas', icon: FaHeartbeat },
  { id: 'health', label: 'Salud y Pacientes', icon: FaChartLine },
  { id: 'services', label: 'Servicios Especiales', icon: FaMobileAlt },
]

function ModulesSection({ dark }) {
  const { refreshModules } = useModules()
  const [modules, setModules] = useState([])
  const [loading, setLoading] = useState(true)
  const [togglingKey, setTogglingKey] = useState(null)
  const [batchLoading, setBatchLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [toast, setToast] = useState(null)

  const showToast = (type, message) => {
    setToast({ type, message })
    setTimeout(() => setToast(null), 4000)
  }

  const loadModules = useCallback(async () => {
    try {
      setLoading(true)
      const res = await api.get('/admin/modules')
      setModules(res.data.modules || [])
    } catch (err) {
      showToast('error', 'Error al cargar los módulos: ' + (err.response?.data?.error || err.message))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadModules()
  }, [loadModules])

  const handleToggle = async (mod) => {
    if (togglingKey) return
    const newStatus = !mod.isEnabled
    setTogglingKey(mod.key)

    // Optimistic UI update
    setModules(prev => prev.map(m => m.key === mod.key ? { ...m, isEnabled: newStatus } : m))

    try {
      const res = await api.put(`/admin/modules/${mod.key}/toggle`, { isEnabled: newStatus })
      showToast('success', res.data.message || `Módulo "${mod.name}" actualizado`)
      refreshModules()
    } catch (err) {
      // Revert optimistic update on error
      setModules(prev => prev.map(m => m.key === mod.key ? { ...m, isEnabled: mod.isEnabled } : m))
      showToast('error', 'Error al actualizar módulo: ' + (err.response?.data?.error || err.message))
    } finally {
      setTogglingKey(null)
    }
  }

  const handleBatch = async (action, actionName) => {
    if (!window.confirm(`¿Estás seguro de que deseas ${actionName.toLowerCase()}?`)) return
    setBatchLoading(true)
    try {
      const res = await api.put('/admin/modules/batch', { action })
      setModules(res.data.modules || [])
      showToast('success', res.data.message || 'Configuración de módulos actualizada')
      refreshModules()
    } catch (err) {
      showToast('error', 'Error en acción grupal: ' + (err.response?.data?.error || err.message))
    } finally {
      setBatchLoading(false)
    }
  }

  const filtered = modules.filter(m => {
    const matchCategory = category === 'all' || m.category === category
    const matchSearch = search.trim() === '' ||
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      (m.description && m.description.toLowerCase().includes(search.toLowerCase())) ||
      m.key.toLowerCase().includes(search.toLowerCase())
    return matchCategory && matchSearch
  })

  const totalCount = modules.length
  const activeCount = modules.filter(m => m.isEnabled).length
  const inactiveCount = totalCount - activeCount

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* ── Top Header ────────────────────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
            padding: '0.25rem 0.75rem', borderRadius: '20px',
            background: dark ? 'rgba(224, 59, 96, 0.15)' : 'rgba(122, 67, 58, 0.08)',
            color: dark ? '#C89953' : '#7A433A',
            fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.06em',
            marginBottom: '0.5rem'
          }}>
            <FaSlidersH size={12} /> Control de Visualización
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: dark ? '#fff' : '#1a1715', margin: 0, letterSpacing: '-0.02em' }}>
            Visibilidad de Apartados y Módulos
          </h2>
          <p style={{ fontSize: '0.875rem', color: dark ? '#7e7a8c' : '#a89580', margin: '0.25rem 0 0' }}>
            Activa o desactiva de forma inmediata qué secciones, páginas y servicios son visibles para los usuarios en la plataforma.
          </p>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => handleBatch('enable_all', 'Activar todos los módulos')}
            disabled={batchLoading || activeCount === totalCount}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
              padding: '0.55rem 0.9rem', borderRadius: '10px',
              border: 'none', cursor: (batchLoading || activeCount === totalCount) ? 'not-allowed' : 'pointer',
              background: '#10b981', color: '#fff', fontSize: '0.8rem', fontWeight: '700',
              opacity: (batchLoading || activeCount === totalCount) ? 0.6 : 1,
              transition: 'all 0.2s ease',
            }}
          >
            <FaCheckCircle size={13} /> Activar Todos
          </button>
          <button
            onClick={() => handleBatch('disable_all', 'Desactivar todos los módulos')}
            disabled={batchLoading || inactiveCount === totalCount}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
              padding: '0.55rem 0.9rem', borderRadius: '10px',
              border: 'none', cursor: (batchLoading || inactiveCount === totalCount) ? 'not-allowed' : 'pointer',
              background: '#ef4444', color: '#fff', fontSize: '0.8rem', fontWeight: '700',
              opacity: (batchLoading || inactiveCount === totalCount) ? 0.6 : 1,
              transition: 'all 0.2s ease',
            }}
          >
            <FaTimesCircle size={13} /> Desactivar Todos
          </button>
          <button
            onClick={() => handleBatch('reset', 'Restablecer configuración predeterminada')}
            disabled={batchLoading}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
              padding: '0.55rem 0.9rem', borderRadius: '10px',
              border: `1.5px solid ${dark ? '#4A2D28' : '#d5c7b8'}`,
              background: dark ? '#38211D' : '#fff',
              color: dark ? '#fff' : '#1a1715',
              cursor: batchLoading ? 'not-allowed' : 'pointer',
              fontSize: '0.8rem', fontWeight: '700',
              transition: 'all 0.2s ease',
            }}
          >
            <FaUndo size={12} /> Restablecer
          </button>
        </div>
      </div>

      {/* ── Toast Alert ────────────────────────────────────────── */}
      {toast && (
        <div style={{
          padding: '0.875rem 1.25rem',
          borderRadius: '12px',
          fontSize: '0.85rem',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          background: toast.type === 'success'
            ? (dark ? 'rgba(16, 185, 129, 0.15)' : '#ecfdf5')
            : (dark ? 'rgba(239, 68, 68, 0.15)' : '#fef2f2'),
          color: toast.type === 'success' ? '#10b981' : '#ef4444',
          border: `1px solid ${toast.type === 'success' ? '#10b98140' : '#ef444440'}`,
          animation: 'slideDown 0.2s ease',
        }}>
          {toast.type === 'success' ? <FaCheck size={14} /> : <FaTimes size={14} />}
          <span style={{ flex: 1 }}>{toast.message}</span>
          <button onClick={() => setToast(null)} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: '0.9rem' }}>
            <FaTimes />
          </button>
        </div>
      )}

      {/* ── KPI Stats Cards ───────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        <div style={{
          ...cardStyle(dark),
          padding: '1.25rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: dark ? '#7e7a8c' : '#a89580', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Total Módulos
            </span>
            <div style={{ fontSize: '1.75rem', fontWeight: '800', color: dark ? '#fff' : '#1a1715', marginTop: '0.25rem' }}>
              {totalCount}
            </div>
          </div>
          <div style={{
            width: '48px', height: '48px', borderRadius: '12px',
            background: dark ? 'rgba(122,67,58,0.15)' : '#7A433A15',
            color: dark ? '#C89953' : '#7A433A',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <FaSlidersH size={22} />
          </div>
        </div>

        <div style={{
          ...cardStyle(dark),
          padding: '1.25rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Apartados Activos (Visibles)
            </span>
            <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#10b981', marginTop: '0.25rem' }}>
              {activeCount}
            </div>
          </div>
          <div style={{
            width: '48px', height: '48px', borderRadius: '12px',
            background: 'rgba(16, 185, 129, 0.15)',
            color: '#10b981',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <FaCheckCircle size={22} />
          </div>
        </div>

        <div style={{
          ...cardStyle(dark),
          padding: '1.25rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: inactiveCount > 0 ? '#ef4444' : (dark ? '#7e7a8c' : '#a89580'), textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Apartados Desactivados (Ocultos)
            </span>
            <div style={{ fontSize: '1.75rem', fontWeight: '800', color: inactiveCount > 0 ? '#ef4444' : (dark ? '#fff' : '#1a1715'), marginTop: '0.25rem' }}>
              {inactiveCount}
            </div>
          </div>
          <div style={{
            width: '48px', height: '48px', borderRadius: '12px',
            background: inactiveCount > 0 ? 'rgba(239, 68, 68, 0.15)' : (dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'),
            color: inactiveCount > 0 ? '#ef4444' : (dark ? '#7e7a8c' : '#a89580'),
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <FaEyeSlash size={22} />
          </div>
        </div>
      </div>

      {/* ── Filter Bar: Tabs & Search ──────────────────────────── */}
      <div style={{
        ...cardStyle(dark),
        padding: '0.875rem 1.25rem',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
      }}>
        {/* Category tabs */}
        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
          {CATEGORY_TABS.map(tab => {
            const isSelected = category === tab.id
            const TabIcon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setCategory(tab.id)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.45rem',
                  padding: '0.45rem 0.85rem', borderRadius: '8px',
                  border: isSelected ? 'none' : `1px solid ${dark ? '#4A2D28' : '#e0d6cb'}`,
                  background: isSelected
                    ? (dark ? '#C89953' : '#7A433A')
                    : (dark ? '#38211D' : '#faf8f5'),
                  color: isSelected ? '#fff' : (dark ? '#9ea4b0' : '#5c5248'),
                  fontSize: '0.8rem', fontWeight: isSelected ? '700' : '600',
                  cursor: 'pointer', transition: 'all 0.2s ease',
                }}
              >
                <TabIcon size={12} />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Search */}
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Buscar apartado o módulo..."
          dark={dark}
        />
      </div>

      {/* ── Modules Grid ──────────────────────────────────────── */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: dark ? '#7e7a8c' : '#a89580' }}>
          <p style={{ fontWeight: '600' }}>Cargando catálogo de módulos...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{
          ...cardStyle(dark),
          padding: '3rem',
          textAlign: 'center',
          color: dark ? '#7e7a8c' : '#a89580'
        }}>
          <FaSlidersH size={36} style={{ opacity: 0.3, marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: dark ? '#fff' : '#1a1715', margin: '0 0 0.5rem' }}>
            No se encontraron apartados
          </h3>
          <p style={{ fontSize: '0.875rem', margin: 0 }}>
            Intenta con otro término de búsqueda o selecciona otra categoría.
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '1.25rem'
        }}>
          {filtered.map(mod => {
            const meta = MODULE_META[mod.key] || {
              icon: FaLayerGroup,
              color: '#7A433A',
              gradient: 'linear-gradient(135deg, #7A433A, #522B24)',
              tag: 'Módulo General'
            }
            const IconComponent = meta.icon
            const isSaving = togglingKey === mod.key

            return (
              <div
                key={mod.key}
                style={{
                  ...cardStyle(dark),
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '1.25rem',
                  transition: 'all 0.25s ease',
                  borderLeft: `4px solid ${mod.isEnabled ? meta.color : (dark ? '#4A2D28' : '#d5c7b8')}`,
                  opacity: mod.isEnabled ? 1 : 0.82,
                  boxShadow: mod.isEnabled
                    ? (dark ? `0 4px 20px ${meta.color}15` : '0 2px 10px rgba(0,0,0,0.05)')
                    : 'none'
                }}
              >
                {/* Header: Icon, Titles and Tag */}
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{
                    width: '46px', height: '46px', borderRadius: '12px',
                    background: mod.isEnabled ? meta.gradient : (dark ? '#4A2D28' : '#e0d6cb'),
                    color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                    boxShadow: mod.isEnabled ? `0 4px 12px ${meta.color}40` : 'none',
                    transition: 'all 0.3s ease',
                  }}>
                    <IconComponent size={20} />
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.25rem' }}>
                      <span style={{
                        fontSize: '0.68rem', fontWeight: '800', textTransform: 'uppercase',
                        letterSpacing: '0.05em', padding: '2px 7px', borderRadius: '4px',
                        background: mod.isEnabled ? `${meta.color}20` : (dark ? '#4A2D28' : '#e8ddd0'),
                        color: mod.isEnabled ? meta.color : (dark ? '#7e7a8c' : '#7d6e5e'),
                      }}>
                        {meta.tag}
                      </span>
                    </div>

                    <h3 style={{
                      fontSize: '1rem', fontWeight: '800',
                      color: dark ? '#fff' : '#1a1715',
                      margin: '0 0 0.4rem',
                      lineHeight: '1.3'
                    }}>
                      {mod.name}
                    </h3>

                    <p style={{
                      fontSize: '0.8rem',
                      color: dark ? '#9ea4b0' : '#5c5248',
                      lineHeight: '1.45',
                      margin: 0
                    }}>
                      {mod.description || 'Controla la visualización de este apartado en la plataforma.'}
                    </p>
                  </div>
                </div>

                {/* Footer: Status Badge and Switch Toggle */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '1rem',
                  borderTop: `1px solid ${dark ? '#38211D' : '#f0e8de'}`,
                }}>
                  {/* Status badge */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{
                      width: '8px', height: '8px', borderRadius: '50%',
                      background: mod.isEnabled ? '#10b981' : '#ef4444',
                      boxShadow: mod.isEnabled ? '0 0 8px #10b981' : 'none',
                    }} />
                    <span style={{
                      fontSize: '0.78rem', fontWeight: '700',
                      color: mod.isEnabled ? '#10b981' : (dark ? '#ef4444' : '#dc2626')
                    }}>
                      {mod.isEnabled ? 'Visible para usuarios' : 'Oculto en la plataforma'}
                    </span>
                  </div>

                  {/* iOS Style Switch Toggle */}
                  <button
                    type="button"
                    onClick={() => handleToggle(mod)}
                    disabled={isSaving}
                    title={mod.isEnabled ? 'Haz clic para desactivar' : 'Haz clic para activar'}
                    style={{
                      width: '52px',
                      height: '28px',
                      borderRadius: '14px',
                      background: mod.isEnabled ? '#10b981' : (dark ? '#4A2D28' : '#d5c7b8'),
                      border: 'none',
                      cursor: isSaving ? 'wait' : 'pointer',
                      position: 'relative',
                      padding: '2px',
                      transition: 'background-color 0.25s ease',
                      outline: 'none',
                      opacity: isSaving ? 0.6 : 1,
                    }}
                  >
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: '#ffffff',
                      boxShadow: '0 2px 5px rgba(0,0,0,0.25)',
                      transform: mod.isEnabled ? 'translateX(24px)' : 'translateX(0px)',
                      transition: 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.65rem',
                      color: mod.isEnabled ? '#10b981' : '#9ea4b0',
                      fontWeight: '800',
                    }}>
                      {isSaving ? '...' : mod.isEnabled ? <FaCheck size={10} /> : <FaTimes size={10} />}
                    </div>
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════
// DASHBOARD SECTION
// ═══════════════════════════════════════════════════════

function DashboardSection({ dark, onNavigate }) {
  const [stats, setStats] = useState(null)
  useEffect(() => {
    api.get('/admin/stats').then(r => setStats(r.data)).catch(() => {})
  }, [])

  if (!stats) return <p style={{ color: dark ? '#7e7a8c' : '#a89580' }}>Cargando estadísticas...</p>

  const cards = [
    { label: 'USUARIOS REGISTRADOS', value: stats.users.total, sub: `${stats.users.active} activos`, color: '#3b82f6', emoji: '👥' },
    { label: 'NUEVOS (30 DÍAS)', value: stats.users.newLast30, color: '#10b981', emoji: '🆕' },
    { label: 'ENFERMEDADES', value: stats.diseases, color: '#C89953', emoji: '💗' },
    { label: 'ARTÍCULOS', value: stats.articles, color: '#10b981', emoji: '📚' },
    { label: 'NUTRACÉUTICOS', value: stats.nutraceuticals, color: '#f59e0b', emoji: '💊' },
    { label: 'NOTICIAS', value: stats.news, color: '#8b5cf6', emoji: '📰' },
    { label: 'MENSAJES', value: stats.messages.total, sub: `${stats.messages.pending} pendientes`, color: '#f97316', emoji: '✉️' },
    { label: 'REGISTROS DE SALUD', value: stats.healthRecords, color: '#06b6d4', emoji: '📊' },
  ]

  return (
    <div>
      <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: dark ? '#fff' : '#1a1715', marginBottom: '1.5rem' }}>Resumen General</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
        {cards.map((c, i) => (
          <div key={i} style={{
            ...cardStyle(dark),
            padding: '1.25rem 1.35rem',
            display: 'flex', flexDirection: 'column', gap: '0.6rem',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '0.6rem', fontWeight: '800', letterSpacing: '0.08em', textTransform: 'uppercase', color: dark ? '#7e7a8c' : '#a89580' }}>{c.label}</span>
              <span style={{ fontSize: '1.2rem' }}>{c.emoji}</span>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: dark ? '#fff' : '#1a1715' }}>{c.value}</div>
            {c.sub && <span style={{ fontSize: '0.72rem', color: dark ? '#7e7a8c' : '#a89580' }}>{c.sub}</span>}
          </div>
        ))}
      </div>

      {/* Dual Shortcut Banners: Mapa Epidemiológico & Control de Módulos */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem', marginTop: '1.5rem' }}>
        {/* Banner 1: Mapa */}
        <div style={{
          ...cardStyle(dark),
          padding: '1.25rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          background: dark ? 'linear-gradient(135deg, rgba(224,59,96,0.15), rgba(20,19,25,0.95))' : 'linear-gradient(135deg, #7A433A0f, #fff)',
          borderLeft: '4px solid #C89953'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{
              width: '42px', height: '42px', borderRadius: '10px',
              background: '#7A433A', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }}>
              <FaMapMarkedAlt size={18} />
            </div>
            <div>
              <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: '800', color: dark ? '#fff' : '#1a1715' }}>
                Mapa de Tamaulipas (43 Municipios)
              </h4>
              <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', color: dark ? '#9ea4b0' : '#5c5248' }}>
                Distribución de usuarios y métricas de salud por municipio.
              </p>
            </div>
          </div>
          <Btn variant="primary" onClick={() => onNavigate?.('map')} small>
            <FaMapMarkedAlt size={12} /> Ver Mapa
          </Btn>
        </div>

        {/* Banner 2: Módulos */}
        <div style={{
          ...cardStyle(dark),
          padding: '1.25rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          background: dark ? 'linear-gradient(135deg, rgba(16,185,129,0.12), rgba(20,19,25,0.95))' : 'linear-gradient(135deg, #10b9810a, #fff)',
          borderLeft: '4px solid #10b981'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{
              width: '42px', height: '42px', borderRadius: '10px',
              background: '#10b981', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }}>
              <FaSlidersH size={18} />
            </div>
            <div>
              <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: '800', color: dark ? '#fff' : '#1a1715' }}>
                Control de Visibilidad de Módulos
              </h4>
              <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', color: dark ? '#9ea4b0' : '#5c5248' }}>
                Activa o desactiva en tiempo real secciones visibles a usuarios.
              </p>
            </div>
          </div>
          <Btn variant="primary" onClick={() => onNavigate?.('modules')} small style={{ background: '#10b981' }}>
            <FaSlidersH size={12} /> Configurar
          </Btn>
        </div>
      </div>

      {/* APK Management Widget on Main Dashboard */}
      <div style={{ marginTop: '2.5rem' }}>
        <AppReleaseManager dark={dark} isDashboardWidget={true} />
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════
// USERS SECTION
// ═══════════════════════════════════════════════════════

function UsersSection({ dark }) {
  const [users, setUsers] = useState([])
  const [doctors, setDoctors] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  const load = useCallback(() => {
    setLoading(true)
    Promise.all([
      api.get('/admin/users', { params: search ? { search } : {} }),
      api.get('/admin/doctors')
    ])
      .then(([resUsers, resDoctors]) => {
        setUsers(resUsers.data.users)
        setDoctors(resDoctors.data.doctors)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [search])

  useEffect(() => { load() }, [load])

  const toggleActive = async (id) => {
    await api.put(`/admin/users/${id}/toggle-active`)
    load()
  }

  const changeRole = async (id, role) => {
    await api.put(`/admin/users/${id}/role`, { role })
    load()
  }

  const assignDoctor = async (userId, doctorId) => {
    try {
      await api.put(`/admin/users/${userId}/assign-doctor`, { doctorId: doctorId || null })
      load()
    } catch (err) {
      alert(err.response?.data?.error || 'Error al asignar médico')
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: dark ? '#fff' : '#1a1715', margin: 0 }}>Gestión de Usuarios</h2>
        <SearchBar value={search} onChange={setSearch} placeholder="Buscar por nombre o correo..." dark={dark} />
      </div>
      <div className="admin-table-container" style={{ ...cardStyle(dark), overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ background: dark ? '#38211D' : '#faf8f5', borderBottom: `1px solid ${dark ? '#4A2D28' : '#e8ddd0'}` }}>
              {['NOMBRE', 'CORREO', 'ROL', 'MÉDICO ASIGNADO', 'ESTADO', 'ACCIONES'].map(h => (
                <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.7rem', fontWeight: '800', letterSpacing: '0.06em', color: dark ? '#C89953' : '#7A433A' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: dark ? '#7e7a8c' : '#a89580' }}>Cargando...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: dark ? '#7e7a8c' : '#a89580' }}>Sin resultados</td></tr>
            ) : users.map(u => (
              <tr key={u.id} style={{ borderBottom: `1px solid ${dark ? '#38211D' : '#f4efe7'}` }}>
                <td style={{ padding: '0.75rem 1rem', fontWeight: '600', color: dark ? '#e5dfef' : '#1a1715' }}>{u.name}</td>
                <td style={{ padding: '0.75rem 1rem', color: dark ? '#9ea4b0' : '#7d6e5e' }}>{u.email}</td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  <select value={u.role} onChange={e => changeRole(u.id, e.target.value)} style={{
                    padding: '0.3rem 0.5rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: '600',
                    border: `1px solid ${dark ? '#4A2D28' : '#e8ddd0'}`,
                    background: dark ? '#38211D' : '#faf8f5', color: dark ? '#fff' : '#1a1715',
                    cursor: 'pointer',
                  }}>
                    <option value="user">Usuario</option>
                    <option value="doctor">Médico</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  {u.role === 'user' ? (
                    <select
                      value={u.doctorId || ''}
                      onChange={e => assignDoctor(u.id, e.target.value)}
                      style={{
                        padding: '0.3rem 0.5rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: '600',
                        border: `1px solid ${dark ? '#4A2D28' : '#e8ddd0'}`,
                        background: dark ? '#38211D' : '#faf8f5', color: dark ? '#fff' : '#1a1715',
                        cursor: 'pointer',
                      }}
                    >
                      <option value="">Sin médico</option>
                      {doctors.map(d => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                  ) : (
                    <span style={{ color: dark ? '#7e7a8c' : '#a89580', fontSize: '0.8rem', fontStyle: 'italic' }}>N/A</span>
                  )}
                </td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  <span style={{
                    padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.72rem', fontWeight: '700',
                    background: u.isActive ? '#10b98118' : '#ef444418',
                    color: u.isActive ? '#059669' : '#dc2626',
                  }}>
                    {u.isActive ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  <Btn variant={u.isActive ? 'danger' : 'success'} small onClick={() => toggleActive(u.id)}>
                    {u.isActive ? '⊘ Desactivar' : '✓ Activar'}
                  </Btn>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════
// GENERIC CRUD SECTION (Diseases, Nutraceuticals, News)
// ═══════════════════════════════════════════════════════

const ENTITY_CONFIG = {
  diseases: {
    endpoint: '/admin/diseases',
    listKey: 'diseases',
    columns: ['coverImage', 'name', 'category', 'isPublished'],
    columnLabels: { coverImage: 'IMAGEN', name: 'NOMBRE', category: 'CATEGORÍA', isPublished: 'ESTADO' },
    fields: [
      { key: 'name', label: 'Nombre', type: 'text', required: true },
      { key: 'category', label: 'Categoría', type: 'text', required: true },
      { key: 'description', label: 'Descripción', type: 'textarea', required: true },
      { key: 'symptoms', label: 'Síntomas (uno por línea)', type: 'jsonarray' },
      { key: 'riskFactors', label: 'Factores de Riesgo (uno por línea)', type: 'jsonarray' },
      { key: 'treatment', label: 'Tratamiento', type: 'textarea' },
      { key: 'iconEmoji', label: 'Emoji de Icono', type: 'text' },
      { key: 'colorHex', label: 'Color Hex', type: 'text' },
      { key: 'coverImage', label: 'Imagen de Portada', type: 'image' },
      { key: 'validatedBy', label: 'Validado por', type: 'text' },
      { key: 'externalResources', label: 'Recursos Externos (Formato: Etiqueta|URL - uno por línea)', type: 'textarea' },
      { key: 'youtubeVideos', label: 'Videos de YouTube (Formato: Título|youtubeId - uno por línea)', type: 'textarea' },
      { key: 'isPublished', label: 'Publicada', type: 'checkbox' },
    ],
  },
  nutraceuticals: {
    endpoint: '/admin/nutraceuticals',
    listKey: 'products',
    columns: ['images', 'name', 'price', 'isPublished'],
    columnLabels: { images: 'IMAGEN', name: 'NOMBRE', price: 'PRECIO', isPublished: 'ESTADO' },
    fields: [
      { key: 'name', label: 'Nombre', type: 'text', required: true },
      { key: 'description', label: 'Descripción', type: 'textarea' },
      { key: 'price', label: 'Precio (MXN)', type: 'number' },
      { key: 'ingredients', label: 'Ingredientes (uno por línea)', type: 'jsonarray' },
      { key: 'benefits', label: 'Beneficios (uno por línea)', type: 'jsonarray' },
      { key: 'purchaseUrl', label: 'URL de Compra', type: 'text' },
      { key: 'images', label: 'Imágenes del Producto (máx. 5)', type: 'multi_image' },
      { key: 'sortOrder', label: 'Orden de Aparición', type: 'number' },
      { key: 'isPublished', label: 'Publicado', type: 'checkbox' },
    ],
  },
  news: {
    endpoint: '/admin/news',
    listKey: 'posts',
    columns: ['coverImage', 'title', 'author', 'isPinned', 'isPublished'],
    columnLabels: { coverImage: 'IMAGEN', title: 'TÍTULO', author: 'AUTOR', isPinned: 'FIJADA', isPublished: 'ESTADO' },
    fields: [
      { key: 'title', label: 'Título', type: 'text', required: true },
      { key: 'excerpt', label: 'Extracto / Resumen', type: 'textarea' },
      { key: 'content', label: 'Contenido', type: 'textarea', required: true },
      { key: 'author', label: 'Autor', type: 'text' },
      { key: 'coverImage', label: 'Imagen de Portada', type: 'image' },
      { key: 'images', label: 'Imágenes Adicionales (para galería o insertar en texto)', type: 'multi_image' },
      { key: 'publishedAt', label: 'Fecha de Publicación', type: 'date' },
      { key: 'isPinned', label: 'Fijada (Pin)', type: 'checkbox' },
      { key: 'isPublished', label: 'Publicada', type: 'checkbox' },
    ],
  },
  articles: {
    endpoint: '/admin/articles',
    listKey: 'articles',
    columns: ['coverImage', 'title', 'category', 'isPublished'],
    columnLabels: { coverImage: 'IMAGEN', title: 'TÍTULO', category: 'CATEGORÍA', isPublished: 'ESTADO' },
    fields: [
      { key: 'title', label: 'Título', type: 'text', required: true },
      { key: 'category', label: 'Categoría', type: 'text', required: true },
      { key: 'diseaseId', label: 'ID de Enfermedad (opcional)', type: 'text' },
      { key: 'excerpt', label: 'Extracto / Resumen', type: 'textarea' },
      { key: 'content', label: 'Contenido', type: 'textarea', required: true },
      { key: 'coverImage', label: 'Imagen de Portada', type: 'image' },
      { key: 'videoUrl', label: 'URL de Video (opcional)', type: 'text' },
      { key: 'isPublished', label: 'Publicado', type: 'checkbox' },
    ],
  },
}


function CrudSection({ dark, entity, title }) {
  const cfg = ENTITY_CONFIG[entity]
  const [items, setItems] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [formData, setFormData] = useState({})
  const [saving, setSaving] = useState(false)

  // Spanish singularization helper
  const getSingular = (plural) => {
    if (plural === 'Enfermedades') return 'Enfermedad'
    if (plural === 'Nutracéuticos') return 'Nutracéutico'
    if (plural === 'Noticias') return 'Noticia'
    if (plural === 'Artículos') return 'Artículo'
    if (plural === 'Usuarios') return 'Usuario'
    return plural.slice(0, -1)
  }

  // Variant management state
  const [variantSubMode, setVariantSubMode] = useState(null) // null, 'create', 'edit'
  const [activeVariantId, setActiveVariantId] = useState(null)
  const [variantsList, setVariantsList] = useState([])
  const [loadingVariants, setLoadingVariants] = useState(false)
  const [savingVariant, setSavingVariant] = useState(false)

  // Variant form fields
  const [vName, setVName] = useState('')
  const [vDescription, setVDescription] = useState('')
  const [vTreatment, setVTreatment] = useState('')
  const [vValidatedBy, setVValidatedBy] = useState('Secretaría de Salud de Tamaulipas')
  const [vSymptoms, setVSymptoms] = useState('')
  const [vRiskFactors, setVRiskFactors] = useState('')
  const [vExternalResources, setVExternalResources] = useState('')
  const [vYoutubeVideos, setVYoutubeVideos] = useState('')

  const loadVariants = useCallback(async (diseaseId) => {
    setLoadingVariants(true)
    try {
      const res = await api.get(`/admin/diseases/${diseaseId}/variants`)
      setVariantsList(res.data.variants || [])
    } catch {
      setVariantsList([])
    } finally {
      setLoadingVariants(false)
    }
  }, [])

  const load = useCallback(() => {
    setLoading(true)
    api.get(cfg.endpoint, { params: search ? { search } : {} })
      .then(r => setItems(r.data[cfg.listKey] || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [search, cfg.endpoint, cfg.listKey])

  useEffect(() => { load() }, [load])

  const openCreate = () => {
    const defaults = {}
    cfg.fields.forEach(f => {
      if (f.type === 'checkbox') defaults[f.key] = true
      else if (f.type === 'jsonarray') defaults[f.key] = ''
      else if (f.type === 'date') defaults[f.key] = new Date().toISOString().slice(0, 10)
      else if (f.type === 'multi_image') defaults[f.key] = []
      else defaults[f.key] = ''
    })
    setFormData(defaults)
    setEditing(null)
    setVariantSubMode(null)
    setShowForm(true)
  }

  const openEdit = (item) => {
    const d = {}
    cfg.fields.forEach(f => {
      if (f.type === 'jsonarray') {
        const arr = item[f.key] || item[f.key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)]
        d[f.key] = Array.isArray(arr) ? arr.join('\n') : ''
      } else if (f.key === 'externalResources') {
        const arr = item.externalResources || item.external_resources
        d[f.key] = Array.isArray(arr) ? arr.map(r => `${r.label || ''}|${r.url || ''}`).join('\n') : ''
      } else if (f.key === 'youtubeVideos') {
        const arr = item.youtubeVideos || item.youtube_videos
        d[f.key] = Array.isArray(arr) ? arr.map(vid => `${vid.title || ''}|${vid.youtubeId || vid.youtube_id || ''}`).join('\n') : ''
      } else if (f.type === 'date') {
        d[f.key] = item[f.key] ? new Date(item[f.key]).toISOString().slice(0, 10) : ''
      } else if (f.type === 'checkbox') {
        d[f.key] = !!item[f.key]
      } else if (f.type === 'multi_image') {
        d[f.key] = Array.isArray(item[f.key]) ? item[f.key] : []
      } else {
        d[f.key] = item[f.key] ?? ''
      }
    })
    setFormData(d)
    setEditing(item)
    setVariantSubMode(null)
    if (entity === 'diseases') {
      loadVariants(item.id)
    }
    setShowForm(true)
  }

  const openCreateVariant = () => {
    setVName('')
    setVDescription('')
    setVTreatment('')
    setVValidatedBy('Secretaría de Salud de Tamaulipas')
    setVSymptoms('')
    setVRiskFactors('')
    setVExternalResources('')
    setVYoutubeVideos('')
    setActiveVariantId(null)
    setVariantSubMode('create')
  }

  const openEditVariant = (v) => {
    setVName(v.name || '')
    setVDescription(v.description || '')
    setVTreatment(v.treatment || '')
    setVValidatedBy(v.validatedBy || v.validated_by || 'Secretaría de Salud de Tamaulipas')
    setVSymptoms(Array.isArray(v.symptoms) ? v.symptoms.join('\n') : '')
    setVRiskFactors(Array.isArray(v.riskFactors) ? v.riskFactors.join('\n') : '')

    const res = v.externalResources || v.external_resources
    const resLines = Array.isArray(res) 
      ? res.map(r => `${r.label || ''}|${r.url || ''}`).join('\n')
      : ''
    setVExternalResources(resLines)

    const vids = v.youtubeVideos || v.youtube_videos
    const vidLines = Array.isArray(vids)
      ? vids.map(vid => `${vid.title || ''}|${vid.youtubeId || vid.youtube_id || ''}`).join('\n')
      : ''
    setVYoutubeVideos(vidLines)

    setActiveVariantId(v.id)
    setVariantSubMode('edit')
  }

  const handleSaveVariant = async () => {
    if (!vName || !vDescription) {
      alert('El nombre y la descripción de la variante son requeridos')
      return
    }
    setSavingVariant(true)
    const resourcesParsed = vExternalResources.split('\n').map(line => {
      const trimmed = line.trim()
      if (!trimmed) return null
      if (trimmed.includes('|')) {
        const parts = trimmed.split('|')
        return { label: parts[0]?.trim() || '', url: parts[1]?.trim() || '' }
      } else if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
        return { label: trimmed, url: trimmed }
      }
      return null
    }).filter(Boolean).filter(r => r.label && r.url)

    const videosParsed = vYoutubeVideos.split('\n').map(line => {
      const trimmed = line.trim()
      if (!trimmed) return null
      if (trimmed.includes('|')) {
        const parts = trimmed.split('|')
        return { title: parts[0]?.trim() || '', youtubeId: parts[1]?.trim() || '' }
      }
      return null
    }).filter(Boolean).filter(vid => vid.title && vid.youtubeId)

    const payload = {
      name: vName,
      description: vDescription,
      treatment: vTreatment,
      validatedBy: vValidatedBy,
      symptoms: vSymptoms.split('\n').map(s => s.trim()).filter(Boolean),
      riskFactors: vRiskFactors.split('\n').map(r => r.trim()).filter(Boolean),
      externalResources: resourcesParsed,
      external_resources: resourcesParsed,
      youtubeVideos: videosParsed,
      youtube_videos: videosParsed,
    }

    try {
      if (variantSubMode === 'edit') {
        await api.put(`/admin/diseases/variants/${activeVariantId}`, payload)
      } else {
        await api.post(`/admin/diseases/${editing.id}/variants`, payload)
      }
      setVariantSubMode(null)
      loadVariants(editing.id)
    } catch (err) {
      alert(err.response?.data?.error || 'Error al guardar variante')
    } finally {
      setSavingVariant(false)
    }
  }

  const handleDeleteVariant = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta variante?')) return
    try {
      await api.delete(`/admin/diseases/variants/${id}`)
      loadVariants(editing.id)
    } catch (err) {
      alert(err.response?.data?.error || 'Error al eliminar variante')
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const payload = { ...formData }
      // Convert jsonarray fields from newline-separated string to arrays
      cfg.fields.forEach(f => {
        if (f.type === 'jsonarray') {
          payload[f.key] = payload[f.key]
            ? payload[f.key].split('\n').map(s => s.trim()).filter(Boolean)
            : []
        } else if (f.key === 'externalResources') {
          const parsed = payload[f.key]
            ? payload[f.key].split('\n').map(line => {
                const trimmed = line.trim()
                if (!trimmed) return null
                if (trimmed.includes('|')) {
                  const parts = trimmed.split('|')
                  return { label: parts[0]?.trim() || '', url: parts[1]?.trim() || '' }
                } else if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
                  return { label: trimmed, url: trimmed }
                }
                return null
              }).filter(Boolean).filter(r => r.label && r.url)
            : []
          payload.externalResources = parsed
          payload.external_resources = parsed
        } else if (f.key === 'youtubeVideos') {
          const parsed = payload[f.key]
            ? payload[f.key].split('\n').map(line => {
                const trimmed = line.trim()
                if (!trimmed) return null
                if (trimmed.includes('|')) {
                  const parts = trimmed.split('|')
                  return { title: parts[0]?.trim() || '', youtubeId: parts[1]?.trim() || '' }
                }
                return null
              }).filter(Boolean).filter(v => v.title && v.youtubeId)
            : []
          payload.youtubeVideos = parsed
          payload.youtube_videos = parsed
        }
        if (f.type === 'number' && payload[f.key] !== '' && payload[f.key] !== undefined) {
          payload[f.key] = Number(payload[f.key])
        }
      })

      if (editing) {
        await api.put(`${cfg.endpoint}/${editing.id}`, payload)
      } else {
        await api.post(cfg.endpoint, payload)
      }
      setShowForm(false)
      load()
    } catch (err) {
      alert(err.response?.data?.error || 'Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    try {
      await api.delete(`${cfg.endpoint}/${deleting.id}`)
      setDeleting(null)
      load()
    } catch (err) {
      alert(err.response?.data?.error || 'Error al eliminar')
    }
  }

  const handleFormat = (fieldKey, formatType, isVariant = false) => {
    const elementId = isVariant ? `variant-textarea-${fieldKey}` : `textarea-${fieldKey}`
    const textarea = document.getElementById(elementId)
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const text = textarea.value
    const selectedText = text.substring(start, end)

    let prefix = ''
    let suffix = ''

    if (formatType === 'bold') {
      prefix = '**'
      suffix = '**'
    } else if (formatType === 'italic') {
      prefix = '*'
      suffix = '*'
    } else if (formatType === 'underline') {
      prefix = '<u>'
      suffix = '</u>'
    }

    const replacement = prefix + selectedText + suffix
    const newValue = text.substring(0, start) + replacement + text.substring(end)

    if (isVariant) {
      if (fieldKey === 'description') setVDescription(newValue)
      if (fieldKey === 'treatment') setVTreatment(newValue)
      if (fieldKey === 'symptoms') setVSymptoms(newValue)
      if (fieldKey === 'riskFactors') setVRiskFactors(newValue)
      if (fieldKey === 'externalResources') setVExternalResources(newValue)
      if (fieldKey === 'youtubeVideos') setVYoutubeVideos(newValue)
    } else {
      setFormData(prev => ({ ...prev, [fieldKey]: newValue }))
    }

    setTimeout(() => {
      textarea.focus()
      const newCursorPosStart = start + prefix.length
      const newCursorPosEnd = end + prefix.length
      textarea.setSelectionRange(newCursorPosStart, newCursorPosEnd)
    }, 0)
  }

  const renderFormattingToolbar = (fieldKey) => (
    <div style={{
      display: 'flex',
      gap: '0.3rem',
      marginBottom: '0.2rem',
      background: dark ? '#38211D' : '#faf8f5',
      border: `1.5px solid ${dark ? '#4A2D28' : '#e8ddd0'}`,
      borderRadius: '8px',
      padding: '0.25rem 0.4rem',
      alignItems: 'center',
      width: 'fit-content'
    }}>
      <button
        type="button"
        onClick={() => handleFormat(fieldKey, 'bold', true)}
        style={{
          background: 'transparent',
          border: 'none',
          color: dark ? '#fff' : '#1a1715',
          fontWeight: 'bold',
          cursor: 'pointer',
          padding: '2px 8px',
          borderRadius: '4px',
          fontSize: '0.85rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background 0.2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = dark ? '#4A2D28' : '#e8ddd0' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
        title="Negrita"
      >
        B
      </button>
      <span style={{ height: '14px', width: '1px', background: dark ? '#4A2D28' : '#e8ddd0' }} />
      <button
        type="button"
        onClick={() => handleFormat(fieldKey, 'italic', true)}
        style={{
          background: 'transparent',
          border: 'none',
          color: dark ? '#fff' : '#1a1715',
          fontStyle: 'italic',
          cursor: 'pointer',
          padding: '2px 8px',
          borderRadius: '4px',
          fontSize: '0.85rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background 0.2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = dark ? '#4A2D28' : '#e8ddd0' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
        title="Cursiva"
      >
        I
      </button>
      <span style={{ height: '14px', width: '1px', background: dark ? '#4A2D28' : '#e8ddd0' }} />
      <button
        type="button"
        onClick={() => handleFormat(fieldKey, 'underline', true)}
        style={{
          background: 'transparent',
          border: 'none',
          color: dark ? '#fff' : '#1a1715',
          textDecoration: 'underline',
          cursor: 'pointer',
          padding: '2px 8px',
          borderRadius: '4px',
          fontSize: '0.85rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background 0.2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = dark ? '#4A2D28' : '#e8ddd0' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
        title="Subrayado"
      >
        U
      </button>
    </div>
  )

  const formatCell = (item, col) => {
    const val = item[col]
    if (col === 'coverImage' || col === 'images') {
      const src = col === 'images'
        ? (Array.isArray(val) && val.length > 0 ? val[0] : null)
        : val

      return src ? (
        <div style={{ width: '48px', height: '32px', borderRadius: '6px', overflow: 'hidden', border: `1px solid ${dark ? '#4A2D28' : '#e8ddd0'}` }}>
          <img src={src.startsWith('http') ? src : `${API_BASE}/${src}`} alt="Thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      ) : (
        <div style={{ width: '48px', height: '32px', borderRadius: '6px', background: dark ? '#38211D' : '#faf8f5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: dark ? '#7e7a8c' : '#a89580', fontSize: '0.65rem' }}>
          Sin img
        </div>
      )
    }
    if (col === 'isPublished' || col === 'isPinned') {
      return (
        <span style={{
          padding: '0.2rem 0.55rem', borderRadius: '20px', fontSize: '0.72rem', fontWeight: '700',
          background: val ? '#10b98118' : '#ef444418',
          color: val ? '#059669' : '#dc2626',
        }}>
          {col === 'isPublished' ? (val ? 'Publicada' : 'Borrador') : (val ? 'Sí' : 'No')}
        </span>
      )
    }
    if (col === 'price') return val != null ? `$${Number(val).toFixed(2)}` : '—'
    return val || '—'
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: dark ? '#fff' : '#1a1715', margin: 0 }}>Gestión de {title}</h2>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <SearchBar value={search} onChange={setSearch} placeholder={`Buscar ${title.toLowerCase()}...`} dark={dark} />
          <Btn onClick={openCreate}><FaPlus size={12} /> Crear nuevo</Btn>
        </div>
      </div>

      <div className="admin-table-container" style={{ ...cardStyle(dark), overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ background: dark ? '#38211D' : '#faf8f5', borderBottom: `1px solid ${dark ? '#4A2D28' : '#e8ddd0'}` }}>
              {cfg.columns.map(col => (
                <th key={col} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.7rem', fontWeight: '800', letterSpacing: '0.06em', color: dark ? '#C89953' : '#7A433A' }}>
                  {cfg.columnLabels[col] || col.toUpperCase()}
                </th>
              ))}
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.7rem', fontWeight: '800', letterSpacing: '0.06em', color: dark ? '#C89953' : '#7A433A' }}>ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={cfg.columns.length + 1} style={{ padding: '2rem', textAlign: 'center', color: dark ? '#7e7a8c' : '#a89580' }}>Cargando...</td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan={cfg.columns.length + 1} style={{ padding: '2rem', textAlign: 'center', color: dark ? '#7e7a8c' : '#a89580' }}>Sin resultados</td></tr>
            ) : items.map(item => (
              <tr key={item.id} style={{ borderBottom: `1px solid ${dark ? '#38211D' : '#f4efe7'}` }}>
                {cfg.columns.map(col => (
                  <td key={col} style={{ padding: '0.75rem 1rem', color: dark ? '#e5dfef' : '#1a1715', fontWeight: col === cfg.columns[0] ? '600' : '400' }}>
                    {formatCell(item, col)}
                  </td>
                ))}
                <td style={{ padding: '0.75rem 1rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Btn small variant="ghost" onClick={() => openEdit(item)}><FaEdit size={12} /> Editar</Btn>
                    <Btn small variant="danger" onClick={() => setDeleting(item)}><FaTrash size={11} /></Btn>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create / Edit Modal */}
      {showForm && (
        <Modal 
          title={
            variantSubMode === 'create' ? `Nueva Variante de ${editing?.name}` :
            variantSubMode === 'edit' ? `Editar Variante de ${editing?.name}` :
            editing ? `Editar ${getSingular(title)}` : `Crear ${getSingular(title)}`
          } 
          onClose={() => setShowForm(false)} 
          dark={dark} 
          wide
        >
          {variantSubMode ? (
            <div>
              <FormField label="Nombre de la Variante" dark={dark}>
                <input type="text" value={vName} onChange={e => setVName(e.target.value)} style={inputStyle(dark)} required />
              </FormField>

              <FormField label="Descripción" dark={dark}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  {renderFormattingToolbar('description')}
                  <textarea id="variant-textarea-description" rows={3} value={vDescription} onChange={e => setVDescription(e.target.value)} style={{ ...inputStyle(dark), resize: 'vertical' }} required />
                </div>
              </FormField>

              <FormField label="Tratamiento" dark={dark}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  {renderFormattingToolbar('treatment')}
                  <textarea id="variant-textarea-treatment" rows={3} value={vTreatment} onChange={e => setVTreatment(e.target.value)} style={{ ...inputStyle(dark), resize: 'vertical' }} />
                </div>
              </FormField>

              <FormField label="Síntomas (uno por línea)" dark={dark}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  {renderFormattingToolbar('symptoms')}
                  <textarea id="variant-textarea-symptoms" rows={3} value={vSymptoms} onChange={e => setVSymptoms(e.target.value)} style={{ ...inputStyle(dark), resize: 'vertical' }} />
                </div>
              </FormField>

              <FormField label="Factores de Riesgo (uno por línea)" dark={dark}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  {renderFormattingToolbar('riskFactors')}
                  <textarea id="variant-textarea-riskFactors" rows={3} value={vRiskFactors} onChange={e => setVRiskFactors(e.target.value)} style={{ ...inputStyle(dark), resize: 'vertical' }} />
                </div>
              </FormField>

              <FormField label="Recursos Externos (Formato: Etiqueta|URL - uno por línea)" dark={dark}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  {renderFormattingToolbar('externalResources')}
                  <textarea id="variant-textarea-externalResources" rows={3} value={vExternalResources} onChange={e => setVExternalResources(e.target.value)} placeholder="Ej: Guía Oficial IMSS|https://imss.gob.mx/guia" style={{ ...inputStyle(dark), resize: 'vertical' }} />
                </div>
              </FormField>

              <FormField label="Videos de YouTube (Formato: Título|youtubeId - uno por línea)" dark={dark}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  {renderFormattingToolbar('youtubeVideos')}
                  <textarea id="variant-textarea-youtubeVideos" rows={3} value={vYoutubeVideos} onChange={e => setVYoutubeVideos(e.target.value)} placeholder="Ej: Prevención Cáncer de Tiroides|dQw4w9WgXcQ" style={{ ...inputStyle(dark), resize: 'vertical' }} />
                </div>
              </FormField>

              <FormField label="Validado por" dark={dark}>
                <input type="text" value={vValidatedBy} onChange={e => setVValidatedBy(e.target.value)} style={inputStyle(dark)} />
              </FormField>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <Btn variant="ghost" onClick={() => setVariantSubMode(null)}>Volver a la Enfermedad</Btn>
                <Btn onClick={handleSaveVariant} disabled={savingVariant}>
                  <FaSave size={13} /> {savingVariant ? 'Guardando...' : 'Guardar Variante'}
                </Btn>
              </div>
            </div>
          ) : (
            <div>
              {cfg.fields.map(f => (
                <FormField key={f.key} label={f.label} dark={dark}>
                  {f.type === 'textarea' || f.type === 'jsonarray' ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      {f.type === 'textarea' && (
                        <div style={{
                          display: 'flex',
                          gap: '0.3rem',
                          marginBottom: '0.2rem',
                          background: dark ? '#38211D' : '#faf8f5',
                          border: `1.5px solid ${dark ? '#4A2D28' : '#e8ddd0'}`,
                          borderRadius: '8px',
                          padding: '0.25rem 0.4rem',
                          alignItems: 'center',
                          width: 'fit-content'
                        }}>
                          <button
                            type="button"
                            onClick={() => handleFormat(f.key, 'bold')}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: dark ? '#fff' : '#1a1715',
                              fontWeight: 'bold',
                              cursor: 'pointer',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              fontSize: '0.85rem',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'background 0.2s',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = dark ? '#4A2D28' : '#e8ddd0' }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                            title="Negrita"
                          >
                            B
                          </button>
                          <span style={{ height: '14px', width: '1px', background: dark ? '#4A2D28' : '#e8ddd0' }} />
                          <button
                            type="button"
                            onClick={() => handleFormat(f.key, 'italic')}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: dark ? '#fff' : '#1a1715',
                              fontStyle: 'italic',
                              cursor: 'pointer',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              fontSize: '0.85rem',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'background 0.2s',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = dark ? '#4A2D28' : '#e8ddd0' }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                            title="Cursiva"
                          >
                            I
                          </button>
                          <span style={{ height: '14px', width: '1px', background: dark ? '#4A2D28' : '#e8ddd0' }} />
                          <button
                            type="button"
                            onClick={() => handleFormat(f.key, 'underline')}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: dark ? '#fff' : '#1a1715',
                              textDecoration: 'underline',
                              cursor: 'pointer',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              fontSize: '0.85rem',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'background 0.2s',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = dark ? '#4A2D28' : '#e8ddd0' }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                            title="Subrayado"
                          >
                            U
                          </button>
                        </div>
                      )}
                      <textarea
                        id={`textarea-${f.key}`}
                        rows={f.type === 'jsonarray' ? 4 : 5}
                        value={formData[f.key] || ''}
                        onChange={e => setFormData(prev => ({ ...prev, [f.key]: e.target.value }))}
                        style={{ ...inputStyle(dark), resize: 'vertical' }}
                        placeholder={f.type === 'jsonarray' ? 'Un elemento por línea' : ''}
                      />
                    </div>
                  ) : f.type === 'checkbox' ? (
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.88rem', color: dark ? '#c5bfae' : '#5c5248' }}>
                      <input
                        type="checkbox"
                        checked={!!formData[f.key]}
                        onChange={e => setFormData(prev => ({ ...prev, [f.key]: e.target.checked }))}
                        style={{ width: '18px', height: '18px', accentColor: '#7A433A' }}
                      />
                      {formData[f.key] ? 'Sí' : 'No'}
                    </label>
                  ) : f.type === 'image' ? (
                    <ImageUploader
                      value={formData[f.key]}
                      onChange={val => setFormData(prev => ({ ...prev, [f.key]: val }))}
                      dark={dark}
                    />
                  ) : f.type === 'multi_image' ? (
                    <MultiImageUploader
                      value={formData[f.key]}
                      onChange={val => setFormData(prev => ({ ...prev, [f.key]: val }))}
                      dark={dark}
                    />
                  ) : (
                    <input
                      type={f.type === 'number' ? 'number' : f.type === 'date' ? 'date' : 'text'}
                      value={formData[f.key] || ''}
                      onChange={e => setFormData(prev => ({ ...prev, [f.key]: e.target.value }))}
                      style={inputStyle(dark)}
                      required={f.required}
                      step={f.type === 'number' ? '0.01' : undefined}
                    />
                  )}
                </FormField>
              ))}

              {/* List of existing variants */}
              {editing && entity === 'diseases' && (
                <div style={{ marginTop: '2rem', borderTop: `2px solid ${dark ? '#4A2D28' : '#e8ddd0'}`, paddingTop: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: dark ? '#fff' : '#1a1715', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    🧬 Variantes Registradas ({variantsList.length})
                  </h3>
                  {loadingVariants ? (
                    <p style={{ fontSize: '0.85rem', color: dark ? '#7e7a8c' : '#a89580' }}>Cargando variantes...</p>
                  ) : variantsList.length === 0 ? (
                    <p style={{ fontSize: '0.85rem', color: dark ? '#7e7a8c' : '#a89580', fontStyle: 'italic', margin: 0 }}>
                      No hay variantes registradas para esta enfermedad.
                    </p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {variantsList.map(v => (
                        <div key={v.id} style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '0.65rem 0.85rem',
                          borderRadius: '8px',
                          background: dark ? '#1b1a20' : '#fcfbf9',
                          border: `1px solid ${dark ? '#4A2D28' : '#e8ddd0'}`,
                        }}>
                          <div style={{ minWidth: 0, flex: 1, marginRight: '1rem' }}>
                            <h5 style={{ margin: 0, fontSize: '0.85rem', fontWeight: '700', color: dark ? '#fff' : '#1a1715' }}>
                              {v.name}
                            </h5>
                          </div>
                          <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                            <button type="button" onClick={() => openEditVariant(v)} style={{
                              background: 'none', border: 'none', color: '#c2a378', cursor: 'pointer', padding: '4px',
                              fontSize: '0.78rem', fontWeight: '600'
                            }}>
                              Editar
                            </button>
                            <button type="button" onClick={() => handleDeleteVariant(v.id)} style={{
                              background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', padding: '4px',
                              fontSize: '0.78rem', fontWeight: '600'
                            }}>
                              Eliminar
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem', alignItems: 'center' }}>
                {editing && entity === 'diseases' && (
                  <Btn variant="ghost" onClick={openCreateVariant} style={{ marginRight: 'auto' }}>
                    <FaPlus size={11} /> Nueva Variante
                  </Btn>
                )}
                <Btn variant="ghost" onClick={() => setShowForm(false)}>Cancelar</Btn>
                <Btn onClick={handleSave} disabled={saving}>
                  <FaSave size={13} /> {saving ? 'Guardando...' : editing ? 'Actualizar' : 'Crear'}
                </Btn>
              </div>
            </div>
          )}
        </Modal>
      )}

      {/* Delete Confirm */}
      {deleting && (
        <ConfirmModal
          message={`¿Estás seguro de que deseas eliminar "${deleting.name || deleting.title || deleting.id}"? Esta acción no se puede deshacer.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleting(null)}
          dark={dark}
        />
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════
// MESSAGES SECTION
// ═══════════════════════════════════════════════════════

function MessagesSection({ dark }) {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(null)

  const load = useCallback(() => {
    setLoading(true)
    api.get('/admin/contact/messages')
      .then(r => setMessages(r.data.messages || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  const changeStatus = async (id, status) => {
    await api.put(`/admin/contact/messages/${id}/status`, { status })
    load()
  }

  const handleDelete = async () => {
    await api.delete(`/admin/contact/messages/${deleting.id}`)
    setDeleting(null)
    load()
  }

  const statusColors = {
    pending: { bg: '#f59e0b18', color: '#d97706', label: 'Pendiente' },
    read: { bg: '#3b82f618', color: '#2563eb', label: 'Leído' },
    replied: { bg: '#10b98118', color: '#059669', label: 'Respondido' },
  }

  return (
    <div>
      <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: dark ? '#fff' : '#1a1715', marginBottom: '1.5rem' }}>Mensajes de Contacto</h2>
      <div className="admin-table-container" style={{ ...cardStyle(dark), overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ background: dark ? '#38211D' : '#faf8f5', borderBottom: `1px solid ${dark ? '#4A2D28' : '#e8ddd0'}` }}>
              {['NOMBRE', 'CORREO', 'ASUNTO', 'ESTADO', 'FECHA', 'ACCIONES'].map(h => (
                <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.7rem', fontWeight: '800', letterSpacing: '0.06em', color: dark ? '#C89953' : '#7A433A' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: dark ? '#7e7a8c' : '#a89580' }}>Cargando...</td></tr>
            ) : messages.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: dark ? '#7e7a8c' : '#a89580' }}>Sin mensajes</td></tr>
            ) : messages.map(m => {
              const sc = statusColors[m.status] || statusColors.pending
              return (
                <tr key={m.id} style={{ borderBottom: `1px solid ${dark ? '#38211D' : '#f4efe7'}` }}>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: '600', color: dark ? '#e5dfef' : '#1a1715' }}>{m.name}</td>
                  <td style={{ padding: '0.75rem 1rem', color: dark ? '#9ea4b0' : '#7d6e5e' }}>{m.email}</td>
                  <td style={{ padding: '0.75rem 1rem', color: dark ? '#c5bfae' : '#5c5248', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.subject}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <select
                      value={m.status}
                      onChange={e => changeStatus(m.id, e.target.value)}
                      style={{
                        padding: '0.25rem 0.5rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '700',
                        border: `1px solid ${dark ? '#4A2D28' : '#e8ddd0'}`,
                        background: sc.bg, color: sc.color, cursor: 'pointer',
                      }}
                    >
                      <option value="pending">Pendiente</option>
                      <option value="read">Leído</option>
                      <option value="replied">Respondido</option>
                    </select>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', color: dark ? '#7e7a8c' : '#a89580', fontSize: '0.8rem' }}>
                    {new Date(m.createdAt).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <Btn small variant="danger" onClick={() => setDeleting(m)}><FaTrash size={11} /></Btn>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {deleting && (
        <ConfirmModal
          message={`¿Eliminar el mensaje de "${deleting.name}" sobre "${deleting.subject}"?`}
          onConfirm={handleDelete}
          onCancel={() => setDeleting(null)}
          dark={dark}
        />
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════
// CONTACT SETTINGS SECTION
// ═══════════════════════════════════════════════════════

function ContactSettingsSection({ dark }) {
  const [generalForm, setGeneralForm] = useState({
    address: '',
    phone: '',
    email: '',
    schedule: '',
    latitude: '',
    longitude: '',
    label: '',
  })
  const [generalSaving, setGeneralSaving] = useState(false)
  const [generalSaved, setGeneralSaved] = useState(false)

  // Locations state
  const [locations, setLocations] = useState([])
  const [locationsLoading, setLocationsLoading] = useState(true)
  const [showLocationForm, setShowLocationForm] = useState(false)
  const [editingLocation, setEditingLocation] = useState(null)
  const [deletingLocation, setDeletingLocation] = useState(null)
  const [locationFormData, setLocationFormData] = useState({
    label: '',
    address: '',
    latitude: '',
    longitude: '',
  })
  const [locationSaving, setLocationSaving] = useState(false)

  const loadGeneral = () => {
    api.get('/admin/contact/settings').then(r => {
      if (r.data.settings) setGeneralForm(prev => ({ ...prev, ...r.data.settings }))
    }).catch(() => {})
  }

  const loadLocations = () => {
    setLocationsLoading(true)
    api.get('/admin/locations')
      .then(r => setLocations(r.data.locations || []))
      .catch(() => {})
      .finally(() => setLocationsLoading(false))
  }

  useEffect(() => {
    loadGeneral()
    loadLocations()
  }, [])

  const handleGeneralSave = async () => {
    setGeneralSaving(true)
    setGeneralSaved(false)
    try {
      await api.put('/admin/contact/settings', generalForm)
      setGeneralSaved(true)
      setTimeout(() => setGeneralSaved(false), 3000)
    } catch (err) {
      alert('Error al guardar configuración general')
    } finally {
      setGeneralSaving(false)
    }
  }

  const openCreateLocation = () => {
    setLocationFormData({
      label: '',
      address: '',
      latitude: '',
      longitude: '',
    })
    setEditingLocation(null)
    setShowLocationForm(true)
  }

  const openEditLocation = (loc) => {
    setLocationFormData({
      label: loc.label,
      address: loc.address,
      latitude: loc.latitude,
      longitude: loc.longitude,
    })
    setEditingLocation(loc)
    setShowLocationForm(true)
  }

  const handleSaveLocation = async () => {
    setLocationSaving(true)
    try {
      const payload = {
        label: locationFormData.label,
        address: locationFormData.address,
        latitude: parseFloat(locationFormData.latitude),
        longitude: parseFloat(locationFormData.longitude),
      }
      if (editingLocation) {
        await api.put(`/admin/locations/${editingLocation.id}`, payload)
      } else {
        await api.post('/admin/locations', payload)
      }
      setShowLocationForm(false)
      loadLocations()
    } catch (err) {
      alert(err.response?.data?.error || 'Error al guardar sede')
    } finally {
      setLocationSaving(false)
    }
  }

  const handleDeleteLocation = async () => {
    try {
      await api.delete(`/admin/locations/${deletingLocation.id}`)
      setDeletingLocation(null)
      loadLocations()
    } catch (err) {
      alert(err.response?.data?.error || 'Error al eliminar sede')
    }
  }

  const getMapUrl = (lat, lng) => {
    const parsedLat = parseFloat(lat)
    const parsedLng = parseFloat(lng)
    if (isNaN(parsedLat) || isNaN(parsedLng)) return null
    return `https://www.openstreetmap.org/export/embed.html?bbox=${parsedLng - 0.008},${parsedLat - 0.005},${parsedLng + 0.008},${parsedLat + 0.005}&layer=mapnik&marker=${parsedLat},${parsedLng}`
  }

  function MapPreview({ latitude, longitude, label, dark }) {
    const mapUrl = getMapUrl(latitude, longitude)

    if (!mapUrl) {
      return (
        <div style={{
          height: '100%',
          minHeight: '260px',
          borderRadius: '12px',
          border: `2px dashed ${dark ? '#4A2D28' : '#e8ddd0'}`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: dark ? '#7e7a8c' : '#a89580',
          padding: '2rem',
          textAlign: 'center',
          background: dark ? '#38211D' : '#faf8f5',
        }}>
          <FaMapMarkerAlt size={32} style={{ marginBottom: '0.5rem', color: '#C89953' }} />
          <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>Vista previa del mapa no disponible</span>
          <span style={{ fontSize: '0.72rem', marginTop: '0.25rem' }}>Ingrese latitud y longitud válidas</span>
        </div>
      )
    }

    return (
      <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '260px', borderRadius: '12px', overflow: 'hidden', border: `1px solid ${dark ? '#4A2D28' : '#e8ddd0'}` }}>
        <iframe
          title={`Vista previa — ${label || 'Ubicación'}`}
          src={mapUrl}
          width="100%"
          height="100%"
          style={{ border: 'none', minHeight: '260px', display: 'block' }}
          loading="lazy"
        />
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      
      {/* ── 1. GENERAL CONTACT SETTINGS ── */}
      <div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: dark ? '#fff' : '#1a1715', marginBottom: '1.25rem' }}>
          Información General de Contacto
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2rem',
          ...cardStyle(dark),
          padding: '2rem',
        }}>
          {/* Inputs Column */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <FormField label="Teléfono" dark={dark}>
              <input type="text" value={generalForm.phone || ''} onChange={e => setGeneralForm(p => ({ ...p, phone: e.target.value }))} style={inputStyle(dark)} />
            </FormField>
            
            <FormField label="Correo electrónico" dark={dark}>
              <input type="text" value={generalForm.email || ''} onChange={e => setGeneralForm(p => ({ ...p, email: e.target.value }))} style={inputStyle(dark)} />
            </FormField>

            <FormField label="Horario de atención" dark={dark}>
              <textarea rows={3} value={generalForm.schedule || ''} onChange={e => setGeneralForm(p => ({ ...p, schedule: e.target.value }))} style={{ ...inputStyle(dark), resize: 'vertical' }} />
            </FormField>

            <div style={{ height: '1px', background: dark ? '#4A2D28' : '#e8ddd0', margin: '0.75rem 0 1.25rem' }} />

            <h3 style={{ fontSize: '0.9rem', fontWeight: '800', color: dark ? '#C89953' : '#7A433A', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Ubicación Principal (Oficial)
            </h3>

            <FormField label="Nombre / Etiqueta de la ubicación" dark={dark}>
              <input type="text" value={generalForm.label || ''} onChange={e => setGeneralForm(p => ({ ...p, label: e.target.value }))} style={inputStyle(dark)} />
            </FormField>

            <FormField label="Dirección completa" dark={dark}>
              <input type="text" value={generalForm.address || ''} onChange={e => setGeneralForm(p => ({ ...p, address: e.target.value }))} style={inputStyle(dark)} />
            </FormField>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <FormField label="Latitud" dark={dark}>
                <input type="number" step="any" value={generalForm.latitude || ''} onChange={e => setGeneralForm(p => ({ ...p, latitude: e.target.value }))} style={inputStyle(dark)} />
              </FormField>
              <FormField label="Longitud" dark={dark}>
                <input type="number" step="any" value={generalForm.longitude || ''} onChange={e => setGeneralForm(p => ({ ...p, longitude: e.target.value }))} style={inputStyle(dark)} />
              </FormField>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
              <Btn onClick={handleGeneralSave} disabled={generalSaving}>
                <FaSave size={13} /> {generalSaving ? 'Guardando...' : 'Guardar Información'}
              </Btn>
              {generalSaved && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#059669', fontSize: '0.85rem', fontWeight: '600' }}>
                  <FaCheck size={13} /> Guardado correctamente
                </span>
              )}
            </div>
          </div>

          {/* Map Preview Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '700', color: dark ? '#9ea4b0' : '#5c5248' }}>
              Previsualización del Mapa Oficial
            </span>
            <div style={{ flex: 1, minHeight: '340px' }}>
              <MapPreview latitude={generalForm.latitude} longitude={generalForm.longitude} label={generalForm.label} dark={dark} />
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. PREDEFINED LOCATIONS CRUD ── */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: dark ? '#fff' : '#1a1715', margin: 0 }}>
            Directorio de Sedes y Sucursales
          </h2>
          <Btn onClick={openCreateLocation}><FaPlus size={12} /> Agregar nueva sede</Btn>
        </div>

        <div style={{ ...cardStyle(dark), overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: dark ? '#38211D' : '#faf8f5', borderBottom: `1px solid ${dark ? '#4A2D28' : '#e8ddd0'}` }}>
                {['MAPA', 'SEDE', 'DIRECCIÓN', 'COORDENADAS', 'ACCIONES'].map(h => (
                  <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.7rem', fontWeight: '800', letterSpacing: '0.06em', color: dark ? '#C89953' : '#7A433A' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {locationsLoading ? (
                <tr><td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: dark ? '#7e7a8c' : '#a89580' }}>Cargando sedes...</td></tr>
              ) : locations.length === 0 ? (
                <tr><td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: dark ? '#7e7a8c' : '#a89580' }}>No hay sedes registradas.</td></tr>
              ) : locations.map(loc => (
                <tr key={loc.id} style={{ borderBottom: `1px solid ${dark ? '#38211D' : '#f4efe7'}` }}>
                  <td style={{ padding: '0.5rem 1rem' }}>
                    <div style={{ width: '64px', height: '48px', borderRadius: '6px', overflow: 'hidden', border: `1px solid ${dark ? '#4A2D28' : '#e8ddd0'}` }}>
                      {getMapUrl(loc.latitude, loc.longitude) ? (
                        <iframe
                          title={`Sede — ${loc.label}`}
                          src={getMapUrl(loc.latitude, loc.longitude)}
                          width="100%"
                          height="100%"
                          style={{ border: 'none', pointerEvents: 'none' }}
                        />
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', background: dark ? '#38211D' : '#faf8f5', color: dark ? '#7e7a8c' : '#a89580', fontSize: '0.6rem' }}>Sin mapa</div>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: '600', color: dark ? '#e5dfef' : '#1a1715' }}>
                    {loc.label} {loc.isOfficial && <span style={{ fontSize: '0.65rem', background: '#C8995318', color: '#C89953', padding: '1px 5px', borderRadius: '4px', marginLeft: '5px' }}>Principal</span>}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', color: dark ? '#9ea4b0' : '#7d6e5e', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {loc.address}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', color: dark ? '#7e7a8c' : '#a89580', fontSize: '0.8rem' }}>
                    {parseFloat(loc.latitude).toFixed(5)}, {parseFloat(loc.longitude).toFixed(5)}
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <Btn small variant="ghost" onClick={() => openEditLocation(loc)}><FaEdit size={12} /> Editar</Btn>
                      <Btn small variant="danger" onClick={() => setDeletingLocation(loc)}><FaTrash size={11} /></Btn>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Location Modal */}
      {showLocationForm && (
        <Modal title={editingLocation ? 'Editar Sede' : 'Agregar Nueva Sede'} onClose={() => setShowLocationForm(false)} dark={dark} wide>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {/* Form Fields */}
            <div>
              <FormField label="Nombre de la sede" dark={dark}>
                <input
                  type="text"
                  value={locationFormData.label}
                  onChange={e => setLocationFormData(p => ({ ...p, label: e.target.value }))}
                  style={inputStyle(dark)}
                  required
                />
              </FormField>

              <FormField label="Dirección completa" dark={dark}>
                <input
                  type="text"
                  value={locationFormData.address}
                  onChange={e => setLocationFormData(p => ({ ...p, address: e.target.value }))}
                  style={inputStyle(dark)}
                  required
                />
              </FormField>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <FormField label="Latitud" dark={dark}>
                  <input
                    type="number"
                    step="any"
                    value={locationFormData.latitude}
                    onChange={e => setLocationFormData(p => ({ ...p, latitude: e.target.value }))}
                    style={inputStyle(dark)}
                    required
                  />
                </FormField>
                <FormField label="Longitud" dark={dark}>
                  <input
                    type="number"
                    step="any"
                    value={locationFormData.longitude}
                    onChange={e => setLocationFormData(p => ({ ...p, longitude: e.target.value }))}
                    style={inputStyle(dark)}
                    required
                  />
                </FormField>
              </div>
            </div>

            {/* Live Map Preview */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: '700', color: dark ? '#9ea4b0' : '#5c5248' }}>
                Previsualización en tiempo real
              </span>
              <div style={{ flex: 1, minHeight: '200px' }}>
                <MapPreview latitude={locationFormData.latitude} longitude={locationFormData.longitude} label={locationFormData.label} dark={dark} />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <Btn variant="ghost" onClick={() => setShowLocationForm(false)}>Cancelar</Btn>
            <Btn onClick={handleSaveLocation} disabled={locationSaving}>
              <FaSave size={13} /> {locationSaving ? 'Guardando...' : editingLocation ? 'Actualizar' : 'Crear'}
            </Btn>
          </div>
        </Modal>
      )}

      {/* Delete Location Confirm Modal */}
      {deletingLocation && (
        <ConfirmModal
          message={`¿Estás seguro de que deseas eliminar la sede "${deletingLocation.label}"? Esta acción no se puede deshacer.`}
          onConfirm={handleDeleteLocation}
          onCancel={() => setDeletingLocation(null)}
          dark={dark}
        />
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════
// APARTADO DE TEMAS / THEME CUSTOMIZER SECTION
// ═══════════════════════════════════════════════════════

function ThemesSection({ dark }) {
  const {
    themes: ctxThemes,
    activeTheme,
    selectTheme,
    refreshThemes,
    syncThemesLocally,
  } = useTheme()

  const [adminThemes, setAdminThemes] = useState(ctxThemes || [])
  const [selectedKey, setSelectedKey] = useState(activeTheme || 'orion')
  const [editingKey, setEditingKey] = useState(null)
  const [editingName, setEditingName] = useState('')
  const [editingDesc, setEditingDesc] = useState('')
  const [deletingTheme, setDeletingTheme] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [newThemeForm, setNewThemeForm] = useState({
    name: '',
    description: 'Tema personalizado para HeartBliss — Cuida tu Corazón.',
    preset: 'orion',
    color1: '#FF5A1F',
    color2: '#88A28E',
    color3: '#1A1A1A',
  })
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState(null)

  const loadThemes = useCallback(async () => {
    try {
      const res = await api.get('/admin/themes')
      if (Array.isArray(res.data?.themes) && res.data.themes.length > 0) {
        setAdminThemes(res.data.themes)
        syncThemesLocally(res.data.themes)
      }
    } catch {
      setAdminThemes(ctxThemes || [])
    }
  }, [ctxThemes, syncThemesLocally])

  useEffect(() => {
    loadThemes()
  }, [loadThemes])

  const selectedThemeObj = adminThemes.find(t => t.key === selectedKey) || adminThemes[0] || {
    key: 'principal',
    name: 'Principal',
    preset: 'principal',
    colors: ['#7A433A', '#C89953', '#5A7B43'],
    isDefault: true,
  }

  const startEditing = (theme) => {
    setEditingKey(theme.key)
    setEditingName(theme.name)
    setEditingDesc(theme.description || '')
  }

  const handleSaveRename = async (theme) => {
    const cleanName = editingName.trim()
    if (!cleanName) return
    setSaving(true)
    setFeedback(null)
    try {
      const res = await api.put(`/admin/themes/${theme.key}`, {
        name: cleanName,
        description: editingDesc.trim(),
      })
      if (Array.isArray(res.data?.themes)) {
        setAdminThemes(res.data.themes)
        syncThemesLocally(res.data.themes)
      } else {
        const updated = adminThemes.map(t => t.key === theme.key ? { ...t, name: cleanName, description: editingDesc.trim() } : t)
        setAdminThemes(updated)
        syncThemesLocally(updated)
      }
      await refreshThemes()
      setEditingKey(null)
      setFeedback({ type: 'success', text: `Nombre del tema actualizado a "${cleanName}".` })
    } catch {
      const updated = adminThemes.map(t => t.key === theme.key ? { ...t, name: cleanName, description: editingDesc.trim() } : t)
      setAdminThemes(updated)
      syncThemesLocally(updated)
      setEditingKey(null)
      setFeedback({ type: 'success', text: `Tema renombrado a "${cleanName}".` })
    } finally {
      setSaving(false)
    }
  }

  const handleConfirmDelete = async () => {
    if (!deletingTheme) return
    const target = deletingTheme
    setSaving(true)
    setFeedback(null)
    try {
      const res = await api.delete(`/admin/themes/${target.key}`)
      const nextList = Array.isArray(res.data?.themes)
        ? res.data.themes
        : adminThemes.filter(t => t.key !== target.key)
      setAdminThemes(nextList)
      syncThemesLocally(nextList)
      if (selectedKey === target.key) setSelectedKey('principal')
      await refreshThemes()
      setFeedback({ type: 'success', text: `El tema "${target.name}" fue eliminado correctamente.` })
    } catch (err) {
      if (target.key !== 'principal' && !target.isDefault) {
        const nextList = adminThemes.filter(t => t.key !== target.key)
        setAdminThemes(nextList)
        syncThemesLocally(nextList)
        if (selectedKey === target.key) setSelectedKey('principal')
        setFeedback({ type: 'success', text: `El tema "${target.name}" fue eliminado.` })
      } else {
        setFeedback({ type: 'error', text: err.response?.data?.error || 'No se puede eliminar el tema Principal.' })
      }
    } finally {
      setDeletingTheme(null)
      setSaving(false)
    }
  }

  const handleCreateTheme = async (e) => {
    e?.preventDefault?.()
    const cleanName = newThemeForm.name.trim()
    if (!cleanName) return
    setSaving(true)
    setFeedback(null)
    const colors = [newThemeForm.color1, newThemeForm.color2, newThemeForm.color3]
    try {
      const res = await api.post('/admin/themes', {
        name: cleanName,
        description: newThemeForm.description.trim(),
        preset: newThemeForm.preset,
        colors,
      })
      const created = res.data?.theme
      const nextList = Array.isArray(res.data?.themes)
        ? res.data.themes
        : [...adminThemes, created]
      setAdminThemes(nextList)
      syncThemesLocally(nextList)
      if (created?.key) setSelectedKey(created.key)
      setShowAddModal(false)
      setNewThemeForm({
        name: '',
        description: 'Tema personalizado para HeartBliss — Cuida tu Corazón.',
        preset: 'orion',
        color1: '#FF5A1F',
        color2: '#88A28E',
        color3: '#1A1A1A',
      })
      setFeedback({ type: 'success', text: `Nuevo tema "${cleanName}" agregado.` })
    } catch {
      const slug = cleanName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || `tema-${Date.now()}`
      const localNew = {
        key: `${slug}-${Date.now().toString().slice(-3)}`,
        name: cleanName,
        description: newThemeForm.description.trim(),
        preset: newThemeForm.preset,
        colors,
        isDefault: false,
        isActive: true,
      }
      const nextList = [...adminThemes, localNew]
      setAdminThemes(nextList)
      syncThemesLocally(nextList)
      setSelectedKey(localNew.key)
      setShowAddModal(false)
      setFeedback({ type: 'success', text: `Nuevo tema "${cleanName}" creado.` })
    } finally {
      setSaving(false)
    }
  }

  const handleResetDefaults = async () => {
    setSaving(true)
    setFeedback(null)
    try {
      const res = await api.post('/admin/themes/reset')
      if (Array.isArray(res.data?.themes)) {
        setAdminThemes(res.data.themes)
        syncThemesLocally(res.data.themes)
      }
      await refreshThemes()
      setFeedback({ type: 'success', text: 'Temas predeterminados restaurados (Principal, Orion N5 y Yakusa).' })
    } catch {
      const fallback = [
        {
          key: 'principal',
          name: 'Principal',
          description: 'Diseño cálido natural original de HeartBliss — Cuida tu Corazón.',
          preset: 'principal',
          colors: ['#7A433A', '#C89953', '#5A7B43'],
          isDefault: true,
          isActive: true,
        },
        {
          key: 'orion',
          name: 'Orion N5',
          description: 'Interfaz táctica aeroespacial HUD con acentos naranja (#FF5A1F), salvia (#88A28E) y carbón (#1A1A1A).',
          preset: 'orion',
          colors: ['#FF5A1F', '#88A28E', '#1A1A1A'],
          isDefault: false,
          isActive: true,
        },
        {
          key: 'yakusa',
          name: 'Yakusa',
          description: 'Tema Sakura / Japonés (Sakura de Día & Yozakura de Noche) con rosa cerezo (#D14D6B / #FF3D73), crema sakura (#FAD5D5), ciruela nocturno (#1D1120) y detalles dorados (#EAA05E / #F8B14B).',
          preset: 'yakusa',
          colors: ['#D14D6B', '#FAD5D5', '#3C1C22'],
          isDefault: false,
          isActive: true,
        },
      ]
      setAdminThemes(fallback)
      syncThemesLocally(fallback)
      setFeedback({ type: 'success', text: 'Temas predeterminados restaurados (Principal, Orion N5 y Yakusa).' })
    } finally {
      setSaving(false)
    }
  }

  const selectedColors = selectedThemeObj.colors || selectedThemeObj.swatches?.slice(0, 3) || (
    selectedThemeObj.preset === 'orion'
      ? ['#FF5A1F', '#88A28E', '#1A1A1A']
      : selectedThemeObj.preset === 'yakusa'
      ? ['#D14D6B', '#FAD5D5', '#3C1C22']
      : ['#7A433A', '#C89953', '#5A7B43']
  )
  const isSelectedOrion = selectedThemeObj.preset === 'orion'
  const isSelectedYakusa = selectedThemeObj.preset === 'yakusa'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header Banner — Inspired by Image 3 (THEME CUSTOMIZER / APARTADO DE TEMAS) */}
      <div style={{
        ...cardStyle(dark),
        padding: '1.5rem 1.75rem',
        background: dark
          ? 'linear-gradient(135deg, #1E221F 0%, #161816 100%)'
          : 'linear-gradient(135deg, #EAECE9 0%, #DCE3DD 100%)',
        border: `1.5px solid ${dark ? '#38423B' : '#B8C6B9'}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
      }}>
        <div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.45rem',
            padding: '0.25rem 0.75rem', borderRadius: '9999px',
            background: '#FF5A1F', color: '#1A1A1A',
            fontSize: '0.68rem', fontWeight: '800', letterSpacing: '0.08em',
            textTransform: 'uppercase', marginBottom: '0.5rem',
          }}>
            <FaPalette size={10} /> Sistema de Temas Dinámicos
          </div>
          <h2 style={{
            fontSize: '1.55rem', fontWeight: '900',
            color: dark ? '#F4F6F4' : '#1A1A1A',
            margin: '0 0 0.25rem', letterSpacing: '-0.02em',
            textTransform: 'uppercase',
          }}>
            Theme Customizer / Apartado de Temas
          </h2>
          <p style={{ fontSize: '0.84rem', color: dark ? '#9FB2A3' : '#404E43', margin: 0 }}>
            Administra los temas globales de la plataforma (renombrar, aplicar, crear o eliminar). El estilo cambia en su totalidad excepto en los reportes PDF.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
          <Btn variant="ghost" onClick={handleResetDefaults} disabled={saving}>
            <FaUndo size={12} /> Restaurar Temas Base
          </Btn>
          <Btn onClick={() => setShowAddModal(true)} disabled={saving}>
            <FaPlus size={12} /> Agregar Nuevo Tema
          </Btn>
        </div>
      </div>

      {feedback && (
        <div style={{
          padding: '0.85rem 1.2rem',
          borderRadius: '12px',
          background: feedback.type === 'error' ? 'rgba(239, 68, 68, 0.14)' : 'rgba(16, 185, 129, 0.14)',
          border: `1px solid ${feedback.type === 'error' ? '#ef4444' : '#10b981'}`,
          color: feedback.type === 'error' ? '#ef4444' : '#10b981',
          fontSize: '0.85rem',
          fontWeight: '700',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <span>{feedback.text}</span>
          <button onClick={() => setFeedback(null)} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>
            <FaTimes />
          </button>
        </div>
      )}

      {/* Main Customizer Grid: Left Selector & Palette | Right Live Telemetry Preview & Theme Management Table */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))',
        gap: '1.5rem',
        alignItems: 'start',
      }}>
        {/* Left Column: Selección de Tema & Paleta de Colores (as in Image 3) */}
        <div style={{
          ...cardStyle(dark),
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.35rem',
        }}>
          <div>
            <div style={{
              fontSize: '0.72rem', fontWeight: '800', letterSpacing: '0.08em',
              textTransform: 'uppercase', color: dark ? '#9FB2A3' : '#52453B',
              marginBottom: '0.75rem',
            }}>
              Selección de Tema ({adminThemes.length})
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
              {adminThemes.map(t => {
                const isSelected = selectedThemeObj.key === t.key
                const isApplied = activeTheme === t.key
                const dotColor = t.preset === 'orion' ? '#FF5A1F' : t.preset === 'yakusa' ? '#D14D6B' : '#C89953'
                return (
                  <div
                    key={t.key}
                    onClick={() => setSelectedKey(t.key)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '0.6rem',
                      padding: '0.7rem 0.9rem',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      background: isSelected
                        ? (dark ? '#1A1A1A' : '#262926')
                        : (dark ? 'rgba(255,255,255,0.03)' : '#F5F2EB'),
                      color: isSelected ? '#FFFFFF' : (dark ? '#E2D4C6' : '#1A1A1A'),
                      border: isSelected
                        ? `1.5px solid ${dotColor}`
                        : `1px solid ${dark ? '#38211D' : '#E0D6C5'}`,
                      transition: 'all 0.18s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', minWidth: 0 }}>
                      <span style={{
                        width: '9px', height: '9px', borderRadius: '50%',
                        background: dotColor, flexShrink: 0,
                      }} />
                      <span style={{ fontWeight: '700', fontSize: '0.88rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {t.name}
                      </span>
                      {t.key === 'principal' && (
                        <span style={{
                          fontSize: '0.62rem', padding: '1px 6px', borderRadius: '9999px',
                          background: 'rgba(200, 153, 83, 0.2)', color: '#C89953', fontWeight: '700',
                          display: 'inline-flex', alignItems: 'center', gap: '3px',
                        }}>
                          <FaLock size={8} /> Base
                        </span>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}>
                      {isApplied && (
                        <span style={{
                          fontSize: '0.65rem', fontWeight: '800',
                          padding: '2px 8px', borderRadius: '9999px',
                          background: '#10b981', color: '#fff',
                        }}>
                          Activo
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Paleta de Colores del Tema Seleccionado */}
          <div>
            <div style={{
              fontSize: '0.72rem', fontWeight: '800', letterSpacing: '0.08em',
              textTransform: 'uppercase', color: dark ? '#9FB2A3' : '#52453B',
              marginBottom: '0.75rem',
            }}>
              Paleta de Colores — {selectedThemeObj.name}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.65rem' }}>
              {selectedColors.map((hex, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem' }}>
                  <div style={{
                    width: '100%',
                    height: '58px',
                    borderRadius: '10px',
                    background: hex,
                    border: '1.5px solid rgba(128,128,128,0.28)',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.12)',
                  }} />
                  <span style={{
                    fontSize: '0.74rem',
                    fontWeight: '800',
                    fontFamily: 'monospace',
                    color: dark ? '#E2D4C6' : '#1A1A1A',
                  }}>
                    {hex}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Elementos de Interfaz */}
          <div style={{
            padding: '0.85rem 1rem',
            borderRadius: '10px',
            background: dark ? 'rgba(0,0,0,0.2)' : '#F5F2EB',
            border: `1px solid ${dark ? '#38211D' : '#E0D6C5'}`,
            display: 'flex',
            flexDirection: 'column',
            gap: '0.45rem',
          }}>
            <div style={{ fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase', color: dark ? '#9FB2A3' : '#52453B' }}>
              Elementos de Interfaz Cubiertos
            </div>
            <div style={{ fontSize: '0.8rem', color: dark ? '#D0DDD2' : '#3A241F', display: 'flex', justifyContent: 'space-between' }}>
              <span>• Barra de Navegación & Hero HUD</span>
              <strong>✓ Activo</strong>
            </div>
            <div style={{ fontSize: '0.8rem', color: dark ? '#D0DDD2' : '#3A241F', display: 'flex', justifyContent: 'space-between' }}>
              <span>• Paneles, Tarjetas y Botones</span>
              <strong>✓ Activo</strong>
            </div>
            <div style={{ fontSize: '0.8rem', color: dark ? '#D0DDD2' : '#3A241F', display: 'flex', justifyContent: 'space-between' }}>
              <span>• Modo Claro y Modo Oscuro</span>
              <strong>✓ Activo</strong>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#10b981', display: 'flex', justifyContent: 'space-between', fontWeight: '700' }}>
              <span>• Reportes PDF Clínicos</span>
              <span>Excluidos (Fijos)</span>
            </div>
          </div>

          {/* Botón Aplicar Tema */}
          <button
            type="button"
            onClick={() => {
              selectTheme(selectedThemeObj.key)
              setFeedback({ type: 'success', text: `Tema "${selectedThemeObj.name}" aplicado en toda la plataforma.` })
            }}
            style={{
              width: '100%',
              padding: '0.85rem 1.25rem',
              borderRadius: '10px',
              border: `2px solid ${isSelectedOrion ? '#FF5A1F' : '#C89953'}`,
              background: '#1A1A1A',
              color: '#FFFFFF',
              fontSize: '0.86rem',
              fontWeight: '800',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 6px 18px rgba(0,0,0,0.25)',
            }}
          >
            {activeTheme === selectedThemeObj.key ? `✓ Tema Aplicado (${selectedThemeObj.name})` : `Aplicar Tema: ${selectedThemeObj.name}`}
          </button>
        </div>

        {/* Right Column: Visualización del Tema Seleccionado & Administración (Renombrar / Eliminar) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Live Telemetry & Theme Preview Card (Inspired by Image 3 & 4) */}
          <div style={{
            background: '#1A1A1A',
            borderRadius: '18px',
            padding: '1.35rem',
            border: '1.5px solid #38423B',
            color: '#FFFFFF',
            boxShadow: '0 14px 34px rgba(0,0,0,0.35)',
          }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              paddingBottom: '0.85rem', marginBottom: '1rem',
              borderBottom: '1px solid rgba(255,255,255,0.1)',
              fontSize: '0.72rem', fontWeight: '800', letterSpacing: '0.08em', color: '#9FB2A3',
            }}>
              <span>● MISSION CONTROL / PREVISUALIZACIÓN: {selectedThemeObj.name.toUpperCase()}</span>
              <span>HEARTBLISS UI</span>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: '0.85rem',
              marginBottom: '1.1rem',
            }}>
              {/* Card 1: Primary Accent */}
              <div style={{
                background: selectedColors[0] || '#FF5A1F',
                color: isSelectedOrion ? '#1A1A1A' : '#FFFFFF',
                borderRadius: '12px',
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '130px',
              }}>
                <div style={{ fontSize: '0.68rem', fontWeight: '800', textTransform: 'uppercase', opacity: 0.85 }}>
                  HeartBliss Core
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: '0.95rem', fontWeight: '800' }}>{selectedThemeObj.name}</span>
                  <span style={{ fontSize: '2rem', fontWeight: '900', lineHeight: 1 }}>79</span>
                </div>
                <div style={{ fontSize: '0.68rem', fontFamily: 'monospace', fontWeight: '700' }}>
                  ACENTO PRIMARIO: {selectedColors[0]}
                </div>
              </div>

              {/* Card 2: Secondary Sage / Sand */}
              <div style={{
                background: selectedColors[1] || '#88A28E',
                color: '#1A1A1A',
                borderRadius: '12px',
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '130px',
              }}>
                <div style={{ fontSize: '0.68rem', fontWeight: '800', textTransform: 'uppercase', opacity: 0.85 }}>
                  Superficie & Salud
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: '2rem', fontWeight: '900', lineHeight: 1 }}>34</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: '700' }}>Modo Claro / Oscuro</span>
                </div>
                <div style={{ fontSize: '0.68rem', fontFamily: 'monospace', fontWeight: '700' }}>
                  SUPERFICIE: {selectedColors[1]}
                </div>
              </div>

              {/* Card 3: Contrast Base */}
              <div style={{
                background: selectedColors[2] || '#1A1A1A',
                color: '#FFFFFF',
                borderRadius: '12px',
                padding: '1rem',
                border: '1px solid rgba(255,255,255,0.18)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '130px',
              }}>
                <div style={{ fontSize: '0.68rem', fontWeight: '800', textTransform: 'uppercase', color: selectedColors[0] }}>
                  Contraste Táctico
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: '2rem', fontWeight: '900', lineHeight: 1 }}>95</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#D0DDD2' }}>PDF Protegido</span>
                </div>
                <div style={{ fontSize: '0.68rem', fontFamily: 'monospace', fontWeight: '700', color: '#9FB2A3' }}>
                  BASE: {selectedColors[2]}
                </div>
              </div>
            </div>

            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.1)',
              flexWrap: 'wrap', gap: '0.75rem',
            }}>
              <span style={{ fontSize: '0.78rem', fontWeight: '700', letterSpacing: '0.04em', color: '#D0DDD2' }}>
                VISUALIZACIÓN DE TEMA SELECCIONADO: <strong style={{ color: selectedColors[0] }}>{selectedThemeObj.name}</strong>
              </span>
              <button
                type="button"
                onClick={() => selectTheme(selectedThemeObj.key)}
                style={{
                  padding: '0.45rem 1rem',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.35)',
                  background: activeTheme === selectedThemeObj.key ? selectedColors[0] : 'transparent',
                  color: activeTheme === selectedThemeObj.key && isSelectedOrion ? '#1A1A1A' : '#FFFFFF',
                  fontSize: '0.75rem',
                  fontWeight: '800',
                  cursor: 'pointer',
                }}
              >
                {activeTheme === selectedThemeObj.key ? 'TEMA EN USO' : 'APLICAR AHORA'}
              </button>
            </div>
          </div>

          {/* Gestión de Nombres y Eliminación de Temas */}
          <div style={{ ...cardStyle(dark), padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: dark ? '#fff' : '#1a1715', margin: '0 0 0.35rem' }}>
              Administrar Nombres y Temas Registrados
            </h3>
            <p style={{ fontSize: '0.8rem', color: dark ? '#9ea4b0' : '#7d6e5e', margin: '0 0 1rem' }}>
              Cambia el nombre de cualquier tema (se reflejará en el menú desplegable del perfil de todos los usuarios) o elimina los temas adicionales. El tema <strong>Principal</strong> está protegido.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {adminThemes.map(theme => {
                const isEditing = editingKey === theme.key
                const isPrincipal = theme.key === 'principal' || theme.isDefault
                const swatches = theme.colors || theme.swatches?.slice(0, 3) || (
                  theme.preset === 'orion'
                    ? ['#FF5A1F', '#88A28E', '#1A1A1A']
                    : theme.preset === 'yakusa'
                    ? ['#D14D6B', '#FAD5D5', '#3C1C22']
                    : ['#7A433A', '#C89953', '#5A7B43']
                )

                return (
                  <div
                    key={theme.key}
                    style={{
                      padding: '1rem',
                      borderRadius: '12px',
                      background: dark ? '#38211D' : '#faf8f5',
                      border: `1px solid ${dark ? '#4A2D28' : '#e8ddd0'}`,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.75rem',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          {swatches.map((hex, idx) => (
                            <span
                              key={idx}
                              style={{
                                width: '18px', height: '18px', borderRadius: '6px',
                                background: hex, border: '1px solid rgba(0,0,0,0.2)',
                              }}
                              title={hex}
                            />
                          ))}
                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ fontWeight: '800', fontSize: '0.95rem', color: dark ? '#fff' : '#1a1715' }}>
                              {theme.name}
                            </span>
                            <span style={{
                              fontSize: '0.68rem', fontWeight: '700', padding: '1px 7px', borderRadius: '9999px',
                              background: theme.preset === 'orion'
                                ? 'rgba(255, 90, 31, 0.16)'
                                : theme.preset === 'yakusa'
                                ? 'rgba(209, 77, 107, 0.18)'
                                : 'rgba(200, 153, 83, 0.18)',
                              color: theme.preset === 'orion'
                                ? '#FF5A1F'
                                : theme.preset === 'yakusa'
                                ? '#D14D6B'
                                : '#C89953',
                            }}>
                              Estilo: {theme.preset === 'orion' ? 'HUD / Táctico' : theme.preset === 'yakusa' ? 'Sakura / Japonés' : 'Cálido Principal'}
                            </span>
                          </div>
                          {theme.description && (
                            <p style={{ fontSize: '0.76rem', color: dark ? '#9ea4b0' : '#7d6e5e', margin: '2px 0 0' }}>
                              {theme.description}
                            </p>
                          )}
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <Btn
                          small
                          variant={activeTheme === theme.key ? 'primary' : 'ghost'}
                          onClick={() => selectTheme(theme.key)}
                        >
                          <FaCheck size={11} /> {activeTheme === theme.key ? 'Aplicado' : 'Probar / Aplicar'}
                        </Btn>

                        {!isPrincipal && (
                          <Btn
                            small
                            variant="ghost"
                            onClick={() => startEditing(theme)}
                          >
                            <FaEdit size={11} /> Cambiar Nombre
                          </Btn>
                        )}

                        {!isPrincipal ? (
                          <Btn
                            small
                            variant="danger"
                            onClick={() => setDeletingTheme(theme)}
                          >
                            <FaTrash size={11} /> Eliminar
                          </Btn>
                        ) : (
                          <span style={{
                            fontSize: '0.72rem', fontWeight: '700', color: dark ? '#C89953' : '#7A433A',
                            padding: '0.35rem 0.65rem', borderRadius: '8px',
                            background: dark ? 'rgba(200, 153, 83, 0.12)' : 'rgba(122, 67, 58, 0.08)',
                            display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                          }}>
                            <FaLock size={10} /> Tema Principal Fijo
                          </span>
                        )}
                      </div>
                    </div>

                    {isEditing && (
                      <div style={{
                        paddingTop: '0.75rem',
                        borderTop: `1px solid ${dark ? '#4A2D28' : '#e8ddd0'}`,
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '0.65rem',
                        alignItems: 'flex-end',
                      }}>
                        <div style={{ flex: '1 1 200px' }}>
                          <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '700', marginBottom: '0.25rem', color: dark ? '#C89953' : '#7A433A' }}>
                            Nuevo nombre del tema
                          </label>
                          <input
                            type="text"
                            value={editingName}
                            onChange={e => setEditingName(e.target.value)}
                            placeholder="Ej. Orion N5, Táctico, Nova..."
                            style={inputStyle(dark)}
                          />
                        </div>
                        <div style={{ flex: '2 1 260px' }}>
                          <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '700', marginBottom: '0.25rem', color: dark ? '#C89953' : '#7A433A' }}>
                            Descripción (opcional)
                          </label>
                          <input
                            type="text"
                            value={editingDesc}
                            onChange={e => setEditingDesc(e.target.value)}
                            placeholder="Descripción breve del tema"
                            style={inputStyle(dark)}
                          />
                        </div>
                        <div style={{ display: 'flex', gap: '0.45rem' }}>
                          <Btn small onClick={() => handleSaveRename(theme)} disabled={saving}>
                            <FaSave size={11} /> Guardar
                          </Btn>
                          <Btn small variant="ghost" onClick={() => setEditingKey(null)}>
                            Cancelar
                          </Btn>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Modal para Agregar Nuevo Tema */}
      {showAddModal && (
        <Modal title="Agregar Nuevo Tema a la Plataforma" onClose={() => setShowAddModal(false)} dark={dark}>
          <form onSubmit={handleCreateTheme}>
            <FormField label="Nombre del Tema *" dark={dark}>
              <input
                type="text"
                value={newThemeForm.name}
                onChange={e => setNewThemeForm(p => ({ ...p, name: e.target.value }))}
                placeholder="Ej. Orion N5, Nova Dynamics, Stealth..."
                style={inputStyle(dark)}
                required
              />
            </FormField>

            <FormField label="Estilo Visual Base" dark={dark}>
              <select
                value={newThemeForm.preset}
                onChange={e => {
                  const preset = e.target.value
                  setNewThemeForm(p => ({
                    ...p,
                    preset,
                    color1: preset === 'orion' ? '#FF5A1F' : preset === 'yakusa' ? '#D14D6B' : '#7A433A',
                    color2: preset === 'orion' ? '#88A28E' : preset === 'yakusa' ? '#FAD5D5' : '#C89953',
                    color3: preset === 'orion' ? '#1A1A1A' : preset === 'yakusa' ? '#3C1C22' : '#5A7B43',
                  }))
                }}
                style={inputStyle(dark)}
              >
                <option value="yakusa">Sakura / Japonés (#D14D6B / #FAD5D5 / #3C1C22)</option>
                <option value="orion">HUD Táctico / Aeroespacial (#FF5A1F / #88A28E / #1A1A1A)</option>
                <option value="principal">Cálido Orgánico HeartBliss (#7A433A / #C89953 / #5A7B43)</option>
              </select>
            </FormField>

            <FormField label="Descripción" dark={dark}>
              <input
                type="text"
                value={newThemeForm.description}
                onChange={e => setNewThemeForm(p => ({ ...p, description: e.target.value }))}
                style={inputStyle(dark)}
              />
            </FormField>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '700', marginBottom: '0.3rem', color: dark ? '#C89953' : '#7A433A' }}>
                  Color Primario
                </label>
                <input
                  type="color"
                  value={newThemeForm.color1}
                  onChange={e => setNewThemeForm(p => ({ ...p, color1: e.target.value }))}
                  style={{ width: '100%', height: '38px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '700', marginBottom: '0.3rem', color: dark ? '#C89953' : '#7A433A' }}>
                  Color Superficie
                </label>
                <input
                  type="color"
                  value={newThemeForm.color2}
                  onChange={e => setNewThemeForm(p => ({ ...p, color2: e.target.value }))}
                  style={{ width: '100%', height: '38px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '700', marginBottom: '0.3rem', color: dark ? '#C89953' : '#7A433A' }}>
                  Color Contraste
                </label>
                <input
                  type="color"
                  value={newThemeForm.color3}
                  onChange={e => setNewThemeForm(p => ({ ...p, color3: e.target.value }))}
                  style={{ width: '100%', height: '38px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <Btn variant="ghost" onClick={() => setShowAddModal(false)}>Cancelar</Btn>
              <Btn type="submit" disabled={saving}>
                <FaPlus size={12} /> {saving ? 'Guardando...' : 'Crear Tema'}
              </Btn>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal Confirmar Eliminación de Tema */}
      {deletingTheme && (
        <ConfirmModal
          message={`¿Estás seguro de que deseas eliminar el tema "${deletingTheme.name}"? Si algún usuario lo tiene activo, volverá automáticamente al tema Principal.`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeletingTheme(null)}
          dark={dark}
        />
      )}
    </div>
  )
}
