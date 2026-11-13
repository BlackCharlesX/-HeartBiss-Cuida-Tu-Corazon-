import { Link } from 'react-router-dom'
import { FaHeartbeat, FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa'
import { HiMail, HiPhone, HiLocationMarker } from 'react-icons/hi'
import { useModules } from '../../context/ModuleContext'
import { useTheme } from '../../context/ThemeContext'
import heartEmblem from '../../assets/heart-emblem.png'
import heartEmblemYakusa from '../../assets/heart-emblem-yakusa.png'

export default function Footer() {
  const { isModuleEnabled } = useModules()
  const { activePreset } = useTheme()
  const isYakusa = activePreset === 'yakusa'

  const footerLinks = [
    { to: '/enfermedades', label: 'Enfermedades Crónicas', key: 'diseases' },
    { to: '/programas', label: 'Programas Sociales', key: 'programs' },
    { to: '/hecho-en-tamaulipas', label: 'Nutracéuticos', key: 'hecho_en_tamaulipas' },
    { to: '/noticias', label: 'Noticias y Artículos', key: 'news' },
    { to: '/faq', label: 'Preguntas Frecuentes', key: 'faq' },
    { to: '/contacto', label: 'Contacto', key: 'contact' },
  ].filter(l => isModuleEnabled(l.key))
  return (
    <footer style={{
      background: 'linear-gradient(180deg, #2B1815 0%, #1F1210 100%)',
      color: '#E2D4C6',
      paddingTop: '3rem',
      borderTop: '1px solid rgba(200, 153, 83, 0.16)',
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '2rem',
          paddingBottom: '2rem',
        }}>
          {/* About */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
              <img src={isYakusa ? heartEmblemYakusa : heartEmblem} alt="Cuida tu Corazón" style={{ width: '44px', height: '32px', objectFit: 'contain' }} />
              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
                <span style={{ fontSize: '1.1rem', fontWeight: '800', color: '#C89953' }}>
                  Cuida tu Corazón
                </span>
                <span style={{ fontSize: '0.72rem', fontWeight: '600', color: '#A38A7C', letterSpacing: '0.04em' }}>
                  HeartBliss · Ingredientes Naturales
                </span>
              </div>
            </div>
            <p style={{ fontSize: '0.875rem', lineHeight: '1.7', color: '#CBB9AA' }}>
              Plataforma digital HeartBliss · Cuida tu Corazón para jóvenes de 18 a 29 años
              con información sobre enfermedades crónicas, nutracéuticos y programas de apoyo social.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
              {[FaFacebookF, FaTwitter, FaInstagram].map((Icon, i) => (
                <a key={i} href="#" style={{
                  width: '36px', height: '36px',
                  borderRadius: '50%',
                  background: '#38211D',
                  border: '1px solid rgba(200, 153, 83, 0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#C89953',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#C89953'; e.currentTarget.style.color = '#1F1210' }}
                onMouseLeave={e => { e.currentTarget.style.background = '#38211D'; e.currentTarget.style.color = '#C89953' }}
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 style={{ fontSize: '0.875rem', fontWeight: '700', color: '#F5ECE1', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Navegación
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {footerLinks.map(link => (
                <Link key={link.to} to={link.to} style={{
                  fontSize: '0.875rem',
                  color: '#CBB9AA',
                  textDecoration: 'none',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.color = '#C89953'}
                onMouseLeave={e => e.currentTarget.style.color = '#CBB9AA'}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ fontSize: '0.875rem', fontWeight: '700', color: '#F5ECE1', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Contacto
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', color: '#CBB9AA' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                <HiLocationMarker style={{ color: '#C89953', flexShrink: 0 }} />
                <span>Cd. Victoria, Tamaulipas, México</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                <HiPhone style={{ color: '#C89953', flexShrink: 0 }} />
                <span>(834) 123-4567</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                <HiMail style={{ color: '#C89953', flexShrink: 0 }} />
                <span>contacto@heartbliss.mx</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid rgba(245, 236, 225, 0.1)',
          padding: '1.25rem 0',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.8rem',
          color: '#A38A7C',
        }}>
          <p>© 2026 HeartBliss — Cuida tu Corazón. Todos los derechos reservados.</p>
          <p>Ingredientes Naturales · Salud Cardiovascular Juvenil</p>
        </div>
      </div>
    </footer>
  )
}
