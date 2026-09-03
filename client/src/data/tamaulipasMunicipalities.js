// ===============================================================
// MASTER CATALOG: 43 MUNICIPIOS DEL ESTADO DE TAMAULIPAS
// ===============================================================

export const TAMAULIPAS_REGIONS = [
  { id: 'all', name: 'Todo el Estado', color: '#871233' },
  { id: 'Frontera Norte', name: 'Frontera Norte', color: '#3b82f6' },
  { id: 'Valle de San Fernando', name: 'Valle de San Fernando', color: '#06b6d4' },
  { id: 'Centro', name: 'Región Centro', color: '#10b981' },
  { id: 'Altiplano', name: 'Altiplano', color: '#f59e0b' },
  { id: 'Sur', name: 'Zona Sur / Conurbada', color: '#8b5cf6' },
  { id: 'Costa', name: 'Costa', color: '#ec4899' },
]

// Projected Coordinates (ViewBox 0 0 700 900)
// Lon: -100.2 (left) to -97.1 (right) -> X
// Lat: 27.8 (top) to 22.1 (bottom) -> Y
function projectCoords(lat, lng) {
  const minLng = -100.2
  const maxLng = -97.1
  const minLat = 22.1
  const maxLat = 27.8

  const x = ((lng - minLng) / (maxLng - minLng)) * 620 + 40
  const y = ((maxLat - lat) / (maxLat - minLat)) * 800 + 50
  return { x: Math.round(x), y: Math.round(y) }
}

