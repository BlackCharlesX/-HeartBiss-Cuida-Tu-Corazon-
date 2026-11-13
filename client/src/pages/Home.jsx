import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaHeart, FaRegHeart, FaHeartbeat, FaBookMedical, FaHandsHelping, FaChartLine, FaTimes, FaNewspaper, FaThumbtack, FaGlobe, FaMapMarkerAlt, FaAndroid, FaDownload } from 'react-icons/fa'
import { HiArrowRight } from 'react-icons/hi'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { useModules } from '../context/ModuleContext'
import api, { getApiBaseUrl } from '../services/api'
import logoLight from '../assets/logo-light.png'
import logoDark from '../assets/logo-dark.png'
import logoOrionLight from '../assets/logo-orion-light.png'
import logoOrionDark from '../assets/logo-orion-dark.png'
import logoYakusaLight from '../assets/logo-yakusa-light.png'
import logoYakusaDark from '../assets/logo-yakusa-dark.png'



const API_BASE = getApiBaseUrl()
const newsImgSrc = (p) => !p ? null : p.startsWith('http') ? p : `${API_BASE}/${p}`
const fmtDate = (d) => d ? new Date(d).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' }) : ''

const allFeatures = [
  {
    key: 'diseases',
    icon: FaBookMedical,
    title: 'Información sobre ECNT',
    description: 'Conoce sobre diabetes, hipertensión, obesidad y otras enfermedades crónicas no transmisibles.',
    to: '/enfermedades',
    color: '#7A433A',
  },
  {
    key: 'programs',
    icon: FaHandsHelping,
    title: 'Programas Sociales',
    description: 'Descubre programas de apoyo enfocados en la salud y bienestar integral de los jóvenes.',
    to: '/programas',
    color: '#C89953',
  },
  {
    key: 'health_tracking',
    icon: FaChartLine,
    title: 'Seguimiento de Salud',
    description: 'Registra y monitorea tus indicadores cardiovasculares y metabólicos con gráficas personalizadas.',
    to: '/login',
    color: '#5A7B43',
  },
]

const statsMexico = [
  { value: '41.1%', label: 'Sobrepeso y Obesidad', desc: 'En adolescentes y jóvenes, siendo el detonante principal de diabetes e hipertensión prematuras.' },
  { value: '14.6M+', label: 'Diabetes en México', desc: 'Prevalencia total estimada en adultos, con una incidencia alarmante y a menor edad (ENSANUT).' },
  { value: '30M+', label: 'Hipertensión Arterial', desc: 'Estimado de personas viviendo con presión alta; el 65% desconoce que tiene esta condición.' },
  { value: '2 de 3', label: 'Consumo de Azúcar', desc: 'Jóvenes exceden el límite diario de azúcares recomendados por la OMS.' },
  { value: '< 20%', label: 'Detección Oportuna', desc: 'De los jóvenes acuden a realizarse pruebas de tamizaje o control médico anual.' }
]

const statsTamaulipas = [
  { value: '49%', label: 'Malnutrición Escolar', desc: 'De jóvenes entre 10 y 19 años presentan sobrepeso u obesidad en el estado.' },
  { value: '21.4K+', label: 'Diabetes Tipo 2', desc: 'Casos acumulados bajo control en el estado durante el último ciclo epidemiológico.' },
  { value: '37.7K+', label: 'Hipertensión Estatal', desc: 'Casos activos bajo monitoreo y control en el sector de salud pública estatal.' },
  { value: '20 años', label: 'Diagnóstico Precoz', desc: 'Edad promedio en la que comienzan a registrarse casos de diabetes e hipertensión.' },
  { value: '199K+', label: 'Casos en Seguimiento', desc: 'Personas con obesidad o riesgo metabólico bajo monitoreo de salud en el estado.' }
]

