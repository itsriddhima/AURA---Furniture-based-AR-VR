/**
 * AURA Local Storage Utility using browser IndexedDB.
 * Stores room images (large Blobs / Data URLs) and scene placement metadata locally.
 * No data is transmitted to external servers.
 */

const DB_NAME = 'aura_room_planner_db';
const DB_VERSION = 2;
const SCENE_STORE = 'scenes';
const IMAGE_STORE = 'room_images';
const CUTOUT_STORE = 'cutout_cache';
const ACTIVE_SCENE_KEY = 'active_scene';
const ACTIVE_IMAGE_KEY = 'current_room_image';

function openDatabase() {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB is not supported in this browser.'));
      return;
    }

    try {
      const request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(SCENE_STORE)) {
          db.createObjectStore(SCENE_STORE, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(IMAGE_STORE)) {
          db.createObjectStore(IMAGE_STORE, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(CUTOUT_STORE)) {
          db.createObjectStore(CUTOUT_STORE, { keyPath: 'key' });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error('Failed to open IndexedDB'));
      request.onblocked = () => reject(new Error('IndexedDB open blocked'));
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Save scene placement metadata (placed furniture items, settings, timestamp)
 */
export async function saveSceneData(sceneData) {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(SCENE_STORE, 'readwrite');
      const store = tx.objectStore(SCENE_STORE);
      const record = {
        id: ACTIVE_SCENE_KEY,
        ...sceneData,
        savedAt: Date.now(),
      };
      const req = store.put(record);
      req.onsuccess = () => resolve(true);
      req.onerror = () => reject(req.error || new Error('Failed to save scene'));
      tx.onabort = () => reject(tx.error || new Error('Transaction aborted'));
    });
  } catch (err) {
    console.warn('AURA Storage: saveSceneData warning:', err);
    return false;
  }
}

/**
 * Load saved scene placement metadata
 */
export async function loadSceneData() {
  try {
    const db = await openDatabase();
    return new Promise((resolve) => {
      const tx = db.transaction(SCENE_STORE, 'readonly');
      const store = tx.objectStore(SCENE_STORE);
      const req = store.get(ACTIVE_SCENE_KEY);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => resolve(null);
      tx.onabort = () => resolve(null);
    });
  } catch (err) {
    console.warn('AURA Storage: loadSceneData warning:', err);
    return null;
  }
}

/**
 * Save room background image (data URL or Blob)
 */
export async function saveRoomImageRecord(imageRecord) {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(IMAGE_STORE, 'readwrite');
      const store = tx.objectStore(IMAGE_STORE);
      const record = {
        id: ACTIVE_IMAGE_KEY,
        ...imageRecord,
        savedAt: Date.now(),
      };
      const req = store.put(record);
      req.onsuccess = () => resolve(true);
      req.onerror = () => reject(req.error || new Error('Failed to save room image'));
      tx.onabort = () => reject(tx.error || new Error('Transaction aborted'));
    });
  } catch (err) {
    console.warn('AURA Storage: saveRoomImageRecord warning:', err);
    return false;
  }
}

/**
 * Load room background image
 */
export async function loadRoomImageRecord() {
  try {
    const db = await openDatabase();
    return new Promise((resolve) => {
      const tx = db.transaction(IMAGE_STORE, 'readonly');
      const store = tx.objectStore(IMAGE_STORE);
      const req = store.get(ACTIVE_IMAGE_KEY);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => resolve(null);
      tx.onabort = () => resolve(null);
    });
  } catch (err) {
    console.warn('AURA Storage: loadRoomImageRecord warning:', err);
    return null;
  }
}

/**
 * Clear the current room design from browser storage
 */
export async function clearCurrentDesign() {
  try {
    const db = await openDatabase();
    return new Promise((resolve) => {
      const tx = db.transaction([SCENE_STORE, IMAGE_STORE], 'readwrite');
      tx.objectStore(SCENE_STORE).delete(ACTIVE_SCENE_KEY);
      tx.objectStore(IMAGE_STORE).delete(ACTIVE_IMAGE_KEY);
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => resolve(false);
      tx.onabort = () => resolve(false);
    });
  } catch (err) {
    console.warn('AURA Storage: clearCurrentDesign warning:', err);
    return false;
  }
}

/**
 * Get cached cutout transparent image by key (e.g. productId or image URL)
 */
export async function getCachedCutout(key) {
  try {
    const db = await openDatabase();
    return new Promise((resolve) => {
      const tx = db.transaction(CUTOUT_STORE, 'readonly');
      const store = tx.objectStore(CUTOUT_STORE);
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result ? req.result.dataUrl : null);
      req.onerror = () => resolve(null);
      tx.onabort = () => resolve(null);
    });
  } catch (err) {
    console.warn('AURA Storage: getCachedCutout warning:', err);
    return null;
  }
}

/**
 * Save cached cutout transparent image dataUrl by key
 */
export async function saveCachedCutout(key, dataUrl) {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(CUTOUT_STORE, 'readwrite');
      const store = tx.objectStore(CUTOUT_STORE);
      const record = {
        key,
        dataUrl,
        savedAt: Date.now(),
      };
      const req = store.put(record);
      req.onsuccess = () => resolve(true);
      req.onerror = () => reject(req.error || new Error('Failed to cache cutout'));
      tx.onabort = () => reject(tx.error || new Error('Transaction aborted'));
    });
  } catch (err) {
    console.warn('AURA Storage: saveCachedCutout warning:', err);
    return false;
  }
}

/**
 * Clear cached cutouts
 */
export async function clearCutoutCache() {
  try {
    const db = await openDatabase();
    return new Promise((resolve) => {
      const tx = db.transaction(CUTOUT_STORE, 'readwrite');
      tx.objectStore(CUTOUT_STORE).clear();
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => resolve(false);
      tx.onabort = () => resolve(false);
    });
  } catch (err) {
    console.warn('AURA Storage: clearCutoutCache warning:', err);
    return false;
  }
}
