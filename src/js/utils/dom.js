/**
 * DOM Utility Functions
 * Helper functions for common DOM operations
 */

/**
 * Get element by ID
 * @param {string} id - Element ID
 * @returns {HTMLElement|null}
 */
export function getElement(id) {
  return document.getElementById(id);
}

/**
 * Get elements by selector
 * @param {string} selector - CSS selector
 * @param {HTMLElement} parent - Parent element (default: document)
 * @returns {NodeList}
 */
export function getElements(selector, parent = document) {
  return parent.querySelectorAll(selector);
}

/**
 * Get single element by selector
 * @param {string} selector - CSS selector
 * @param {HTMLElement} parent - Parent element (default: document)
 * @returns {HTMLElement|null}
 */
export function getOne(selector, parent = document) {
  return parent.querySelector(selector);
}

/**
 * Add class to element
 * @param {HTMLElement} element
 * @param {string} className
 */
export function addClass(element, className) {
  if (!element) return;
  element.classList.add(className);
}

/**
 * Remove class from element
 * @param {HTMLElement} element
 * @param {string} className
 */
export function removeClass(element, className) {
  if (!element) return;
  element.classList.remove(className);
}

/**
 * Toggle class on element
 * @param {HTMLElement} element
 * @param {string} className
 */
export function toggleClass(element, className) {
  if (!element) return;
  element.classList.toggle(className);
}

/**
 * Check if element has class
 * @param {HTMLElement} element
 * @param {string} className
 * @returns {boolean}
 */
export function hasClass(element, className) {
  if (!element) return false;
  return element.classList.contains(className);
}

/**
 * Set element text content
 * @param {HTMLElement} element
 * @param {string} text
 */
export function setText(element, text) {
  if (!element) return;
  element.textContent = text;
}

/**
 * Set element HTML content
 * @param {HTMLElement} element
 * @param {string} html
 */
export function setHTML(element, html) {
  if (!element) return;
  element.innerHTML = html;
}

/**
 * Get element value (for inputs)
 * @param {HTMLElement} element
 * @returns {string}
 */
export function getValue(element) {
  if (!element) return '';
  return element.value || '';
}

/**
 * Set element value (for inputs)
 * @param {HTMLElement} element
 * @param {string} value
 */
export function setValue(element, value) {
  if (!element) return;
  element.value = value;
}

/**
 * Show element (remove hidden class)
 * @param {HTMLElement} element
 */
export function show(element) {
  removeClass(element, 'hidden');
}

/**
 * Hide element (add hidden class)
 * @param {HTMLElement} element
 */
export function hide(element) {
  addClass(element, 'hidden');
}

/**
 * Toggle element visibility
 * @param {HTMLElement} element
 */
export function toggle(element) {
  toggleClass(element, 'hidden');
}

/**
 * Create new element
 * @param {string} tag - HTML tag name
 * @param {Object} options - Element options
 * @param {string} options.className - CSS class
 * @param {string} options.id - Element ID
 * @param {string} options.text - Text content
 * @param {string} options.html - HTML content
 * @param {Object} options.attrs - Additional attributes
 * @returns {HTMLElement}
 */
export function createElement(tag, options = {}) {
  const element = document.createElement(tag);
  
  if (options.className) {
    element.className = options.className;
  }
  
  if (options.id) {
    element.id = options.id;
  }
  
  if (options.text) {
    element.textContent = options.text;
  }
  
  if (options.html) {
    element.innerHTML = options.html;
  }
  
  if (options.attrs) {
    Object.entries(options.attrs).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
  }
  
  return element;
}

/**
 * Append element to parent
 * @param {HTMLElement} parent
 * @param {HTMLElement} child
 */
export function append(parent, child) {
  if (!parent || !child) return;
  parent.appendChild(child);
}

/**
 * Remove element from DOM
 * @param {HTMLElement} element
 */
export function remove(element) {
  if (!element || !element.parentNode) return;
  element.parentNode.removeChild(element);
}

/**
 * Add event listener
 * @param {HTMLElement} element
 * @param {string} event - Event name
 * @param {Function} handler - Event handler
 */
export function on(element, event, handler) {
  if (!element) return;
  element.addEventListener(event, handler);
}

/**
 * Remove event listener
 * @param {HTMLElement} element
 * @param {string} event - Event name
 * @param {Function} handler - Event handler
 */
export function off(element, event, handler) {
  if (!element) return;
  element.removeEventListener(event, handler);
}

/**
 * Delegate event listener
 * @param {HTMLElement} parent
 * @param {string} event
 * @param {string} selector
 * @param {Function} handler
 */
export function delegate(parent, event, selector, handler) {
  if (!parent) return;
  
  parent.addEventListener(event, (e) => {
    const target = e.target.closest(selector);
    if (target) {
      handler.call(target, e);
    }
  });
}

/**
 * Get data attribute
 * @param {HTMLElement} element
 * @param {string} key
 * @returns {string|null}
 */
export function getData(element, key) {
  if (!element) return null;
  return element.dataset[key] || null;
}

/**
 * Set data attribute
 * @param {HTMLElement} element
 * @param {string} key
 * @param {string} value
 */
export function setData(element, key, value) {
  if (!element) return;
  element.dataset[key] = value;
}

/**
 * Check if element is visible
 * @param {HTMLElement} element
 * @returns {boolean}
 */
export function isVisible(element) {
  if (!element) return false;
  return !hasClass(element, 'hidden') && 
         element.offsetParent !== null;
}

/**
 * Get computed style property
 * @param {HTMLElement} element
 * @param {string} property
 * @returns {string}
 */
export function getStyle(element, property) {
  if (!element) return '';
  return window.getComputedStyle(element)[property];
}

/**
 * Set inline style
 * @param {HTMLElement} element
 * @param {string} property
 * @param {string} value
 */
export function setStyle(element, property, value) {
  if (!element) return;
  element.style[property] = value;
}

/**
 * Animate element with CSS class
 * @param {HTMLElement} element
 * @param {string} animationClass
 * @param {number} duration - Duration in ms
 */
export function animate(element, animationClass, duration = 300) {
  if (!element) return Promise.resolve();
  
  return new Promise((resolve) => {
    addClass(element, animationClass);
    
    setTimeout(() => {
      removeClass(element, animationClass);
      resolve();
    }, duration);
  });
}

/**
 * Scroll to element
 * @param {HTMLElement} element
 * @param {Object} options - Scroll options
 */
export function scrollTo(element, options = {}) {
  if (!element) return;
  
  element.scrollIntoView({
    behavior: options.smooth ? 'smooth' : 'auto',
    block: options.block || 'start',
    inline: options.inline || 'nearest'
  });
}

/**
 * Debounce function - delays execution until after wait time
 * @param {Function} func - Function to debounce
 * @param {number} wait - Milliseconds to wait
 * @returns {Function} - Debounced function
 */
export function debounce(func, wait = 300) {
  let timeout;
  
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export default {
  getElement,
  getElements,
  getOne,
  addClass,
  removeClass,
  toggleClass,
  hasClass,
  setText,
  setHTML,
  getValue,
  setValue,
  show,
  hide,
  toggle,
  createElement,
  append,
  remove,
  on,
  off,
  delegate,
  getData,
  setData,
  isVisible,
  getStyle,
  setStyle,
  animate,
  scrollTo,
  debounce
};