// Configuración centralizada del Gran Desafío del Scraping Arcano

module.exports = {
  // URLs de la cripta
  urls: {
    login: 'https://pruebatecnica-sherpa-production.up.railway.app/login',
    api: 'https://backend-production-9d875.up.railway.app/api/cipher/challenge'
  },

  // Credenciales del monje
  credentials: {
    email: 'monje@sherpa.local',
    password: 'cript@123'
  },

  // Configuración del navegador
  browser: {
    headless: false,
    slowMo: 1000,
    timeout: 30000
  },

  // Orden cronológico de los siglos según la profecía
  siglos: {
    primeros: ['XIV', 'XV', 'XVI'],
    arcanos: ['XVII', 'XVIII']
  },

  // Configuración de descargas
  downloads: {
    path: '../data/pdfs',
    filename: 'manuscrito-siglo-{siglo}.pdf'
  },

  // Selectores CSS robustos
  selectors: {
    email: 'input[name="email"], input[type="email"], #email',
    password: 'input[name="password"], input[type="password"], #password',
    submit: 'button[type="submit"], input[type="submit"], .btn-primary, .login-btn',
    manuscriptBox: '.border, .rounded-md',
    downloadButton: 'button:has-text("Descargar PDF")',
    unlockButton: 'button:has-text("Desbloquear")',
    unlockInput: 'input[type="text"]',
    documentationButton: 'button:has-text("Ver Documentación")',
    modal: 'div[role="dialog"], .modal, .MuiDialog-root',
    closeButton: 'button:has-text("Cerrar"), button[aria-label="Close"], button:has-text("×")',
    title: 'h3.font-medium'
  },

  // Configuración de timeouts
  timeouts: {
    element: 10000,
    navigation: 30000,
    download: 10000,
    modal: 5000
  },

  // Mensajes del sistema
  messages: {
    inicio: '---- Invocando el portal de los manuscritos sagrados ----',
    autenticacion: '---- Iniciando el ritual de autenticación ----',
    primerosPergaminos: '---- Descifrando los primeros pergaminos ----',
    segundaDimension: '---- Cruzando el umbral hacia la Segunda Dimensión ----',
    guardianesArcanos: '---- Enfrentando a los últimos guardianes arcanos ----',
    victoria: '**** ¡Has conquistado la cripta digital y desvelado todos sus secretos! ****',
    cierre: '---- El portal ha sido sellado. ----'
  },

  // Configuración de regex para extracción de códigos
  regex: {
    codigo: /(c.{0,5}digo|clave|contrase.{0,3}a|palabra sagrada)[^\n:]{0,30}(secreto|acceso|final)?[^\n:]{0,30}:?\s*([A-Z0-9]{6,})/i
  }
}; 