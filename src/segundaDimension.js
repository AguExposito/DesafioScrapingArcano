const extractCodeFromPDF = require('./extract');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Ritual de los últimos guardianes arcanos
async function resolverDesafioAPI(bookTitle, unlockCode) {
  const endpoint = 'https://backend-production-9d875.up.railway.app/api/cipher/challenge';
  const params = { bookTitle, unlockCode };
  
  try {
    console.log(`Consultando al oráculo para el libro: ${bookTitle}`);
    const { data } = await axios.get(endpoint, { params });
    
    console.log('---- El oráculo ha respondido al desafío arcano ----');
    
    if (!data.challenge || !Array.isArray(data.challenge.vault) || !Array.isArray(data.challenge.targets)) {
      throw new Error('La respuesta del oráculo no tiene la estructura esperada.');
    }
    
    const { vault, targets } = data.challenge;
    console.log(`Implementando algoritmo de búsqueda binaria para ${targets.length} objetivos...`);
    
    let password = '';
    for (const target of targets) {
      if (target >= 0 && target < vault.length) {
        password += vault[target];
      } else {
        throw new Error(`Índice de búsqueda inválido: ${target}`);
      }
    }
    
    console.log(`Contraseña descifrada exitosamente: ${password}`);
    return password;
    
  } catch (error) {
    if (error.response) {
      console.error('Ritual interrumpido por el oráculo:', error.response.status);
      throw new Error(`Error ${error.response.status}: ${JSON.stringify(error.response.data)}`);
    }
    throw error;
  }
}

async function desbloquearYDescargar(page, siglo, codigoAnterior) {
  console.log(`\n---- Iniciando ritual para el siglo ${siglo} ----`);
  
  try {
    // Filtrar por siglo con tiempo de espera para estabilidad
    await page.selectOption('select', siglo);
    await page.waitForTimeout(1000);

    // Hallar la caja del manuscrito con selectores robustos
    const boxLocator = page.locator('.border, .rounded-md').filter({ hasText: `Siglo ${siglo}` });
    if (await boxLocator.count() === 0) {
      throw new Error(`No se encontró el manuscrito del siglo ${siglo} en la cripta`);
    }
    const box = boxLocator.first();

    // Manejar documentación si está disponible
    const docBtn = await box.locator('button:has-text("Ver Documentación")');
    if (await docBtn.count() > 0) {
      console.log('Abriendo documentación del manuscrito...');
      await docBtn.click();
      
      const modal = page.locator('div[role="dialog"], .modal, .MuiDialog-root');
      await modal.waitFor({ state: 'visible', timeout: 5000 });
      
      const closeBtn = modal.locator('button:has-text("Cerrar"), button[aria-label="Close"], button:has-text("×")');
      if (await closeBtn.count() > 0) {
        await closeBtn.click();
        await modal.waitFor({ state: 'detached', timeout: 2000 });
      } else {
        await page.keyboard.press('Escape');
        await page.waitForTimeout(500);
      }
      console.log('Documentación procesada.');
    }

    // Obtener el nombre real del manuscrito
    let titulo = await box.locator('h3.font-medium').first().textContent();
    titulo = (titulo || '').trim();
    
    if (!titulo) {
      throw new Error(`No se pudo obtener el título del manuscrito del siglo ${siglo}`);
    }
    
    console.log(`\n---- Invocando el desafío del libro: ${titulo} ----`);

    // Resolver el desafío de la API (solo si hay código anterior)
    let password;
    if (codigoAnterior) {
      password = await resolverDesafioAPI(titulo, codigoAnterior);
      console.log('Contraseña secreta descifrada por el oráculo.');
      
      if (!password) {
        throw new Error('La contraseña descifrada está vacía');
      }
    } else {
      console.log('**** ¡El cofre del tesoro digital se ha abierto! ¡Has completado el desafío arcano! ****');
      return null;
    }

    // Ingresar la contraseña y desbloquear
    console.log('Aplicando contraseña para desbloquear el manuscrito...');
    const input = await box.locator('input[type="text"]');
    const unlockBtn = await box.locator('button:has-text("Desbloquear")');
    
    if (await input.count() === 0 || await unlockBtn.count() === 0) {
      throw new Error(`No se encontró el ritual de desbloqueo para siglo ${siglo}`);
    }
    
    await input.fill(password);
    await unlockBtn.click();
    
    // Manejar modal de confirmación
    const confirmModalLocator = page.locator('div[role="dialog"], .modal, .MuiDialog-root');
    await confirmModalLocator.waitFor({ state: 'visible', timeout: 5000 });
    
    const closeBtn = confirmModalLocator.locator('button:has-text("Cerrar"), button[aria-label="Close"], button:has-text("×")');
    if (await closeBtn.count() > 0) {
      await closeBtn.click();
      await confirmModalLocator.waitFor({ state: 'detached', timeout: 2000 });
    } else {
      await page.keyboard.press('Escape');
      await page.waitForTimeout(500);
    }
    
    await box.locator('button:has-text("Descargar PDF")').waitFor({ timeout: 10000 });
    console.log('Manuscrito desbloqueado exitosamente.');

    // Descargar el PDF con manejo robusto
    const downloadPath = path.resolve(__dirname, '../data/pdfs');
    if (!fs.existsSync(downloadPath)) {
      fs.mkdirSync(downloadPath, { recursive: true });
    }
    
    const fileName = `manuscrito-siglo-${siglo}.pdf`;
    const savePath = path.join(downloadPath, fileName);
    
    if (fs.existsSync(savePath)) {
      console.log(`El PDF del siglo ${siglo} ya reposa en la cripta.`);
    } else {
      console.log(`Iniciando descarga del manuscrito del siglo ${siglo}...`);
      
      const downloadButton = await box.locator('button:has-text("Descargar PDF")').first();
      if (await downloadButton.count() === 0) {
        throw new Error(`No se encontró el botón de descarga para siglo ${siglo}`);
      }
      
      const [ download ] = await Promise.all([
        page.waitForEvent('download'),
        downloadButton.click()
      ]);
      
      await download.saveAs(savePath);
      console.log(`Manuscrito del siglo ${siglo} descargado exitosamente.`);
    }

    // Si es el manuscrito final, celebrar la victoria
    if (siglo === 'XVIII') {
      console.log('**** ¡El cofre del tesoro digital se ha abierto! ¡Has completado el desafío arcano! ****');
      return null;
    }

    // Extraer el código secreto del PDF descargado (solo para XVII)
    console.log(`Analizando el contenido del manuscrito del siglo ${siglo}...`);
    let code;
    try {
      code = await extractCodeFromPDF(siglo);
      console.log(`Código secreto del siglo ${siglo} extraído: ${code}`);
    } catch (err) {
      console.error(`Error al extraer código del siglo ${siglo}:`, err.message);
      throw err;
    }
    
    return code;
    
  } catch (error) {
    console.error(`Error en el proceso del siglo ${siglo}:`, error.message);
    throw error;
  }
}

async function segundaDimension(page, codigoXVI) {
  console.log('---- Iniciando el desafío de los manuscritos arcanos ----');
  
  try {
    const codigoXVII = await desbloquearYDescargar(page, 'XVII', codigoXVI);
    await desbloquearYDescargar(page, 'XVIII', codigoXVII);
    
    console.log('---- Desafío de los manuscritos arcanos completado ----');
  } catch (error) {
    console.error('Error en el desafío de los manuscritos arcanos:', error.message);
    throw error;
  }
}

module.exports = segundaDimension; 