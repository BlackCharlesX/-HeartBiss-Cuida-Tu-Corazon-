import React, { useState, useEffect, useMemo, useRef } from 'react'
import {
  FaMapMarkedAlt, FaUsers, FaHeartbeat, FaFileDownload, FaSearch,
  FaShieldAlt, FaExclamationTriangle, FaCheckCircle, FaSyncAlt,
  FaThList, FaMap, FaTint, FaWeight, FaTimes, FaMobileAlt, FaPrint
} from 'react-icons/fa'
import api from '../../services/api'
import {
  TAMAULIPAS_MUNICIPALITIES,
  TAMAULIPAS_REGIONS
} from '../../data/tamaulipasMunicipalities'

// ══════════════════════════════════════════════════════════════════
// MAP LAYERS CONFIGURATION
// ══════════════════════════════════════════════════════════════════

const LAYERS = [
  {
    id: 'users',
    name: 'Cobertura y Usuarios',
    shortName: 'Usuarios',
    icon: FaUsers,
    unit: 'beneficiarios',
    description: 'Concentración de usuarios registrados y familiares',
    colorScale: ['#fce7f3', '#f43f5e', '#871233'],
    stops: [0, 50, 100],
    legend: { min: 'Baja densidad', mid: 'Media', max: 'Alta concentración' }
  },
  {
    id: 'bmi',
    name: 'Índice de Masa Corporal (IMC)',
    shortName: 'IMC / Obesidad',
    icon: FaWeight,
    unit: 'kg/m²',
    description: 'Promedio de IMC y prevalencia de sobrepeso/obesidad',
    colorScale: ['#10b981', '#f59e0b', '#ef4444'],
    stops: [24, 27, 30],
    legend: { min: 'Normopeso (<25)', mid: 'Sobrepeso (25-29.9)', max: 'Obesidad (≥30)' }
  },
  {
    id: 'bloodPressure',
    name: 'Presión Arterial Sistólica',
    shortName: 'Hipertensión',
    icon: FaHeartbeat,
    unit: 'mmHg',
    description: 'Monitoreo de presión arterial y riesgo hipertensivo',
    colorScale: ['#10b981', '#f59e0b', '#dc2626'],
    stops: [118, 125, 130],
    legend: { min: 'Óptima (<120)', mid: 'Elevada (120-129)', max: 'Hipertensión (≥130)' }
  },
  {
    id: 'glucose',
    name: 'Glucosa en Sangre',
    shortName: 'Glucosa / Diabetes',
    icon: FaTint,
    unit: 'mg/dL',
    description: 'Promedio glucémico en ayunas y riesgo de diabetes',
    colorScale: ['#06b6d4', '#f59e0b', '#dc2626'],
    stops: [95, 105, 115],
    legend: { min: 'Normal (<100)', mid: 'Prediabetes (100-125)', max: 'Hiperglucemia (≥126)' }
  },
  {
    id: 'risk',
    name: 'Índice de Riesgo Epidemiológico',
    shortName: 'Riesgo Global',
    icon: FaShieldAlt,
    unit: 'pts',
    description: 'Score compuesto metabólico-cardiovascular (1-100)',
    colorScale: ['#10b981', '#f59e0b', '#991b1b'],
    stops: [30, 55, 75],
    legend: { min: 'Riesgo Bajo (<40)', mid: 'Riesgo Moderado', max: 'Riesgo Crítico (>70)' }
  }
]

// Major demographic hubs to highlight with beacon markers
const KEY_HUBS = [
  'Reynosa', 'Matamoros', 'Nuevo Laredo', 'Victoria',
  'Tampico', 'Ciudad Madero', 'Altamira', 'El Mante', 'Río Bravo'
]

// ══════════════════════════════════════════════════════════════════
// COLOR HELPERS
// ══════════════════════════════════════════════════════════════════

function hexToRgb(hex) {
  const clean = hex.replace('#', '')
  const bigint = parseInt(clean, 16)
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255
  }
}

function interpolateColor(color1, color2, factor) {
  const c1 = hexToRgb(color1)
  const c2 = hexToRgb(color2)
  const r = Math.round(c1.r + factor * (c2.r - c1.r))
  const g = Math.round(c1.g + factor * (c2.g - c1.g))
  const b = Math.round(c1.b + factor * (c2.b - c1.b))
  return `rgb(${r}, ${g}, ${b})`
}

function getMunicipalityValue(m, layerId) {
  if (!m) return 0
  switch (layerId) {
    case 'users':
      return m.totalBeneficiaries || (m.registeredUsers || 0) + (m.familyMembers || 0)
    case 'bmi':
      return m.vitals?.bmi || m.baselineBmi || 26.5
    case 'bloodPressure':
      return m.vitals?.bloodPressure?.systolic || m.baselineSys || 122
    case 'glucose':
      return m.vitals?.glucose || m.baselineGlucose || 100
    case 'risk':
      return m.risks?.compositeRiskScore || 50
    default:
      return 0
  }
}

function getMunicipalityColor(m, layerId, isDark, minVal, maxVal) {
  const val = getMunicipalityValue(m, layerId)
  const layer = LAYERS.find(l => l.id === layerId) || LAYERS[0]

  if (layerId === 'users') {
    const range = Math.max(1, maxVal - minVal)
    const factor = Math.min(1, Math.max(0, (val - minVal) / range))
    if (isDark) {
      return interpolateColor('#2d1525', '#e03b60', factor)
    }
    return interpolateColor('#fce7f3', '#871233', factor)
  }

  const [s0, s1, s2] = layer.stops
  const [c0, c1, c2] = layer.colorScale

  if (val <= s0) return c0
  if (val >= s2) return c2
  if (val < s1) {
    const factor = (val - s0) / (s1 - s0)
    return interpolateColor(c0, c1, factor)
  } else {
    const factor = (val - s1) / (s2 - s1)
    return interpolateColor(c1, c2, factor)
  }
}

// ══════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════════════

