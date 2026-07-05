// Datos históricos de Mundiales 1970-2026
// Cada selección incluye sus 11 mejores jugadores de ese torneo

export const MUNDIALES_EQUIPOS = [

  // ===================== MUNDIAL 1970 - MEXICO =====================
  {
    id: 'brasil_1970', nombre: 'Brasil 1970', abrev: 'BRA', color: '#FFD700', colorSecundario: '#009C3B',
    liga: 'mundial', anio: 1970, pais: 'Brasil',
    cartaEspecial: { mediaBase: 99, jugadorNombre: 'Pelé 1970 (LEGENDARIO)', jugadorPos: 'DEL', rareza: 'especial', probabilidad: 0.01 },
    jugadores: [
      { id: 'br70_felix', nombre: 'Félix', pos: 'POR', media: 79, upgrades: [] },
      { id: 'br70_carlosalberto', nombre: 'Carlos Alberto', pos: 'LAD', media: 87, upgrades: [{ media: 91, prob: 0.20 }] },
      { id: 'br70_brito', nombre: 'Brito', pos: 'DFC', media: 78, upgrades: [] },
      { id: 'br70_piazza', nombre: 'Piazza', pos: 'DFC', media: 78, upgrades: [] },
      { id: 'br70_everaldo', nombre: 'Everaldo', pos: 'LAI', media: 80, upgrades: [] },
      { id: 'br70_clodoaldo', nombre: 'Clodoaldo', pos: 'MCD', media: 82, upgrades: [] },
      { id: 'br70_gerson', nombre: 'Gérson', pos: 'MC', media: 87, upgrades: [{ media: 91, prob: 0.20 }] },
      { id: 'br70_rivelino', nombre: 'Rivelino', pos: 'EXI', media: 90, upgrades: [{ media: 94, prob: 0.15 }] },
      { id: 'br70_jairzinho', nombre: 'Jairzinho', pos: 'EXD', media: 92, upgrades: [{ media: 95, prob: 0.15 }, { media: 98, prob: 0.05 }] },
      { id: 'br70_tostao', nombre: 'Tostão', pos: 'DEL', media: 89, upgrades: [{ media: 93, prob: 0.15 }] },
      { id: 'br70_pele', nombre: 'Pelé', pos: 'DEL', media: 99, upgrades: [] },
    ]
  },
  {
    id: 'italia_1970', nombre: 'Italia 1970', abrev: 'ITA', color: '#003399', colorSecundario: '#FFFFFF',
    liga: 'mundial', anio: 1970, pais: 'Italia',
    cartaEspecial: null,
    jugadores: [
      { id: 'it70_albertosi', nombre: 'Albertosi', pos: 'POR', media: 84, upgrades: [] },
      { id: 'it70_burgnich', nombre: 'Burgnich', pos: 'LAD', media: 83, upgrades: [] },
      { id: 'it70_cera', nombre: 'Cera', pos: 'DFC', media: 79, upgrades: [] },
      { id: 'it70_rosato', nombre: 'Rosato', pos: 'DFC', media: 78, upgrades: [] },
      { id: 'it70_facchetti', nombre: 'Facchetti', pos: 'LAI', media: 86, upgrades: [{ media: 90, prob: 0.20 }] },
      { id: 'it70_bertini', nombre: 'Bertini', pos: 'MCD', media: 80, upgrades: [] },
      { id: 'it70_mazzola', nombre: 'Mazzola', pos: 'MC', media: 88, upgrades: [{ media: 92, prob: 0.15 }] },
      { id: 'it70_rivera', nombre: 'Rivera', pos: 'MCO', media: 90, upgrades: [{ media: 93, prob: 0.15 }, { media: 96, prob: 0.05 }] },
      { id: 'it70_domenghini', nombre: 'Domenghini', pos: 'EXD', media: 82, upgrades: [] },
      { id: 'it70_boninsegna', nombre: 'Boninsegna', pos: 'DEL', media: 87, upgrades: [{ media: 91, prob: 0.20 }] },
      { id: 'it70_riva', nombre: 'Gigi Riva', pos: 'EXI', media: 92, upgrades: [{ media: 95, prob: 0.15 }] },
    ]
  },
  {
    id: 'alemania_1970', nombre: 'Alemania Occ. 1970', abrev: 'GER', color: '#000000', colorSecundario: '#DD0000',
    liga: 'mundial', anio: 1970, pais: 'Alemania',
    cartaEspecial: null,
    jugadores: [
      { id: 'ge70_maier', nombre: 'Sepp Maier', pos: 'POR', media: 88, upgrades: [{ media: 92, prob: 0.15 }] },
      { id: 'ge70_vogts', nombre: 'Vogts', pos: 'LAD', media: 83, upgrades: [] },
      { id: 'ge70_schulz', nombre: 'Schulz', pos: 'DFC', media: 79, upgrades: [] },
      { id: 'ge70_schnellinger', nombre: 'Schnellinger', pos: 'LAI', media: 81, upgrades: [] },
      { id: 'ge70_beckenbauer', nombre: 'Beckenbauer', pos: 'DFC', media: 95, upgrades: [{ media: 98, prob: 0.15 }, { media: 99, prob: 0.05 }] },
      { id: 'ge70_overath', nombre: 'Overath', pos: 'MC', media: 86, upgrades: [{ media: 90, prob: 0.20 }] },
      { id: 'ge70_seeler', nombre: 'Seeler', pos: 'DEL', media: 88, upgrades: [{ media: 92, prob: 0.15 }] },
      { id: 'ge70_grabowski', nombre: 'Grabowski', pos: 'EXD', media: 80, upgrades: [] },
      { id: 'ge70_held', nombre: 'Held', pos: 'EXI', media: 80, upgrades: [] },
      { id: 'ge70_muller', nombre: 'Gerd Müller', pos: 'DEL', media: 95, upgrades: [{ media: 97, prob: 0.15 }, { media: 99, prob: 0.05 }] },
      { id: 'ge70_libuda', nombre: 'Libuda', pos: 'EXD', media: 78, upgrades: [] },
    ]
  },

  // ===================== MUNDIAL 1974 - ALEMANIA =====================
  {
    id: 'alemania_1974', nombre: 'Alemania Occ. 1974', abrev: 'GER', color: '#000000', colorSecundario: '#DD0000',
    liga: 'mundial', anio: 1974, pais: 'Alemania',
    cartaEspecial: { mediaBase: 99, jugadorNombre: 'Beckenbauer 1974 (LEGENDARIO)', jugadorPos: 'DFC', rareza: 'especial', probabilidad: 0.01 },
    jugadores: [
      { id: 'ge74_maier', nombre: 'Sepp Maier', pos: 'POR', media: 89, upgrades: [{ media: 93, prob: 0.15 }] },
      { id: 'ge74_vogts', nombre: 'Vogts', pos: 'LAD', media: 83, upgrades: [] },
      { id: 'ge74_schwarzenbeck', nombre: 'Schwarzenbeck', pos: 'DFC', media: 82, upgrades: [] },
      { id: 'ge74_beckenbauer', nombre: 'Beckenbauer', pos: 'DFC', media: 96, upgrades: [{ media: 98, prob: 0.15 }, { media: 99, prob: 0.05 }] },
      { id: 'ge74_breitner', nombre: 'Breitner', pos: 'LAI', media: 87, upgrades: [{ media: 91, prob: 0.20 }] },
      { id: 'ge74_bonhof', nombre: 'Bonhof', pos: 'MCD', media: 84, upgrades: [] },
      { id: 'ge74_overath', nombre: 'Overath', pos: 'MC', media: 87, upgrades: [{ media: 91, prob: 0.15 }] },
      { id: 'ge74_hoeness', nombre: 'Hoeneß', pos: 'EXI', media: 83, upgrades: [] },
      { id: 'ge74_grabowski', nombre: 'Grabowski', pos: 'EXD', media: 82, upgrades: [] },
      { id: 'ge74_muller', nombre: 'Gerd Müller', pos: 'DEL', media: 95, upgrades: [{ media: 98, prob: 0.15 }, { media: 99, prob: 0.05 }] },
      { id: 'ge74_heynckes', nombre: 'Heynckes', pos: 'DEL', media: 80, upgrades: [] },
    ]
  },
  {
    id: 'holanda_1974', nombre: 'Holanda 1974', abrev: 'HOL', color: '#FF6600', colorSecundario: '#FFFFFF',
    liga: 'mundial', anio: 1974, pais: 'Holanda',
    cartaEspecial: { mediaBase: 99, jugadorNombre: 'Cruyff 1974 (LEGENDARIO)', jugadorPos: 'DEL', rareza: 'especial', probabilidad: 0.01 },
    jugadores: [
      { id: 'ho74_jongbloed', nombre: 'Jongbloed', pos: 'POR', media: 78, upgrades: [] },
      { id: 'ho74_suurbier', nombre: 'Suurbier', pos: 'LAD', media: 81, upgrades: [] },
      { id: 'ho74_rijsbergen', nombre: 'Rijsbergen', pos: 'DFC', media: 79, upgrades: [] },
      { id: 'ho74_haan', nombre: 'Haan', pos: 'DFC', media: 83, upgrades: [] },
      { id: 'ho74_krol', nombre: 'Krol', pos: 'LAI', media: 85, upgrades: [{ media: 89, prob: 0.20 }] },
      { id: 'ho74_neeskens', nombre: 'Neeskens', pos: 'MCD', media: 89, upgrades: [{ media: 93, prob: 0.15 }] },
      { id: 'ho74_vanhanegem', nombre: 'Van Hanegem', pos: 'MC', media: 87, upgrades: [{ media: 91, prob: 0.20 }] },
      { id: 'ho74_jansen', nombre: 'Jansen', pos: 'MC', media: 82, upgrades: [] },
      { id: 'ho74_rensenbrink', nombre: 'Rensenbrink', pos: 'EXI', media: 85, upgrades: [{ media: 89, prob: 0.20 }] },
      { id: 'ho74_rep', nombre: 'Rep', pos: 'EXD', media: 86, upgrades: [{ media: 90, prob: 0.20 }] },
      { id: 'ho74_cruyff', nombre: 'Johan Cruyff', pos: 'DEL', media: 98, upgrades: [{ media: 99, prob: 0.15 }] },
    ]
  },

  // ===================== MUNDIAL 1978 - ARGENTINA =====================
  {
    id: 'argentina_1978', nombre: 'Argentina 1978', abrev: 'ARG', color: '#75AADB', colorSecundario: '#FFFFFF',
    liga: 'mundial', anio: 1978, pais: 'Argentina',
    cartaEspecial: null,
    jugadores: [
      { id: 'ar78_fillol', nombre: 'Fillol', pos: 'POR', media: 85, upgrades: [{ media: 89, prob: 0.20 }] },
      { id: 'ar78_olguin', nombre: 'Olguín', pos: 'LAD', media: 79, upgrades: [] },
      { id: 'ar78_galvan', nombre: 'Galván', pos: 'DFC', media: 80, upgrades: [] },
      { id: 'ar78_passarella', nombre: 'Passarella', pos: 'DFC', media: 89, upgrades: [{ media: 93, prob: 0.15 }] },
      { id: 'ar78_tarantini', nombre: 'Tarantini', pos: 'LAI', media: 80, upgrades: [] },
      { id: 'ar78_ardiles', nombre: 'Ardiles', pos: 'MC', media: 88, upgrades: [{ media: 92, prob: 0.15 }] },
      { id: 'ar78_gallardo', nombre: 'Gallardo', pos: 'MC', media: 83, upgrades: [] },
      { id: 'ar78_ortiz', nombre: 'Ortiz', pos: 'MCD', media: 82, upgrades: [] },
      { id: 'ar78_luque', nombre: 'Luque', pos: 'DEL', media: 86, upgrades: [{ media: 90, prob: 0.20 }] },
      { id: 'ar78_kempes', nombre: 'Mario Kempes', pos: 'DEL', media: 94, upgrades: [{ media: 97, prob: 0.15 }, { media: 99, prob: 0.05 }] },
      { id: 'ar78_bertoni', nombre: 'Bertoni', pos: 'EXD', media: 82, upgrades: [] },
    ]
  },
  {
    id: 'holanda_1978', nombre: 'Holanda 1978', abrev: 'HOL', color: '#FF6600', colorSecundario: '#FFFFFF',
    liga: 'mundial', anio: 1978, pais: 'Holanda',
    cartaEspecial: null,
    jugadores: [
      { id: 'ho78_jongbloed', nombre: 'Jongbloed', pos: 'POR', media: 79, upgrades: [] },
      { id: 'ho78_poortvliet', nombre: 'Poortvliet', pos: 'LAD', media: 79, upgrades: [] },
      { id: 'ho78_brandts', nombre: 'Brandts', pos: 'DFC', media: 80, upgrades: [] },
      { id: 'ho78_krol', nombre: 'Krol', pos: 'LAI', media: 86, upgrades: [{ media: 90, prob: 0.20 }] },
      { id: 'ho78_haan', nombre: 'Haan', pos: 'MCD', media: 84, upgrades: [] },
      { id: 'ho78_neeskens', nombre: 'Neeskens', pos: 'MC', media: 87, upgrades: [{ media: 91, prob: 0.20 }] },
      { id: 'ho78_vdkerk_r', nombre: 'Van de Kerkhof R.', pos: 'MC', media: 83, upgrades: [] },
      { id: 'ho78_vdkerk_w', nombre: 'Van de Kerkhof W.', pos: 'EXI', media: 82, upgrades: [] },
      { id: 'ho78_rensenbrink', nombre: 'Rensenbrink', pos: 'EXD', media: 89, upgrades: [{ media: 93, prob: 0.15 }] },
      { id: 'ho78_rep', nombre: 'Rep', pos: 'DEL', media: 85, upgrades: [] },
      { id: 'ho78_nanninga', nombre: 'Nanninga', pos: 'DEL', media: 79, upgrades: [] },
    ]
  },

  // ===================== MUNDIAL 1982 - ESPAÑA =====================
  {
    id: 'italia_1982', nombre: 'Italia 1982', abrev: 'ITA', color: '#003399', colorSecundario: '#FFFFFF',
    liga: 'mundial', anio: 1982, pais: 'Italia',
    cartaEspecial: { mediaBase: 97, jugadorNombre: 'Zoff 1982 (LEGENDARIO)', jugadorPos: 'POR', rareza: 'especial', probabilidad: 0.01 },
    jugadores: [
      { id: 'it82_zoff', nombre: 'Dino Zoff', pos: 'POR', media: 92, upgrades: [{ media: 95, prob: 0.15 }, { media: 97, prob: 0.05 }] },
      { id: 'it82_bergomi', nombre: 'Bergomi', pos: 'LAD', media: 81, upgrades: [] },
      { id: 'it82_scirea', nombre: 'Scirea', pos: 'DFC', media: 88, upgrades: [{ media: 92, prob: 0.15 }] },
      { id: 'it82_gentile', nombre: 'Gentile', pos: 'DFC', media: 83, upgrades: [] },
      { id: 'it82_cabrini', nombre: 'Cabrini', pos: 'LAI', media: 85, upgrades: [] },
      { id: 'it82_oriali', nombre: 'Oriali', pos: 'MCD', media: 81, upgrades: [] },
      { id: 'it82_tardelli', nombre: 'Tardelli', pos: 'MC', media: 87, upgrades: [{ media: 91, prob: 0.20 }] },
      { id: 'it82_antognoni', nombre: 'Antognoni', pos: 'MCO', media: 86, upgrades: [{ media: 90, prob: 0.15 }] },
      { id: 'it82_conti', nombre: 'Conti', pos: 'EXD', media: 84, upgrades: [] },
      { id: 'it82_graziani', nombre: 'Graziani', pos: 'DEL', media: 82, upgrades: [] },
      { id: 'it82_rossi', nombre: 'Paolo Rossi', pos: 'DEL', media: 92, upgrades: [{ media: 95, prob: 0.15 }, { media: 98, prob: 0.05 }] },
    ]
  },
  {
    id: 'brasil_1982', nombre: 'Brasil 1982', abrev: 'BRA', color: '#FFD700', colorSecundario: '#009C3B',
    liga: 'mundial', anio: 1982, pais: 'Brasil',
    cartaEspecial: { mediaBase: 99, jugadorNombre: 'Zico 1982 (LEGENDARIO)', jugadorPos: 'MC', rareza: 'especial', probabilidad: 0.01 },
    jugadores: [
      { id: 'br82_valdirperes', nombre: 'Valdir Peres', pos: 'POR', media: 79, upgrades: [] },
      { id: 'br82_leandro', nombre: 'Leandro', pos: 'LAD', media: 83, upgrades: [] },
      { id: 'br82_oscar', nombre: 'Oscar', pos: 'DFC', media: 81, upgrades: [] },
      { id: 'br82_luizinho', nombre: 'Luizinho', pos: 'DFC', media: 80, upgrades: [] },
      { id: 'br82_junior', nombre: 'Júnior', pos: 'LAI', media: 85, upgrades: [] },
      { id: 'br82_cerezo', nombre: 'Cerezo', pos: 'MCD', media: 86, upgrades: [{ media: 90, prob: 0.20 }] },
      { id: 'br82_falcao', nombre: 'Falcão', pos: 'MC', media: 93, upgrades: [{ media: 96, prob: 0.15 }, { media: 98, prob: 0.05 }] },
      { id: 'br82_socrates', nombre: 'Sócrates', pos: 'MCO', media: 92, upgrades: [{ media: 95, prob: 0.15 }] },
      { id: 'br82_eder', nombre: 'Éder', pos: 'EXI', media: 88, upgrades: [{ media: 92, prob: 0.15 }] },
      { id: 'br82_serginho', nombre: 'Serginho', pos: 'EXD', media: 80, upgrades: [] },
      { id: 'br82_zico', nombre: 'Zico', pos: 'MC', media: 96, upgrades: [{ media: 98, prob: 0.15 }, { media: 99, prob: 0.05 }] },
    ]
  },
  {
    id: 'francia_1982', nombre: 'Francia 1982', abrev: 'FRA', color: '#003399', colorSecundario: '#FFFFFF',
    liga: 'mundial', anio: 1982, pais: 'Francia',
    cartaEspecial: { mediaBase: 99, jugadorNombre: 'Platini 1982 (LEGENDARIO)', jugadorPos: 'MCO', rareza: 'especial', probabilidad: 0.01 },
    jugadores: [
      { id: 'fr82_ettori', nombre: 'Ettori', pos: 'POR', media: 82, upgrades: [] },
      { id: 'fr82_amoros', nombre: 'Amoros', pos: 'LAD', media: 79, upgrades: [] },
      { id: 'fr82_janvion', nombre: 'Janvion', pos: 'DFC', media: 78, upgrades: [] },
      { id: 'fr82_tresor', nombre: 'Trésor', pos: 'DFC', media: 83, upgrades: [] },
      { id: 'fr82_bossis', nombre: 'Bossis', pos: 'LAI', media: 82, upgrades: [] },
      { id: 'fr82_tigana', nombre: 'Tigana', pos: 'MCD', media: 84, upgrades: [] },
      { id: 'fr82_giresse', nombre: 'Giresse', pos: 'MC', media: 86, upgrades: [{ media: 90, prob: 0.20 }] },
      { id: 'fr82_platini', nombre: 'Michel Platini', pos: 'MCO', media: 95, upgrades: [{ media: 97, prob: 0.15 }, { media: 99, prob: 0.05 }] },
      { id: 'fr82_rocheteau', nombre: 'Rocheteau', pos: 'EXD', media: 83, upgrades: [] },
      { id: 'fr82_six', nombre: 'Six', pos: 'EXI', media: 81, upgrades: [] },
      { id: 'fr82_lacombe', nombre: 'Lacombe', pos: 'DEL', media: 80, upgrades: [] },
    ]
  },

  // ===================== MUNDIAL 1986 - MEXICO =====================
  {
    id: 'argentina_1986', nombre: 'Argentina 1986', abrev: 'ARG', color: '#75AADB', colorSecundario: '#FFFFFF',
    liga: 'mundial', anio: 1986, pais: 'Argentina',
    cartaEspecial: { mediaBase: 99, jugadorNombre: 'Maradona 1986 (LEGENDARIO)', jugadorPos: 'MCO', rareza: 'especial', probabilidad: 0.01 },
    jugadores: [
      { id: 'ar86_pumpido', nombre: 'Pumpido', pos: 'POR', media: 85, upgrades: [] },
      { id: 'ar86_cuciuffo', nombre: 'Cuciuffo', pos: 'LAD', media: 79, upgrades: [] },
      { id: 'ar86_ruggeri', nombre: 'Ruggeri', pos: 'DFC', media: 84, upgrades: [] },
      { id: 'ar86_brown', nombre: 'Brown', pos: 'DFC', media: 82, upgrades: [] },
      { id: 'ar86_olarticoechea', nombre: 'Olarticoechea', pos: 'LAI', media: 80, upgrades: [] },
      { id: 'ar86_batista', nombre: 'Batista', pos: 'MCD', media: 81, upgrades: [] },
      { id: 'ar86_giusti', nombre: 'Giusti', pos: 'MC', media: 82, upgrades: [] },
      { id: 'ar86_burruchaga', nombre: 'Burruchaga', pos: 'MC', media: 88, upgrades: [{ media: 92, prob: 0.15 }] },
      { id: 'ar86_valdano', nombre: 'Valdano', pos: 'EXI', media: 87, upgrades: [{ media: 91, prob: 0.20 }] },
      { id: 'ar86_enrique', nombre: 'Enrique', pos: 'EXD', media: 83, upgrades: [] },
      { id: 'ar86_maradona', nombre: 'Diego Maradona', pos: 'MCO', media: 99, upgrades: [] },
    ]
  },
  {
    id: 'alemania_1986', nombre: 'Alemania Occ. 1986', abrev: 'GER', color: '#000000', colorSecundario: '#DD0000',
    liga: 'mundial', anio: 1986, pais: 'Alemania',
    cartaEspecial: null,
    jugadores: [
      { id: 'ge86_schumacher', nombre: 'Schumacher', pos: 'POR', media: 83, upgrades: [] },
      { id: 'ge86_berthold', nombre: 'Berthold', pos: 'LAD', media: 80, upgrades: [] },
      { id: 'ge86_forster', nombre: 'Förster K.H.', pos: 'DFC', media: 82, upgrades: [] },
      { id: 'ge86_jakobs', nombre: 'Jakobs', pos: 'LAI', media: 79, upgrades: [] },
      { id: 'ge86_briegel', nombre: 'Briegel', pos: 'MCD', media: 82, upgrades: [] },
      { id: 'ge86_matthaus', nombre: 'Matthäus', pos: 'MC', media: 92, upgrades: [{ media: 95, prob: 0.15 }, { media: 97, prob: 0.05 }] },
      { id: 'ge86_magath', nombre: 'Magath', pos: 'MC', media: 82, upgrades: [] },
      { id: 'ge86_allofs', nombre: 'Allofs', pos: 'EXI', media: 83, upgrades: [] },
      { id: 'ge86_littbarski', nombre: 'Littbarski', pos: 'EXD', media: 85, upgrades: [{ media: 89, prob: 0.20 }] },
      { id: 'ge86_voller', nombre: 'Völler', pos: 'DEL', media: 89, upgrades: [{ media: 93, prob: 0.15 }] },
      { id: 'ge86_rummenigge', nombre: 'Rummenigge', pos: 'DEL', media: 91, upgrades: [{ media: 94, prob: 0.15 }, { media: 97, prob: 0.05 }] },
    ]
  },
  {
    id: 'francia_1986', nombre: 'Francia 1986', abrev: 'FRA', color: '#003399', colorSecundario: '#FFFFFF',
    liga: 'mundial', anio: 1986, pais: 'Francia',
    cartaEspecial: null,
    jugadores: [
      { id: 'fr86_bats', nombre: 'Bats', pos: 'POR', media: 82, upgrades: [] },
      { id: 'fr86_amoros', nombre: 'Amoros', pos: 'LAD', media: 82, upgrades: [] },
      { id: 'fr86_battiston', nombre: 'Battiston', pos: 'DFC', media: 81, upgrades: [] },
      { id: 'fr86_bossis', nombre: 'Bossis', pos: 'DFC', media: 81, upgrades: [] },
      { id: 'fr86_ayache', nombre: 'Ayache', pos: 'LAI', media: 79, upgrades: [] },
      { id: 'fr86_tigana', nombre: 'Tigana', pos: 'MCD', media: 85, upgrades: [] },
      { id: 'fr86_fernandez', nombre: 'Fernández', pos: 'MC', media: 83, upgrades: [] },
      { id: 'fr86_giresse', nombre: 'Giresse', pos: 'MC', media: 85, upgrades: [{ media: 89, prob: 0.20 }] },
      { id: 'fr86_platini', nombre: 'Platini', pos: 'MCO', media: 96, upgrades: [{ media: 98, prob: 0.15 }, { media: 99, prob: 0.05 }] },
      { id: 'fr86_papin', nombre: 'Papin', pos: 'EXD', media: 85, upgrades: [{ media: 89, prob: 0.20 }] },
      { id: 'fr86_rocheteau', nombre: 'Rocheteau', pos: 'EXI', media: 82, upgrades: [] },
    ]
  },

  // ===================== MUNDIAL 1990 - ITALIA =====================
  {
    id: 'alemania_1990', nombre: 'Alemania 1990', abrev: 'GER', color: '#000000', colorSecundario: '#DD0000',
    liga: 'mundial', anio: 1990, pais: 'Alemania',
    cartaEspecial: { mediaBase: 99, jugadorNombre: 'Matthäus 1990 (LEGENDARIO)', jugadorPos: 'MC', rareza: 'especial', probabilidad: 0.01 },
    jugadores: [
      { id: 'ge90_illgner', nombre: 'Illgner', pos: 'POR', media: 86, upgrades: [] },
      { id: 'ge90_berthold', nombre: 'Berthold', pos: 'LAD', media: 81, upgrades: [] },
      { id: 'ge90_kohler', nombre: 'Köhler', pos: 'DFC', media: 82, upgrades: [] },
      { id: 'ge90_buchwald', nombre: 'Buchwald', pos: 'DFC', media: 83, upgrades: [] },
      { id: 'ge90_brehme', nombre: 'Brehme', pos: 'LAI', media: 87, upgrades: [{ media: 91, prob: 0.20 }] },
      { id: 'ge90_hassler', nombre: 'Häßler', pos: 'MCD', media: 84, upgrades: [] },
      { id: 'ge90_matthaus', nombre: 'Matthäus', pos: 'MC', media: 96, upgrades: [{ media: 98, prob: 0.15 }, { media: 99, prob: 0.05 }] },
      { id: 'ge90_littbarski', nombre: 'Littbarski', pos: 'EXD', media: 84, upgrades: [] },
      { id: 'ge90_voller', nombre: 'Völler', pos: 'DEL', media: 88, upgrades: [{ media: 92, prob: 0.15 }] },
      { id: 'ge90_klinsmann', nombre: 'Klinsmann', pos: 'DEL', media: 90, upgrades: [{ media: 93, prob: 0.15 }] },
      { id: 'ge90_riedle', nombre: 'Riedle', pos: 'EXI', media: 82, upgrades: [] },
    ]
  },
  {
    id: 'argentina_1990', nombre: 'Argentina 1990', abrev: 'ARG', color: '#75AADB', colorSecundario: '#FFFFFF',
    liga: 'mundial', anio: 1990, pais: 'Argentina',
    cartaEspecial: null,
    jugadores: [
      { id: 'ar90_goycochea', nombre: 'Goycochea', pos: 'POR', media: 86, upgrades: [{ media: 90, prob: 0.20 }] },
      { id: 'ar90_simon', nombre: 'Simón', pos: 'LAD', media: 80, upgrades: [] },
      { id: 'ar90_ruggeri', nombre: 'Ruggeri', pos: 'DFC', media: 83, upgrades: [] },
      { id: 'ar90_serrizuela', nombre: 'Serrizuela', pos: 'LAI', media: 80, upgrades: [] },
      { id: 'ar90_sensini', nombre: 'Sensini', pos: 'DFC', media: 82, upgrades: [] },
      { id: 'ar90_basualdo', nombre: 'Basualdo', pos: 'MC', media: 80, upgrades: [] },
      { id: 'ar90_giusti', nombre: 'Giusti', pos: 'MCD', media: 83, upgrades: [] },
      { id: 'ar90_caniggia', nombre: 'Caniggia', pos: 'DEL', media: 89, upgrades: [{ media: 93, prob: 0.15 }] },
      { id: 'ar90_calderon', nombre: 'Calderón', pos: 'EXD', media: 79, upgrades: [] },
      { id: 'ar90_troglio', nombre: 'Troglio', pos: 'EXI', media: 80, upgrades: [] },
      { id: 'ar90_maradona', nombre: 'Diego Maradona', pos: 'MCO', media: 97, upgrades: [{ media: 99, prob: 0.15 }] },
    ]
  },
  {
    id: 'italia_1990', nombre: 'Italia 1990', abrev: 'ITA', color: '#003399', colorSecundario: '#FFFFFF',
    liga: 'mundial', anio: 1990, pais: 'Italia',
    cartaEspecial: null,
    jugadores: [
      { id: 'it90_pagliuca', nombre: 'Pagliuca', pos: 'POR', media: 84, upgrades: [] },
      { id: 'it90_bergomi', nombre: 'Bergomi', pos: 'LAD', media: 83, upgrades: [] },
      { id: 'it90_costacurta', nombre: 'Costacurta', pos: 'DFC', media: 83, upgrades: [] },
      { id: 'it90_baresi', nombre: 'Baresi', pos: 'DFC', media: 94, upgrades: [{ media: 97, prob: 0.15 }, { media: 99, prob: 0.05 }] },
      { id: 'it90_deagostini', nombre: 'De Agostini', pos: 'LAI', media: 81, upgrades: [] },
      { id: 'it90_donadoni', nombre: 'Donadoni', pos: 'MC', media: 84, upgrades: [] },
      { id: 'it90_ancelotti', nombre: 'Ancelotti', pos: 'MCD', media: 84, upgrades: [] },
      { id: 'it90_maldini', nombre: 'Paolo Maldini', pos: 'LAI', media: 88, upgrades: [{ media: 92, prob: 0.15 }] },
      { id: 'it90_baggio', nombre: 'Roberto Baggio', pos: 'MCO', media: 86, upgrades: [{ media: 90, prob: 0.15 }, { media: 94, prob: 0.05 }] },
      { id: 'it90_vialli', nombre: 'Vialli', pos: 'DEL', media: 86, upgrades: [] },
      { id: 'it90_schillaci', nombre: 'Schillaci', pos: 'DEL', media: 91, upgrades: [{ media: 94, prob: 0.15 }, { media: 97, prob: 0.05 }] },
    ]
  },
  {
    id: 'inglaterra_1990', nombre: 'Inglaterra 1990', abrev: 'ENG', color: '#FFFFFF', colorSecundario: '#CF081F',
    liga: 'mundial', anio: 1990, pais: 'Inglaterra',
    cartaEspecial: null,
    jugadores: [
      { id: 'en90_shilton', nombre: 'Shilton', pos: 'POR', media: 86, upgrades: [{ media: 90, prob: 0.15 }] },
      { id: 'en90_stevens', nombre: 'Stevens', pos: 'LAD', media: 79, upgrades: [] },
      { id: 'en90_walker', nombre: 'Walker', pos: 'DFC', media: 82, upgrades: [] },
      { id: 'en90_butcher', nombre: 'Butcher', pos: 'DFC', media: 82, upgrades: [] },
      { id: 'en90_pearce', nombre: 'Pearce', pos: 'LAI', media: 83, upgrades: [] },
      { id: 'en90_robson', nombre: 'Robson', pos: 'MC', media: 84, upgrades: [] },
      { id: 'en90_gascoigne', nombre: 'Gascoigne', pos: 'MCO', media: 90, upgrades: [{ media: 94, prob: 0.15 }, { media: 97, prob: 0.05 }] },
      { id: 'en90_beardsley', nombre: 'Beardsley', pos: 'EXI', media: 84, upgrades: [] },
      { id: 'en90_barnes', nombre: 'Barnes', pos: 'EXD', media: 87, upgrades: [{ media: 91, prob: 0.20 }] },
      { id: 'en90_platt', nombre: 'Platt', pos: 'MC', media: 85, upgrades: [] },
      { id: 'en90_lineker', nombre: 'Gary Lineker', pos: 'DEL', media: 91, upgrades: [{ media: 94, prob: 0.15 }, { media: 97, prob: 0.05 }] },
    ]
  },

  // ===================== MUNDIAL 1994 - ESTADOS UNIDOS =====================
  {
    id: 'brasil_1994', nombre: 'Brasil 1994', abrev: 'BRA', color: '#FFD700', colorSecundario: '#009C3B',
    liga: 'mundial', anio: 1994, pais: 'Brasil',
    cartaEspecial: { mediaBase: 99, jugadorNombre: 'Romário 1994 (LEGENDARIO)', jugadorPos: 'DEL', rareza: 'especial', probabilidad: 0.01 },
    jugadores: [
      { id: 'br94_taffarel', nombre: 'Taffarel', pos: 'POR', media: 87, upgrades: [{ media: 91, prob: 0.20 }] },
      { id: 'br94_cafu', nombre: 'Cafu', pos: 'LAD', media: 88, upgrades: [{ media: 92, prob: 0.15 }] },
      { id: 'br94_aldair', nombre: 'Aldair', pos: 'DFC', media: 87, upgrades: [] },
      { id: 'br94_marcio', nombre: 'Márcio Santos', pos: 'DFC', media: 84, upgrades: [] },
      { id: 'br94_branco', nombre: 'Branco', pos: 'LAI', media: 83, upgrades: [] },
      { id: 'br94_mazinho', nombre: 'Mazinho', pos: 'MCD', media: 83, upgrades: [] },
      { id: 'br94_mauro', nombre: 'Mauro Silva', pos: 'MCD', media: 82, upgrades: [] },
      { id: 'br94_zinho', nombre: 'Zinho', pos: 'MC', media: 85, upgrades: [] },
      { id: 'br94_leonardo', nombre: 'Leonardo', pos: 'EXI', media: 85, upgrades: [] },
      { id: 'br94_bebeto', nombre: 'Bebeto', pos: 'DEL', media: 93, upgrades: [{ media: 96, prob: 0.15 }] },
      { id: 'br94_romario', nombre: 'Romário', pos: 'DEL', media: 96, upgrades: [{ media: 98, prob: 0.15 }, { media: 99, prob: 0.05 }] },
    ]
  },
  {
    id: 'italia_1994', nombre: 'Italia 1994', abrev: 'ITA', color: '#003399', colorSecundario: '#FFFFFF',
    liga: 'mundial', anio: 1994, pais: 'Italia',
    cartaEspecial: { mediaBase: 99, jugadorNombre: 'R. Baggio 1994 (LEGENDARIO)', jugadorPos: 'MCO', rareza: 'especial', probabilidad: 0.01 },
    jugadores: [
      { id: 'it94_pagliuca', nombre: 'Pagliuca', pos: 'POR', media: 83, upgrades: [] },
      { id: 'it94_mussi', nombre: 'Mussi', pos: 'LAD', media: 80, upgrades: [] },
      { id: 'it94_costacurta', nombre: 'Costacurta', pos: 'DFC', media: 85, upgrades: [] },
      { id: 'it94_baresi', nombre: 'Baresi', pos: 'DFC', media: 94, upgrades: [{ media: 97, prob: 0.15 }, { media: 99, prob: 0.05 }] },
      { id: 'it94_maldini', nombre: 'Maldini', pos: 'LAI', media: 93, upgrades: [{ media: 96, prob: 0.15 }] },
      { id: 'it94_albertini', nombre: 'Albertini', pos: 'MCD', media: 84, upgrades: [] },
      { id: 'it94_donadoni', nombre: 'Donadoni', pos: 'MC', media: 83, upgrades: [] },
      { id: 'it94_berti', nombre: 'Berti', pos: 'MC', media: 82, upgrades: [] },
      { id: 'it94_baggio_d', nombre: 'Dino Baggio', pos: 'EXD', media: 82, upgrades: [] },
      { id: 'it94_signori', nombre: 'Signori', pos: 'EXI', media: 87, upgrades: [{ media: 91, prob: 0.20 }] },
      { id: 'it94_baggio', nombre: 'Roberto Baggio', pos: 'MCO', media: 95, upgrades: [{ media: 97, prob: 0.15 }, { media: 99, prob: 0.05 }] },
    ]
  },

  // ===================== MUNDIAL 1998 - FRANCIA =====================
  {
    id: 'francia_1998', nombre: 'Francia 1998', abrev: 'FRA', color: '#003399', colorSecundario: '#FFFFFF',
    liga: 'mundial', anio: 1998, pais: 'Francia',
    cartaEspecial: { mediaBase: 99, jugadorNombre: 'Zidane 1998 (LEGENDARIO)', jugadorPos: 'MC', rareza: 'especial', probabilidad: 0.01 },
    jugadores: [
      { id: 'fr98_barthez', nombre: 'Barthez', pos: 'POR', media: 88, upgrades: [{ media: 92, prob: 0.15 }] },
      { id: 'fr98_thuram', nombre: 'Thuram', pos: 'LAD', media: 88, upgrades: [{ media: 92, prob: 0.15 }] },
      { id: 'fr98_desailly', nombre: 'Desailly', pos: 'DFC', media: 89, upgrades: [{ media: 93, prob: 0.15 }] },
      { id: 'fr98_blanc', nombre: 'Blanc', pos: 'DFC', media: 86, upgrades: [] },
      { id: 'fr98_lizarazu', nombre: 'Lizarazu', pos: 'LAI', media: 85, upgrades: [] },
      { id: 'fr98_deschamps', nombre: 'Deschamps', pos: 'MCD', media: 87, upgrades: [{ media: 91, prob: 0.20 }] },
      { id: 'fr98_petit', nombre: 'Petit', pos: 'MC', media: 85, upgrades: [] },
      { id: 'fr98_zidane', nombre: 'Zinedine Zidane', pos: 'MC', media: 98, upgrades: [{ media: 99, prob: 0.15 }] },
      { id: 'fr98_djorkaeff', nombre: 'Djorkaeff', pos: 'EXI', media: 87, upgrades: [] },
      { id: 'fr98_henry', nombre: 'Henry', pos: 'EXD', media: 85, upgrades: [{ media: 89, prob: 0.20 }] },
      { id: 'fr98_dugarry', nombre: 'Dugarry', pos: 'DEL', media: 82, upgrades: [] },
    ]
  },
  {
    id: 'brasil_1998', nombre: 'Brasil 1998', abrev: 'BRA', color: '#FFD700', colorSecundario: '#009C3B',
    liga: 'mundial', anio: 1998, pais: 'Brasil',
    cartaEspecial: { mediaBase: 99, jugadorNombre: 'Ronaldo 1998 (LEGENDARIO)', jugadorPos: 'DEL', rareza: 'especial', probabilidad: 0.01 },
    jugadores: [
      { id: 'br98_taffarel', nombre: 'Taffarel', pos: 'POR', media: 85, upgrades: [] },
      { id: 'br98_cafu', nombre: 'Cafu', pos: 'LAD', media: 92, upgrades: [{ media: 95, prob: 0.15 }] },
      { id: 'br98_aldair', nombre: 'Aldair', pos: 'DFC', media: 84, upgrades: [] },
      { id: 'br98_juniorbaia', nombre: 'Junior Baiano', pos: 'DFC', media: 82, upgrades: [] },
      { id: 'br98_roberto', nombre: 'Roberto Carlos', pos: 'LAI', media: 93, upgrades: [{ media: 96, prob: 0.15 }, { media: 98, prob: 0.05 }] },
      { id: 'br98_dunga', nombre: 'Dunga', pos: 'MCD', media: 83, upgrades: [] },
      { id: 'br98_cesar', nombre: 'César Sampaio', pos: 'MC', media: 82, upgrades: [] },
      { id: 'br98_rivaldo', nombre: 'Rivaldo', pos: 'MCO', media: 95, upgrades: [{ media: 97, prob: 0.15 }, { media: 99, prob: 0.05 }] },
      { id: 'br98_denilson', nombre: 'Denilson', pos: 'EXI', media: 84, upgrades: [] },
      { id: 'br98_bebeto', nombre: 'Bebeto', pos: 'DEL', media: 88, upgrades: [] },
      { id: 'br98_ronaldo', nombre: 'Ronaldo', pos: 'DEL', media: 99, upgrades: [] },
    ]
  },
  {
    id: 'holanda_1998', nombre: 'Holanda 1998', abrev: 'HOL', color: '#FF6600', colorSecundario: '#FFFFFF',
    liga: 'mundial', anio: 1998, pais: 'Holanda',
    cartaEspecial: null,
    jugadores: [
      { id: 'ho98_vandersar', nombre: 'Van der Sar', pos: 'POR', media: 86, upgrades: [] },
      { id: 'ho98_reiziger', nombre: 'Reiziger', pos: 'LAD', media: 82, upgrades: [] },
      { id: 'ho98_stam', nombre: 'Stam', pos: 'DFC', media: 88, upgrades: [{ media: 92, prob: 0.15 }] },
      { id: 'ho98_frank', nombre: 'Frank de Boer', pos: 'DFC', media: 84, upgrades: [] },
      { id: 'ho98_numan', nombre: 'Numan', pos: 'LAI', media: 81, upgrades: [] },
      { id: 'ho98_cocu', nombre: 'Cocu', pos: 'MCD', media: 85, upgrades: [] },
      { id: 'ho98_davids', nombre: 'Davids', pos: 'MC', media: 87, upgrades: [{ media: 91, prob: 0.20 }] },
      { id: 'ho98_seedorf', nombre: 'Seedorf', pos: 'MC', media: 87, upgrades: [{ media: 91, prob: 0.15 }] },
      { id: 'ho98_zenden', nombre: 'Zenden', pos: 'EXI', media: 83, upgrades: [] },
      { id: 'ho98_bergkamp', nombre: 'Bergkamp', pos: 'DEL', media: 96, upgrades: [{ media: 98, prob: 0.15 }, { media: 99, prob: 0.05 }] },
      { id: 'ho98_kluivert', nombre: 'Kluivert', pos: 'EXD', media: 88, upgrades: [{ media: 92, prob: 0.15 }] },
    ]
  },

  // ===================== MUNDIAL 2002 - COREA/JAPON =====================
  {
    id: 'brasil_2002', nombre: 'Brasil 2002', abrev: 'BRA', color: '#FFD700', colorSecundario: '#009C3B',
    liga: 'mundial', anio: 2002, pais: 'Brasil',
    cartaEspecial: { mediaBase: 99, jugadorNombre: 'Ronaldo 2002 (LEGENDARIO)', jugadorPos: 'DEL', rareza: 'especial', probabilidad: 0.01 },
    jugadores: [
      { id: 'br02_marcos', nombre: 'Marcos', pos: 'POR', media: 83, upgrades: [] },
      { id: 'br02_cafu', nombre: 'Cafu', pos: 'LAD', media: 90, upgrades: [{ media: 94, prob: 0.15 }] },
      { id: 'br02_lucio', nombre: 'Lúcio', pos: 'DFC', media: 88, upgrades: [{ media: 92, prob: 0.15 }] },
      { id: 'br02_roque', nombre: 'Roque Júnior', pos: 'DFC', media: 82, upgrades: [] },
      { id: 'br02_roberto', nombre: 'Roberto Carlos', pos: 'LAI', media: 91, upgrades: [{ media: 94, prob: 0.15 }] },
      { id: 'br02_gilberto', nombre: 'Gilberto Silva', pos: 'MCD', media: 84, upgrades: [] },
      { id: 'br02_kleberson', nombre: 'Kléberson', pos: 'MC', media: 82, upgrades: [] },
      { id: 'br02_rivaldo', nombre: 'Rivaldo', pos: 'MCO', media: 95, upgrades: [{ media: 97, prob: 0.15 }] },
      { id: 'br02_ronaldinho', nombre: 'Ronaldinho', pos: 'EXI', media: 93, upgrades: [{ media: 96, prob: 0.15 }, { media: 98, prob: 0.05 }] },
      { id: 'br02_ronaldo', nombre: 'Ronaldo', pos: 'DEL', media: 99, upgrades: [] },
      { id: 'br02_edmilson', nombre: 'Edmílson', pos: 'DFC', media: 83, upgrades: [] },
    ]
  },
  {
    id: 'alemania_2002', nombre: 'Alemania 2002', abrev: 'GER', color: '#000000', colorSecundario: '#DD0000',
    liga: 'mundial', anio: 2002, pais: 'Alemania',
    cartaEspecial: null,
    jugadores: [
      { id: 'ge02_kahn', nombre: 'Oliver Kahn', pos: 'POR', media: 97, upgrades: [{ media: 99, prob: 0.15 }] },
      { id: 'ge02_metzelder', nombre: 'Metzelder', pos: 'LAD', media: 82, upgrades: [] },
      { id: 'ge02_ramelow', nombre: 'Ramelow', pos: 'DFC', media: 82, upgrades: [] },
      { id: 'ge02_linke', nombre: 'Linke', pos: 'LAI', media: 80, upgrades: [] },
      { id: 'ge02_frings', nombre: 'Frings', pos: 'MCD', media: 85, upgrades: [] },
      { id: 'ge02_jeremies', nombre: 'Jeremies', pos: 'MC', media: 82, upgrades: [] },
      { id: 'ge02_hamann', nombre: 'Hamann', pos: 'MC', media: 84, upgrades: [] },
      { id: 'ge02_schneider', nombre: 'Schneider', pos: 'EXD', media: 84, upgrades: [] },
      { id: 'ge02_ballack', nombre: 'Ballack', pos: 'MCO', media: 93, upgrades: [{ media: 96, prob: 0.15 }, { media: 98, prob: 0.05 }] },
      { id: 'ge02_bode', nombre: 'Bode', pos: 'EXI', media: 83, upgrades: [] },
      { id: 'ge02_klose', nombre: 'Miroslav Klose', pos: 'DEL', media: 88, upgrades: [{ media: 92, prob: 0.15 }] },
    ]
  },

  // ===================== MUNDIAL 2006 - ALEMANIA =====================
  {
    id: 'italia_2006', nombre: 'Italia 2006', abrev: 'ITA', color: '#003399', colorSecundario: '#FFFFFF',
    liga: 'mundial', anio: 2006, pais: 'Italia',
    cartaEspecial: { mediaBase: 99, jugadorNombre: 'Buffon 2006 (LEGENDARIO)', jugadorPos: 'POR', rareza: 'especial', probabilidad: 0.01 },
    jugadores: [
      { id: 'it06_buffon', nombre: 'Gigi Buffon', pos: 'POR', media: 98, upgrades: [{ media: 99, prob: 0.15 }] },
      { id: 'it06_zambrotta', nombre: 'Zambrotta', pos: 'LAD', media: 86, upgrades: [] },
      { id: 'it06_cannavaro', nombre: 'Cannavaro', pos: 'DFC', media: 95, upgrades: [{ media: 98, prob: 0.15 }, { media: 99, prob: 0.05 }] },
      { id: 'it06_materazzi', nombre: 'Materazzi', pos: 'DFC', media: 83, upgrades: [] },
      { id: 'it06_grosso', nombre: 'Grosso', pos: 'LAI', media: 82, upgrades: [] },
      { id: 'it06_gattuso', nombre: 'Gattuso', pos: 'MCD', media: 86, upgrades: [] },
      { id: 'it06_pirlo', nombre: 'Andrea Pirlo', pos: 'MC', media: 93, upgrades: [{ media: 96, prob: 0.15 }, { media: 98, prob: 0.05 }] },
      { id: 'it06_camoranesi', nombre: 'Camoranesi', pos: 'EXD', media: 84, upgrades: [] },
      { id: 'it06_totti', nombre: 'Totti', pos: 'MCO', media: 91, upgrades: [{ media: 94, prob: 0.15 }] },
      { id: 'it06_delpiero', nombre: 'Del Piero', pos: 'EXI', media: 92, upgrades: [{ media: 95, prob: 0.15 }] },
      { id: 'it06_inzaghi', nombre: 'Inzaghi', pos: 'DEL', media: 88, upgrades: [{ media: 92, prob: 0.15 }] },
    ]
  },
  {
    id: 'francia_2006', nombre: 'Francia 2006', abrev: 'FRA', color: '#003399', colorSecundario: '#FFFFFF',
    liga: 'mundial', anio: 2006, pais: 'Francia',
    cartaEspecial: null,
    jugadores: [
      { id: 'fr06_barthez', nombre: 'Barthez', pos: 'POR', media: 85, upgrades: [] },
      { id: 'fr06_sagnol', nombre: 'Sagnol', pos: 'LAD', media: 83, upgrades: [] },
      { id: 'fr06_thuram', nombre: 'Thuram', pos: 'DFC', media: 87, upgrades: [] },
      { id: 'fr06_gallas', nombre: 'Gallas', pos: 'DFC', media: 85, upgrades: [] },
      { id: 'fr06_abidal', nombre: 'Abidal', pos: 'LAI', media: 85, upgrades: [] },
      { id: 'fr06_makelele', nombre: 'Makélélé', pos: 'MCD', media: 90, upgrades: [{ media: 93, prob: 0.15 }] },
      { id: 'fr06_vieira', nombre: 'Vieira', pos: 'MC', media: 91, upgrades: [{ media: 94, prob: 0.15 }] },
      { id: 'fr06_zidane', nombre: 'Zinedine Zidane', pos: 'MCO', media: 98, upgrades: [{ media: 99, prob: 0.15 }] },
      { id: 'fr06_malouda', nombre: 'Malouda', pos: 'EXI', media: 85, upgrades: [] },
      { id: 'fr06_ribery', nombre: 'Ribéry', pos: 'EXD', media: 88, upgrades: [{ media: 92, prob: 0.15 }] },
      { id: 'fr06_henry', nombre: 'Thierry Henry', pos: 'DEL', media: 94, upgrades: [{ media: 97, prob: 0.15 }, { media: 99, prob: 0.05 }] },
    ]
  },
  {
    id: 'portugal_2006', nombre: 'Portugal 2006', abrev: 'POR', color: '#006600', colorSecundario: '#FF0000',
    liga: 'mundial', anio: 2006, pais: 'Portugal',
    cartaEspecial: null,
    jugadores: [
      { id: 'pt06_ricardo', nombre: 'Ricardo', pos: 'POR', media: 82, upgrades: [] },
      { id: 'pt06_miguel', nombre: 'Miguel', pos: 'LAD', media: 79, upgrades: [] },
      { id: 'pt06_meira', nombre: 'Meira', pos: 'DFC', media: 81, upgrades: [] },
      { id: 'pt06_carvalho', nombre: 'Ricardo Carvalho', pos: 'DFC', media: 88, upgrades: [{ media: 92, prob: 0.15 }] },
      { id: 'pt06_nuno', nombre: 'Nuno Valente', pos: 'LAI', media: 82, upgrades: [] },
      { id: 'pt06_costinha', nombre: 'Costinha', pos: 'MCD', media: 82, upgrades: [] },
      { id: 'pt06_maniche', nombre: 'Maniche', pos: 'MC', media: 84, upgrades: [] },
      { id: 'pt06_deco', nombre: 'Deco', pos: 'MCO', media: 88, upgrades: [{ media: 92, prob: 0.15 }] },
      { id: 'pt06_figo', nombre: 'Luís Figo', pos: 'EXD', media: 94, upgrades: [{ media: 97, prob: 0.15 }, { media: 99, prob: 0.05 }] },
      { id: 'pt06_pauleta', nombre: 'Pauleta', pos: 'DEL', media: 85, upgrades: [] },
      { id: 'pt06_ronaldo', nombre: 'C. Ronaldo (joven)', pos: 'EXI', media: 90, upgrades: [{ media: 93, prob: 0.15 }, { media: 96, prob: 0.05 }] },
    ]
  },

  // ===================== MUNDIAL 2010 - SUDAFRICA =====================
  {
    id: 'espana_2010', nombre: 'España 2010', abrev: 'ESP', color: '#AA151B', colorSecundario: '#F1BF00',
    liga: 'mundial', anio: 2010, pais: 'España',
    cartaEspecial: { mediaBase: 99, jugadorNombre: 'Xavi 2010 (LEGENDARIO)', jugadorPos: 'MC', rareza: 'especial', probabilidad: 0.01 },
    jugadores: [
      { id: 'es10_casillas', nombre: 'Iker Casillas', pos: 'POR', media: 97, upgrades: [{ media: 99, prob: 0.15 }] },
      { id: 'es10_ramos', nombre: 'Sergio Ramos', pos: 'LAD', media: 90, upgrades: [{ media: 93, prob: 0.15 }] },
      { id: 'es10_puyol', nombre: 'Puyol', pos: 'DFC', media: 92, upgrades: [{ media: 95, prob: 0.15 }] },
      { id: 'es10_pique', nombre: 'Piqué', pos: 'DFC', media: 89, upgrades: [{ media: 93, prob: 0.15 }] },
      { id: 'es10_alba', nombre: 'Jordi Alba', pos: 'LAI', media: 86, upgrades: [{ media: 90, prob: 0.20 }] },
      { id: 'es10_alonso', nombre: 'Xabi Alonso', pos: 'MCD', media: 91, upgrades: [{ media: 94, prob: 0.15 }] },
      { id: 'es10_busquets', nombre: 'Busquets', pos: 'MCD', media: 88, upgrades: [{ media: 92, prob: 0.15 }] },
      { id: 'es10_xavi', nombre: 'Xavi', pos: 'MC', media: 97, upgrades: [{ media: 99, prob: 0.15 }] },
      { id: 'es10_iniesta', nombre: 'Iniesta', pos: 'MCO', media: 96, upgrades: [{ media: 98, prob: 0.15 }, { media: 99, prob: 0.05 }] },
      { id: 'es10_villa', nombre: 'David Villa', pos: 'DEL', media: 93, upgrades: [{ media: 96, prob: 0.15 }] },
      { id: 'es10_torres', nombre: 'Fernando Torres', pos: 'EXI', media: 90, upgrades: [{ media: 93, prob: 0.15 }] },
    ]
  },
  {
    id: 'holanda_2010', nombre: 'Holanda 2010', abrev: 'HOL', color: '#FF6600', colorSecundario: '#FFFFFF',
    liga: 'mundial', anio: 2010, pais: 'Holanda',
    cartaEspecial: null,
    jugadores: [
      { id: 'ho10_vandersar', nombre: 'Van der Sar', pos: 'POR', media: 88, upgrades: [] },
      { id: 'ho10_heitinga', nombre: 'Heitinga', pos: 'LAD', media: 83, upgrades: [] },
      { id: 'ho10_mathijsen', nombre: 'Mathijsen', pos: 'DFC', media: 82, upgrades: [] },
      { id: 'ho10_vlaar', nombre: 'Vlaar', pos: 'DFC', media: 81, upgrades: [] },
      { id: 'ho10_vanbronck', nombre: 'Van Bronckhorst', pos: 'LAI', media: 85, upgrades: [] },
      { id: 'ho10_dejong', nombre: 'Nigel de Jong', pos: 'MCD', media: 84, upgrades: [] },
      { id: 'ho10_vandervaart', nombre: 'Van der Vaart', pos: 'MC', media: 88, upgrades: [{ media: 92, prob: 0.15 }] },
      { id: 'ho10_sneijder', nombre: 'Sneijder', pos: 'MCO', media: 93, upgrades: [{ media: 96, prob: 0.15 }, { media: 98, prob: 0.05 }] },
      { id: 'ho10_robben', nombre: 'Arjen Robben', pos: 'EXD', media: 93, upgrades: [{ media: 96, prob: 0.15 }, { media: 98, prob: 0.05 }] },
      { id: 'ho10_vanpersie', nombre: 'Van Persie', pos: 'EXI', media: 91, upgrades: [{ media: 94, prob: 0.15 }] },
      { id: 'ho10_kuyt', nombre: 'Kuyt', pos: 'DEL', media: 85, upgrades: [] },
    ]
  },
  {
    id: 'alemania_2010', nombre: 'Alemania 2010', abrev: 'GER', color: '#000000', colorSecundario: '#DD0000',
    liga: 'mundial', anio: 2010, pais: 'Alemania',
    cartaEspecial: null,
    jugadores: [
      { id: 'ge10_neuer', nombre: 'Manuel Neuer', pos: 'POR', media: 91, upgrades: [{ media: 94, prob: 0.15 }] },
      { id: 'ge10_lahm', nombre: 'Philipp Lahm', pos: 'LAD', media: 91, upgrades: [{ media: 94, prob: 0.15 }] },
      { id: 'ge10_mertesacker', nombre: 'Mertesacker', pos: 'DFC', media: 86, upgrades: [] },
      { id: 'ge10_badstuber', nombre: 'Badstuber', pos: 'DFC', media: 83, upgrades: [] },
      { id: 'ge10_friedrich', nombre: 'Friedrich', pos: 'LAI', media: 82, upgrades: [] },
      { id: 'ge10_khedira', nombre: 'Khedira', pos: 'MCD', media: 88, upgrades: [{ media: 92, prob: 0.15 }] },
      { id: 'ge10_schweinst', nombre: 'Schweinsteiger', pos: 'MC', media: 90, upgrades: [{ media: 93, prob: 0.15 }] },
      { id: 'ge10_ozil', nombre: 'Özil', pos: 'MCO', media: 89, upgrades: [{ media: 93, prob: 0.15 }] },
      { id: 'ge10_podolski', nombre: 'Podolski', pos: 'EXI', media: 86, upgrades: [] },
      { id: 'ge10_muller', nombre: 'Thomas Müller', pos: 'EXD', media: 89, upgrades: [{ media: 93, prob: 0.15 }] },
      { id: 'ge10_klose', nombre: 'Miroslav Klose', pos: 'DEL', media: 90, upgrades: [{ media: 93, prob: 0.15 }] },
    ]
  },

  // ===================== MUNDIAL 2014 - BRASIL =====================
  {
    id: 'alemania_2014', nombre: 'Alemania 2014', abrev: 'GER', color: '#000000', colorSecundario: '#DD0000',
    liga: 'mundial', anio: 2014, pais: 'Alemania',
    cartaEspecial: { mediaBase: 99, jugadorNombre: 'Neuer 2014 (LEGENDARIO)', jugadorPos: 'POR', rareza: 'especial', probabilidad: 0.01 },
    jugadores: [
      { id: 'ge14_neuer', nombre: 'Manuel Neuer', pos: 'POR', media: 96, upgrades: [{ media: 98, prob: 0.15 }, { media: 99, prob: 0.05 }] },
      { id: 'ge14_lahm', nombre: 'Philipp Lahm', pos: 'LAD', media: 93, upgrades: [{ media: 96, prob: 0.15 }] },
      { id: 'ge14_boateng', nombre: 'Boateng', pos: 'DFC', media: 88, upgrades: [{ media: 92, prob: 0.15 }] },
      { id: 'ge14_hummels', nombre: 'Hummels', pos: 'DFC', media: 89, upgrades: [{ media: 93, prob: 0.15 }] },
      { id: 'ge14_howedes', nombre: 'Höwedes', pos: 'LAI', media: 82, upgrades: [] },
      { id: 'ge14_khedira', nombre: 'Khedira', pos: 'MCD', media: 88, upgrades: [] },
      { id: 'ge14_kroos', nombre: 'Toni Kroos', pos: 'MC', media: 92, upgrades: [{ media: 95, prob: 0.15 }, { media: 97, prob: 0.05 }] },
      { id: 'ge14_schweinst', nombre: 'Schweinsteiger', pos: 'MC', media: 90, upgrades: [] },
      { id: 'ge14_ozil', nombre: 'Özil', pos: 'MCO', media: 90, upgrades: [{ media: 93, prob: 0.15 }] },
      { id: 'ge14_muller', nombre: 'Thomas Müller', pos: 'EXD', media: 92, upgrades: [{ media: 95, prob: 0.15 }] },
      { id: 'ge14_klose', nombre: 'Miroslav Klose', pos: 'DEL', media: 90, upgrades: [{ media: 93, prob: 0.15 }] },
    ]
  },
  {
    id: 'argentina_2014', nombre: 'Argentina 2014', abrev: 'ARG', color: '#75AADB', colorSecundario: '#FFFFFF',
    liga: 'mundial', anio: 2014, pais: 'Argentina',
    cartaEspecial: { mediaBase: 99, jugadorNombre: 'Messi 2014 (LEGENDARIO)', jugadorPos: 'EXD', rareza: 'especial', probabilidad: 0.01 },
    jugadores: [
      { id: 'ar14_romero', nombre: 'Romero', pos: 'POR', media: 82, upgrades: [] },
      { id: 'ar14_zabaleta', nombre: 'Zabaleta', pos: 'LAD', media: 83, upgrades: [] },
      { id: 'ar14_garay', nombre: 'Garay', pos: 'DFC', media: 86, upgrades: [] },
      { id: 'ar14_demichelis', nombre: 'Demichelis', pos: 'DFC', media: 83, upgrades: [] },
      { id: 'ar14_rojo', nombre: 'Rojo', pos: 'LAI', media: 82, upgrades: [] },
      { id: 'ar14_mascherano', nombre: 'Mascherano', pos: 'MCD', media: 91, upgrades: [{ media: 94, prob: 0.15 }] },
      { id: 'ar14_biglia', nombre: 'Biglia', pos: 'MC', media: 84, upgrades: [] },
      { id: 'ar14_dimaria', nombre: 'Di María', pos: 'EXI', media: 92, upgrades: [{ media: 95, prob: 0.15 }] },
      { id: 'ar14_lavezzi', nombre: 'Lavezzi', pos: 'EXD', media: 85, upgrades: [] },
      { id: 'ar14_higuain', nombre: 'Higuaín', pos: 'DEL', media: 89, upgrades: [{ media: 93, prob: 0.15 }] },
      { id: 'ar14_messi', nombre: 'Leo Messi', pos: 'EXD', media: 99, upgrades: [] },
    ]
  },
  {
    id: 'brasil_2014', nombre: 'Brasil 2014', abrev: 'BRA', color: '#FFD700', colorSecundario: '#009C3B',
    liga: 'mundial', anio: 2014, pais: 'Brasil',
    cartaEspecial: null,
    jugadores: [
      { id: 'br14_julio', nombre: 'Júlio César', pos: 'POR', media: 83, upgrades: [] },
      { id: 'br14_maicon', nombre: 'Maicon', pos: 'LAD', media: 83, upgrades: [] },
      { id: 'br14_thiagos', nombre: 'Thiago Silva', pos: 'DFC', media: 93, upgrades: [{ media: 96, prob: 0.15 }] },
      { id: 'br14_davidluiz', nombre: 'David Luiz', pos: 'DFC', media: 87, upgrades: [{ media: 91, prob: 0.15 }] },
      { id: 'br14_marcelo', nombre: 'Marcelo', pos: 'LAI', media: 89, upgrades: [{ media: 93, prob: 0.15 }] },
      { id: 'br14_fernandinho', nombre: 'Fernandinho', pos: 'MCD', media: 88, upgrades: [] },
      { id: 'br14_paulinho', nombre: 'Paulinho', pos: 'MC', media: 84, upgrades: [] },
      { id: 'br14_oscar', nombre: 'Oscar', pos: 'MCO', media: 88, upgrades: [{ media: 92, prob: 0.15 }] },
      { id: 'br14_hulk', nombre: 'Hulk', pos: 'EXD', media: 85, upgrades: [] },
      { id: 'br14_bernard', nombre: 'Bernard', pos: 'EXI', media: 83, upgrades: [] },
      { id: 'br14_neymar', nombre: 'Neymar', pos: 'EXI', media: 94, upgrades: [{ media: 97, prob: 0.15 }, { media: 99, prob: 0.05 }] },
    ]
  },
  {
    id: 'colombia_2014', nombre: 'Colombia 2014', abrev: 'COL', color: '#FCD116', colorSecundario: '#003087',
    liga: 'mundial', anio: 2014, pais: 'Colombia',
    cartaEspecial: null,
    jugadores: [
      { id: 'co14_ospina', nombre: 'Ospina', pos: 'POR', media: 84, upgrades: [] },
      { id: 'co14_zapata', nombre: 'Cristian Zapata', pos: 'LAD', media: 83, upgrades: [] },
      { id: 'co14_yepes', nombre: 'Yepes', pos: 'DFC', media: 83, upgrades: [] },
      { id: 'co14_armero', nombre: 'Armero', pos: 'LAI', media: 81, upgrades: [] },
      { id: 'co14_zuniga', nombre: 'Zúñiga', pos: 'LAD', media: 80, upgrades: [] },
      { id: 'co14_sanchez', nombre: 'Carlos Sánchez', pos: 'MCD', media: 82, upgrades: [] },
      { id: 'co14_guarin', nombre: 'Guarín', pos: 'MC', media: 83, upgrades: [] },
      { id: 'co14_lerma', nombre: 'Arias', pos: 'MC', media: 80, upgrades: [] },
      { id: 'co14_cuadrado', nombre: 'Juan Cuadrado', pos: 'EXD', media: 86, upgrades: [{ media: 90, prob: 0.20 }] },
      { id: 'co14_rodriguez', nombre: 'James Rodríguez', pos: 'MCO', media: 91, upgrades: [{ media: 94, prob: 0.15 }, { media: 97, prob: 0.05 }] },
      { id: 'co14_falcao', nombre: 'Radamel Falcao', pos: 'DEL', media: 93, upgrades: [{ media: 96, prob: 0.15 }] },
    ]
  },

  // ===================== MUNDIAL 2018 - RUSIA =====================
  {
    id: 'francia_2018', nombre: 'Francia 2018', abrev: 'FRA', color: '#003399', colorSecundario: '#FFFFFF',
    liga: 'mundial', anio: 2018, pais: 'Francia',
    cartaEspecial: { mediaBase: 99, jugadorNombre: 'Mbappé 2018 (LEGENDARIO)', jugadorPos: 'DEL', rareza: 'especial', probabilidad: 0.01 },
    jugadores: [
      { id: 'fr18_lloris', nombre: 'Hugo Lloris', pos: 'POR', media: 91, upgrades: [{ media: 94, prob: 0.15 }] },
      { id: 'fr18_pavard', nombre: 'Pavard', pos: 'LAD', media: 84, upgrades: [] },
      { id: 'fr18_varane', nombre: 'Varane', pos: 'DFC', media: 91, upgrades: [{ media: 94, prob: 0.15 }] },
      { id: 'fr18_umtiti', nombre: 'Umtiti', pos: 'DFC', media: 87, upgrades: [] },
      { id: 'fr18_hernandez', nombre: 'Lucas Hernandez', pos: 'LAI', media: 83, upgrades: [] },
      { id: 'fr18_kante', nombre: 'N\'Golo Kanté', pos: 'MCD', media: 92, upgrades: [{ media: 95, prob: 0.15 }, { media: 97, prob: 0.05 }] },
      { id: 'fr18_pogba', nombre: 'Paul Pogba', pos: 'MC', media: 89, upgrades: [{ media: 93, prob: 0.15 }] },
      { id: 'fr18_tolisso', nombre: 'Tolisso', pos: 'MC', media: 85, upgrades: [] },
      { id: 'fr18_griezmann', nombre: 'Griezmann', pos: 'MCO', media: 92, upgrades: [{ media: 95, prob: 0.15 }] },
      { id: 'fr18_dembele', nombre: 'Dembélé', pos: 'EXD', media: 89, upgrades: [{ media: 93, prob: 0.15 }] },
      { id: 'fr18_mbappe', nombre: 'Kylian Mbappé', pos: 'DEL', media: 94, upgrades: [{ media: 97, prob: 0.15 }, { media: 99, prob: 0.05 }] },
    ]
  },
  {
    id: 'croacia_2018', nombre: 'Croacia 2018', abrev: 'CRO', color: '#FF0000', colorSecundario: '#FFFFFF',
    liga: 'mundial', anio: 2018, pais: 'Croacia',
    cartaEspecial: { mediaBase: 99, jugadorNombre: 'Modrić 2018 (LEGENDARIO)', jugadorPos: 'MC', rareza: 'especial', probabilidad: 0.01 },
    jugadores: [
      { id: 'cr18_subasic', nombre: 'Subašić', pos: 'POR', media: 86, upgrades: [] },
      { id: 'cr18_vrsaljko', nombre: 'Vrsaljko', pos: 'LAD', media: 83, upgrades: [] },
      { id: 'cr18_lovren', nombre: 'Lovren', pos: 'DFC', media: 83, upgrades: [] },
      { id: 'cr18_vida', nombre: 'Vida', pos: 'DFC', media: 84, upgrades: [] },
      { id: 'cr18_strinic', nombre: 'Strinić', pos: 'LAI', media: 80, upgrades: [] },
      { id: 'cr18_brozovic', nombre: 'Brozović', pos: 'MCD', media: 87, upgrades: [{ media: 91, prob: 0.20 }] },
      { id: 'cr18_modric', nombre: 'Luka Modrić', pos: 'MC', media: 96, upgrades: [{ media: 98, prob: 0.15 }, { media: 99, prob: 0.05 }] },
      { id: 'cr18_rakitic', nombre: 'Rakitić', pos: 'MC', media: 90, upgrades: [{ media: 93, prob: 0.15 }] },
      { id: 'cr18_perisic', nombre: 'Perišić', pos: 'EXI', media: 88, upgrades: [{ media: 92, prob: 0.15 }] },
      { id: 'cr18_mandzukic', nombre: 'Mandžukić', pos: 'DEL', media: 87, upgrades: [{ media: 91, prob: 0.20 }] },
      { id: 'cr18_kovacic', nombre: 'Kovačić', pos: 'EXD', media: 87, upgrades: [{ media: 91, prob: 0.20 }] },
    ]
  },
  {
    id: 'belgica_2018', nombre: 'Bélgica 2018', abrev: 'BEL', color: '#000000', colorSecundario: '#FFD700',
    liga: 'mundial', anio: 2018, pais: 'Bélgica',
    cartaEspecial: null,
    jugadores: [
      { id: 'be18_courtois', nombre: 'Courtois', pos: 'POR', media: 93, upgrades: [{ media: 96, prob: 0.15 }] },
      { id: 'be18_meunier', nombre: 'Meunier', pos: 'LAD', media: 83, upgrades: [] },
      { id: 'be18_alderweireld', nombre: 'Alderweireld', pos: 'DFC', media: 87, upgrades: [] },
      { id: 'be18_vertonghen', nombre: 'Vertonghen', pos: 'DFC', media: 88, upgrades: [] },
      { id: 'be18_chadli', nombre: 'Chadli', pos: 'LAI', media: 82, upgrades: [] },
      { id: 'be18_witsel', nombre: 'Witsel', pos: 'MCD', media: 87, upgrades: [] },
      { id: 'be18_debruyne', nombre: 'De Bruyne', pos: 'MC', media: 95, upgrades: [{ media: 97, prob: 0.15 }, { media: 99, prob: 0.05 }] },
      { id: 'be18_mertens', nombre: 'Mertens', pos: 'MCO', media: 87, upgrades: [{ media: 91, prob: 0.15 }] },
      { id: 'be18_hazard', nombre: 'Eden Hazard', pos: 'EXI', media: 95, upgrades: [{ media: 97, prob: 0.15 }, { media: 99, prob: 0.05 }] },
      { id: 'be18_kompany', nombre: 'Kompany', pos: 'DFC', media: 87, upgrades: [] },
      { id: 'be18_lukaku', nombre: 'Romelu Lukaku', pos: 'DEL', media: 91, upgrades: [{ media: 94, prob: 0.15 }] },
    ]
  },
  {
    id: 'inglaterra_2018', nombre: 'Inglaterra 2018', abrev: 'ENG', color: '#FFFFFF', colorSecundario: '#CF081F',
    liga: 'mundial', anio: 2018, pais: 'Inglaterra',
    cartaEspecial: null,
    jugadores: [
      { id: 'en18_pickford', nombre: 'Pickford', pos: 'POR', media: 84, upgrades: [] },
      { id: 'en18_walker', nombre: 'Walker', pos: 'LAD', media: 85, upgrades: [] },
      { id: 'en18_stones', nombre: 'Stones', pos: 'DFC', media: 84, upgrades: [] },
      { id: 'en18_maguire', nombre: 'Maguire', pos: 'DFC', media: 84, upgrades: [] },
      { id: 'en18_trippier', nombre: 'Trippier', pos: 'LAI', media: 84, upgrades: [{ media: 88, prob: 0.20 }] },
      { id: 'en18_henderson', nombre: 'Henderson', pos: 'MCD', media: 83, upgrades: [] },
      { id: 'en18_delph', nombre: 'Delph', pos: 'MC', media: 81, upgrades: [] },
      { id: 'en18_lingard', nombre: 'Lingard', pos: 'MCO', media: 82, upgrades: [] },
      { id: 'en18_sterling', nombre: 'Sterling', pos: 'EXI', media: 86, upgrades: [{ media: 90, prob: 0.20 }] },
      { id: 'en18_alli', nombre: 'Dele Alli', pos: 'EXD', media: 84, upgrades: [] },
      { id: 'en18_kane', nombre: 'Harry Kane', pos: 'DEL', media: 92, upgrades: [{ media: 95, prob: 0.15 }, { media: 97, prob: 0.05 }] },
    ]
  },

  // ===================== MUNDIAL 2022 - QATAR =====================
  {
    id: 'argentina_2022', nombre: 'Argentina 2022', abrev: 'ARG', color: '#75AADB', colorSecundario: '#FFFFFF',
    liga: 'mundial', anio: 2022, pais: 'Argentina',
    cartaEspecial: { mediaBase: 99, jugadorNombre: 'Messi 2022 (LEGENDARIO)', jugadorPos: 'EXD', rareza: 'especial', probabilidad: 0.01 },
    jugadores: [
      { id: 'ar22_dibu', nombre: 'Dibu Martínez', pos: 'POR', media: 91, upgrades: [{ media: 94, prob: 0.15 }, { media: 97, prob: 0.05 }] },
      { id: 'ar22_montiel', nombre: 'Montiel', pos: 'LAD', media: 82, upgrades: [] },
      { id: 'ar22_romero', nombre: 'Romero', pos: 'DFC', media: 88, upgrades: [{ media: 92, prob: 0.15 }] },
      { id: 'ar22_otamendi', nombre: 'Otamendi', pos: 'DFC', media: 86, upgrades: [] },
      { id: 'ar22_acuna', nombre: 'Acuña', pos: 'LAI', media: 83, upgrades: [] },
      { id: 'ar22_depaul', nombre: 'De Paul', pos: 'MCD', media: 89, upgrades: [{ media: 92, prob: 0.15 }] },
      { id: 'ar22_macallister', nombre: 'Mac Allister', pos: 'MC', media: 87, upgrades: [{ media: 91, prob: 0.20 }] },
      { id: 'ar22_enzo', nombre: 'Enzo Fernández', pos: 'MC', media: 85, upgrades: [{ media: 89, prob: 0.20 }] },
      { id: 'ar22_dimaria', nombre: 'Di María', pos: 'EXI', media: 91, upgrades: [{ media: 94, prob: 0.15 }] },
      { id: 'ar22_alvarez', nombre: 'Julián Álvarez', pos: 'DEL', media: 86, upgrades: [{ media: 90, prob: 0.15 }, { media: 93, prob: 0.05 }] },
      { id: 'ar22_messi', nombre: 'Leo Messi', pos: 'EXD', media: 99, upgrades: [] },
    ]
  },
  {
    id: 'francia_2022', nombre: 'Francia 2022', abrev: 'FRA', color: '#003399', colorSecundario: '#FFFFFF',
    liga: 'mundial', anio: 2022, pais: 'Francia',
    cartaEspecial: null,
    jugadores: [
      { id: 'fr22_lloris', nombre: 'Hugo Lloris', pos: 'POR', media: 90, upgrades: [] },
      { id: 'fr22_kounde', nombre: 'Koundé', pos: 'LAD', media: 87, upgrades: [] },
      { id: 'fr22_varane', nombre: 'Varane', pos: 'DFC', media: 88, upgrades: [] },
      { id: 'fr22_upamecano', nombre: 'Upamecano', pos: 'DFC', media: 87, upgrades: [{ media: 91, prob: 0.20 }] },
      { id: 'fr22_theo', nombre: 'Theo Hernandez', pos: 'LAI', media: 87, upgrades: [{ media: 91, prob: 0.20 }] },
      { id: 'fr22_tchouameni', nombre: 'Tchouaméni', pos: 'MCD', media: 87, upgrades: [{ media: 91, prob: 0.20 }] },
      { id: 'fr22_rabiot', nombre: 'Rabiot', pos: 'MC', media: 85, upgrades: [] },
      { id: 'fr22_griezmann', nombre: 'Griezmann', pos: 'MCO', media: 91, upgrades: [{ media: 94, prob: 0.15 }] },
      { id: 'fr22_dembele', nombre: 'Dembélé', pos: 'EXD', media: 89, upgrades: [{ media: 93, prob: 0.15 }] },
      { id: 'fr22_giroud', nombre: 'Giroud', pos: 'DEL', media: 85, upgrades: [] },
      { id: 'fr22_mbappe', nombre: 'Kylian Mbappé', pos: 'DEL', media: 97, upgrades: [{ media: 99, prob: 0.15 }] },
    ]
  },
  {
    id: 'marruecos_2022', nombre: 'Marruecos 2022', abrev: 'MAR', color: '#006233', colorSecundario: '#C1272D',
    liga: 'mundial', anio: 2022, pais: 'Marruecos',
    cartaEspecial: null,
    jugadores: [
      { id: 'ma22_bono', nombre: 'Bono (Yassine Bounou)', pos: 'POR', media: 87, upgrades: [{ media: 91, prob: 0.15 }, { media: 94, prob: 0.05 }] },
      { id: 'ma22_hakimi', nombre: 'Achraf Hakimi', pos: 'LAD', media: 89, upgrades: [{ media: 92, prob: 0.15 }] },
      { id: 'ma22_aguerd', nombre: 'Aguerd', pos: 'DFC', media: 82, upgrades: [] },
      { id: 'ma22_saiss', nombre: 'Saïss', pos: 'DFC', media: 83, upgrades: [] },
      { id: 'ma22_attiyat', nombre: 'Attiyat Allah', pos: 'LAI', media: 79, upgrades: [] },
      { id: 'ma22_amrabat', nombre: 'Sofyan Amrabat', pos: 'MCD', media: 86, upgrades: [{ media: 90, prob: 0.15 }, { media: 93, prob: 0.05 }] },
      { id: 'ma22_ounahi', nombre: 'Ounahi', pos: 'MC', media: 82, upgrades: [] },
      { id: 'ma22_sabiri', nombre: 'Sabiri', pos: 'MC', media: 81, upgrades: [] },
      { id: 'ma22_ziyech', nombre: 'Ziyech', pos: 'EXD', media: 85, upgrades: [{ media: 89, prob: 0.20 }] },
      { id: 'ma22_ennesyri', nombre: 'En-Nesyri', pos: 'DEL', media: 83, upgrades: [{ media: 87, prob: 0.20 }] },
      { id: 'ma22_boufal', nombre: 'Boufal', pos: 'EXI', media: 82, upgrades: [] },
    ]
  },
  {
    id: 'croacia_2022', nombre: 'Croacia 2022', abrev: 'CRO', color: '#FF0000', colorSecundario: '#FFFFFF',
    liga: 'mundial', anio: 2022, pais: 'Croacia',
    cartaEspecial: null,
    jugadores: [
      { id: 'cr22_livakovic', nombre: 'Livaković', pos: 'POR', media: 86, upgrades: [{ media: 90, prob: 0.15 }] },
      { id: 'cr22_juranovic', nombre: 'Juranović', pos: 'LAD', media: 82, upgrades: [] },
      { id: 'cr22_gvardiol', nombre: 'Joško Gvardiol', pos: 'DFC', media: 85, upgrades: [{ media: 89, prob: 0.20 }] },
      { id: 'cr22_lovren', nombre: 'Lovren', pos: 'DFC', media: 80, upgrades: [] },
      { id: 'cr22_sosa', nombre: 'Sosa', pos: 'LAI', media: 80, upgrades: [] },
      { id: 'cr22_brozovic', nombre: 'Brozović', pos: 'MCD', media: 87, upgrades: [] },
      { id: 'cr22_modric', nombre: 'Luka Modrić', pos: 'MC', media: 94, upgrades: [{ media: 97, prob: 0.15 }] },
      { id: 'cr22_kovacic', nombre: 'Kovačić', pos: 'MC', media: 86, upgrades: [{ media: 90, prob: 0.20 }] },
      { id: 'cr22_kramaric', nombre: 'Kramarić', pos: 'MCO', media: 87, upgrades: [{ media: 91, prob: 0.20 }] },
      { id: 'cr22_perisic', nombre: 'Perišić', pos: 'EXI', media: 87, upgrades: [] },
      { id: 'cr22_orsic', nombre: 'Oršić', pos: 'EXD', media: 83, upgrades: [] },
    ]
  },

  // ===================== MUNDIAL 2026 - USA/CANADA/MEXICO =====================
  {
    id: 'espana_2026', nombre: 'España 2026', abrev: 'ESP', color: '#AA151B', colorSecundario: '#F1BF00',
    liga: 'mundial', anio: 2026, pais: 'España',
    cartaEspecial: { mediaBase: 99, jugadorNombre: 'Yamal 2026 (LEGENDARIO)', jugadorPos: 'EXD', rareza: 'especial', probabilidad: 0.01 },
    jugadores: [
      { id: 'es26_unai', nombre: 'Unai Simón', pos: 'POR', media: 84, upgrades: [{ media: 88, prob: 0.20 }] },
      { id: 'es26_carvajal', nombre: 'Carvajal', pos: 'LAD', media: 86, upgrades: [] },
      { id: 'es26_laporte', nombre: 'Laporte', pos: 'DFC', media: 85, upgrades: [] },
      { id: 'es26_lenormand', nombre: 'Le Normand', pos: 'DFC', media: 83, upgrades: [] },
      { id: 'es26_cucurella', nombre: 'Cucurella', pos: 'LAI', media: 84, upgrades: [] },
      { id: 'es26_rodri', nombre: 'Rodri', pos: 'MCD', media: 95, upgrades: [{ media: 98, prob: 0.15 }, { media: 99, prob: 0.05 }] },
      { id: 'es26_pedri', nombre: 'Pedri', pos: 'MC', media: 92, upgrades: [{ media: 95, prob: 0.15 }] },
      { id: 'es26_fabian', nombre: 'Fabián Ruiz', pos: 'MC', media: 87, upgrades: [{ media: 91, prob: 0.20 }] },
      { id: 'es26_nico', nombre: 'Nico Williams', pos: 'EXI', media: 89, upgrades: [{ media: 92, prob: 0.15 }] },
      { id: 'es26_morata', nombre: 'Morata', pos: 'DEL', media: 84, upgrades: [] },
      { id: 'es26_yamal', nombre: 'Lamine Yamal', pos: 'EXD', media: 94, upgrades: [{ media: 97, prob: 0.15 }, { media: 99, prob: 0.05 }] },
    ]
  },
  {
    id: 'argentina_2026', nombre: 'Argentina 2026', abrev: 'ARG', color: '#75AADB', colorSecundario: '#FFFFFF',
    liga: 'mundial', anio: 2026, pais: 'Argentina',
    cartaEspecial: { mediaBase: 99, jugadorNombre: 'Messi 2026 (LEGENDARIO)', jugadorPos: 'EXD', rareza: 'especial', probabilidad: 0.01 },
    jugadores: [
      { id: 'ar26_dibu', nombre: 'Dibu Martínez', pos: 'POR', media: 91, upgrades: [{ media: 94, prob: 0.15 }] },
      { id: 'ar26_montiel', nombre: 'Montiel', pos: 'LAD', media: 83, upgrades: [] },
      { id: 'ar26_romero', nombre: 'Romero', pos: 'DFC', media: 89, upgrades: [{ media: 93, prob: 0.15 }] },
      { id: 'ar26_otamendi', nombre: 'Otamendi', pos: 'DFC', media: 86, upgrades: [] },
      { id: 'ar26_acuna', nombre: 'Acuña', pos: 'LAI', media: 84, upgrades: [] },
      { id: 'ar26_depaul', nombre: 'De Paul', pos: 'MCD', media: 88, upgrades: [] },
      { id: 'ar26_macallister', nombre: 'Mac Allister', pos: 'MC', media: 89, upgrades: [{ media: 92, prob: 0.15 }] },
      { id: 'ar26_enzo', nombre: 'Enzo Fernández', pos: 'MC', media: 85, upgrades: [{ media: 89, prob: 0.20 }] },
      { id: 'ar26_dimaria', nombre: 'Di María', pos: 'EXI', media: 90, upgrades: [] },
      { id: 'ar26_alvarez', nombre: 'Julián Álvarez', pos: 'DEL', media: 90, upgrades: [{ media: 93, prob: 0.15 }, { media: 96, prob: 0.05 }] },
      { id: 'ar26_messi', nombre: 'Leo Messi', pos: 'EXD', media: 98, upgrades: [{ media: 99, prob: 0.15 }] },
    ]
  },
  {
    id: 'francia_2026', nombre: 'Francia 2026', abrev: 'FRA', color: '#003399', colorSecundario: '#FFFFFF',
    liga: 'mundial', anio: 2026, pais: 'Francia',
    cartaEspecial: null,
    jugadores: [
      { id: 'fr26_maignan', nombre: 'Maignan', pos: 'POR', media: 90, upgrades: [{ media: 93, prob: 0.15 }] },
      { id: 'fr26_kounde', nombre: 'Koundé', pos: 'LAD', media: 87, upgrades: [] },
      { id: 'fr26_saliba', nombre: 'Saliba', pos: 'DFC', media: 89, upgrades: [{ media: 92, prob: 0.15 }] },
      { id: 'fr26_upamecano', nombre: 'Upamecano', pos: 'DFC', media: 88, upgrades: [] },
      { id: 'fr26_theo', nombre: 'Theo Hernandez', pos: 'LAI', media: 87, upgrades: [] },
      { id: 'fr26_tchouameni', nombre: 'Tchouaméni', pos: 'MCD', media: 88, upgrades: [{ media: 92, prob: 0.15 }] },
      { id: 'fr26_camavinga', nombre: 'Camavinga', pos: 'MC', media: 87, upgrades: [{ media: 91, prob: 0.20 }] },
      { id: 'fr26_griezmann', nombre: 'Griezmann', pos: 'MCO', media: 90, upgrades: [] },
      { id: 'fr26_dembele', nombre: 'Dembélé', pos: 'EXD', media: 90, upgrades: [{ media: 93, prob: 0.15 }] },
      { id: 'fr26_mbappe', nombre: 'Kylian Mbappé', pos: 'DEL', media: 98, upgrades: [{ media: 99, prob: 0.15 }] },
      { id: 'fr26_barcola', nombre: 'Barcola', pos: 'EXI', media: 85, upgrades: [{ media: 89, prob: 0.20 }] },
    ]
  },
  {
    id: 'inglaterra_2026', nombre: 'Inglaterra 2026', abrev: 'ENG', color: '#FFFFFF', colorSecundario: '#CF081F',
    liga: 'mundial', anio: 2026, pais: 'Inglaterra',
    cartaEspecial: null,
    jugadores: [
      { id: 'en26_pickford', nombre: 'Pickford', pos: 'POR', media: 85, upgrades: [] },
      { id: 'en26_walker', nombre: 'Walker', pos: 'LAD', media: 85, upgrades: [] },
      { id: 'en26_stones', nombre: 'Stones', pos: 'DFC', media: 85, upgrades: [] },
      { id: 'en26_maguire', nombre: 'Maguire', pos: 'DFC', media: 84, upgrades: [] },
      { id: 'en26_trippier', nombre: 'Trippier', pos: 'LAI', media: 83, upgrades: [] },
      { id: 'en26_rice', nombre: 'Declan Rice', pos: 'MCD', media: 89, upgrades: [{ media: 93, prob: 0.15 }] },
      { id: 'en26_alexander', nombre: 'Alexander-Arnold', pos: 'MC', media: 87, upgrades: [{ media: 91, prob: 0.20 }] },
      { id: 'en26_bellingham', nombre: 'Jude Bellingham', pos: 'MCO', media: 93, upgrades: [{ media: 96, prob: 0.15 }, { media: 98, prob: 0.05 }] },
      { id: 'en26_saka', nombre: 'Bukayo Saka', pos: 'EXD', media: 90, upgrades: [{ media: 93, prob: 0.15 }] },
      { id: 'en26_foden', nombre: 'Foden', pos: 'EXI', media: 91, upgrades: [{ media: 94, prob: 0.15 }] },
      { id: 'en26_kane', nombre: 'Harry Kane', pos: 'DEL', media: 92, upgrades: [{ media: 95, prob: 0.15 }] },
    ]
  },
  {
    id: 'brasil_2026', nombre: 'Brasil 2026', abrev: 'BRA', color: '#FFD700', colorSecundario: '#009C3B',
    liga: 'mundial', anio: 2026, pais: 'Brasil',
    cartaEspecial: { mediaBase: 99, jugadorNombre: 'Vinicius 2026 (LEGENDARIO)', jugadorPos: 'EXI', rareza: 'especial', probabilidad: 0.01 },
    jugadores: [
      { id: 'br26_alisson', nombre: 'Alisson', pos: 'POR', media: 92, upgrades: [{ media: 95, prob: 0.15 }] },
      { id: 'br26_danilo', nombre: 'Danilo', pos: 'LAD', media: 83, upgrades: [] },
      { id: 'br26_marquinhos', nombre: 'Marquinhos', pos: 'DFC', media: 88, upgrades: [{ media: 92, prob: 0.15 }] },
      { id: 'br26_militao', nombre: 'Militão', pos: 'DFC', media: 87, upgrades: [] },
      { id: 'br26_lodi', nombre: 'Renan Lodi', pos: 'LAI', media: 82, upgrades: [] },
      { id: 'br26_casemiro', nombre: 'Casemiro', pos: 'MCD', media: 87, upgrades: [] },
      { id: 'br26_paqueta', nombre: 'Lucas Paquetá', pos: 'MC', media: 88, upgrades: [{ media: 92, prob: 0.15 }] },
      { id: 'br26_raphinha', nombre: 'Raphinha', pos: 'EXD', media: 88, upgrades: [{ media: 92, prob: 0.15 }] },
      { id: 'br26_rodrygo', nombre: 'Rodrygo', pos: 'MCO', media: 89, upgrades: [{ media: 93, prob: 0.15 }] },
      { id: 'br26_endrick', nombre: 'Endrick', pos: 'DEL', media: 85, upgrades: [{ media: 89, prob: 0.20 }] },
      { id: 'br26_vinicius', nombre: 'Vinicius Jr', pos: 'EXI', media: 95, upgrades: [{ media: 98, prob: 0.15 }, { media: 99, prob: 0.05 }] },
    ]
  },
  {
    id: 'alemania_2026', nombre: 'Alemania 2026', abrev: 'GER', color: '#000000', colorSecundario: '#DD0000',
    liga: 'mundial', anio: 2026, pais: 'Alemania',
    cartaEspecial: null,
    jugadores: [
      { id: 'ge26_neuer', nombre: 'Manuel Neuer', pos: 'POR', media: 88, upgrades: [] },
      { id: 'ge26_kimmich', nombre: 'Joshua Kimmich', pos: 'LAD', media: 91, upgrades: [{ media: 94, prob: 0.15 }] },
      { id: 'ge26_rudiger', nombre: 'Rüdiger', pos: 'DFC', media: 87, upgrades: [] },
      { id: 'ge26_schlotterbeck', nombre: 'Schlotterbeck', pos: 'DFC', media: 85, upgrades: [] },
      { id: 'ge26_mittelstadt', nombre: 'Mittelstädt', pos: 'LAI', media: 82, upgrades: [] },
      { id: 'ge26_kroos', nombre: 'Toni Kroos', pos: 'MCD', media: 89, upgrades: [{ media: 92, prob: 0.15 }] },
      { id: 'ge26_gundogan', nombre: 'Gündoğan', pos: 'MC', media: 87, upgrades: [] },
      { id: 'ge26_musiala', nombre: 'Jamal Musiala', pos: 'MCO', media: 92, upgrades: [{ media: 95, prob: 0.15 }, { media: 97, prob: 0.05 }] },
      { id: 'ge26_gnabry', nombre: 'Gnabry', pos: 'EXD', media: 87, upgrades: [] },
      { id: 'ge26_wirtz', nombre: 'Florian Wirtz', pos: 'EXI', media: 93, upgrades: [{ media: 96, prob: 0.15 }, { media: 98, prob: 0.05 }] },
      { id: 'ge26_klose2', nombre: 'Kleindienst', pos: 'DEL', media: 82, upgrades: [] },
    ]
  },
  {
    id: 'portugal_2026', nombre: 'Portugal 2026', abrev: 'POR', color: '#006600', colorSecundario: '#FF0000',
    liga: 'mundial', anio: 2026, pais: 'Portugal',
    cartaEspecial: null,
    jugadores: [
      { id: 'pt26_costa', nombre: 'Diogo Costa', pos: 'POR', media: 88, upgrades: [{ media: 92, prob: 0.15 }] },
      { id: 'pt26_cancelo', nombre: 'Cancelo', pos: 'LAD', media: 87, upgrades: [] },
      { id: 'pt26_dias', nombre: 'Rúben Dias', pos: 'DFC', media: 92, upgrades: [{ media: 95, prob: 0.15 }] },
      { id: 'pt26_pepe', nombre: 'Pepe', pos: 'DFC', media: 82, upgrades: [] },
      { id: 'pt26_nuno', nombre: 'Nuno Mendes', pos: 'LAI', media: 85, upgrades: [] },
      { id: 'pt26_vitinha', nombre: 'Vitinha', pos: 'MCD', media: 87, upgrades: [{ media: 91, prob: 0.20 }] },
      { id: 'pt26_neves', nombre: 'Rúben Neves', pos: 'MC', media: 86, upgrades: [] },
      { id: 'pt26_bruno', nombre: 'Bruno Fernandes', pos: 'MCO', media: 91, upgrades: [{ media: 94, prob: 0.15 }] },
      { id: 'pt26_bernardo', nombre: 'Bernardo Silva', pos: 'EXD', media: 92, upgrades: [{ media: 95, prob: 0.15 }] },
      { id: 'pt26_leao', nombre: 'Rafael Leão', pos: 'EXI', media: 89, upgrades: [{ media: 92, prob: 0.15 }] },
      { id: 'pt26_ronaldo', nombre: 'C. Ronaldo (veterano)', pos: 'DEL', media: 91, upgrades: [{ media: 94, prob: 0.15 }, { media: 97, prob: 0.05 }] },
    ]
  },
];

// Lista todos los años de los mundiales disponibles
export const ANIOS_MUNDIALES = [...new Set(MUNDIALES_EQUIPOS.map(e => e.anio))].sort();

// Obtener equipos de un año específico
export function getEquiposMundial(anio) {
  return MUNDIALES_EQUIPOS.filter(e => e.anio === anio);
}
