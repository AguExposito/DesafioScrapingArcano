const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');

// Hechizo de extracción del código secreto de un manuscrito
async function extractCodeFromPDF(siglo = 'XIV') {
  console.log(`---- Buscando el código oculto en el manuscrito del siglo ${siglo} ----`);

  const filePath = path.resolve(__dirname, `../data/pdfs/manuscrito-siglo-${siglo}.pdf`);//Crear la ruta del archivo
  const buffer = fs.readFileSync(filePath);//Leer el archivo

  // Intentar extraer texto con magia arcana (pdf-parse)
  let text = '';
  try {
    const data = await pdfParse(buffer);//Extraer el texto del PDF
    text = data.text;//Guardar el texto
  } catch (err) {
    // Si falla, intentar con runas antiguas (binario)
    text = buffer.toString('latin1');//Convertir el buffer a texto
  }

  // Invocar el conjuro de búsqueda flexible
  const regex = /(c.{0,5}digo|clave|contrase.{0,3}a|palabra sagrada)[^\n:]{0,30}(secreto|acceso|final)?[^\n:]{0,30}:?\s*([A-Z0-9]{6,})/i;
  const match = text.match(regex);//Buscar el código secreto

  if (match) {
    const code = match[3].trim();//Extraer el código secreto
    console.log(`**** Código secreto hallado: ${code} ****`);
    return code;
  } else {
    // Si el código no aparece, dejar constancia para el próximo mago
    const txtPath = filePath.replace(/\.pdf$/, '.txt');//Crear la ruta del archivo
    fs.writeFileSync(txtPath, text, 'utf8');//Guardar el texto
    throw new Error('No se pudo encontrar el código secreto en el manuscrito. Consulta el archivo .txt generado.');
  }
}

module.exports = extractCodeFromPDF;
