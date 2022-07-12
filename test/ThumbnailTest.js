import imageToBase64 from '../lib/ImageToBase64.js';

try {
  const data = await imageToBase64('https://img.ridicdn.net/cover/1458006067/xxlarge#1');
  console.log(data);
} catch (err) {
  console.error(err.message);
}
