// ./apps/client/src/utils/qrcode.ts
import QRCode from 'qrcode';

/**
 * Utility tool untuk generate QR Code sebagai Data URL (Base64 Image String)
 * Sangat berguna untuk dikirim via JSON API ke frontend
 */
export async function generateQrCodeDataUrl(text: string): Promise<string> {
  try {
    const dataUrl = await QRCode.toDataURL(text, {
      errorCorrectionLevel: 'M',
      type: 'image/png',
      margin: 2,
      width: 300,
      color: {
        dark: '#000000',  // Warna titik
        light: '#ffffff', // Warna background
      },
    });
    return dataUrl;
  } catch (err) {
    console.error('Failed to generate QR Code:', err);
    throw new Error('Gagal membuat QR Code');
  }
}