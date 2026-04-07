// src/js/utils/storage.js

/**
 * Storage Utility
 * Wrapper for localStorage with JSON support and error handling
 */

const STORAGE_PREFIX = 'el_royale_';

export class Storage {
  /**
   * Save data to localStorage
   * @param {string} key - Storage key
   * @param {*} value - Value to store (will be JSON stringified)
   * @returns {boolean} - Success status
   */
  static set(key, value) {
    try {
      const prefixedKey = STORAGE_PREFIX + key;
      const serialized = JSON.stringify(value);
      localStorage.setItem(prefixedKey, serialized);
      return true;
    } catch (error) {
      console.error('Storage.set error:', error);
      return false;
    }
  }

  /**
   * Get data from localStorage
   * @param {string} key - Storage key
   * @param {*} defaultValue - Default value if key doesn't exist
   * @returns {*} - Parsed value or default value
   */
  static get(key, defaultValue = null) {
    try {
      const prefixedKey = STORAGE_PREFIX + key;
      const item = localStorage.getItem(prefixedKey);
      
      if (item === null) {
        return defaultValue;
      }
      
      return JSON.parse(item);
    } catch (error) {
      console.error('Storage.get error:', error);
      return defaultValue;
    }
  }

  /**
   * Remove item from localStorage
   * @param {string} key - Storage key
   * @returns {boolean} - Success status
   */
  static remove(key) {
    try {
      const prefixedKey = STORAGE_PREFIX + key;
      localStorage.removeItem(prefixedKey);
      return true;
    } catch (error) {
      console.error('Storage.remove error:', error);
      return false;
    }
  }

  /**
   * Clear all app data from localStorage
   * @returns {boolean} - Success status
   */
  static clear() {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(STORAGE_PREFIX)) {
          localStorage.removeItem(key);
        }
      });
      return true;
    } catch (error) {
      console.error('Storage.clear error:', error);
      return false;
    }
  }

  /**
   * Check if key exists
   * @param {string} key - Storage key
   * @returns {boolean}
   */
  static has(key) {
    const prefixedKey = STORAGE_PREFIX + key;
    return localStorage.getItem(prefixedKey) !== null;
  }

  /**
   * Get all keys with prefix
   * @returns {string[]}
   */
  static keys() {
    const keys = Object.keys(localStorage);
    return keys
      .filter(key => key.startsWith(STORAGE_PREFIX))
      .map(key => key.replace(STORAGE_PREFIX, ''));
  }

  /**
   * Get storage size in bytes
   * @returns {number}
   */
  static size() {
    let total = 0;
    const keys = Object.keys(localStorage);
    
    keys.forEach(key => {
      if (key.startsWith(STORAGE_PREFIX)) {
        const item = localStorage.getItem(key);
        total += key.length + (item ? item.length : 0);
      }
    });
    
    return total;
  }

  /**
   * Update existing value (merge objects or replace primitives)
   * @param {string} key - Storage key
   * @param {*} updates - Updates to apply
   * @returns {boolean} - Success status
   */
  static update(key, updates) {
    try {
      const current = this.get(key);
      
      if (current && typeof current === 'object' && !Array.isArray(current)) {
        // Merge objects
        const merged = { ...current, ...updates };
        return this.set(key, merged);
      } else {
        // Replace primitives and arrays
        return this.set(key, updates);
      }
    } catch (error) {
      console.error('Storage.update error:', error);
      return false;
    }
  }

  /**
   * Increment numeric value
   * @param {string} key - Storage key
   * @param {number} amount - Amount to increment (default: 1)
   * @returns {number} - New value
   */
  static increment(key, amount = 1) {
    const current = this.get(key, 0);
    const newValue = Number(current) + amount;
    this.set(key, newValue);
    return newValue;
  }

  /**
   * Push item to array
   * @param {string} key - Storage key
   * @param {*} item - Item to push
   * @returns {Array} - Updated array
   */
  static push(key, item) {
    const array = this.get(key, []);
    
    if (!Array.isArray(array)) {
      console.warn(`Storage.push: ${key} is not an array`);
      return [];
    }
    
    array.push(item);
    this.set(key, array);
    return array;
  }

  /**
   * Remove item from array
   * @param {string} key - Storage key
   * @param {*} item - Item to remove
   * @returns {Array} - Updated array
   */
  static pull(key, item) {
    const array = this.get(key, []);
    
    if (!Array.isArray(array)) {
      console.warn(`Storage.pull: ${key} is not an array`);
      return [];
    }
    
    const filtered = array.filter(i => i !== item);
    this.set(key, filtered);
    return filtered;
  }

  /**
   * Toggle item in array (add if not present, remove if present)
   * @param {string} key - Storage key
   * @param {*} item - Item to toggle
   * @returns {Array} - Updated array
   */
  static toggle(key, item) {
    const array = this.get(key, []);
    
    if (!Array.isArray(array)) {
      console.warn(`Storage.toggle: ${key} is not an array`);
      return [];
    }
    
    const index = array.indexOf(item);
    
    if (index === -1) {
      array.push(item);
    } else {
      array.splice(index, 1);
    }
    
    this.set(key, array);
    return array;
  }
}

