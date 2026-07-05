const https = require('https');

https.get('https://furgolero.vercel.app/', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const match = data.match(/src="(\/assets\/index-[^"]+\.js)"/);
    if (match) {
      console.log('Found JS:', match[1]);
      https.get('https://furgolero.vercel.app' + match[1], (res2) => {
        let jsData = '';
        res2.on('data', chunk => jsData += chunk);
        res2.on('end', () => {
          console.log('JS Size:', jsData.length);
          console.log('Has Kounde?', jsData.includes('Koundé'));
          console.log('Has SofaScore?', jsData.includes('sofascore.com'));
          console.log('Has test_penaltis?', jsData.includes('test_penaltis'));
          console.log('Has shop?', jsData.includes('Abre sobres'));
        });
      });
    } else {
      console.log('No JS found in HTML');
    }
  });
});
