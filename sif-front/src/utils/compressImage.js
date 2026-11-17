import imageCompression from 'browser-image-compression';

export async function compressImage(file) {
  const options = {
    maxSizeMB: 0.5,
    maxWidthOrHeight: 1280,
    useWebWorker: true,
  };
  try {
    return await imageCompression(file, options);
  } catch (e) {
    console.error('Ошибка сжатия:', e);
    return file;
  }
}