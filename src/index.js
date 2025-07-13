// El Gran Ritual de la Cripta Arcana
const login = require('./auth');
const downloadAndUnlockManuscripts = require('./download');
const navegarAlPortal = require('./portal');
const segundaDimension = require('./segundaDimension');

(async () => {
    let browser = null;
    try {
        console.log('---- Invocando el portal de los manuscritos sagrados ----');
        const result = await login();//Iniciar sesión
        browser = result.browser;
        const { page } = result;//Extraer la página

        console.log('\n---- Descifrando los primeros pergaminos ----');
        const codes = await downloadAndUnlockManuscripts(page);//Descargar y desbloquear los manuscritos
        console.log('Códigos secretos obtenidos:', codes);

        console.log('\n---- Cruzando el umbral hacia la Segunda Dimensión ----');
        await navegarAlPortal(page);//Navegar al portal

        console.log('\n---- Enfrentando a los últimos guardianes arcanos ----');
        await segundaDimension(page, codes['XVI']);//Enfrentar a los últimos guardianes arcanos

        console.log('\n**** ¡Has conquistado la cripta digital y desvelado todos sus secretos! ****');
    } catch (error) {
        console.error('Ritual interrumpido:', error.message);
        process.exit(1);//Salir del proceso
    } finally {
        if (browser) {
            await browser.close();//Cerrar el navegador
            console.log('---- El portal ha sido sellado. ----');
        }
    }
})();