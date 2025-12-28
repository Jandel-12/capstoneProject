// src/js/core/ChallengeEngine.js

/**
 * ChallengeEngine - Handles validation logic for all challenge types
 */
export class ChallengeEngine {
  constructor(challenge) {
    this.challenge = challenge;
  }

  /**
   * Main validation method - routes to correct validator
   * @param {string} code - User's code
   * @returns {Object} - {success: boolean, errors: string[]}
   */
  validate(code) {
    const challengeType = this.challenge.type || 'html';
    
    switch (challengeType) {
      case 'html':
        return this.validateHTML(code);
      case 'css':
        return this.validateCSS(code);
      case 'javascript':
        return this.validateJavaScript(code);
      default:
        return this.validateHTML(code);
    }
  }

  /**
   * Validate HTML challenges
   */
  validateHTML(code) {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(code, 'text/html');
      const errors = [];

      for (const check of this.challenge.validation) {
        const elements = doc.querySelectorAll(check.selector);

        // Check if element exists
        if (check.exists !== undefined) {
          if (check.exists && elements.length === 0) {
            errors.push(check.errorMsg);
            continue;
          }
          if (!check.exists && elements.length > 0) {
            errors.push(check.errorMsg);
            continue;
          }
        }

        // Check element count
        if (check.count !== undefined) {
          if (elements.length !== check.count) {
            errors.push(check.errorMsg);
            continue;
          }
        }

        // Check text content
        if (check.textContent !== undefined && elements.length > 0) {
          const element = elements[0];
          if (element.textContent.trim() !== check.textContent) {
            errors.push(check.errorMsg);
            continue;
          }
        }

        // Check attribute value
        if (check.attribute !== undefined && elements.length > 0) {
          const element = elements[0];
          const attrValue = element.getAttribute(check.attribute);
          if (attrValue !== check.value) {
            errors.push(check.errorMsg);
            continue;
          }
        }

        // Check if element has specific class
        if (check.hasClass !== undefined && elements.length > 0) {
          const element = elements[0];
          if (!element.classList.contains(check.hasClass)) {
            errors.push(check.errorMsg);
            continue;
          }
        }

        // Check parent-child relationship
        if (check.parent !== undefined && elements.length > 0) {
          const element = elements[0];
          const parent = element.parentElement;
          if (!parent || parent.tagName.toLowerCase() !== check.parent.toLowerCase()) {
            errors.push(check.errorMsg);
            continue;
          }
        }
      }

      return {
        success: errors.length === 0,
        errors: errors
      };
    } catch (e) {
      return {
        success: false,
        errors: ['Invalid HTML syntax. Check for unclosed tags or typos.']
      };
    }
  }

  /**
   * Validate CSS challenges
   */
  validateCSS(code) {
    try {
      // Create a temporary iframe to test CSS
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      document.body.appendChild(iframe);

      const doc = iframe.contentDocument || iframe.contentWindow.document;
      const win = iframe.contentWindow;
      
      // Parse the starter code to extract HTML and existing CSS
      const parser = new DOMParser();
      const parsedStarter = parser.parseFromString(this.challenge.starterCode, 'text/html');
      
      // Extract HTML body content (excluding style tags)
      const bodyContent = Array.from(parsedStarter.body.childNodes)
        .filter(node => node.nodeName !== 'STYLE' && node.nodeName !== 'SCRIPT')
        .map(node => node.outerHTML || node.textContent)
        .join('');
      
      // Extract existing styles from starter code
      const existingStyles = Array.from(parsedStarter.querySelectorAll('style'))
        .map(style => style.textContent)
        .join('\n');
      
      // Inject HTML body
      doc.body.innerHTML = bodyContent;
      
      // Inject existing styles first
      if (existingStyles) {
        const starterStyle = doc.createElement('style');
        starterStyle.textContent = existingStyles;
        doc.head.appendChild(starterStyle);
      }
      
      // Extract and inject user's CSS
      const userCSSMatch = code.match(/<style>([\s\S]*?)<\/style>/);
      const userCSS = userCSSMatch ? userCSSMatch[1] : code;
      
      // Inject user CSS with higher specificity
      const userStyle = doc.createElement('style');
      userStyle.textContent = userCSS;
      doc.head.appendChild(userStyle);

      const errors = [];

      // Check CSS validation rules
      for (const check of this.challenge.validation) {
        const elements = doc.querySelectorAll(check.selector);

        if (elements.length === 0) {
          errors.push(check.errorMsg || `Selector "${check.selector}" doesn't match any elements`);
          continue;
        }

        const element = elements[0];
        const computedStyle = win.getComputedStyle(element);

        // Check specific CSS property
        if (check.property !== undefined) {
          const actualValue = computedStyle[check.property];
          
          // Normalize values for comparison
          const normalizedActual = this.normalizeCSSValue(actualValue);
          const normalizedExpected = this.normalizeCSSValue(check.value);

          if (normalizedActual !== normalizedExpected) {
            errors.push(check.errorMsg || 
              `Property "${check.property}" should be "${check.value}" but got "${actualValue}"`);
          }
        }
      }

      // Cleanup
      document.body.removeChild(iframe);

      return {
        success: errors.length === 0,
        errors: errors
      };
    } catch (e) {
      return {
        success: false,
        errors: ['Invalid CSS syntax. Check for typos or missing semicolons.']
      };
    }
  }

  /**
   * Validate JavaScript challenges
   */
  validateJavaScript(code) {
    try {
      const errors = [];
      
      // Create isolated testing environment
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      document.body.appendChild(iframe);

      const doc = iframe.contentDocument || iframe.contentWindow.document;
      const win = iframe.contentWindow;
      
      // Parse starter code to extract HTML and script separately
      const parser = new DOMParser();
      const parsedStarter = parser.parseFromString(this.challenge.starterCode, 'text/html');
      
      // Extract HTML (excluding script tags)
      const bodyNodes = Array.from(parsedStarter.body.childNodes)
        .filter(node => node.nodeName !== 'SCRIPT');
      
      const htmlContent = bodyNodes
        .map(node => node.outerHTML || node.textContent)
        .join('');
      
      // Extract any styles from starter code
      const starterStyles = Array.from(parsedStarter.querySelectorAll('style'))
        .map(style => style.textContent)
        .join('\n');
      
      // Build complete HTML document
      const fullHTML = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            ${starterStyles ? `<style>${starterStyles}</style>` : ''}
          </head>
          <body>
            ${htmlContent}
          </body>
        </html>
      `;
      
      // Write complete document at once
      doc.open();
      doc.write(fullHTML);
      doc.close();
      
      // Wait a tick for DOM to be ready
      return new Promise((resolve) => {
        setTimeout(() => {
          try {
            // Extract user's JavaScript
            const userScriptMatch = code.match(/<script[^>]*>([\s\S]*?)<\/script>/i);
            const userScript = userScriptMatch ? userScriptMatch[1] : code;
            
            // Execute user's JavaScript in iframe context
            const scriptEl = doc.createElement('script');
            scriptEl.textContent = userScript;
            doc.body.appendChild(scriptEl);
            
            // Wait another tick for script execution
            setTimeout(() => {
              try {
                // Run validation checks
                for (const check of this.challenge.validation) {
                  if (check.type === 'elementExists') {
                    const element = doc.querySelector(check.selector);
                    if (!element) {
                      errors.push(check.errorMsg);
                    }
                  }

                  if (check.type === 'eventListener') {
                    const element = doc.querySelector(check.selector);
                    if (!element) {
                      errors.push(`Element "${check.selector}" not found`);
                      continue;
                    }

                    // Check if event listener is attached
                    // We'll test by checking if the element has any listeners
                    // Note: This is a simplified check
                    let hasListener = false;
                    
                    // Check for inline handler
                    if (element[`on${check.event}`]) {
                      hasListener = true;
                    }
                    
                    // Try to detect addEventListener
                    // Create a test flag in the element
                    let listenerDetected = false;
                    const testHandler = () => { listenerDetected = true; };
                    
                    // Dispatch event to see if any handler responds
                    const testEvent = new win.Event(check.event, { bubbles: true });
                    element.dispatchEvent(testEvent);
                    
                    // For validation, we'll just check if the element exists
                    // More robust: check if student used addEventListener in their code
                    const codeHasListener = userScript.includes('addEventListener') && 
                                           userScript.includes(check.event);
                    
                    if (!hasListener && !codeHasListener) {
                      errors.push(check.errorMsg);
                    }
                  }

                  if (check.type === 'domChange') {
                    const element = doc.querySelector(check.selector);
                    if (!element) {
                      errors.push(`Element "${check.selector}" not found`);
                      continue;
                    }

                    // Check if property matches expected value
                    if (check.property) {
                      let actualValue;
                      
                      // Check if it's a style property
                      if (check.property === 'textContent') {
                        actualValue = element.textContent.trim();
                      } else if (check.property.startsWith('style.')) {
                        const styleProp = check.property.replace('style.', '');
                        actualValue = element.style[styleProp] || 
                                     win.getComputedStyle(element)[styleProp];
                      } else if (check.property === 'backgroundColor' || 
                                 check.property === 'color') {
                        // Check computed style for color properties
                        actualValue = win.getComputedStyle(element)[check.property];
                      } else {
                        actualValue = element[check.property];
                      }
                      
                      // Normalize color values for comparison
                      if (check.property === 'backgroundColor' || check.property === 'color') {
                        actualValue = this.normalizeCSSValue(actualValue);
                        const expectedValue = this.normalizeCSSValue(check.value);
                        
                        if (actualValue !== expectedValue) {
                          errors.push(check.errorMsg);
                        }
                      } else if (actualValue !== check.value) {
                        errors.push(check.errorMsg);
                      }
                    }
                  }

                  if (check.type === 'functionExists') {
                    if (typeof win[check.functionName] !== 'function') {
                      errors.push(check.errorMsg);
                    }
                  }
                }

                // Cleanup
                document.body.removeChild(iframe);

                resolve({
                  success: errors.length === 0,
                  errors: errors
                });
              } catch (e) {
                document.body.removeChild(iframe);
                resolve({
                  success: false,
                  errors: [`JavaScript error: ${e.message}`]
                });
              }
            }, 100);
          } catch (e) {
            document.body.removeChild(iframe);
            resolve({
              success: false,
              errors: [`JavaScript error: ${e.message}`]
            });
          }
        }, 50);
      });
    } catch (e) {
      return Promise.resolve({
        success: false,
        errors: [`JavaScript error: ${e.message}`]
      });
    }
  }

  /**
   * Normalize CSS values for comparison
   */
  normalizeCSSValue(value) {
    if (!value) return '';
    
    // Convert to lowercase
    value = value.toLowerCase().trim();
    
    // Normalize color names to RGB
    const colorMap = {
      'white': 'rgb(255, 255, 255)',
      'black': 'rgb(0, 0, 0)',
      'red': 'rgb(255, 0, 0)',
      'green': 'rgb(0, 128, 0)',
      'blue': 'rgb(0, 0, 255)',
      'yellow': 'rgb(255, 255, 0)',
      'orange': 'rgb(255, 165, 0)',
      'purple': 'rgb(128, 0, 128)',
      'pink': 'rgb(255, 192, 203)',
      'gray': 'rgb(128, 128, 128)',
      'grey': 'rgb(128, 128, 128)'
    };
    
    if (colorMap[value]) {
      value = colorMap[value];
    }
    
    // Normalize hex colors to RGB
    if (value.startsWith('#')) {
      let hex = value.slice(1);
      
      // Convert 3-digit hex to 6-digit
      if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
      }
      
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      value = `rgb(${r}, ${g}, ${b})`;
    }
    
    // Normalize rgb/rgba - remove spaces
    if (value.startsWith('rgb')) {
      value = value.replace(/\s/g, '');
    }
    
    // Remove units from 0 values
    value = value.replace(/\b0(px|em|rem|%)\b/g, '0');
    
    return value;
  }

  /**
   * Provide progressive hints
   */
  getHint(level) {
    if (level >= 0 && level < this.challenge.hints.length) {
      return this.challenge.hints[level];
    }
    return null;
  }

  /**
   * Get total number of hints
   */
  getTotalHints() {
    return this.challenge.hints.length;
  }
}

export default ChallengeEngine;