export default function Home() {
  const { isAuthenticated, user } = useAuth()
  const { dark, activePreset } = useTheme()
  const isOrion = activePreset === 'orion'
  const isYakusa = activePreset === 'yakusa'
  const { isModuleEnabled } = useModules()
  const [featuredNews, setFeaturedNews] = useState([])
  const [apkInfo, setApkInfo] = useState(null)
  const [downloadingApk, setDownloadingApk] = useState(false)
  const [apkNotice, setApkNotice] = useState('')

  const activeFeatures = allFeatures.filter(f => isModuleEnabled(f.key))

  useEffect(() => {
    api.get('/news/featured').then(r => setFeaturedNews(r.data.posts || [])).catch(() => { })
    api.get('/app/latest-apk').then(r => {
      if (r.data?.available) {
        setApkInfo(r.data)
      }
    }).catch(() => { })
  }, [])

  const handleDownloadApk = (e) => {
    e?.preventDefault?.()
    setDownloadingApk(true)
    setApkNotice('')

    const downloadUrl = `${API_BASE}/api/app/download-apk`

    api.get('/app/latest-apk')
      .then(res => {
        if (res.data?.available) {
          setApkInfo(res.data)
          const link = document.createElement('a')
          link.href = downloadUrl
          link.setAttribute('download', res.data.fileName || 'heartbliss-cuida-tu-corazon.apk')
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          setApkNotice('Descarga de APK iniciada.')
        } else {
          setApkNotice('El archivo APK estará disponible próximamente.')
        }
      })
      .catch(() => {
        window.location.href = downloadUrl
      })
      .finally(() => {
        setTimeout(() => setDownloadingApk(false), 2000)
        setTimeout(() => setApkNotice(''), 4500)
      })
  }

  return (
    <div>
      {/* Hero Section — HeartBliss Cuida tu Corazón (Principal, Orion HUD & Yakusa Sakura Themes) */}
      <section style={{
        position: 'relative',
        minHeight: '86vh',
        display: 'flex',
        alignItems: 'center',
        background: isOrion
          ? (dark
            ? 'linear-gradient(rgba(136, 162, 142, 0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(136, 162, 142, 0.06) 1px, transparent 1px), radial-gradient(circle at 76% 36%, rgba(46, 92, 64, 0.25) 0%, transparent 45%), radial-gradient(circle at 22% 80%, rgba(255, 90, 31, 0.12) 0%, transparent 40%), linear-gradient(135deg, #161816 0%, #1E2420 55%, #161816 100%)'
            : 'linear-gradient(rgba(26, 26, 26, 0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(26, 26, 26, 0.06) 1px, transparent 1px), radial-gradient(circle at 76% 36%, rgba(136, 162, 142, 0.35) 0%, transparent 48%), linear-gradient(135deg, #C9D6CA 0%, #BFCFC0 55%, #B8C8B9 100%)')
          : isYakusa
          ? (dark
            ? 'radial-gradient(circle at 78% 34%, rgba(255, 61, 115, 0.24) 0%, transparent 46%), radial-gradient(circle at 20% 82%, rgba(248, 177, 75, 0.14) 0%, transparent 40%), linear-gradient(135deg, #1D1120 0%, #2D1A33 56%, #1D1120 100%)'
            : 'radial-gradient(circle at 78% 34%, rgba(209, 77, 107, 0.16) 0%, transparent 46%), radial-gradient(circle at 18% 82%, rgba(234, 160, 94, 0.18) 0%, transparent 42%), linear-gradient(135deg, #FFF3F3 0%, #FCE5E5 55%, #FAD5D5 100%)')
          : (dark
            ? 'radial-gradient(circle at 76% 32%, rgba(77, 104, 62, 0.28) 0%, transparent 42%), radial-gradient(circle at 82% 84%, rgba(139, 30, 24, 0.36) 0%, transparent 45%), radial-gradient(circle at 18% 82%, rgba(200, 153, 83, 0.16) 0%, transparent 38%), linear-gradient(135deg, #1F1210 0%, #2B1815 58%, #1F1210 100%)'
            : 'radial-gradient(circle at 76% 32%, rgba(90, 123, 67, 0.16) 0%, transparent 44%), radial-gradient(circle at 18% 82%, rgba(200, 153, 83, 0.20) 0%, transparent 42%), linear-gradient(135deg, #F8F4EB 0%, #F3ECDC 55%, #E6DBC9 100%)'),
        backgroundSize: isOrion ? '38px 38px, 38px 38px, 100% 100%, 100% 100%, 100% 100%' : 'auto',
        overflow: 'hidden',
        borderBottom: `1px solid ${isOrion ? (dark ? '#38423B' : '#9EB2A0') : isYakusa ? (dark ? '#3D2445' : '#F2BFC2') : (dark ? '#38211D' : '#E6DBC9')}`,
      }}>
        {/* Yakusa Japanese Seigaiha Waves & Sakura Petals Overlay (matching Image 1 & 2) */}
        {isYakusa && (
          <svg
            viewBox="0 0 1440 720"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
              zIndex: 2,
            }}
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <pattern id="seigaiha-pattern" width="80" height="40" patternUnits="userSpaceOnUse">
                <path d="M 0 40 A 40 40 0 0 1 80 40 M 10 40 A 30 30 0 0 1 70 40 M 20 40 A 20 20 0 0 1 60 40 M 30 40 A 10 10 0 0 1 50 40" stroke={dark ? '#F8B14B' : '#EAA05E'} strokeWidth="1.2" fill="none" opacity={dark ? '0.22' : '0.32'} />
                <path d="M -40 20 A 40 40 0 0 1 40 20 M -30 20 A 30 30 0 0 1 30 20 M -20 20 A 20 20 0 0 1 20 20 M 40 20 A 40 40 0 0 1 120 20 M 50 20 A 30 30 0 0 1 110 20 M 60 20 A 20 20 0 0 1 100 20" stroke={dark ? '#F8B14B' : '#EAA05E'} strokeWidth="1.2" fill="none" opacity={dark ? '0.22' : '0.32'} />
              </pattern>
            </defs>
            {/* Top-left & Bottom-left Seigaiha traditional wave clouds */}
            <ellipse cx="110" cy="40" rx="220" ry="110" fill="url(#seigaiha-pattern)" />
            <ellipse cx="140" cy="690" rx="280" ry="120" fill="url(#seigaiha-pattern)" />
            <ellipse cx="1280" cy="690" rx="260" ry="115" fill="url(#seigaiha-pattern)" />

            {/* Floating Sakura Petals across Hero */}
            {[
              { x: 280, y: 85, r: 25, s: 1 },
              { x: 420, y: 55, r: -18, s: 0.85 },
              { x: 350, y: 145, r: 42, s: 1.1 },
              { x: 580, y: 95, r: -30, s: 0.9 },
              { x: 740, y: 70, r: 15, s: 1 },
              { x: 88, y: 390, r: -25, s: 0.95 },
              { x: 260, y: 635, r: 35, s: 0.9 },
              { x: 540, y: 615, r: -20, s: 0.85 },
              { x: 830, y: 585, r: 28, s: 1 },
              { x: 1320, y: 120, r: -35, s: 1.05 },
              { x: 1240, y: 540, r: 22, s: 0.95 },
            ].map((p, idx) => (
              <g key={idx} transform={`translate(${p.x}, ${p.y}) rotate(${p.r}) scale(${p.s})`}>
                <path
                  d="M0,0 C6,-10 18,-10 22,0 C18,8 8,12 0,0 Z"
                  fill={dark ? '#FF5C8A' : '#F49DB0'}
                  stroke={dark ? '#FFD4E5' : '#D14D6B'}
                  strokeWidth="0.8"
                  opacity={dark ? '0.85' : '0.8'}
                />
              </g>
            ))}
          </svg>
        )}
        {/* Orion Tactical HUD Frame & Corner Brackets (matching Image 2) */}
        {isOrion && (
          <div style={{
            position: 'absolute',
            inset: '20px 24px',
            border: `1px solid ${dark ? 'rgba(136, 162, 142, 0.22)' : 'rgba(26, 26, 26, 0.22)'}`,
            borderRadius: '18px',
            pointerEvents: 'none',
            zIndex: 2,
          }}>
            {/* Top-left bracket */}
            <span style={{
              position: 'absolute', top: '-2px', left: '-2px', width: '26px', height: '26px',
              borderTop: `3.5px solid ${dark ? '#88A28E' : '#1A1A1A'}`,
              borderLeft: `3.5px solid ${dark ? '#88A28E' : '#1A1A1A'}`,
              borderTopLeftRadius: '10px',
            }} />
            {/* Top-right bracket */}
            <span style={{
              position: 'absolute', top: '-2px', right: '-2px', width: '26px', height: '26px',
              borderTop: `3.5px solid ${dark ? '#88A28E' : '#1A1A1A'}`,
              borderRight: `3.5px solid ${dark ? '#88A28E' : '#1A1A1A'}`,
              borderTopRightRadius: '10px',
            }} />
            {/* Bottom-left bracket */}
            <span style={{
              position: 'absolute', bottom: '-2px', left: '-2px', width: '26px', height: '26px',
              borderBottom: `3.5px solid ${dark ? '#FF5A1F' : '#1A1A1A'}`,
              borderLeft: `3.5px solid ${dark ? '#FF5A1F' : '#1A1A1A'}`,
              borderBottomLeftRadius: '10px',
            }} />
            {/* Bottom-right bracket */}
            <span style={{
              position: 'absolute', bottom: '-2px', right: '-2px', width: '26px', height: '26px',
              borderBottom: `3.5px solid ${dark ? '#FF5A1F' : '#1A1A1A'}`,
              borderRight: `3.5px solid ${dark ? '#FF5A1F' : '#1A1A1A'}`,
              borderBottomRightRadius: '10px',
            }} />
            {/* Telemetry status blocks ■■■■ at bottom right */}
            <div style={{
              position: 'absolute', bottom: '-12px', right: '28px',
              display: 'flex', gap: '3px', alignItems: 'center',
            }}>
              {[0, 1, 2, 3].map(idx => (
                <span key={idx} style={{
                  width: '5px', height: '5px',
                  background: dark ? '#88A28E' : '#1A1A1A',
                  opacity: 0.75,
                }} />
              ))}
            </div>
          </div>
        )}
        {/* Ambient organic glow blobs */}
        <div style={{
          position: 'absolute',
          top: '12%', right: '8%',
          width: '340px', height: '340px',
          borderRadius: '50%',
          background: dark
            ? 'radial-gradient(circle, rgba(77, 104, 62, 0.28), transparent 70%)'
            : 'radial-gradient(circle, rgba(90, 123, 67, 0.18), transparent 70%)',
          filter: 'blur(50px)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute',
          bottom: '8%', right: '14%',
          width: '280px', height: '280px',
          borderRadius: '50%',
          background: dark
            ? 'radial-gradient(circle, rgba(139, 30, 24, 0.35), transparent 70%)'
            : 'radial-gradient(circle, rgba(200, 153, 83, 0.22), transparent 70%)',
          filter: 'blur(45px)',
          pointerEvents: 'none',
        }} />

        {/* Decorative flowing wave lines at bottom of Hero (matching Image 1) */}
        <svg
          viewBox="0 0 1440 220"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '180px',
            pointerEvents: 'none',
            opacity: dark ? 0.35 : 0.42,
          }}
          preserveAspectRatio="none"
        >
          <path
            d="M380 215 C 520 140, 640 95, 760 155 C 880 215, 980 85, 1140 120 C 1260 145, 1360 90, 1440 110"
            stroke={dark ? '#8B1E18' : '#7A433A'}
            strokeWidth="1.6"
            fill="none"
          />
          <path
            d="M450 220 C 590 155, 700 110, 820 168 C 940 220, 1040 105, 1190 135 C 1300 155, 1380 110, 1440 130"
            stroke={dark ? '#C89953' : '#A88455'}
            strokeWidth="1.3"
            fill="none"
          />
          <path
            d="M520 220 C 660 170, 770 125, 890 180 C 1000 225, 1100 125, 1240 150 C 1330 165, 1400 130, 1440 145"
            stroke={dark ? '#4D683E' : '#5A7B43'}
            strokeWidth="1.2"
            fill="none"
          />
        </svg>

        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '3.5rem 2.25rem', width: '100%', position: 'relative', zIndex: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '3rem', flexWrap: 'wrap' }}>
          <div style={{ maxWidth: '640px', flex: '1 1 480px' }}>
            {/* Top Pill Badge: ♥ HeartBliss */}
            <div className="animate-fade-in-up" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.42rem 1.1rem',
              borderRadius: '9999px',
              background: isOrion
                ? (dark ? '#2A2F2B' : '#B5C5B7')
                : isYakusa
                ? (dark ? '#2D1A33' : '#FAD5D5')
                : (dark ? '#2B1815' : '#E6DBC9'),
              border: isOrion
                ? `1px solid ${dark ? 'rgba(136, 162, 142, 0.3)' : 'rgba(26, 26, 26, 0.18)'}`
                : isYakusa
                ? `2px double ${dark ? '#F8B14B' : '#D14D6B'}`
                : `1px solid ${dark ? 'rgba(200, 153, 83, 0.28)' : 'rgba(122, 67, 58, 0.16)'}`,
              marginBottom: '1.5rem',
              fontSize: isOrion ? '0.8rem' : '0.88rem',
              fontWeight: '800',
              letterSpacing: isOrion ? '0.06em' : 'normal',
              textTransform: isOrion ? 'uppercase' : 'none',
              color: isOrion
                ? (dark ? '#D8A868' : '#1A1A1A')
                : isYakusa
                ? (dark ? '#FFD4E5' : '#3C1C22')
                : (dark ? '#C89953' : '#7A433A'),
              boxShadow: dark ? '0 2px 10px rgba(0,0,0,0.3)' : '0 2px 8px rgba(58, 36, 31, 0.06)',
            }}>
              <FaHeart size={13} style={{ color: isOrion ? (dark ? '#D8A868' : '#1A1A1A') : isYakusa ? (dark ? '#F8B14B' : '#3C1C22') : (dark ? '#C89953' : '#7A433A') }} />
              {isOrion ? 'HEARTBLISS' : 'HeartBliss'}
            </div>

            <h1 className="animate-fade-in-up stagger-1" style={{
              fontSize: 'clamp(2.5rem, 5vw, 4.1rem)',
              fontWeight: '800',
              fontFamily: "'Outfit', 'Inter', sans-serif",
              color: isOrion
                ? (dark ? '#FFFFFF' : '#1A1A1A')
                : isYakusa
                ? (dark ? '#FFFFFF' : '#3C1C22')
                : (dark ? '#F5ECE1' : '#3A241F'),
              lineHeight: '1.08',
              letterSpacing: '-0.025em',
              marginBottom: '1.5rem',
            }}>
              Tu salud importa,
              <br />
              <span style={{
                color: isOrion
                  ? (dark ? '#FF5A1F' : '#1A1A1A')
                  : isYakusa
                  ? (dark ? '#FF3D73' : '#4E1F28')
                  : (dark ? '#C89953' : '#4E241C'),
              }}>
                infórmate y actúa
              </span>
            </h1>

            <p className="animate-fade-in-up stagger-2" style={{
              fontSize: '1.1rem',
              color: isOrion
                ? (dark ? '#D0DDD2' : '#263028')
                : isYakusa
                ? (dark ? '#FFD4E5' : '#4F242C')
                : (dark ? '#D9C8B8' : '#4B322A'),
              lineHeight: '1.75',
              marginBottom: '2.25rem',
              maxWidth: '560px',
              fontWeight: '400',
            }}>
              Plataforma digital para jóvenes de 18 a 29 años con información sobre
              enfermedades crónicas, programas de apoyo social y herramientas de
              seguimiento de salud personalizado.
            </p>

            <div className="animate-fade-in-up stagger-3" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
              {isAuthenticated ? (
                <Link
                  to={user?.role === 'admin' ? '/admin' : user?.role === 'doctor' ? '/doctor' : '/dashboard'}
                  className={isOrion ? 'orion-hazard-btn' : ''}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.55rem',
                    padding: '0.9rem 2rem',
                    borderRadius: '9999px',
                    background: isOrion
                      ? (dark ? '#FF5A1F' : '#1A1A1A')
                      : isYakusa
                      ? (dark
                        ? 'linear-gradient(135deg, #FF5C8A 0%, #FF3D73 55%, #D14D6B 100%)'
                        : 'linear-gradient(135deg, #FAD5D5 0%, #F4B3BE 55%, #EA869A 100%)')
                      : 'linear-gradient(135deg, #D6AA65 0%, #C89953 55%, #B0803B 100%)',
                    color: isOrion
                      ? (dark ? '#1A1A1A' : '#FFFFFF')
                      : isYakusa
                      ? (dark ? '#FFFFFF' : '#3C1C22')
                      : (dark ? '#1F1210' : '#FFFFFF'),
                    textDecoration: 'none',
                    fontWeight: '700',
                    fontSize: '0.98rem',
                    border: isOrion
                      ? `1.5px solid ${dark ? '#FF5A1F' : '#1A1A1A'}`
                      : isYakusa
                      ? (dark ? '1.5px solid #FF85A6' : '2px double #D14D6B')
                      : 'none',
                    boxShadow: isOrion
                      ? (dark ? '0 8px 25px rgba(255, 90, 31, 0.45)' : '0 8px 22px rgba(26, 26, 26, 0.32)')
                      : isYakusa
                      ? (dark
                        ? '0 8px 28px rgba(255, 61, 115, 0.55), 0 0 16px rgba(255, 61, 115, 0.32)'
                        : '0 8px 22px rgba(209, 77, 107, 0.28)')
                      : (dark
                        ? '0 8px 25px rgba(200, 153, 83, 0.45), 0 0 15px rgba(200, 153, 83, 0.25)'
                        : '0 8px 22px rgba(200, 153, 83, 0.42)'),
                    transition: 'all 0.25s ease',
                  }}
                >
                  {user?.role === 'admin' ? 'Ir al Panel Admin' : user?.role === 'doctor' ? 'Ir al Panel Médico' : 'Ir a Mi Salud'}
                  <HiArrowRight />
                </Link>
              ) : (
                <Link
                  to="/registro"
                  className={isOrion ? 'orion-hazard-btn' : ''}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.55rem',
                    padding: '0.9rem 2rem',
                    borderRadius: '9999px',
                    background: isOrion
                      ? (dark ? '#FF5A1F' : '#1A1A1A')
                      : isYakusa
                      ? (dark
                        ? 'linear-gradient(135deg, #FF5C8A 0%, #FF3D73 55%, #D14D6B 100%)'
                        : 'linear-gradient(135deg, #FAD5D5 0%, #F4B3BE 55%, #EA869A 100%)')
                      : 'linear-gradient(135deg, #D6AA65 0%, #C89953 55%, #B0803B 100%)',
                    color: isOrion
                      ? (dark ? '#1A1A1A' : '#FFFFFF')
                      : isYakusa
                      ? (dark ? '#FFFFFF' : '#3C1C22')
                      : (dark ? '#1F1210' : '#FFFFFF'),
                    textDecoration: 'none',
                    fontWeight: '700',
                    fontSize: '0.98rem',
                    border: isOrion
                      ? `1.5px solid ${dark ? '#FF5A1F' : '#1A1A1A'}`
                      : isYakusa
                      ? (dark ? '1.5px solid #FF85A6' : '2px double #D14D6B')
                      : 'none',
                    boxShadow: isOrion
                      ? (dark ? '0 8px 25px rgba(255, 90, 31, 0.45)' : '0 8px 22px rgba(26, 26, 26, 0.32)')
                      : isYakusa
                      ? (dark
                        ? '0 8px 28px rgba(255, 61, 115, 0.55), 0 0 16px rgba(255, 61, 115, 0.32)'
                        : '0 8px 22px rgba(209, 77, 107, 0.28)')
                      : (dark
                        ? '0 8px 25px rgba(200, 153, 83, 0.45), 0 0 15px rgba(200, 153, 83, 0.25)'
                        : '0 8px 22px rgba(200, 153, 83, 0.42)'),
                    transition: 'all 0.25s ease',
                  }}
                >
                  Crear Cuenta Gratis
                  <HiArrowRight />
                </Link>
              )}

              {/* Botón Secundario "♡ Explorar Información" como en el boceto */}
              <Link to="/enfermedades" style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.55rem',
                padding: '0.88rem 1.85rem',
                borderRadius: '9999px',
                background: isOrion
                  ? 'transparent'
                  : isYakusa
                  ? (dark ? 'rgba(45, 26, 51, 0.65)' : 'rgba(255, 243, 243, 0.72)')
                  : (dark ? 'rgba(43, 24, 21, 0.55)' : 'rgba(248, 244, 235, 0.65)'),
                backdropFilter: 'blur(8px)',
                border: `1.5px solid ${isOrion ? (dark ? '#D0DDD2' : '#1A1A1A') : isYakusa ? (dark ? '#F8B14B' : '#3C1C22') : (dark ? '#C89953' : '#3A241F')}`,
                color: isOrion ? (dark ? '#F4F6F4' : '#1A1A1A') : isYakusa ? (dark ? '#FFD4E5' : '#3C1C22') : (dark ? '#F5ECE1' : '#3A241F'),
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '0.98rem',
                transition: 'all 0.25s ease',
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = isOrion
                    ? (dark ? 'rgba(255, 90, 31, 0.14)' : 'rgba(26, 26, 26, 0.08)')
                    : isYakusa
                    ? (dark ? 'rgba(255, 61, 115, 0.16)' : '#FAD5D5')
                    : (dark ? 'rgba(200, 153, 83, 0.15)' : '#E6DBC9')
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = isOrion
                    ? 'transparent'
                    : isYakusa
                    ? (dark ? 'rgba(45, 26, 51, 0.65)' : 'rgba(255, 243, 243, 0.72)')
                    : (dark ? 'rgba(43, 24, 21, 0.55)' : 'rgba(248, 244, 235, 0.65)')
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                <FaRegHeart size={15} style={{ color: isOrion ? (dark ? '#F4F6F4' : '#1A1A1A') : isYakusa ? (dark ? '#FFD4E5' : '#D14D6B') : (dark ? '#C89953' : '#7A433A') }} />
                Explorar Información
              </Link>

              {isModuleEnabled('download_apk') && (
                <button
                  type="button"
                  onClick={handleDownloadApk}
                  disabled={downloadingApk}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.55rem',
                    padding: '0.85rem 1.5rem',
                    borderRadius: '9999px',
                    background: dark ? '#4D683E' : '#5A7B43',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: '#FFFFFF',
                    fontWeight: '700',
                    fontSize: '0.92rem',
                    cursor: downloadingApk ? 'wait' : 'pointer',
                    transition: 'all 0.25s ease',
                    boxShadow: '0 4px 14px rgba(90, 123, 67, 0.32)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(90, 123, 67, 0.45)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 4px 14px rgba(90, 123, 67, 0.32)'
                  }}
                  title={apkInfo?.version ? `Descargar APK v${apkInfo.version} (${(apkInfo.fileSize / (1024 * 1024)).toFixed(1)} MB)` : 'Descargar instalador APK para Android'}
                >
                  <FaAndroid style={{ fontSize: '1.15rem', color: '#E3EDE0' }} />
                  <span>{downloadingApk ? 'Descargando...' : 'Descargar Apk'}</span>
                  <FaDownload style={{ fontSize: '0.8rem', opacity: 0.85 }} />
                </button>
              )}
            </div>

            {isModuleEnabled('download_apk') && apkNotice && (
              <div style={{
                marginTop: '0.85rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.45rem 1rem',
                borderRadius: '9999px',
                background: dark ? '#2B1815' : '#E6DBC9',
                border: `1px solid ${dark ? '#C89953' : '#7A433A'}`,
                color: dark ? '#F5ECE1' : '#3A241F',
                fontSize: '0.82rem',
                fontWeight: '600',
                animation: 'fadeIn 0.3s ease',
              }}>
                <FaAndroid style={{ color: '#5A7B43' }} />
                {apkNotice}
              </div>
            )}
          </div>

          {/* Right Logo Column — Tarjeta HeartBliss Cuida tu Corazón */}
          <div className="animate-fade-in-up stagger-3" style={{ flex: '1 1 300px', display: 'flex', justifyContent: 'center', position: 'relative' }}>
            <div style={{
              position: 'relative',
              width: '100%',
              maxWidth: isOrion ? '360px' : isYakusa ? '345px' : '370px',
              aspectRatio: isOrion ? '821 / 1024' : isYakusa ? '422 / 601' : '1 / 1',
              borderRadius: isOrion ? '2.4rem' : isYakusa ? '1.6rem' : '2.25rem',
              overflow: 'hidden',
              boxShadow: isOrion
                ? (dark
                  ? '0 25px 50px -12px rgba(0, 0, 0, 0.78), 0 0 38px rgba(136, 162, 142, 0.22)'
                  : '0 22px 45px -12px rgba(26, 26, 26, 0.22), 0 0 30px rgba(136, 162, 142, 0.25)')
                : isYakusa
                ? (dark
                  ? '0 25px 50px -12px rgba(12, 6, 15, 0.85), 0 0 42px rgba(255, 61, 115, 0.32)'
                  : '0 22px 45px -12px rgba(60, 28, 34, 0.22), 0 0 35px rgba(209, 77, 107, 0.22)')
                : (dark
                  ? '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 40px rgba(77, 104, 62, 0.25), 0 0 40px rgba(139, 30, 24, 0.28)'
                  : '0 22px 45px -12px rgba(58, 36, 31, 0.16), 0 0 35px rgba(90, 123, 67, 0.15)'),
              border: isOrion || isYakusa
                ? 'none'
                : `1.5px solid ${dark ? 'rgba(200, 153, 83, 0.32)' : 'rgba(122, 67, 58, 0.18)'}`,
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: isOrion || isYakusa
                ? 'transparent'
                : (dark
                  ? 'radial-gradient(circle at 75% 25%, rgba(77, 104, 62, 0.32), rgba(43, 24, 21, 0.92) 70%)'
                  : 'radial-gradient(circle at 75% 25%, rgba(90, 123, 67, 0.15), #F8F4EB 70%)'),
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-6px) scale(1.02)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)'
            }}
            >
              <img
                src={isOrion ? (dark ? logoOrionDark : logoOrionLight) : isYakusa ? (dark ? logoYakusaDark : logoYakusaLight) : (dark ? logoDark : logoLight)}
                alt="HeartBliss — Cuida tu Corazón"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: isYakusa ? 'cover' : 'contain',
                  display: 'block',
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Institutional Logos Banner ─────────────────────── */}
      <section className="institutions-section" style={{
        background: 'var(--institutions-gradient)',
        padding: '2.25rem 1.5rem 2.5rem',
        borderBottom: '1px solid var(--color-surface-200)',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <p style={{
            textAlign: 'center',
            fontSize: '0.65rem',
            fontWeight: '700',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.55)',
            marginBottom: '1.5rem',
          }}>
            Instituciones que respaldan este proyecto
          </p>

          {/* Logo grid: 4 cols desktop → 2 cols tablet → 2 cols mobile */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1rem',
            alignItems: 'center',
          }}
            className="logos-grid"
          >
            {[
              { src: '/logo-tamaulipas.png', alt: 'Gobierno del Estado de Tamaulipas', maxW: '240px', href: 'https://www.tamaulipas.gob.mx/' },
              { src: '/logo-injuventud.png', alt: 'Instituto de la Juventud de Tamaulipas', maxW: '180px', href: 'https://www.tamaulipas.gob.mx/jovenes/' },
              { src: '/logo-salud.jpg', alt: 'Secretaría de Salud de Tamaulipas', maxW: '200px', href: 'https://www.tamaulipas.gob.mx/salud/' },
              { src: '/logo-bienestar.png', alt: 'Secretaría del Bienestar', maxW: '240px', href: 'https://www.tamaulipas.gob.mx/bienestarsocial/' },
            ].map((logo, i) => (
              <a key={i} href={logo.href} target="_blank" rel="noopener noreferrer" style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: dark ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.97)',
                borderRadius: '16px',
                padding: '1.25rem 1.75rem',
                boxShadow: dark ? '0 4px 20px rgba(0,0,0,0.4)' : '0 4px 20px rgba(0,0,0,0.18)',
                transition: 'transform 0.22s ease, box-shadow 0.22s ease',
                minHeight: '100px',
                textDecoration: 'none',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = dark ? '0 8px 28px rgba(0,0,0,0.55)' : '0 8px 28px rgba(0,0,0,0.25)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = dark ? '0 4px 20px rgba(0,0,0,0.4)' : '0 4px 20px rgba(0,0,0,0.18)' }}
              >
                <img
                  src={logo.src}
                  alt={logo.alt}
                  title={logo.alt}
                  style={{
                    height: 'auto',
                    maxHeight: '68px',
                    width: '100%',
                    maxWidth: logo.maxW,
                    objectFit: 'contain',
                  }}
                  onError={e => { e.currentTarget.parentElement.style.display = 'none' }}
                />
              </a>
            ))}
          </div>

          {/* Responsive styles injected via a style tag */}
          <style>{`
            @media (max-width: 640px) {
              .logos-grid { grid-template-columns: repeat(2, 1fr) !important; }
            }
          `}</style>
        </div>
      </section>

      {/* Stats Section with Justifications */}
      <section style={{
        background: 'var(--color-surface-100)',
        padding: '5rem 1.5rem',
        borderBottom: '1px solid var(--color-surface-200)',
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.35rem 1rem',
              borderRadius: '9999px',
              background: dark ? '#2B1815' : '#E6DBC9',
              color: dark ? '#C89953' : '#7A433A',
              fontSize: '0.75rem',
              fontWeight: '800',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '0.75rem',
              border: `1px solid ${dark ? 'rgba(200,153,83,0.25)' : 'rgba(122,67,58,0.18)'}`,
            }}>
              <FaChartLine size={11} /> Impacto & Justificación
            </div>
            <h2 style={{
              fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
              fontWeight: '800',
              color: 'var(--color-surface-900)',
              marginBottom: '1rem',
              letterSpacing: '-0.02em',
            }}>
              El desafío de las ECNT en la juventud
            </h2>
            <p style={{
              fontSize: '1.05rem',
              color: 'var(--color-surface-500)',
              maxWidth: '650px',
              margin: '0 auto',
              lineHeight: '1.6'
            }}>
              Las Enfermedades Crónicas No Transmisibles (ECNT) ya no son exclusivas de la edad avanzada. Conoce la realidad que justifica la necesidad de una prevención activa.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2.5rem',
          }}>
            {/* México Card */}
            <div style={{
              background: 'var(--color-surface-50)',
              borderRadius: '24px',
              padding: '2.5rem',
              border: '1px solid var(--color-surface-200)',
              boxShadow: 'var(--shadow-card)',
              transition: 'all 0.3s ease',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
            className="hover-lift">
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    background: dark ? 'rgba(200, 153, 83, 0.15)' : 'rgba(122, 67, 58, 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: dark ? '#C89953' : '#7A433A'
                  }}>
                    <FaGlobe size={20} />
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--color-surface-900)' }}>
                    Situación en México (Nacional)
                  </h3>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                  {statsMexico.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                      <div style={{
                        fontSize: '2rem',
                        fontWeight: '800',
                        color: 'var(--color-primary-500)',
                        minWidth: '95px',
                        lineHeight: '1',
                        background: 'linear-gradient(135deg, var(--color-primary-500), var(--color-primary-600))',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}>
                        {item.value}
                      </div>
                      <div>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--color-surface-800)', marginBottom: '0.25rem' }}>
                          {item.label}
                        </h4>
                        <p style={{ fontSize: '0.85rem', color: 'var(--color-surface-500)', lineHeight: '1.4' }}>
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Tamaulipas Card */}
            <div style={{
              background: 'var(--color-surface-50)',
              borderRadius: '24px',
              padding: '2.5rem',
              border: '1px solid var(--color-surface-200)',
              boxShadow: 'var(--shadow-card)',
              transition: 'all 0.3s ease',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
            className="hover-lift">
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    background: 'rgba(90, 123, 67, 0.14)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#5A7B43'
                  }}>
                    <FaMapMarkerAlt size={20} />
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--color-surface-900)' }}>
                    Situación en Tamaulipas (Estatal)
                  </h3>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                  {statsTamaulipas.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                      <div style={{
                        fontSize: '2rem',
                        fontWeight: '800',
                        color: 'var(--color-accent-500)',
                        minWidth: '95px',
                        lineHeight: '1',
                        background: 'linear-gradient(135deg, var(--color-accent-400), var(--color-accent-600))',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}>
                        {item.value}
                      </div>
                      <div>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--color-surface-800)', marginBottom: '0.25rem' }}>
                          {item.label}
                        </h4>
                        <p style={{ fontSize: '0.85rem', color: 'var(--color-surface-500)', lineHeight: '1.4' }}>
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      {activeFeatures.length > 0 && (
        <section style={{ padding: '5rem 1.5rem', background: 'var(--color-surface-50)' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <h2 style={{
                fontSize: '2rem',
                fontWeight: '700',
                color: 'var(--color-surface-900)',
                marginBottom: '0.75rem',
              }}>
                ¿Qué encontrarás aquí?
              </h2>
              <p style={{ fontSize: '1.05rem', color: 'var(--color-surface-500)', maxWidth: '600px', margin: '0 auto' }}>
                Herramientas y recursos diseñados para empoderar a jóvenes tamaulipecos en el cuidado de su salud.
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '1.5rem',
            }}>
              {activeFeatures.map((feature, i) => (
                <Link
                  key={i}
                  to={feature.to}
                  className="animate-fade-in-up"
                  style={{
                    animationDelay: `${i * 0.15}s`,
                    padding: '2rem',
                    borderRadius: 'var(--radius-xl)',
                    background: 'var(--color-surface-100)',
                    textDecoration: 'none',
                    boxShadow: 'var(--shadow-card)',
                    border: '1px solid var(--color-surface-200)',
                    transition: 'all 0.3s ease',
                    display: 'block',
                  }}
                >
                  <div style={{
                    width: '48px', height: '48px',
                    borderRadius: 'var(--radius-lg)',
                    background: `${feature.color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1rem',
                  }}>
                    <feature.icon style={{ fontSize: '1.25rem', color: feature.color }} />
                  </div>
                  <h3 style={{
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    color: 'var(--color-surface-900)',
                    marginBottom: '0.5rem',
                  }}>
                    {feature.title}
                  </h3>
                  <p style={{
                    fontSize: '0.9rem',
                    color: 'var(--color-surface-500)',
                    lineHeight: '1.6',
                    marginBottom: '1rem',
                  }}>
                    {feature.description}
                  </p>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    color: 'var(--color-primary-500)',
                  }}>
                    Explorar <HiArrowRight />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Latest News ──────────────────────────────────── */}
      {isModuleEnabled('news') && featuredNews.length > 0 && (
        <section style={{ padding: '5rem 1.5rem', background: 'var(--color-surface-100)' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.35rem 1rem', borderRadius: '9999px', background: dark ? '#2B1815' : '#E6DBC9', color: dark ? '#C89953' : '#7A433A', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
                  <FaNewspaper size={11} /> Noticias
                </div>
                <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: '800', color: 'var(--color-surface-900)', margin: 0, letterSpacing: '-0.02em' }}>Últimas Noticias</h2>
              </div>
              <Link to="/noticias" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '0.6rem 1.35rem', borderRadius: '9999px', border: `1.5px solid ${dark ? '#C89953' : '#7A433A'}`, color: dark ? '#C89953' : '#7A433A', fontWeight: '700', textDecoration: 'none', fontSize: '0.875rem', transition: 'all 0.2s', whiteSpace: 'nowrap' }}
                onMouseEnter={e => { e.currentTarget.style.background = dark ? '#C89953' : '#7A433A'; e.currentTarget.style.color = dark ? '#1F1210' : 'white' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = dark ? '#C89953' : '#7A433A' }}>
                Explorar <HiArrowRight />
              </Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem' }}>
              {featuredNews.map(post => (
                <Link key={post.id} to={`/noticias/${post.slug}`} style={{ display: 'block', textDecoration: 'none', background: 'var(--color-surface-50)', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--color-surface-200)', transition: 'transform 0.2s, box-shadow 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(58, 36, 31, 0.12)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}>
                  <div style={{ height: '160px', overflow: 'hidden', background: 'linear-gradient(135deg, #7A433A, #3A241F)', position: 'relative' }}>
                    {newsImgSrc(post.coverImage)
                      ? <img src={newsImgSrc(post.coverImage)} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem' }}>📰</div>
                    }
                    {post.isPinned && <span style={{ position: 'absolute', top: '8px', left: '8px', padding: '2px 8px', borderRadius: '20px', background: '#C89953', color: '#1F1210', fontSize: '0.6rem', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '3px' }}><FaThumbtack size={8} /></span>}
                  </div>
                  <div style={{ padding: '1rem' }}>
                    <p style={{ fontSize: '0.7rem', color: 'var(--color-surface-500)', fontWeight: '700', marginBottom: '0.4rem' }}>{fmtDate(post.publishedAt)}</p>
                    <h3 style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--color-surface-900)', marginBottom: '0.4rem', lineHeight: 1.35, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{post.title}</h3>
                    {post.excerpt && <p style={{ fontSize: '0.78rem', color: 'var(--color-surface-500)', lineHeight: 1.55, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{post.excerpt}</p>}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section style={{
        padding: '5rem 1.5rem',
        background: 'var(--cta-gradient)',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', color: '#F5ECE1', marginBottom: '1rem' }}>
            Empieza a cuidar tu corazón hoy
          </h2>
          <p style={{ fontSize: '1rem', color: 'rgba(245, 236, 225, 0.88)', marginBottom: '2rem', lineHeight: '1.7' }}>
            Regístrate gratis en HeartBliss y accede a herramientas de seguimiento personalizado,
            información confiable y programas de apoyo social.
          </p>
          {isAuthenticated ? (
            <Link to={user?.role === 'admin' ? '/admin' : user?.role === 'doctor' ? '/doctor' : '/dashboard'} style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.95rem 2.5rem',
              borderRadius: '9999px',
              background: 'linear-gradient(135deg, #D6AA65, #C89953)',
              color: '#1F1210',
              textDecoration: 'none',
              fontWeight: '700',
              fontSize: '1.05rem',
              boxShadow: '0 8px 24px rgba(200, 153, 83, 0.4)',
            }}>
              {user?.role === 'admin' ? 'Ir al Panel Admin' : user?.role === 'doctor' ? 'Ir al Panel Médico' : 'Ir a Mi Salud'}
              <HiArrowRight />
            </Link>
          ) : (
            <Link to="/registro" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.95rem 2.5rem',
              borderRadius: '9999px',
              background: 'linear-gradient(135deg, #D6AA65, #C89953)',
              color: '#1F1210',
              textDecoration: 'none',
              fontWeight: '700',
              fontSize: '1.05rem',
              boxShadow: '0 8px 24px rgba(200, 153, 83, 0.4)',
            }}>
              Crear Mi Cuenta
              <HiArrowRight />
            </Link>
          )}
        </div>
      </section>
    </div>
  )
}
