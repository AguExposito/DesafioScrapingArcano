const { chromium } = require('playwright');

// Ritual de autenticación en la cripta sagrada
async function login() {
  console.log('---- Iniciando el ritual de autenticación ----');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1000 // Tiempo de espera entre acciones para estabilidad
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Navegar a la cripta sagrada
    console.log('Navegando hacia el portal de los manuscritos...');
    await page.goto('https://pruebatecnica-sherpa-production.up.railway.app/login');
    await page.waitForLoadState('networkidle');

    // Buscar y llenar el campo de email con selectores robustos
    const emailInput = await page.waitForSelector('input[name="email"], input[type="email"], #email', { timeout: 10000 });
    await emailInput.fill('monje@sherpa.local');
    console.log('Credenciales del monje ingresadas.');

    // Buscar y llenar el campo de contraseña
    const passwordInput = await page.waitForSelector('input[name="password"], input[type="password"], #password', { timeout: 10000 });
    await passwordInput.fill('cript@123');
    console.log('Hechizo de acceso invocado.');

    // Buscar y hacer click en el botón de submit con múltiples selectores
    const submitButton = await page.waitForSelector('button[type="submit"], input[type="submit"], .btn-primary, .login-btn', { timeout: 10000 });
    await submitButton.click();
    console.log('Ritual de autenticación completado.');
    
    // Esperar a que la URL cambie y ya no contenga '/login'
    console.log('Esperando la apertura del portal...');
    await page.waitForFunction(() => !window.location.pathname.includes('/login'), null, { timeout: 30000 });

    const currentUrl = page.url();
    console.log(`---- Portal accedido: ${currentUrl} ----`);

    return { browser, context, page };
    
  } catch (error) {
    console.error('Ritual de autenticación fallido:', error.message);
    try {
      await page.screenshot({ path: 'error-auth-screenshot.png' });
      console.log('Evidencia del fallo guardada como error-auth-screenshot.png');
    } catch (screenshotError) {
      console.log('No se pudo capturar evidencia del error');
    }
    throw error;
  }
}

module.exports = login;