export default function TamaulipasMap({ dark }) {
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [activeLayer, setActiveLayer] = useState('users')
  const [selectedRegion, setSelectedRegion] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMun, setSelectedMun] = useState(null)
  const [hoveredMun, setHoveredMun] = useState(null)
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })
  const [viewMode, setViewMode] = useState('map') // 'map' | 'table'
  const [sortBy, setSortBy] = useState('beneficiaries') // 'beneficiaries' | 'name' | 'risk' | 'bmi' | 'glucose'
  const [stateData, setStateData] = useState(null)
  const [munDataMap, setMunDataMap] = useState({})
  const [lastSync, setLastSync] = useState(new Date())

  const mapContainerRef = useRef(null)

  // ── 1. Fetch live metrics from API ─────────────────────────────
  const fetchMetrics = async (isManual = false) => {
    if (isManual) setRefreshing(true)
    else setLoading(true)

    try {
      const res = await api.get('/admin/map-metrics')
      if (res.data) {
        setStateData(res.data.statewide)
        const mapObj = {}
        res.data.municipalities.forEach(m => {
          mapObj[m.name.toLowerCase()] = m
        })
        setMunDataMap(mapObj)
        setLastSync(new Date())
      }
    } catch (err) {
      console.error('Error cargando métricas epidemiológicas:', err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchMetrics()
  }, [])

  // ── 2. Merge static geometries with live API metrics ───────────
  const enrichedMunicipalities = useMemo(() => {
    return TAMAULIPAS_MUNICIPALITIES.map(geo => {
      const key = geo.name.toLowerCase()
      const live = munDataMap[key] || {}
      return {
        ...geo,
        ...live,
        totalBeneficiaries: live.totalBeneficiaries || (live.registeredUsers || 0) + (live.familyMembers || 0),
        vitals: live.vitals || {
          bmi: 26.5,
          bmiStatus: 'Sobrepeso',
          glucose: 101,
          bloodPressure: { systolic: 122, diastolic: 79 },
          heartRate: 72,
          spo2: 98
        },
        risks: live.risks || {
          hypertensionRiskRate: 28.0,
          diabetesRiskRate: 17.0,
          compositeRiskScore: 50
        },
        alerts: live.alerts || { total: 0, critical: 0, warning: 0 },
        adoptionRate: live.adoptionRate || Number((((live.totalBeneficiaries || 0) / geo.popYouth) * 100).toFixed(2)),
      }
    })
  }, [munDataMap])

  // Compute min and max for active layer (used in color gradients)
  const { minVal, maxVal } = useMemo(() => {
    let min = Infinity
    let max = -Infinity
    enrichedMunicipalities.forEach(m => {
      const val = getMunicipalityValue(m, activeLayer)
      if (val < min) min = val
      if (val > max) max = val
    })
    if (min === Infinity) min = 0
    if (max === -Infinity) max = 100
    return { minVal: min, maxVal: max }
  }, [enrichedMunicipalities, activeLayer])

  // Filtered municipalities based on search & region
  const filteredMunicipalities = useMemo(() => {
    return enrichedMunicipalities.filter(m => {
      const matchesSearch = !searchQuery ||
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.cabecera?.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesRegion = selectedRegion === 'all' || m.region === selectedRegion
      return matchesSearch && matchesRegion
    })
  }, [enrichedMunicipalities, searchQuery, selectedRegion])

  // Sorted list for table view
  const sortedMunicipalities = useMemo(() => {
    return [...filteredMunicipalities].sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      if (sortBy === 'beneficiaries') return (b.totalBeneficiaries || 0) - (a.totalBeneficiaries || 0)
      if (sortBy === 'risk') return (b.risks?.compositeRiskScore || 0) - (a.risks?.compositeRiskScore || 0)
      if (sortBy === 'bmi') return (b.vitals?.bmi || 0) - (a.vitals?.bmi || 0)
      if (sortBy === 'glucose') return (b.vitals?.glucose || 0) - (a.vitals?.glucose || 0)
      if (sortBy === 'alerts') return (b.alerts?.total || 0) - (a.alerts?.total || 0)
      return 0
    })
  }, [filteredMunicipalities, sortBy])

  // Sync selectedMun when live data updates
  const selectedMunId = selectedMun?.id
  useEffect(() => {
    if (selectedMunId) {
      const updated = enrichedMunicipalities.find(m => m.id === selectedMunId)
      if (updated) setSelectedMun(updated)
    }
  }, [enrichedMunicipalities, selectedMunId])

  // Handle map cursor move for tooltip
  const handleMouseMove = (e) => {
    if (!mapContainerRef.current) return
    const rect = mapContainerRef.current.getBoundingClientRect()
    setTooltipPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    })
  }

  // Export statewide summary report to JSON
  const handleExportData = () => {
    const report = {
      titulo: 'Informe Epidemiológico y de Cobertura Territorial - Tamaulipas',
      fechaGeneracion: new Date().toISOString(),
      estado: stateData,
      municipios: enrichedMunicipalities.map(m => ({
        inegi: m.inegi,
        nombre: m.name,
        region: m.region,
        poblacionJoven: m.popYouth,
        usuariosRegistrados: m.registeredUsers || 0,
        familiares: m.familyMembers || 0,
        totalBeneficiarios: m.totalBeneficiaries || 0,
        tasaAdopcionPorc: m.adoptionRate,
        wearablesActivos: m.activeWearables || 0,
        imcPromedio: m.vitals?.bmi,
        clasificacionImc: m.vitals?.bmiStatus,
        glucosaPromedio: m.vitals?.glucose,
        presionSistolica: m.vitals?.bloodPressure?.systolic,
        presionDiastolica: m.vitals?.bloodPressure?.diastolic,
        alertasMedicasTotales: m.alerts?.total || 0,
        alertasCriticas: m.alerts?.critical || 0,
        riesgoCompuestoScore: m.risks?.compositeRiskScore
      }))
    }

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(report, null, 2))
    const downloadAnchor = document.createElement('a')
    downloadAnchor.setAttribute('href', dataStr)
    downloadAnchor.setAttribute('download', `reporte_epidemiologico_tamaulipas_${new Date().toISOString().slice(0,10)}.json`)
    document.body.appendChild(downloadAnchor)
    downloadAnchor.click()
    downloadAnchor.remove()
  }

  // Print inspector technical sheet
  const handlePrintMunicipality = () => {
    window.print()
  }

  const currentLayerObj = LAYERS.find(l => l.id === activeLayer) || LAYERS[0]

  if (loading && !stateData) {
    return (
      <div style={{
        background: dark ? '#141319' : '#fff',
        borderRadius: '20px',
        padding: '4rem 2rem',
        border: `1px solid ${dark ? '#1e1c25' : '#e8ddd0'}`,
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
      }}>
        <FaSyncAlt className="animate-spin" size={28} style={{ color: '#871233' }} />
        <div>
          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '800', color: dark ? '#fff' : '#1a1715' }}>
            Cargando Mapa Epidemiológico de Tamaulipas
          </h3>
          <p style={{ margin: '0.35rem 0 0', fontSize: '0.8rem', color: dark ? '#7e7a8c' : '#8c827a' }}>
            Consolidando telemetría de 43 municipios, registros metabólicos y coberturas territoriales...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
      {/* ── HEADER BANNER ────────────────────────────────────────── */}
      <div style={{
        background: dark
          ? 'linear-gradient(135deg, rgba(135,18,51,0.25) 0%, rgba(20,19,25,0.95) 100%)'
          : 'linear-gradient(135deg, #87123314 0%, #ffffff 100%)',
        borderRadius: '20px',
        padding: '1.75rem 2rem',
        border: `1px solid ${dark ? '#272530' : '#e8ddd0'}`,
        boxShadow: dark ? '0 10px 30px rgba(0,0,0,0.3)' : '0 4px 16px rgba(135,18,51,0.06)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.25rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #871233 0%, #e03b60 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 8px 20px rgba(224,59,96,0.35)',
            flexShrink: 0,
          }}>
            <FaMapMarkedAlt size={26} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
              <span style={{
                fontSize: '0.65rem',
                fontWeight: '800',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                padding: '0.2rem 0.65rem',
                borderRadius: '999px',
                background: dark ? 'rgba(224,59,96,0.2)' : '#87123318',
                color: dark ? '#e03b60' : '#871233',
                border: `1px solid ${dark ? 'rgba(224,59,96,0.3)' : '#87123330'}`,
              }}>
                GEO-MONITOREO EPIDEMIOLÓGICO
              </span>
              <span style={{ fontSize: '0.75rem', color: dark ? '#7e7a8c' : '#8c827a' }}>
                43 Municipios de Tamaulipas
              </span>
            </div>
            <h1 style={{
              fontSize: '1.5rem',
              fontWeight: '900',
              color: dark ? '#fff' : '#1a1715',
              margin: 0,
              letterSpacing: '-0.02em',
            }}>
              Mapa Epidemiológico de Tamaulipas
            </h1>
            <p style={{
              fontSize: '0.85rem',
              color: dark ? '#9ea4b0' : '#5c5248',
              margin: '0.25rem 0 0',
            }}>
              Supervisión territorial en tiempo real de salud metabólica, factores de riesgo y cobertura del programa Jóvenes con Salud.
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* View mode toggle */}
          <div style={{
            display: 'flex',
            background: dark ? '#1e1c25' : '#faf8f5',
            padding: '3px',
            borderRadius: '12px',
            border: `1.5px solid ${dark ? '#272530' : '#e8ddd0'}`,
          }}>
            <button
              onClick={() => setViewMode('map')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.45rem 0.85rem',
                borderRadius: '9px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.78rem',
                fontWeight: '700',
                background: viewMode === 'map' ? '#871233' : 'transparent',
                color: viewMode === 'map' ? '#fff' : (dark ? '#9ea4b0' : '#73665c'),
                transition: 'all 0.2s',
              }}
            >
              <FaMap size={12} /> Mapa Vectorial
            </button>
            <button
              onClick={() => setViewMode('table')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.45rem 0.85rem',
                borderRadius: '9px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.78rem',
                fontWeight: '700',
                background: viewMode === 'table' ? '#871233' : 'transparent',
                color: viewMode === 'table' ? '#fff' : (dark ? '#9ea4b0' : '#73665c'),
                transition: 'all 0.2s',
              }}
            >
              <FaThList size={12} /> Tabla Comparativa
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={() => fetchMetrics(true)}
              disabled={refreshing}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.55rem 0.95rem',
                borderRadius: '11px',
                border: `1.5px solid ${dark ? '#272530' : '#e8ddd0'}`,
                background: dark ? '#1e1c25' : '#faf8f5',
                color: dark ? '#fff' : '#1a1715',
                fontSize: '0.8rem',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              title="Sincronizar datos"
            >
              <FaSyncAlt size={12} className={refreshing ? 'animate-spin' : ''} />
              {refreshing ? 'Sincronizando...' : 'Actualizar'}
            </button>
            <span style={{ fontSize: '0.7rem', color: dark ? '#7e7a8c' : '#8c827a', whiteSpace: 'nowrap' }}>
              {lastSync ? `${lastSync.getHours().toString().padStart(2, '0')}:${lastSync.getMinutes().toString().padStart(2, '0')}` : ''}
            </span>
          </div>

          <button
            onClick={handleExportData}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.55rem 1rem',
              borderRadius: '11px',
              border: 'none',
              background: 'linear-gradient(135deg, #871233 0%, #a81c44 100%)',
              color: '#fff',
              fontSize: '0.8rem',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(135,18,51,0.3)',
              transition: 'all 0.2s',
            }}
          >
            <FaFileDownload size={13} /> Exportar Reporte
          </button>
        </div>
      </div>

      {/* ── STATEWIDE KPIS SUMMARY BAR ───────────────────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '1rem',
      }}>
        {/* Total Beneficiarios */}
        <div style={{
          background: dark ? '#141319' : '#fff',
          borderRadius: '16px',
          padding: '1.15rem 1.25rem',
          border: `1px solid ${dark ? '#1e1c25' : '#e8ddd0'}`,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.35rem',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.68rem', fontWeight: '800', letterSpacing: '0.06em', textTransform: 'uppercase', color: dark ? '#7e7a8c' : '#8c827a' }}>
              BENEFICIARIOS
            </span>
            <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(59,130,246,0.12)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FaUsers size={14} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: '900', color: dark ? '#fff' : '#1a1715' }}>
            {stateData?.totalBeneficiaries?.toLocaleString() || '---'}
          </div>
          <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: '600' }}>
            {stateData?.totalRegisteredUsers || 0} titulares · {stateData?.totalFamilyMembers || 0} familiares
          </span>
        </div>

        {/* Cobertura de Municipios */}
        <div style={{
          background: dark ? '#141319' : '#fff',
          borderRadius: '16px',
          padding: '1.15rem 1.25rem',
          border: `1px solid ${dark ? '#1e1c25' : '#e8ddd0'}`,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.35rem',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.68rem', fontWeight: '800', letterSpacing: '0.06em', textTransform: 'uppercase', color: dark ? '#7e7a8c' : '#8c827a' }}>
              COBERTURA ESTATAL
            </span>
            <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(16,185,129,0.12)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FaCheckCircle size={14} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: '900', color: dark ? '#fff' : '#1a1715' }}>
            43 / 43
          </div>
          <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: '600' }}>
            100% de municipios con presencia
          </span>
        </div>

        {/* IMC Estatal Promedio */}
        <div style={{
          background: dark ? '#141319' : '#fff',
          borderRadius: '16px',
          padding: '1.15rem 1.25rem',
          border: `1px solid ${dark ? '#1e1c25' : '#e8ddd0'}`,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.35rem',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.68rem', fontWeight: '800', letterSpacing: '0.06em', textTransform: 'uppercase', color: dark ? '#7e7a8c' : '#8c827a' }}>
              IMC PROMEDIO
            </span>
            <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(245,158,11,0.12)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FaWeight size={14} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: '900', color: dark ? '#fff' : '#1a1715' }}>
            {stateData?.avgBmi || '27.2'} <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>kg/m²</span>
          </div>
          <span style={{ fontSize: '0.72rem', color: '#f59e0b', fontWeight: '600' }}>
            Rango: Sobrepeso Moderado
          </span>
        </div>

        {/* Glucosa Promedio */}
        <div style={{
          background: dark ? '#141319' : '#fff',
          borderRadius: '16px',
          padding: '1.15rem 1.25rem',
          border: `1px solid ${dark ? '#1e1c25' : '#e8ddd0'}`,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.35rem',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.68rem', fontWeight: '800', letterSpacing: '0.06em', textTransform: 'uppercase', color: dark ? '#7e7a8c' : '#8c827a' }}>
              GLUCOSA PROMEDIO
            </span>
            <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(6,182,212,0.12)', color: '#06b6d4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FaTint size={14} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: '900', color: dark ? '#fff' : '#1a1715' }}>
            {stateData?.avgGlucose || '105'} <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>mg/dL</span>
          </div>
          <span style={{ fontSize: '0.72rem', color: '#06b6d4', fontWeight: '600' }}>
            Umbral preventivo estatal
          </span>
        </div>

        {/* Presión Arterial */}
        <div style={{
          background: dark ? '#141319' : '#fff',
          borderRadius: '16px',
          padding: '1.15rem 1.25rem',
          border: `1px solid ${dark ? '#1e1c25' : '#e8ddd0'}`,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.35rem',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.68rem', fontWeight: '800', letterSpacing: '0.06em', textTransform: 'uppercase', color: dark ? '#7e7a8c' : '#8c827a' }}>
              PRESIÓN ARTERIAL
            </span>
            <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(239,68,68,0.12)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FaHeartbeat size={14} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: '900', color: dark ? '#fff' : '#1a1715' }}>
            {stateData?.avgBloodPressure?.systolic || 124}/{stateData?.avgBloodPressure?.diastolic || 80}
            <span style={{ fontSize: '0.85rem', fontWeight: '600' }}> mmHg</span>
          </div>
          <span style={{ fontSize: '0.72rem', color: '#f59e0b', fontWeight: '600' }}>
            Normotensión limítrofe
          </span>
        </div>

        {/* Wearables Sincronizados */}
        <div style={{
          background: dark ? '#141319' : '#fff',
          borderRadius: '16px',
          padding: '1.15rem 1.25rem',
          border: `1px solid ${dark ? '#1e1c25' : '#e8ddd0'}`,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.35rem',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.68rem', fontWeight: '800', letterSpacing: '0.06em', textTransform: 'uppercase', color: dark ? '#7e7a8c' : '#8c827a' }}>
              WEARABLES ACTIVOS
            </span>
            <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(139,92,246,0.12)', color: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FaMobileAlt size={14} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: '900', color: dark ? '#fff' : '#1a1715' }}>
            {stateData?.totalActiveWearables || 0}
          </div>
          <span style={{ fontSize: '0.72rem', color: '#8b5cf6', fontWeight: '600' }}>
            Dispositivos IoT vinculados
          </span>
        </div>
      </div>

      {/* ── CONTROLS & FILTER BAR ─────────────────────────────────── */}
      <div style={{
        background: dark ? '#141319' : '#fff',
        borderRadius: '16px',
        padding: '1.25rem 1.5rem',
        border: `1px solid ${dark ? '#1e1c25' : '#e8ddd0'}`,
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}>
        {/* Layer Selector Tabs */}
        <div>
          <label style={{
            display: 'block',
            fontSize: '0.7rem',
            fontWeight: '800',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: dark ? '#7e7a8c' : '#8c827a',
            marginBottom: '0.5rem',
          }}>
            CAPAS EPIDEMIOLÓGICAS (COROPLETA)
          </label>
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            flexWrap: 'wrap',
          }}>
            {LAYERS.map(layer => {
              const active = activeLayer === layer.id
              const Icon = layer.icon
              return (
                <button
                  key={layer.id}
                  onClick={() => setActiveLayer(layer.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.6rem 1rem',
                    borderRadius: '12px',
                    border: `1.5px solid ${active ? '#871233' : (dark ? '#272530' : '#e8ddd0')}`,
                    background: active
                      ? (dark ? 'rgba(135,18,51,0.25)' : '#87123312')
                      : (dark ? '#1e1c25' : '#faf8f5'),
                    color: active ? (dark ? '#e03b60' : '#871233') : (dark ? '#fff' : '#1a1715'),
                    fontSize: '0.82rem',
                    fontWeight: active ? '800' : '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <Icon size={14} style={{ color: active ? (dark ? '#e03b60' : '#871233') : (dark ? '#7e7a8c' : '#8c827a') }} />
                  {layer.shortName}
                </button>
              )
            })}
          </div>
        </div>

        {/* Region Chips & Search */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          paddingTop: '0.75rem',
          borderTop: `1px solid ${dark ? '#1e1c25' : '#f0e8dc'}`,
        }}>
          {/* Region Chips */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: dark ? '#7e7a8c' : '#8c827a', marginRight: '0.25rem' }}>
              Región:
            </span>
            {TAMAULIPAS_REGIONS.map(reg => {
              const active = selectedRegion === reg.id
              return (
                <button
                  key={reg.id}
                  onClick={() => setSelectedRegion(reg.id)}
                  style={{
                    padding: '0.35rem 0.75rem',
                    borderRadius: '999px',
                    border: 'none',
                    background: active
                      ? (dark ? '#e03b60' : '#871233')
                      : (dark ? '#1e1c25' : '#f0ece4'),
                    color: active ? '#fff' : (dark ? '#9ea4b0' : '#5c5248'),
                    fontSize: '0.75rem',
                    fontWeight: active ? '800' : '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  {reg.name}
                </button>
              )
            })}
          </div>

          {/* Search Box */}
          <div style={{ position: 'relative', width: '260px' }}>
            <FaSearch style={{
              position: 'absolute',
              left: '0.85rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: dark ? '#7e7a8c' : '#a89580',
              fontSize: '0.8rem',
            }} />
            <input
              type="text"
              placeholder="Buscar municipio o cabecera..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem 0.85rem 0.5rem 2.2rem',
                borderRadius: '10px',
                border: `1.5px solid ${dark ? '#272530' : '#e8ddd0'}`,
                background: dark ? '#1e1c25' : '#faf8f5',
                color: dark ? '#fff' : '#1a1715',
                fontSize: '0.8rem',
                outline: 'none',
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: '0.6rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: dark ? '#7e7a8c' : '#a89580',
                  cursor: 'pointer',
                }}
              >
                <FaTimes size={12} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── ACTIVE LAYER LEGEND BAR ──────────────────────────────── */}
      <div style={{
        background: dark ? '#141319' : '#fff',
        borderRadius: '14px',
        padding: '0.85rem 1.25rem',
        border: `1px solid ${dark ? '#1e1c25' : '#e8ddd0'}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: currentLayerObj.colorScale[1],
            boxShadow: `0 0 10px ${currentLayerObj.colorScale[1]}`,
          }} />
          <span style={{ fontSize: '0.82rem', fontWeight: '800', color: dark ? '#fff' : '#1a1715' }}>
            {currentLayerObj.name}
          </span>
          <span style={{ fontSize: '0.75rem', color: dark ? '#7e7a8c' : '#8c827a' }}>
            ({currentLayerObj.description})
          </span>
        </div>

        {/* Gradient Legend */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: '700', color: dark ? '#9ea4b0' : '#73665c' }}>
            {currentLayerObj.legend.min}
          </span>
          <div style={{
            width: '140px',
            height: '10px',
            borderRadius: '5px',
            background: `linear-gradient(to right, ${currentLayerObj.colorScale[0]}, ${currentLayerObj.colorScale[1]}, ${currentLayerObj.colorScale[2]})`,
            border: `1px solid ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
          }} />
          <span style={{ fontSize: '0.72rem', fontWeight: '700', color: dark ? '#9ea4b0' : '#73665c' }}>
            {currentLayerObj.legend.max}
          </span>
        </div>
      </div>

      {/* ── WORKSPACE: MAP VIEW OR TABLE VIEW ────────────────────── */}
      {viewMode === 'map' ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: selectedMun ? '1fr 390px' : '1fr',
          gap: '1.5rem',
          alignItems: 'start',
          transition: 'all 0.3s ease',
        }}>
          {/* MAP CANVAS CONTAINER */}
          <div
            ref={mapContainerRef}
            onMouseMove={handleMouseMove}
            style={{
              position: 'relative',
              background: dark ? '#141319' : '#ffffff',
              borderRadius: '20px',
              border: `1px solid ${dark ? '#1e1c25' : '#e8ddd0'}`,
              boxShadow: dark ? '0 10px 35px rgba(0,0,0,0.35)' : '0 4px 20px rgba(0,0,0,0.05)',
              overflow: 'hidden',
              minHeight: '620px',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Compass / State Seal Watermark */}
            <div style={{
              position: 'absolute',
              top: '1.25rem',
              left: '1.5rem',
              pointerEvents: 'none',
              zIndex: 5,
              display: 'flex',
              flexDirection: 'column',
              gap: '0.2rem',
            }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.35rem 0.75rem',
                borderRadius: '8px',
                background: dark ? 'rgba(30,28,37,0.85)' : 'rgba(250,248,245,0.85)',
                backdropFilter: 'blur(4px)',
                border: `1px solid ${dark ? '#272530' : '#e8ddd0'}`,
                color: dark ? '#e03b60' : '#871233',
                fontSize: '0.75rem',
                fontWeight: '800',
              }}>
                <span>ESTADO DE TAMAULIPAS</span>
              </div>
              <span style={{ fontSize: '0.65rem', color: dark ? '#7e7a8c' : '#a89580', paddingLeft: '0.25rem' }}>
                Proyección Cartográfica Vectorial · 43 Polígonos
              </span>
            </div>

            {/* Interactive North Compass */}
            <div style={{
              position: 'absolute',
              top: '1.25rem',
              right: '1.5rem',
              pointerEvents: 'none',
              zIndex: 5,
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: dark ? 'rgba(30,28,37,0.85)' : 'rgba(250,248,245,0.85)',
              border: `1px solid ${dark ? '#272530' : '#e8ddd0'}`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(4px)',
            }}>
              <span style={{ fontSize: '0.65rem', fontWeight: '900', color: dark ? '#e03b60' : '#871233' }}>N</span>
              <div style={{ width: '0', height: '0', borderLeft: '3px solid transparent', borderRight: '3px solid transparent', borderBottom: '6px solid #871233' }} />
            </div>

            {/* SVG MAP */}
            <svg
              viewBox="0 0 700 920"
              style={{
                width: '100%',
                height: 'auto',
                maxHeight: '720px',
                margin: 'auto',
                display: 'block',
              }}
            >
              {/* Defs for Glow Filter & Gradients */}
              <defs>
                <filter id="mapGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <pattern id="mapGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke={dark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.03)'} strokeWidth="1" />
                </pattern>
              </defs>

              {/* Grid Background */}
              <rect width="700" height="920" fill="url(#mapGrid)" />

              {/* Gulf of Mexico Coastline Cue */}
              <path
                d="M 500 120 Q 560 350 515 550 T 525 890"
                fill="none"
                stroke={dark ? 'rgba(59,130,246,0.15)' : 'rgba(59,130,246,0.2)'}
                strokeWidth="2"
                strokeDasharray="4 6"
              />
              <text
                x="560"
                y="520"
                fill={dark ? 'rgba(59,130,246,0.3)' : 'rgba(59,130,246,0.45)'}
                fontSize="12"
                fontWeight="800"
                letterSpacing="4"
                transform="rotate(65 560 520)"
                style={{ userSelect: 'none' }}
              >
                GOLFO DE MÉXICO
              </text>

              {/* Municipalities Polygons */}
              <g id="municipalities-layer">
                {enrichedMunicipalities.map(m => {
                  const isHovered = hoveredMun?.id === m.id
                  const isSelected = selectedMun?.id === m.id
                  const isInSelectedRegion = selectedRegion === 'all' || m.region === selectedRegion
                  const matchesSearch = !searchQuery || m.name.toLowerCase().includes(searchQuery.toLowerCase())

                  const fillColor = getMunicipalityColor(m, activeLayer, dark, minVal, maxVal)

                  const opacity = (isInSelectedRegion && matchesSearch) ? 1 : 0.22
                  const strokeColor = isSelected
                    ? (dark ? '#ffffff' : '#1a1715')
                    : isHovered
                    ? '#e03b60'
                    : (dark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)')

                  const strokeWidth = isSelected ? 3 : isHovered ? 2.5 : 1

                  return (
                    <path
                      key={m.id}
                      id={`mun-${m.id}`}
                      d={m.path}
                      fill={fillColor}
                      stroke={strokeColor}
                      strokeWidth={strokeWidth}
                      opacity={opacity}
                      filter={isSelected || isHovered ? 'url(#mapGlow)' : undefined}
                      style={{
                        cursor: 'pointer',
                        transition: 'fill 0.3s ease, stroke 0.2s ease, opacity 0.2s ease, transform 0.2s ease',
                      }}
                      onMouseEnter={() => setHoveredMun(m)}
                      onMouseLeave={() => setHoveredMun(null)}
                      onClick={() => setSelectedMun(m)}
                    />
                  )
                })}
              </g>

              {/* Key Hubs Markers & Beacons */}
              <g id="hubs-layer">
                {enrichedMunicipalities.map(m => {
                  const isHub = KEY_HUBS.includes(m.name)
                  const isHovered = hoveredMun?.id === m.id
                  const isSelected = selectedMun?.id === m.id
                  const hasAlerts = (m.alerts?.critical || 0) > 0

                  if (!m.projX || !m.projY) return null

                  return (
                    <g
                      key={`hub-${m.id}`}
                      transform={`translate(${m.projX}, ${m.projY})`}
                      style={{ cursor: 'pointer' }}
                      onMouseEnter={() => setHoveredMun(m)}
                      onMouseLeave={() => setHoveredMun(null)}
                      onClick={() => setSelectedMun(m)}
                    >
                      {/* Critical Alert Beacon Pulse */}
                      {hasAlerts && (
                        <circle
                          r="14"
                          fill="none"
                          stroke="#ef4444"
                          strokeWidth="2"
                          opacity="0.8"
                        >
                          <animate
                            attributeName="r"
                            values="6;18;24"
                            dur="2s"
                            repeatCount="indefinite"
                          />
                          <animate
                            attributeName="opacity"
                            values="0.9;0.3;0"
                            dur="2s"
                            repeatCount="indefinite"
                          />
                        </circle>
                      )}

                      {/* Main Node Center Dot */}
                      <circle
                        r={isSelected ? 7 : isHovered ? 6 : isHub ? 4.5 : 3}
                        fill={isSelected ? '#ffffff' : hasAlerts ? '#ef4444' : isHub ? '#871233' : (dark ? '#c5bfae' : '#5c5248')}
                        stroke={dark ? '#141319' : '#ffffff'}
                        strokeWidth={isSelected ? 2.5 : 1.5}
                        style={{ transition: 'all 0.2s ease' }}
                      />

                      {/* Node Label (Major Hubs or when hovered/selected) */}
                      {(isHub || isHovered || isSelected) && (
                        <text
                          y={isSelected || isHovered ? -12 : -8}
                          textAnchor="middle"
                          fill={dark ? '#ffffff' : '#1a1715'}
                          fontSize={isSelected ? '12' : isHovered ? '11' : '9.5'}
                          fontWeight={isHub || isSelected ? '800' : '600'}
                          stroke={dark ? '#141319' : '#ffffff'}
                          strokeWidth="3"
                          paintOrder="stroke"
                          style={{
                            pointerEvents: 'none',
                            userSelect: 'none',
                          }}
                        >
                          {m.name}
                        </text>
                      )}
                    </g>
                  )
                })}
              </g>
            </svg>

            {/* FLOATING HOVER TOOLTIP */}
            {hoveredMun && (
              <div
                style={{
                  position: 'absolute',
                  left: `${Math.min(tooltipPos.x + 15, 420)}px`,
                  top: `${Math.max(tooltipPos.y - 120, 20)}px`,
                  background: dark ? 'rgba(20,19,25,0.96)' : 'rgba(255,255,255,0.96)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '14px',
                  padding: '0.85rem 1.1rem',
                  border: `1.5px solid ${dark ? '#272530' : '#e8ddd0'}`,
                  boxShadow: '0 12px 30px rgba(0,0,0,0.3)',
                  pointerEvents: 'none',
                  zIndex: 30,
                  width: '240px',
                  transition: 'opacity 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: '800', color: dark ? '#fff' : '#1a1715' }}>
                    {hoveredMun.name}
                  </h4>
                  <span style={{
                    fontSize: '0.65rem',
                    fontWeight: '700',
                    padding: '0.15rem 0.45rem',
                    borderRadius: '6px',
                    background: dark ? '#272530' : '#f0ece4',
                    color: dark ? '#c5bfae' : '#73665c',
                  }}>
                    {hoveredMun.region}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', fontSize: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: dark ? '#7e7a8c' : '#8c827a' }}>Beneficiarios:</span>
                    <strong style={{ color: dark ? '#fff' : '#1a1715' }}>{hoveredMun.totalBeneficiaries?.toLocaleString() || 0}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: dark ? '#7e7a8c' : '#8c827a' }}>IMC Promedio:</span>
                    <strong style={{ color: hoveredMun.vitals?.bmi >= 30 ? '#ef4444' : hoveredMun.vitals?.bmi >= 25 ? '#f59e0b' : '#10b981' }}>
                      {hoveredMun.vitals?.bmi || '---'} ({hoveredMun.vitals?.bmiStatus || 'Normopeso'})
                    </strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: dark ? '#7e7a8c' : '#8c827a' }}>Glucosa:</span>
                    <strong style={{ color: hoveredMun.vitals?.glucose >= 126 ? '#ef4444' : hoveredMun.vitals?.glucose >= 100 ? '#f59e0b' : '#06b6d4' }}>
                      {hoveredMun.vitals?.glucose || '---'} mg/dL
                    </strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: dark ? '#7e7a8c' : '#8c827a' }}>Presión Arterial:</span>
                    <strong style={{ color: dark ? '#fff' : '#1a1715' }}>
                      {hoveredMun.vitals?.bloodPressure?.systolic || 120}/{hoveredMun.vitals?.bloodPressure?.diastolic || 80} mmHg
                    </strong>
                  </div>
                  {hoveredMun.alerts?.total > 0 && (
                    <div style={{
                      marginTop: '0.25rem',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '6px',
                      background: 'rgba(239,68,68,0.12)',
                      color: '#ef4444',
                      fontSize: '0.7rem',
                      fontWeight: '700',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                    }}>
                      <FaExclamationTriangle size={10} />
                      {hoveredMun.alerts.total} anomalía(s) clínica(s) detectadas
                    </div>
                  )}
                </div>
                <div style={{
                  marginTop: '0.45rem',
                  fontSize: '0.65rem',
                  color: dark ? '#e03b60' : '#871233',
                  fontWeight: '700',
                  textAlign: 'right',
                }}>
                  Clic para inspeccionar ficha completa →
                </div>
              </div>
            )}
          </div>

          {/* ── MUNICIPALITY INSPECTOR DRAWER ─────────────────────── */}
          {selectedMun && (
            <MunicipalityInspector
              municipality={selectedMun}
              dark={dark}
              onClose={() => setSelectedMun(null)}
              onPrint={handlePrintMunicipality}
            />
          )}
        </div>
      ) : (
        /* ── TABLE VIEW (DATA AUDIT) ─────────────────────────────── */
        <div style={{
          background: dark ? '#141319' : '#fff',
          borderRadius: '20px',
          border: `1px solid ${dark ? '#1e1c25' : '#e8ddd0'}`,
          boxShadow: dark ? '0 10px 30px rgba(0,0,0,0.3)' : '0 4px 16px rgba(0,0,0,0.04)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}>
          {/* Table Toolbar */}
          <div style={{
            padding: '1.25rem 1.5rem',
            borderBottom: `1px solid ${dark ? '#1e1c25' : '#e8ddd0'}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
          }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '800', color: dark ? '#fff' : '#1a1715' }}>
                Matriz Comparativa de los 43 Municipios
              </h3>
              <p style={{ margin: '0.2rem 0 0', fontSize: '0.78rem', color: dark ? '#7e7a8c' : '#8c827a' }}>
                Mostrando {sortedMunicipalities.length} municipios ordenados por criterio estadístico
              </p>
            </div>

            {/* Sort Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: '700', color: dark ? '#7e7a8c' : '#8c827a' }}>
                Ordenar por:
              </span>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                style={{
                  padding: '0.45rem 0.85rem',
                  borderRadius: '10px',
                  border: `1.5px solid ${dark ? '#272530' : '#e8ddd0'}`,
                  background: dark ? '#1e1c25' : '#faf8f5',
                  color: dark ? '#fff' : '#1a1715',
                  fontSize: '0.78rem',
                  fontWeight: '700',
                  outline: 'none',
                  cursor: 'pointer',
                }}
              >
                <option value="beneficiaries">Mayor Cobertura (Beneficiarios)</option>
                <option value="risk">Mayor Riesgo Epidemiológico</option>
                <option value="bmi">Mayor Promedio IMC</option>
                <option value="glucose">Mayor Nivel de Glucosa</option>
                <option value="alerts">Mayor Número de Alertas</option>
                <option value="name">Alfabético (A - Z)</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
              <thead>
                <tr style={{
                  background: dark ? '#1a1822' : '#f9f6f0',
                  borderBottom: `1px solid ${dark ? '#272530' : '#e8ddd0'}`,
                  textAlign: 'left',
                }}>
                  <th style={{ padding: '0.85rem 1.25rem', fontWeight: '800', color: dark ? '#9ea4b0' : '#5c5248' }}>Municipio</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: '800', color: dark ? '#9ea4b0' : '#5c5248' }}>Región</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: '800', color: dark ? '#9ea4b0' : '#5c5248' }}>Población Joven</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: '800', color: dark ? '#9ea4b0' : '#5c5248' }}>Beneficiarios</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: '800', color: dark ? '#9ea4b0' : '#5c5248' }}>Adopción %</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: '800', color: dark ? '#9ea4b0' : '#5c5248' }}>IMC Promedio</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: '800', color: dark ? '#9ea4b0' : '#5c5248' }}>Glucosa</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: '800', color: dark ? '#9ea4b0' : '#5c5248' }}>Presión Art.</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: '800', color: dark ? '#9ea4b0' : '#5c5248' }}>Score Riesgo</th>
                  <th style={{ padding: '0.85rem 1.25rem', fontWeight: '800', color: dark ? '#9ea4b0' : '#5c5248', textAlign: 'center' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {sortedMunicipalities.map((m, idx) => {
                  const riskScore = m.risks?.compositeRiskScore || 50
                  return (
                    <tr
                      key={m.id}
                      style={{
                        borderBottom: `1px solid ${dark ? '#1e1c25' : '#f0ece4'}`,
                        background: idx % 2 === 0 ? 'transparent' : (dark ? 'rgba(255,255,255,0.015)' : 'rgba(0,0,0,0.015)'),
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = dark ? '#1e1c25' : '#faf5ee'}
                      onMouseLeave={e => e.currentTarget.style.background = idx % 2 === 0 ? 'transparent' : (dark ? 'rgba(255,255,255,0.015)' : 'rgba(0,0,0,0.015)')}
                    >
                      <td style={{ padding: '0.85rem 1.25rem' }}>
                        <div style={{ fontWeight: '800', color: dark ? '#fff' : '#1a1715' }}>{m.name}</div>
                        <span style={{ fontSize: '0.7rem', color: dark ? '#7e7a8c' : '#a89580' }}>INEGI: {m.inegi} · {m.cabecera}</span>
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span style={{
                          fontSize: '0.72rem',
                          fontWeight: '700',
                          padding: '0.2rem 0.55rem',
                          borderRadius: '6px',
                          background: dark ? '#272530' : '#f0ece4',
                          color: dark ? '#c5bfae' : '#73665c',
                        }}>
                          {m.region}
                        </span>
                      </td>
                      <td style={{ padding: '0.85rem 1rem', color: dark ? '#fff' : '#1a1715' }}>
                        {m.popYouth?.toLocaleString()}
                      </td>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: '700', color: dark ? '#e03b60' : '#871233' }}>
                        {m.totalBeneficiaries?.toLocaleString() || 0}
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <div style={{
                            width: '45px',
                            height: '6px',
                            borderRadius: '3px',
                            background: dark ? '#272530' : '#e8ddd0',
                            overflow: 'hidden',
                          }}>
                            <div style={{
                              width: `${Math.min(100, (m.adoptionRate || 0) * 10)}%`,
                              height: '100%',
                              background: '#871233',
                            }} />
                          </div>
                          <span style={{ fontSize: '0.75rem', fontWeight: '700', color: dark ? '#fff' : '#1a1715' }}>
                            {m.adoptionRate || 0}%
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span style={{
                          fontWeight: '700',
                          color: m.vitals?.bmi >= 30 ? '#ef4444' : m.vitals?.bmi >= 25 ? '#f59e0b' : '#10b981',
                        }}>
                          {m.vitals?.bmi}
                        </span>
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span style={{
                          fontWeight: '700',
                          color: m.vitals?.glucose >= 126 ? '#ef4444' : m.vitals?.glucose >= 100 ? '#f59e0b' : '#06b6d4',
                        }}>
                          {m.vitals?.glucose} mg/dL
                        </span>
                      </td>
                      <td style={{ padding: '0.85rem 1rem', color: dark ? '#fff' : '#1a1715' }}>
                        {m.vitals?.bloodPressure?.systolic}/{m.vitals?.bloodPressure?.diastolic}
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          padding: '0.2rem 0.6rem',
                          borderRadius: '8px',
                          background: riskScore >= 70 ? 'rgba(239,68,68,0.15)' : riskScore >= 50 ? 'rgba(245,158,11,0.15)' : 'rgba(16,185,129,0.15)',
                          color: riskScore >= 70 ? '#ef4444' : riskScore >= 50 ? '#f59e0b' : '#10b981',
                          fontWeight: '800',
                          fontSize: '0.75rem',
                        }}>
                          {riskScore} / 100
                        </div>
                      </td>
                      <td style={{ padding: '0.85rem 1.25rem', textAlign: 'center' }}>
                        <button
                          onClick={() => {
                            setSelectedMun(m)
                            setViewMode('map')
                          }}
                          style={{
                            padding: '0.35rem 0.85rem',
                            borderRadius: '8px',
                            border: `1.5px solid ${dark ? '#272530' : '#e8ddd0'}`,
                            background: dark ? '#1e1c25' : '#faf8f5',
                            color: dark ? '#fff' : '#1a1715',
                            fontSize: '0.75rem',
                            fontWeight: '700',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.background = '#871233'
                            e.currentTarget.style.color = '#fff'
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.background = dark ? '#1e1c25' : '#faf8f5'
                            e.currentTarget.style.color = dark ? '#fff' : '#1a1715'
                          }}
                        >
                          Ver en Mapa
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════
// MUNICIPALITY INSPECTOR SUB-COMPONENT
// ══════════════════════════════════════════════════════════════════

function MunicipalityInspector({ municipality, dark, onClose, onPrint }) {
  const m = municipality
  const riskScore = m.risks?.compositeRiskScore || 50
  const riskColor = riskScore >= 70 ? '#ef4444' : riskScore >= 50 ? '#f59e0b' : '#10b981'
  const riskLabel = riskScore >= 70 ? 'Riesgo Crítico' : riskScore >= 50 ? 'Riesgo Moderado' : 'Riesgo Bajo'

  return (
    <div style={{
      background: dark ? '#141319' : '#fff',
      borderRadius: '20px',
      border: `1px solid ${dark ? '#1e1c25' : '#e8ddd0'}`,
      boxShadow: dark ? '0 10px 35px rgba(0,0,0,0.4)' : '0 6px 24px rgba(135,18,51,0.08)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      maxHeight: '740px',
      position: 'sticky',
      top: '1rem',
      animation: 'fadeIn 0.25s ease',
    }}>
      {/* Drawer Header */}
      <div style={{
        padding: '1.25rem 1.5rem',
        background: dark ? 'linear-gradient(135deg, rgba(135,18,51,0.3) 0%, #1e1c25 100%)' : 'linear-gradient(135deg, #87123314 0%, #faf8f5 100%)',
        borderBottom: `1px solid ${dark ? '#272530' : '#e8ddd0'}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span style={{
              fontSize: '0.65rem',
              fontWeight: '800',
              padding: '0.15rem 0.5rem',
              borderRadius: '6px',
              background: '#871233',
              color: '#fff',
              letterSpacing: '0.04em',
            }}>
              INEGI {m.inegi}
            </span>
            <span style={{ fontSize: '0.72rem', color: dark ? '#c5bfae' : '#73665c', fontWeight: '700' }}>
              {m.region}
            </span>
          </div>
          <h2 style={{ margin: 0, fontSize: '1.35rem', fontWeight: '900', color: dark ? '#fff' : '#1a1715' }}>
            {m.name}
          </h2>
          <p style={{ margin: '0.2rem 0 0', fontSize: '0.75rem', color: dark ? '#7e7a8c' : '#8c827a' }}>
            Cabecera: <strong>{m.cabecera}</strong>
          </p>
        </div>

        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: dark ? '#7e7a8c' : '#8c827a',
            cursor: 'pointer',
            padding: '0.4rem',
            borderRadius: '8px',
            fontSize: '1rem',
          }}
          title="Cerrar inspector"
        >
          <FaTimes />
        </button>
      </div>

      {/* Drawer Body (Scrollable) */}
      <div style={{
        padding: '1.25rem 1.5rem',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
      }}>
        {/* Composite Risk Radial Card */}
        <div style={{
          background: dark ? '#1a1822' : '#f9f6f0',
          borderRadius: '14px',
          padding: '1rem 1.25rem',
          border: `1px solid ${dark ? '#272530' : '#e8ddd0'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div>
            <span style={{ fontSize: '0.68rem', fontWeight: '800', letterSpacing: '0.06em', textTransform: 'uppercase', color: dark ? '#7e7a8c' : '#8c827a' }}>
              RIESGO EPIDEMIOLÓGICO
            </span>
            <div style={{ fontSize: '1.15rem', fontWeight: '800', color: riskColor, marginTop: '0.15rem' }}>
              {riskLabel}
            </div>
            <p style={{ margin: '0.15rem 0 0', fontSize: '0.72rem', color: dark ? '#9ea4b0' : '#73665c' }}>
              Score integral metabólico/cardiovascular
            </p>
          </div>

          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            border: `4px solid ${riskColor}`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 0 15px ${riskColor}40`,
          }}>
            <span style={{ fontSize: '1.1rem', fontWeight: '900', color: dark ? '#fff' : '#1a1715', lineHeight: 1 }}>
              {riskScore}
            </span>
            <span style={{ fontSize: '0.55rem', fontWeight: '700', color: dark ? '#7e7a8c' : '#8c827a' }}>
              /100
            </span>
          </div>
        </div>

        {/* Demographics Summary */}
        <div>
          <h4 style={{
            fontSize: '0.75rem',
            fontWeight: '800',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: dark ? '#7e7a8c' : '#8c827a',
            margin: '0 0 0.6rem',
          }}>
            DEMOGRAFÍA Y COBERTURA DEL PROGRAMA
          </h4>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.75rem',
          }}>
            <div style={{
              background: dark ? '#1e1c25' : '#faf8f5',
              padding: '0.75rem 0.85rem',
              borderRadius: '10px',
              border: `1px solid ${dark ? '#272530' : '#e8ddd0'}`,
            }}>
              <span style={{ fontSize: '0.68rem', color: dark ? '#7e7a8c' : '#8c827a' }}>Población Joven (12-29):</span>
              <div style={{ fontSize: '1.1rem', fontWeight: '800', color: dark ? '#fff' : '#1a1715' }}>
                {m.popYouth?.toLocaleString()}
              </div>
            </div>
            <div style={{
              background: dark ? '#1e1c25' : '#faf8f5',
              padding: '0.75rem 0.85rem',
              borderRadius: '10px',
              border: `1px solid ${dark ? '#272530' : '#e8ddd0'}`,
            }}>
              <span style={{ fontSize: '0.68rem', color: dark ? '#7e7a8c' : '#8c827a' }}>Total Beneficiarios:</span>
              <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#871233' }}>
                {m.totalBeneficiaries?.toLocaleString() || 0}
              </div>
            </div>
          </div>

          <div style={{ marginTop: '0.6rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', marginBottom: '0.25rem' }}>
              <span style={{ color: dark ? '#7e7a8c' : '#8c827a' }}>Penetración en Población Joven</span>
              <strong style={{ color: dark ? '#fff' : '#1a1715' }}>{m.adoptionRate || 0}%</strong>
            </div>
            <div style={{ width: '100%', height: '6px', borderRadius: '3px', background: dark ? '#272530' : '#e8ddd0', overflow: 'hidden' }}>
              <div style={{ width: `${Math.min(100, (m.adoptionRate || 0) * 10)}%`, height: '100%', background: '#871233' }} />
            </div>
          </div>
        </div>

        {/* Clinical Biomarkers Breakdown */}
        <div>
          <h4 style={{
            fontSize: '0.75rem',
            fontWeight: '800',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: dark ? '#7e7a8c' : '#8c827a',
            margin: '0 0 0.6rem',
          }}>
            PROMEDIOS CLÍNICOS Y METABÓLICOS
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {/* BMI Meter */}
            <div style={{
              background: dark ? '#1e1c25' : '#faf8f5',
              padding: '0.85rem 1rem',
              borderRadius: '12px',
              border: `1px solid ${dark ? '#272530' : '#e8ddd0'}`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <FaWeight size={13} style={{ color: '#f59e0b' }} />
                  <span style={{ fontSize: '0.78rem', fontWeight: '700', color: dark ? '#fff' : '#1a1715' }}>
                    IMC Promedio
                  </span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '1rem', fontWeight: '900', color: m.vitals?.bmi >= 30 ? '#ef4444' : m.vitals?.bmi >= 25 ? '#f59e0b' : '#10b981' }}>
                    {m.vitals?.bmi}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: dark ? '#7e7a8c' : '#8c827a', marginLeft: '0.2rem' }}>kg/m²</span>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: dark ? '#7e7a8c' : '#8c827a', marginTop: '0.4rem' }}>
                <span>Normopeso (&lt;25)</span>
                <span>Sobrepeso (25-29.9)</span>
                <span>Obesidad (≥30)</span>
              </div>
              <div style={{ width: '100%', height: '6px', borderRadius: '3px', background: dark ? '#272530' : '#e8ddd0', marginTop: '0.2rem', overflow: 'hidden', display: 'flex' }}>
                <div style={{ width: '33%', height: '100%', background: '#10b981' }} />
                <div style={{ width: '33%', height: '100%', background: '#f59e0b' }} />
                <div style={{ width: '34%', height: '100%', background: '#ef4444' }} />
              </div>
            </div>

            {/* Glucose Meter */}
            <div style={{
              background: dark ? '#1e1c25' : '#faf8f5',
              padding: '0.85rem 1rem',
              borderRadius: '12px',
              border: `1px solid ${dark ? '#272530' : '#e8ddd0'}`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <FaTint size={13} style={{ color: '#06b6d4' }} />
                  <span style={{ fontSize: '0.78rem', fontWeight: '700', color: dark ? '#fff' : '#1a1715' }}>
                    Glucosa en Sangre
                  </span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '1rem', fontWeight: '900', color: m.vitals?.glucose >= 126 ? '#ef4444' : m.vitals?.glucose >= 100 ? '#f59e0b' : '#06b6d4' }}>
                    {m.vitals?.glucose}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: dark ? '#7e7a8c' : '#8c827a', marginLeft: '0.2rem' }}>mg/dL</span>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: dark ? '#7e7a8c' : '#8c827a', marginTop: '0.4rem' }}>
                <span>Normal (&lt;100)</span>
                <span>Prediabetes (100-125)</span>
                <span>Alerta (≥126)</span>
              </div>
              <div style={{ width: '100%', height: '6px', borderRadius: '3px', background: dark ? '#272530' : '#e8ddd0', marginTop: '0.2rem', overflow: 'hidden', display: 'flex' }}>
                <div style={{ width: '40%', height: '100%', background: '#06b6d4' }} />
                <div style={{ width: '35%', height: '100%', background: '#f59e0b' }} />
                <div style={{ width: '25%', height: '100%', background: '#ef4444' }} />
              </div>
            </div>

            {/* Blood Pressure Meter */}
            <div style={{
              background: dark ? '#1e1c25' : '#faf8f5',
              padding: '0.85rem 1rem',
              borderRadius: '12px',
              border: `1px solid ${dark ? '#272530' : '#e8ddd0'}`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <FaHeartbeat size={13} style={{ color: '#ef4444' }} />
                  <span style={{ fontSize: '0.78rem', fontWeight: '700', color: dark ? '#fff' : '#1a1715' }}>
                    Presión Arterial Promedio
                  </span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '1rem', fontWeight: '900', color: dark ? '#fff' : '#1a1715' }}>
                    {m.vitals?.bloodPressure?.systolic}/{m.vitals?.bloodPressure?.diastolic}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: dark ? '#7e7a8c' : '#8c827a', marginLeft: '0.2rem' }}>mmHg</span>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: dark ? '#7e7a8c' : '#8c827a', marginTop: '0.4rem' }}>
                <span>Riesgo Hipertensivo Estimado:</span>
                <strong style={{ color: '#f59e0b' }}>{m.risks?.hypertensionRiskRate}%</strong>
              </div>
            </div>

            {/* Telemetry row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
              <div style={{
                background: dark ? '#1e1c25' : '#faf8f5',
                padding: '0.65rem 0.85rem',
                borderRadius: '10px',
                border: `1px solid ${dark ? '#272530' : '#e8ddd0'}`,
              }}>
                <span style={{ fontSize: '0.68rem', color: dark ? '#7e7a8c' : '#8c827a' }}>Ritmo Cardíaco:</span>
                <div style={{ fontSize: '0.95rem', fontWeight: '800', color: dark ? '#fff' : '#1a1715' }}>
                  {m.vitals?.heartRate || 72} <span style={{ fontSize: '0.7rem', fontWeight: '500' }}>lpm</span>
                </div>
              </div>
              <div style={{
                background: dark ? '#1e1c25' : '#faf8f5',
                padding: '0.65rem 0.85rem',
                borderRadius: '10px',
                border: `1px solid ${dark ? '#272530' : '#e8ddd0'}`,
              }}>
                <span style={{ fontSize: '0.68rem', color: dark ? '#7e7a8c' : '#8c827a' }}>Oxígeno SpO2:</span>
                <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#10b981' }}>
                  {m.vitals?.spo2 || 98}%
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Clinical Alerts Box */}
        {m.alerts?.total > 0 && (
          <div style={{
            background: 'rgba(239,68,68,0.1)',
            borderRadius: '12px',
            padding: '0.85rem 1rem',
            border: '1px solid rgba(239,68,68,0.25)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#ef4444', fontWeight: '800', fontSize: '0.8rem', marginBottom: '0.3rem' }}>
              <FaExclamationTriangle size={13} />
              Alertas Epidemiológicas en la Zona
            </div>
            <p style={{ margin: 0, fontSize: '0.72rem', color: dark ? '#ff8595' : '#991b1b' }}>
              Se han detectado {m.alerts.critical || 0} anomalías críticas y {m.alerts.warning || 0} advertencias preventivas vinculadas a pacientes registrados en {m.name}.
            </p>
          </div>
        )}
      </div>

      {/* Drawer Footer Actions */}
      <div style={{
        padding: '1rem 1.5rem',
        borderTop: `1px solid ${dark ? '#272530' : '#e8ddd0'}`,
        display: 'flex',
        gap: '0.75rem',
      }}>
        <button
          onClick={onPrint}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.4rem',
            padding: '0.6rem 1rem',
            borderRadius: '10px',
            border: `1.5px solid ${dark ? '#272530' : '#e8ddd0'}`,
            background: dark ? '#1e1c25' : '#faf8f5',
            color: dark ? '#fff' : '#1a1715',
            fontSize: '0.8rem',
            fontWeight: '700',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          <FaPrint size={12} /> Imprimir Ficha
        </button>
        <button
          onClick={onClose}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0.6rem 1rem',
            borderRadius: '10px',
            border: 'none',
            background: '#871233',
            color: '#fff',
            fontSize: '0.8rem',
            fontWeight: '700',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          Cerrar
        </button>
      </div>
    </div>
  )
}
