// Ritual de acceso a la Segunda Dimensión
async function navegarAlPortal(page) {
    console.log('---- Verificando el umbral de la Segunda Dimensión ----');

    // Filtrar por siglo XVII y verificar
    await page.selectOption('select', 'XVII'); //Seleccionar siglo XVII
    await page.waitForTimeout(1000); //Esperar 1 segundo
    const siglo17 = await page.locator('text=Siglo XVII').count();
    if (siglo17 === 0) {
      throw new Error('No se encontró el manuscrito del siglo XVII tras filtrar.');
    }
    console.log('Manuscrito del siglo XVII visible.');

    // Filtrar por siglo XVIII y verificar
    await page.selectOption('select', 'XVIII'); //Seleccionar siglo XVIII
    await page.waitForTimeout(1000); //Esperar 1 segundo
    const siglo18 = await page.locator('text=Siglo XVIII').count();
    if (siglo18 === 0) {
      throw new Error('No se encontró el manuscrito del siglo XVIII tras filtrar.');
    }
    console.log('Manuscrito del siglo XVIII visible.');
    
    console.log('---- El portal a la Segunda Dimensión está abierto ----');
}

module.exports = navegarAlPortal;
  