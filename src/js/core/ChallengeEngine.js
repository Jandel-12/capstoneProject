// ./core/ChallengeEngine.js

export class ChallengeEngine {
  constructor(challenge) {
    this.challenge = challenge || {};
    this.rules = Array.isArray(challenge.validation) ? challenge.validation : [];
  }

  validate(code) {
    const type = (this.challenge.type || 'html').toLowerCase();
    return Promise.resolve().then(() => {
      switch (type) {
        case 'html':       return this.validateHTML(code);
        case 'css':        return this.validateCSS(code);
        case 'javascript': return this.validateJavaScript(code);
        default:           return { success: false, errors: ['Unknown challenge type'] };
      }
    });
  }

  // ====================== HTML ======================
  validateHTML(code) {
    if (!code || !code.trim()) return { success: false, errors: ['No code submitted'] };

    const errors = [];

    // Strict unclosed tag check
    const openTags = (code.match(/<([a-z][a-z0-9]*)[^>]*>/gi) || [])
      .map(t => t.match(/<([a-z][a-z0-9]*)/i)?.[1]?.toLowerCase())
      .filter(t => !['br','hr','img','input','meta','link'].includes(t));

    const closeTags = (code.match(/<\/([a-z][a-z0-9]*)>/gi) || [])
      .map(t => t.match(/<\/([a-z][a-z0-9]*)/i)?.[1]?.toLowerCase());

    // Check each opened tag has a matching close
    const tagCount = {};
    openTags.forEach(t => tagCount[t] = (tagCount[t] || 0) + 1);
    closeTags.forEach(t => tagCount[t] = (tagCount[t] || 0) - 1);

    const unclosed = Object.entries(tagCount)
      .filter(([, count]) => count > 0)
      .map(([tag]) => tag);

    if (unclosed.length > 0) {
      errors.push(`Unclosed tag(s) detected: ${unclosed.map(t => `<${t}>`).join(', ')}. Make sure every opening tag has a closing tag.`);
      return { success: false, errors };
    }

    // Parse with DOMParser for selector checks
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(code, 'text/html');

      for (const rule of this.rules) {
        if (!rule?.selector) continue;
        const elements = doc.querySelectorAll(rule.selector);
        const msg = rule.message || `Failed check on ${rule.selector}`;

        switch (rule.type?.toLowerCase()) {
          case 'exists':
            if (elements.length === 0) errors.push(msg);
            break;

          case 'text':
          case 'textcontent': {
            if (elements.length === 0) { errors.push(msg); break; }
            const textMatch = Array.from(elements).some(el =>
              el.textContent.trim() === String(rule.expected || '').trim()
            );
            if (!textMatch) errors.push(msg);
            break;
          }

          case 'count':
            if (elements.length !== Number(rule.expected)) errors.push(msg);
            break;

          case 'attribute': {
            if (elements.length === 0) { errors.push(msg); break; }
            const attrMatch = Array.from(elements).some(el =>
              el.getAttribute('href') === rule.expected ||
              el.getAttribute('src') === rule.expected ||
              el.getAttribute('id') === rule.expected
            );
            if (!attrMatch) errors.push(msg);
            break;
          }

          default:
            console.warn(`Unknown HTML rule: ${rule.type}`);
        }
      }
    } catch (e) {
      return { success: false, errors: ['HTML parsing failed. Check your tags.'] };
    }

