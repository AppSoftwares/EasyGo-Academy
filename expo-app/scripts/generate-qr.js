const QRCode = require('qrcode');
const fs = require('fs');
const url = 'exp://192.168.1.102:8082';
const output = 'expo-qr.png';

QRCode.toFile(output, url, { type: 'png', width: 512 }, function (err) {
  if (err) {
    console.error('Error generating QR:', err);
    process.exit(1);
  }
  console.log('QR image generated at', output);
});
