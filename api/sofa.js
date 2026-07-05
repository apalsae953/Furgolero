export default async function handler(req, res) {
  const { path, ...queryParams } = req.query;
  
  if (!path) {
    return res.status(400).json({ error: 'Missing path' });
  }

  // Construimos la URL destino en SofaScore
  let url = `https://api.sofascore.com/api/v1/${path}`;
  
  // Reconstruimos la query string original (ej: ?q=Kounde)
  const qs = new URLSearchParams(queryParams).toString().replace(/\+/g, '%20');
  if (qs) {
    url += `?${qs}`;
  }

  try {
    // Hacemos la peticin a SofaScore enmascarando nuestra identidad como si furamos su web
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Referer': 'https://www.sofascore.com/',
        'Origin': 'https://www.sofascore.com',
        'Cache-Control': 'no-cache'
      }
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: `SofaScore devolvi error ${response.status}` });
    }

    const data = await response.json();
    
    // Devolvemos el resultado al cliente con cabeceras CORS permisivas
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 's-maxage=86400'); // Cach en el Edge de Vercel por 1 da
    res.status(200).json(data);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
