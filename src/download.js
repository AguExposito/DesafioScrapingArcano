const fs = require('fs');
const path = require('path');
const extractCodeFromPDF = require('./extract');

// Ritual de descarga y desbloqueo de manuscritos sagrados
async function downloadAndUnlockManuscripts(page) {
  const siglos = ['XIV', 'XV', 'XVI']; // Orden cronológico según la profecía
  const codes = {};

  console.log('---- Iniciando la conquista de los primeros pergaminos ----');

  for (let i = 0; i < siglos.length; i++) {
    const siglo = siglos[i];
    console.log(`\n---- Invocando manuscrito del siglo ${siglo} ----`);

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

      // Si no es el primero, desbloquear con el código anterior
      if (i > 0) {
        console.log(`Aplicando el código secreto del siglo anterior para desbloquear ${siglo}...`);
        
        const input = await box.locator('input[type="text"]');
        const unlockBtn = await box.locator('button:has-text("Desbloquear")');
        
        if (await input.count() === 0 || await unlockBtn.count() === 0) {
          throw new Error(`No se encontró el ritual de desbloqueo para el siglo ${siglo}`);
        }
        
        const prevCode = codes[siglos[i-1]];
        console.log(`Código secreto aplicado: ${prevCode}`);
        
        await input.fill(prevCode);
        await unlockBtn.click();
        
        // Esperar a que aparezca el botón de descarga tras el desbloqueo
        await box.locator('button:has-text("Descargar PDF")').waitFor({ timeout: 10000 });
        console.log('Manuscrito desbloqueado exitosamente.');
      }

      // Descargar el PDF con manejo robusto de errores
      const downloadPath = path.resolve(__dirname, '../data/pdfs');
      if (!fs.existsSync(downloadPath)) {
        fs.mkdirSync(downloadPath, { recursive: true });
        console.log('Cripta de descargas creada.');
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

      // Extraer el código secreto con manejo de errores
      console.log(`Analizando el contenido del manuscrito del siglo ${siglo}...`);
      try {
        const code = await extractCodeFromPDF(siglo);
        codes[siglo] = code;
        console.log(`Código secreto del siglo ${siglo} extraído: ${code}`);
      } catch (err) {
        console.error(`Error al extraer código del siglo ${siglo}:`, err.message);
        throw err;
      }
      
    } catch (error) {
      console.error(`Error en el proceso del siglo ${siglo}:`, error.message);
      throw error;
    }
  }
  
  console.log('---- Conquista de los primeros pergaminos completada ----');
  return codes;
}

module.exports = downloadAndUnlockManuscripts;