export const TAMAULIPAS_MUNICIPALITIES = [
  {
    id: 'abasolo',
    name: 'Abasolo',
    inegi: '28001',
    region: 'Centro',
    cabecera: 'Abasolo',
    lat: 24.0569,
    lng: -98.3739,
    popYouth: 3120,
    radius: 20,
    path: "M360,530 L395,520 L415,550 L385,580 L350,560 Z"
  },
  {
    id: 'aldama',
    name: 'Aldama',
    inegi: '28002',
    region: 'Sur',
    cabecera: 'Aldama',
    lat: 22.9205,
    lng: -97.9042,
    popYouth: 8200,
    radius: 26,
    path: "M435,690 L480,685 L510,725 L475,760 L430,730 Z"
  },
  {
    id: 'altamira',
    name: 'Altamira',
    inegi: '28003',
    region: 'Sur',
    cabecera: 'Altamira',
    lat: 22.3925,
    lng: -97.9392,
    popYouth: 72400,
    radius: 34,
    path: "M435,765 L480,760 L505,800 L470,830 L430,800 Z"
  },
  {
    id: 'antiguo-morelos',
    name: 'Antiguo Morelos',
    inegi: '28004',
    region: 'Sur',
    cabecera: 'Antiguo Morelos',
    lat: 22.5489,
    lng: -99.0833,
    popYouth: 2450,
    radius: 17,
    path: "M245,770 L275,760 L285,785 L260,805 L235,790 Z"
  },
  {
    id: 'burgos',
    name: 'Burgos',
    inegi: '28005',
    region: 'Valle de San Fernando',
    cabecera: 'Burgos',
    lat: 24.9483,
    lng: -98.7969,
    popYouth: 1420,
    radius: 22,
    path: "M275,405 L315,395 L335,435 L295,455 L265,430 Z"
  },
  {
    id: 'bustamante',
    name: 'Bustamante',
    inegi: '28006',
    region: 'Altiplano',
    cabecera: 'Bustamante',
    lat: 23.4358,
    lng: -99.7578,
    popYouth: 1980,
    radius: 21,
    path: "M110,630 L145,615 L160,650 L135,680 L100,660 Z"
  },
  {
    id: 'camargo',
    name: 'Camargo',
    inegi: '28007',
    region: 'Frontera Norte',
    cabecera: 'Ciudad Camargo',
    lat: 26.3214,
    lng: -98.8319,
    popYouth: 4600,
    radius: 25,
    path: "M265,210 L310,200 L325,235 L285,255 L255,230 Z"
  },
  {
    id: 'casas',
    name: 'Casas',
    inegi: '28008',
    region: 'Centro',
    cabecera: 'Casas',
    lat: 23.7297,
    lng: -98.7369,
    popYouth: 1250,
    radius: 27,
    path: "M295,570 L345,555 L375,600 L325,630 L285,600 Z"
  },
  {
    id: 'ciudad-madero',
    name: 'Ciudad Madero',
    inegi: '28009',
    region: 'Sur',
    cabecera: 'Ciudad Madero',
    lat: 22.2742,
    lng: -97.8344,
    popYouth: 58900,
    radius: 22,
    path: "M485,815 L515,810 L525,835 L500,850 L475,835 Z"
  },
  {
    id: 'cruillas',
    name: 'Cruillas',
    inegi: '28010',
    region: 'Valle de San Fernando',
    cabecera: 'Cruillas',
    lat: 24.7575,
    lng: -98.5372,
    popYouth: 620,
    radius: 21,
    path: "M325,435 L365,420 L385,460 L345,480 L315,455 Z"
  },
  {
    id: 'gomez-farias',
    name: 'Gómez Farías',
    inegi: '28011',
    region: 'Sur',
    cabecera: 'Gómez Farías',
    lat: 23.0539,
    lng: -99.1508,
    popYouth: 2490,
    radius: 20,
    path: "M230,685 L265,670 L280,705 L250,725 L220,705 Z"
  },
  {
    id: 'gonzalez',
    name: 'González',
    inegi: '28012',
    region: 'Sur',
    cabecera: 'González',
    lat: 22.8258,
    lng: -98.4319,
    popYouth: 11200,
    radius: 30,
    path: "M345,710 L395,695 L425,740 L380,775 L335,745 Z"
  },
  {
    id: 'guemez',
    name: 'Güémez',
    inegi: '28013',
    region: 'Centro',
    cabecera: 'Güémez',
    lat: 23.9292,
    lng: -99.0119,
    popYouth: 4280,
    radius: 24,
    path: "M245,545 L290,530 L310,570 L270,595 L235,570 Z"
  },
  {
    id: 'guerrero',
    name: 'Guerrero',
    inegi: '28014',
    region: 'Frontera Norte',
    cabecera: 'Nueva Ciudad Guerrero',
    lat: 26.5658,
    lng: -99.2319,
    popYouth: 1100,
    radius: 24,
    path: "M190,175 L235,160 L255,200 L215,220 L180,195 Z"
  },
  {
    id: 'gustavo-diaz-ordaz',
    name: 'Gustavo Díaz Ordaz',
    inegi: '28015',
    region: 'Frontera Norte',
    cabecera: 'Ciudad Gustavo Díaz Ordaz',
    lat: 26.2319,
    lng: -98.5969,
    popYouth: 4120,
    radius: 21,
    path: "M310,225 L350,215 L365,245 L330,265 L300,245 Z"
  },
  {
    id: 'hidalgo',
    name: 'Hidalgo',
    inegi: '28016',
    region: 'Centro',
    cabecera: 'Hidalgo',
    lat: 24.2492,
    lng: -99.4369,
    popYouth: 4500,
    radius: 25,
    path: "M170,500 L215,485 L235,525 L195,550 L160,525 Z"
  },
  {
    id: 'jaumave',
    name: 'Jaumave',
    inegi: '28017',
    region: 'Altiplano',
    cabecera: 'Jaumave',
    lat: 23.4144,
    lng: -99.3789,
    popYouth: 4300,
    radius: 26,
    path: "M175,635 L220,620 L240,660 L200,690 L165,665 Z"
  },
  {
    id: 'jimenez',
    name: 'Jiménez',
    inegi: '28018',
    region: 'Centro',
    cabecera: 'Santander Jiménez',
    lat: 24.2189,
    lng: -98.4878,
    popYouth: 2350,
    radius: 25,
    path: "M340,505 L385,490 L405,530 L365,555 L330,530 Z"
  },
  {
    id: 'llera',
    name: 'Llera',
    inegi: '28019',
    region: 'Centro',
    cabecera: 'Llera de Canales',
    lat: 23.3178,
    lng: -99.0269,
    popYouth: 4680,
    radius: 27,
    path: "M245,640 L295,625 L320,670 L275,700 L235,670 Z"
  },
  {
    id: 'mainero',
    name: 'Mainero',
    inegi: '28020',
    region: 'Centro',
    cabecera: 'Villa Mainero',
    lat: 24.5669,
    lng: -99.5969,
    popYouth: 720,
    radius: 17,
    path: "M145,455 L175,445 L190,475 L165,495 L140,475 Z"
  },
  {
    id: 'el-mante',
    name: 'El Mante',
    inegi: '28021',
    region: 'Sur',
    cabecera: 'Ciudad Mante',
    lat: 22.7431,
    lng: -98.9719,
    popYouth: 31200,
    radius: 30,
    path: "M255,730 L305,715 L330,760 L285,790 L245,765 Z"
  },
  {
    id: 'matamoros',
    name: 'Matamoros',
    inegi: '28022',
    region: 'Frontera Norte',
    cabecera: 'Heroica Matamoros',
    lat: 25.8690,
    lng: -97.5027,
    popYouth: 148900,
    radius: 42,
    path: "M500,270 L570,250 L605,310 L545,355 L480,315 Z"
  },
  {
    id: 'mendez',
    name: 'Méndez',
    inegi: '28023',
    region: 'Valle de San Fernando',
    cabecera: 'Méndez',
    lat: 25.1219,
    lng: -98.5919,
    popYouth: 1180,
    radius: 23,
    path: "M305,380 L355,365 L375,410 L330,435 L295,405 Z"
  },
  {
    id: 'mier',
    name: 'Mier',
    inegi: '28024',
    region: 'Frontera Norte',
    cabecera: 'Mier',
    lat: 26.4319,
    lng: -99.1469,
    popYouth: 1350,
    radius: 18,
    path: "M205,195 L245,185 L260,215 L225,235 L195,215 Z"
  },
  {
    id: 'miguel-aleman',
    name: 'Miguel Alemán',
    inegi: '28025',
    region: 'Frontera Norte',
    cabecera: 'Ciudad Miguel Alemán',
    lat: 26.3986,
    lng: -99.0236,
    popYouth: 7800,
    radius: 20,
    path: "M230,200 L270,190 L285,220 L250,240 L220,220 Z"
  },
  {
    id: 'miquihuana',
    name: 'Miquihuana',
    inegi: '28026',
    region: 'Altiplano',
    cabecera: 'Miquihuana',
    lat: 23.5758,
    lng: -99.7569,
    popYouth: 950,
    radius: 20,
    path: "M105,595 L145,580 L165,615 L130,645 L95,625 Z"
  },
  {
    id: 'nuevo-laredo',
    name: 'Nuevo Laredo',
    inegi: '28027',
    region: 'Frontera Norte',
    cabecera: 'Nuevo Laredo',
    lat: 27.4861,
    lng: -99.5078,
    popYouth: 124500,
    radius: 42,
    path: "M130,55 L215,40 L240,110 L170,145 L115,100 Z"
  },
  {
    id: 'nuevo-morelos',
    name: 'Nuevo Morelos',
    inegi: '28028',
    region: 'Sur',
    cabecera: 'Nuevo Morelos',
    lat: 22.5319,
    lng: -99.2169,
    popYouth: 920,
    radius: 17,
    path: "M220,775 L250,765 L260,795 L235,810 L210,795 Z"
  },
  {
    id: 'ocampo',
    name: 'Ocampo',
    inegi: '28029',
    region: 'Sur',
    cabecera: 'Ocampo',
    lat: 22.8447,
    lng: -99.3364,
    popYouth: 3800,
    radius: 25,
    path: "M195,715 L240,700 L260,745 L220,775 L185,745 Z"
  },
  {
    id: 'padilla',
    name: 'Padilla',
    inegi: '28030',
    region: 'Centro',
    cabecera: 'Nueva Villa de Padilla',
    lat: 24.0489,
    lng: -98.9039,
    popYouth: 3950,
    radius: 25,
    path: "M265,525 L315,510 L335,555 L295,580 L255,555 Z"
  },
  {
    id: 'palmillas',
    name: 'Palmillas',
    inegi: '28031',
    region: 'Altiplano',
    cabecera: 'Palmillas',
    lat: 23.3039,
    lng: -99.5447,
    popYouth: 520,
    radius: 18,
    path: "M145,655 L180,640 L195,675 L165,695 L135,680 Z"
  },
  {
    id: 'reynosa',
    name: 'Reynosa',
    inegi: '28032',
    region: 'Frontera Norte',
    cabecera: 'Reynosa',
    lat: 26.0806,
    lng: -98.2883,
    popYouth: 205000,
    radius: 46,
    path: "M360,240 L440,220 L470,285 L405,325 L340,285 Z"
  },
  {
    id: 'rio-bravo',
    name: 'Río Bravo',
    inegi: '28033',
    region: 'Frontera Norte',
    cabecera: 'Ciudad Río Bravo',
    lat: 25.9819,
    lng: -98.0939,
    popYouth: 39800,
    radius: 32,
    path: "M405,255 L465,240 L490,295 L440,330 L390,295 Z"
  },
  {
    id: 'san-carlos',
    name: 'San Carlos',
    inegi: '28034',
    region: 'Valle de San Fernando',
    cabecera: 'San Carlos',
    lat: 24.5244,
    lng: -98.9389,
    popYouth: 2150,
    radius: 26,
    path: "M255,465 L305,450 L325,495 L285,520 L245,495 Z"
  },
  {
    id: 'san-fernando',
    name: 'San Fernando',
    inegi: '28035',
    region: 'Valle de San Fernando',
    cabecera: 'San Fernando',
    lat: 24.8483,
    lng: -98.1578,
    popYouth: 16200,
    radius: 36,
    path: "M385,420 L455,400 L490,470 L430,515 L365,470 Z"
  },
  {
    id: 'san-nicolas',
    name: 'San Nicolás',
    inegi: '28036',
    region: 'Valle de San Fernando',
    cabecera: 'San Nicolás',
    lat: 24.6919,
    lng: -98.8319,
    popYouth: 310,
    radius: 17,
    path: "M275,445 L305,435 L320,465 L295,485 L265,465 Z"
  },
  {
    id: 'soto-la-marina',
    name: 'Soto la Marina',
    inegi: '28037',
    region: 'Costa',
    cabecera: 'Soto la Marina',
    lat: 23.7667,
    lng: -98.2119,
    popYouth: 7400,
    radius: 38,
    path: "M390,560 L465,540 L505,620 L445,670 L375,620 Z"
  },
  {
    id: 'tampico',
    name: 'Tampico',
    inegi: '28038',
    region: 'Sur',
    cabecera: 'Tampico',
    lat: 22.2558,
    lng: -97.8686,
    popYouth: 83500,
    radius: 26,
    path: "M475,830 L505,825 L515,855 L490,870 L465,855 Z"
  },
  {
    id: 'tula',
    name: 'Tula',
    inegi: '28039',
    region: 'Altiplano',
    cabecera: 'Ciudad Tula',
    lat: 22.9972,
    lng: -99.7119,
    popYouth: 7900,
    radius: 30,
    path: "M120,695 L175,675 L200,730 L155,765 L105,735 Z"
  },
  {
    id: 'valle-hermoso',
    name: 'Valle Hermoso',
    inegi: '28040',
    region: 'Frontera Norte',
    cabecera: 'Valle Hermoso',
    lat: 25.6719,
    lng: -97.8189,
    popYouth: 18400,
    radius: 27,
    path: "M450,290 L500,275 L525,325 L485,355 L440,325 Z"
  },
  {
    id: 'victoria',
    name: 'Victoria',
    inegi: '28041',
    region: 'Centro',
    cabecera: 'Ciudad Victoria (Capital)',
    lat: 23.7369,
    lng: -99.1411,
    popYouth: 98600,
    radius: 36,
    path: "M215,570 L275,550 L305,605 L255,640 L200,605 Z"
  },
  {
    id: 'villagran',
    name: 'Villagrán',
    inegi: '28042',
    region: 'Centro',
    cabecera: 'Villagrán',
    lat: 24.4758,
    lng: -99.4919,
    popYouth: 1600,
    radius: 21,
    path: "M160,470 L200,455 L220,495 L185,515 L150,495 Z"
  },
  {
    id: 'xicotencatl',
    name: 'Xicoténcatl',
    inegi: '28043',
    region: 'Sur',
    cabecera: 'Xicoténcatl',
    lat: 22.9989,
    lng: -98.9439,
    popYouth: 6100,
    radius: 24,
    path: "M265,680 L310,665 L330,705 L290,730 L255,705 Z"
  }
].map(m => {
  const proj = projectCoords(m.lat, m.lng)
  return {
    ...m,
    projX: proj.x,
    projY: proj.y,
  }
})
