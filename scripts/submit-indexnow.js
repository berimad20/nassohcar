// script to submit urls to IndexNow (Bing)
const fetch = require('node-fetch');

const KEY = 'a599bf3dbd75444488d556a0d7f4be3c';
const HOST = 'nassohcar.com'; // Adjust to your actual domain
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;

// You can add more URLs here, including blog posts, fleet pages, etc.
const URL_LIST = [
  `https://${HOST}/`,
  `https://${HOST}/en`,
  `https://${HOST}/es`,
  `https://${HOST}/fleet`,
  `https://${HOST}/en/fleet`,
  `https://${HOST}/es/flota`,
  `https://${HOST}/contact`,
  `https://${HOST}/en/contact`,
  `https://${HOST}/es/contacto`,
  `https://${HOST}/faq`,
  `https://${HOST}/en/faq`,
  `https://${HOST}/es/faq`,
  `https://${HOST}/car-rental-tangier`,
  `https://${HOST}/en/car-rental-tangier`,
  `https://${HOST}/es/alquiler-coches-tanger`,
  `https://${HOST}/car-rental-tangier-airport`,
  `https://${HOST}/en/car-rental-tangier-airport`,
  `https://${HOST}/es/alquiler-coches-aeropuerto-tanger`,
];

async function submitToIndexNow() {
  console.log(`Submitting ${URL_LIST.length} URLs to IndexNow...`);
  
  try {
    const response = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({
        host: HOST,
        key: KEY,
        keyLocation: KEY_LOCATION,
        urlList: URL_LIST
      })
    });

    console.log(`Response Status: ${response.status} ${response.statusText}`);
    
    if (response.status === 200) {
      console.log('✅ URLs submitted successfully to IndexNow!');
    } else {
      const data = await response.text();
      console.error('❌ Failed to submit URLs:', data);
    }
  } catch (error) {
    console.error('Error submitting to IndexNow:', error);
  }
}

submitToIndexNow();