    return { success: errors.length === 0, errors };
  }

  // ====================== CSS ======================
  async validateCSS(code) {
    return new Promise((resolve) => {
      const iframe = document.createElement('iframe');
      iframe.style.cssText = 'position:absolute;visibility:hidden;width:600px;height:400px;left:-9999px;';
      document.body.appendChild(iframe);

      iframe.onload = () => {
        try {
          const doc = iframe.contentDocument;
          const win = iframe.contentWindow;

          // Extract CSS from <style> tags or use raw
          const styleMatch = code.match(/<style[^>]*>([\s\S]*?)<\/style>/gi);
          const userCSS = styleMatch
            ? styleMatch.map(s => s.replace(/<\/?style[^>]*>/gi, '')).join('\n')
            : code;

          // Inject CSS
          const style = doc.createElement('style');
          style.textContent = userCSS;
          doc.head.appendChild(style);

          // Allow browser to compute styles
          setTimeout(() => {
            const errors = [];

            for (const rule of this.rules) {
              if (!rule.selector) continue;
              const msg = rule.message || `CSS check failed for ${rule.selector}`;
              const elements = doc.querySelectorAll(rule.selector);

              if (elements.length === 0) {
                errors.push(`Element "${rule.selector}" not found in the HTML.`);
                continue;
              }

              if (rule.type === 'style' && rule.expected) {
                const computed = win.getComputedStyle(elements[0]);
                const expected = String(rule.expected).trim().toLowerCase();

                // Check all computed properties for a match
                const matched = this.checkComputedStyle(computed, expected);
                if (!matched) errors.push(msg);
              }
            }

            document.body.removeChild(iframe);
            resolve({ success: errors.length === 0, errors });
          }, 100);

        } catch (e) {
          document.body.removeChild(iframe);
          resolve({ success: false, errors: ['CSS validation failed: ' + e.message] });
        }
      };

      // Load starter HTML into iframe
      const starterCode = this.challenge.starterCode || '<html><head></head><body></body></html>';
      iframe.srcdoc = starterCode;
    });
  }

  checkComputedStyle(computed, expected) {
    // Normalize colors for comparison
    const normalize = (val) => {
      if (!val) return '';
      val = val.trim().toLowerCase();
      // Convert named colors to rgb
      const colorMap = {
        'blue': 'rgb(0, 0, 255)',
        'red': 'rgb(255, 0, 0)',
        'green': 'rgb(0, 128, 0)',
        'yellow': 'rgb(255, 255, 0)',
        'white': 'rgb(255, 255, 255)',
        'black': 'rgb(0, 0, 0)',
        'purple': 'rgb(128, 0, 128)',
        'orange': 'rgb(255, 165, 0)',
        'gray': 'rgb(128, 128, 128)',
        'grey': 'rgb(128, 128, 128)'
      };
      return colorMap[val] || val;
    };

    const normalizedExpected = normalize(expected);

    // Check each relevant CSS property
    const propsToCheck = [
      'color', 'backgroundColor', 'fontSize', 'fontsize',
      'textAlign', 'display', 'justifyContent', 'alignItems',
      'flexDirection', 'flexWrap', 'gap', 'padding',
      'borderRadius', 'height', 'width', 'margin'
    ];

    for (const prop of propsToCheck) {
      const val = computed[prop];
      if (!val) continue;
      const normalizedVal = normalize(val.trim().toLowerCase());
      if (normalizedVal === normalizedExpected) return true;
      if (val.trim().toLowerCase() === normalizedExpected) return true;
    }

    return false;
  }

  // ====================== JAVASCRIPT ======================
  async validateJavaScript(code) {
    return new Promise((resolve) => {
      const iframe = document.createElement('iframe');
      iframe.style.cssText = 'position:absolute;visibility:hidden;width:600px;height:400px;left:-9999px;';
      document.body.appendChild(iframe);

      iframe.onload = () => {
        try {
          const doc = iframe.contentDocument;
          const win = iframe.contentWindow;

          // Extract only the script content from user code
          const scriptMatch = code.match(/<script[^>]*>([\s\S]*?)<\/script>/gi);
          const userScript = scriptMatch
            ? scriptMatch.map(s => s.replace(/<\/?script[^>]*>/gi, '')).join('\n')
            : code;

          // Inject and run script
          const script = doc.createElement('script');
          script.textContent = userScript;
          doc.body.appendChild(script);

          setTimeout(async () => {
            const errors = [];

            for (const rule of this.rules) {
              const msg = rule.message || 'JavaScript check failed';

              switch (rule.type?.toLowerCase()) {
                case 'exists':
                case 'elementexists': {
                  if (!doc.querySelector(rule.selector)) errors.push(msg);
                  break;
                }

                case 'domchange':
                case 'text':
                case 'textcontent': {
                  const el = doc.querySelector(rule.selector);
                  if (!el) { errors.push(msg); break; }
                  const actual = (el.textContent || el.style?.color || el.style?.backgroundColor || '').trim();
                  const expected = String(rule.expected || '').trim();
                  if (actual !== expected) errors.push(msg);
                  break;
                }

                case 'eventlistener': {
                  // Simulate click and check for changes
                  const btn = doc.querySelector(rule.selector);
                  if (!btn) { errors.push(msg); break; }

                  // Store state before click
                  const beforeHTML = doc.body.innerHTML;
                  btn.click();

                  await new Promise(r => setTimeout(r, 100));

                  const afterHTML = doc.body.innerHTML;
                  if (beforeHTML === afterHTML) {
                    errors.push(msg + ' (clicking the button had no effect)');
                  }
                  break;
                }

                case 'functionexists': {
                  if (typeof win[rule.expected || rule.functionName] !== 'function') {
                    errors.push(msg);
                  }
                  break;
                }

                default:
                  console.warn(`Unknown JS rule: ${rule.type}`);
              }
            }

            document.body.removeChild(iframe);
            resolve({ success: errors.length === 0, errors });
          }, 200);

        } catch (e) {
          if (iframe.parentNode) document.body.removeChild(iframe);
          resolve({ success: false, errors: ['JavaScript error: ' + e.message] });
        }
      };

      // Load starter HTML into iframe
      const starterCode = this.challenge.starterCode || '<html><head></head><body></body></html>';
      iframe.srcdoc = starterCode;
    });
  }

  getHint(level) {
    const hints = this.challenge.hints || [];
    return level < hints.length ? hints[level] : null;
  }
}

export default ChallengeEngine;