/**
 * Progress Tracker - Specialized storage for user progress
 */
export class ProgressTracker {
  static PROGRESS_KEY = 'user_progress';
  static API = process.env.NODE_ENV === 'production'
  ? 'https://el-royale-api.onrender.com/api'
  : 'http://localhost:5000/api';

  static getToken() {
    return localStorage.getItem('studentToken');
  }

  static authFetch(url, options = {}) {
    return fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.getToken()}`,
        ...options.headers
      }
    });
  }

  /**
   * Get progress from API, fallback to LocalStorage
   */
  static async getProgress() {
  try {
    const res = await this.authFetch(`${this.API}/progress/mine`);

    // 🔧 Handle 401/403 properly
    if (res.status === 401 || res.status === 403) {
      console.warn('Token invalid or expired, logging out...');
      localStorage.removeItem('studentToken');
      localStorage.removeItem('studentUser');
      window.location.href = 'login.html';
      return;
    }

    const data = await res.json();
    const completedChallenges = data
      .filter(p => p.completed)
      .map(p => p.challengeId.toString());

    const progress = {
      completedChallenges,
      totalStars: completedChallenges.length,
      lastVisit: new Date().toISOString()
    };

    Storage.set(this.PROGRESS_KEY, progress);
    return progress;

  } catch (err) {
    console.warn('API unavailable, using LocalStorage fallback');
    return Storage.get(this.PROGRESS_KEY, {
      completedChallenges: [],
      totalStars: 0,
      lastVisit: null
    });
  }
}

  /**
   * Mark challenge as completed — saves to API + LocalStorage
   */
static async completeChallenge(challengeId, challengeTitle = '', category = '') {
  // 🔍 Debug
  console.log('Token in ProgressTracker:', this.getToken());
  
  try {
    const res = await this.authFetch(`${this.API}/progress`, {
      method: 'POST',
      body: JSON.stringify({
        challengeId,
        challengeTitle,
        category,
        completed: true
      })
    });

    // 🔍 Debug
    console.log('Progress POST status:', res.status);
    const data = await res.json();
    console.log('Progress POST response:', data);

  } catch (err) {
    console.warn('Could not save progress to API:', err);
  }

    // Always update LocalStorage too
    const progress = Storage.get(this.PROGRESS_KEY, {
      completedChallenges: [],
      totalStars: 0,
      lastVisit: null
    });

    if (!progress.completedChallenges.includes(challengeId)) {
      progress.completedChallenges.push(challengeId);
      progress.totalStars++;
    }

    progress.lastVisit = new Date().toISOString();
    Storage.set(this.PROGRESS_KEY, progress);
    return progress;
  }

  /**
   * Get completed challenges (from LocalStorage for sync use)
   */
  static getCompletedChallenges() {
    const progress = Storage.get(this.PROGRESS_KEY, {
      completedChallenges: [],
      totalStars: 0
    });
    return progress.completedChallenges;
  }

  /**
   * Get completed challenges for a module
   */
  static getModuleProgress(moduleId) {
    const completed = this.getCompletedChallenges();
    return completed.filter(id => id.startsWith(moduleId));
  }

  /**
   * Get total stars
   */
  static getTotalStars() {
    const progress = Storage.get(this.PROGRESS_KEY, { totalStars: 0 });
    return progress.totalStars;
  }

  /**
   * Reset progress
   */
  static reset() {
    return Storage.remove(this.PROGRESS_KEY);
  }
}

/**
 * Auth Helper - manage student session
 */
export class Auth {
  static getToken() {
    return localStorage.getItem('studentToken');
  }

  static getUser() {
    const user = localStorage.getItem('studentUser');
    return user ? JSON.parse(user) : null;
  }

  static isLoggedIn() {
    return !!this.getToken();
  }

  // Clears everything including progress
  static logout() {
    localStorage.removeItem('studentToken');
    localStorage.removeItem('studentUser');
    Storage.clear(); // clears all el_royale_ prefixed keys including progress
    window.location.href = 'login.html';
  }
}

export default Storage;