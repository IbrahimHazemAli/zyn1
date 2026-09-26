// Client-side IndexedDB storage for large video and media files
// Prevents localStorage 5MB quota errors when uploading high-res videos

const DB_NAME = 'sanaria_media_db';
const DB_VERSION = 1;
const STORE_NAME = 'media_items';

let dbPromise = null;
const urlCache = new Map();

function openDB() {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      resolve(null);
      return;
    }

    try {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      };

      request.onsuccess = (event) => {
        resolve(event.target.result);
      };

      request.onerror = (event) => {
        console.warn('IndexedDB failed to open:', event.target.error);
        resolve(null);
      };
    } catch (e) {
      console.warn('IndexedDB error:', e);
      resolve(null);
    }
  });

  return dbPromise;
}

export async function saveMediaItem(id, blobOrFile, metadata = {}) {
  const db = await openDB();
  if (!db) return null;

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const record = {
        id,
        blob: blobOrFile,
        name: blobOrFile.name || metadata.name || 'video.mp4',
        type: blobOrFile.type || 'video/mp4',
        size: blobOrFile.size || 0,
        createdAt: Date.now(),
        ...metadata
      };
      const req = store.put(record);
      req.onsuccess = () => resolve(record);
      req.onerror = () => resolve(null);
    } catch (e) {
      console.warn('saveMediaItem failed:', e);
      resolve(null);
    }
  });
}

export async function getMediaItem(id) {
  const db = await openDB();
  if (!db) return null;

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(id);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => resolve(null);
    } catch (e) {
      resolve(null);
    }
  });
}

export async function deleteMediaItem(id) {
  const db = await openDB();
  if (!db) return false;

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(id);
      req.onsuccess = () => {
        if (urlCache.has(id)) {
          try {
            URL.revokeObjectURL(urlCache.get(id));
          } catch {}
          urlCache.delete(id);
        }
        resolve(true);
      };
      req.onerror = () => resolve(false);
    } catch (e) {
      resolve(false);
    }
  });
}

export async function resolveVideoUrl(url) {
  if (!url || typeof url !== 'string') return '';
  if (!url.startsWith('idb://')) return url;

  if (urlCache.has(url)) return urlCache.get(url);

  try {
    const item = await getMediaItem(url);
    if (item && item.blob) {
      const objectUrl = URL.createObjectURL(item.blob);
      urlCache.set(url, objectUrl);
      return objectUrl;
    }
  } catch (e) {
    console.warn('Error resolving video from IndexedDB:', e);
  }
  return '';
}

export async function storeUploadedVideoFile(file) {
  const id = `idb://video_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  await saveMediaItem(id, file, {
    name: file.name,
    size: file.size,
    type: file.type
  });

  const objectUrl = URL.createObjectURL(file);
  urlCache.set(id, objectUrl);

  return {
    id,
    previewUrl: objectUrl,
    name: file.name,
    size: file.size,
    type: file.type
  };
}
