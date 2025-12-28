// src/js/core/PreviewManager.js

/**
 * PreviewManager - Handles live preview rendering in iframe
 */
export class PreviewManager {
  constructor() {
    this.defaultStyles = `
      body {
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        padding: 20px;
        margin: 0;
        line-height: 1.6;
      }
      h1 {
        color: #f97316;
        margin: 0 0 10px 0;
        font-size: 2rem;
      }
      h2 {
        color: #ea580c;
        margin: 0 0 8px 0;
        font-size: 1.5rem;
      }
      h3 {
        color: #c2410c;
        margin: 0 0 6px 0;
        font-size: 1.25rem;
      }
      p {
        color: #64748b;
        margin: 0 0 10px 0;
      }
      button {
        background: #3b82f6;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        transition: background 0.2s;
      }
      button:hover {
        background: #2563eb;
      }
      button:active {
        background: #1d4ed8;
      }
      ul, ol {
        padding-left: 24px;
        margin: 0 0 10px 0;
      }
      li {
        margin: 5px 0;
        color: #475569;
      }
      a {
        color: #3b82f6;
        text-decoration: none;
        transition: color 0.2s;
      }
      a:hover {
        text-decoration: underline;
        color: #2563eb;
      }
      img {
        max-width: 100%;
        height: auto;
        border-radius: 4px;
      }
      input, textarea, select {
        padding: 8px 12px;
        border: 1px solid #cbd5e1;
        border-radius: 6px;
        font-family: inherit;
        font-size: 14px;
      }
      input:focus, textarea:focus, select:focus {
        outline: none;
        border-color: #3b82f6;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
      }
      .container {
        max-width: 800px;
        margin: 0 auto;
      }
      .flex {
        display: flex;
      }
      .flex-col {
        flex-direction: column;
      }
      .items-center {
        align-items: center;
      }
      .justify-center {
        justify-content: center;
      }
      .gap-2 {
        gap: 0.5rem;
      }
      .gap-4 {
        gap: 1rem;
      }
    `;
  }

  /**
   * Update the preview iframe with new code
   * @param {HTMLIFrameElement} iframe - The preview iframe
   * @param {string} code - User's code to preview
   * @param {string} type - Type of code: 'html', 'css', or 'javascript'
   */
update(iframe, code, type = 'html') {
  if (!iframe) {
    console.warn('Preview iframe not found');
    return;
  }
  
  if (!code) {
    this.clear(iframe);
    return;
  }

  try {
    const win = iframe.contentWindow;
    
    // Set error handlers FIRST (before any content)
    if (win) {
      win.onerror = (message) => {
        return true; 
      };
      
      win.onunhandledrejection = (event) => {
        return true; 
      };
    }
    
    // Build content
    const content = this.buildPreviewContent(code, type);
    
    // Set content using srcdoc ✅
    iframe.srcdoc = content;
    console.clear();
    
  } catch (error) {
    console.error('Preview update error:', error);
  }
}

buildPreviewContent(code, type) {
  let htmlContent = '';
  let cssContent = this.defaultStyles;
  let jsContent = '';

  switch (type) {
    case 'html':
      htmlContent = code;
      break;
    
    case 'css':
      const cssMatch = code.match(/<style>([\s\S]*?)<\/style>/);
      if (cssMatch) {
        cssContent += '\n' + cssMatch[1];
        htmlContent = code.replace(/<style>[\s\S]*?<\/style>/, '');
      } else {
        cssContent += '\n' + code;
      }
      break;
    
    case 'javascript':
      const scriptMatch = code.match(/<script>([\s\S]*?)<\/script>/);
      if (scriptMatch) {
        jsContent = scriptMatch[1];
        htmlContent = code.replace(/<script>[\s\S]*?<\/script>/, '');
      } else {
        jsContent = code;
      }
      break;
  }

  // Wrap JavaScript in try-catch
  if (jsContent) {
    jsContent = `
      try {
        ${jsContent}
      } catch (error) {
        // Silently fail - user is still typing
        console.warn('Preview JS error:', error.message);
      }
    `;
  }

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Preview</title>
      <style>${cssContent}</style>
    </head>
    <body>
      ${htmlContent}
      ${jsContent ? `<script>${jsContent}</script>` : ''}
    </body>
    </html>
  `;
}


  /**
   * Build complete HTML content for preview
   */
  buildPreviewContent(code, type) {
    let htmlContent = '';
    let cssContent = this.defaultStyles;
    let jsContent = '';

    switch (type) {
      case 'html':
        htmlContent = code;
        break;
      
      case 'css':
        // CSS challenges include both HTML structure and CSS
        const cssMatch = code.match(/<style>([\s\S]*?)<\/style>/);
        if (cssMatch) {
          cssContent += '\n' + cssMatch[1];
          htmlContent = code.replace(/<style>[\s\S]*?<\/style>/, '');
        } else {
          cssContent += '\n' + code;
        }
        break;
      
      case 'javascript':
        // JavaScript challenges include HTML and JS
        const scriptMatch = code.match(/<script>([\s\S]*?)<\/script>/);
        if (scriptMatch) {
          jsContent = scriptMatch[1];
          htmlContent = code.replace(/<script>[\s\S]*?<\/script>/, '');
        } else {
          jsContent = code;
        }
        break;
    }

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Preview</title>
        <style>${cssContent}</style>
      </head>
      <body>
        ${htmlContent}
        ${jsContent ? `<script>${jsContent}</script>` : ''}
      </body>
      </html>
    `;
  }

  /**
   * Show error in preview
   */
  showError(doc, message) {
    const errorHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: system-ui, sans-serif;
            padding: 20px;
            background: #fef2f2;
            color: #991b1b;
          }
          .error-box {
            background: white;
            border: 2px solid #fca5a5;
            border-radius: 8px;
            padding: 16px;
          }
          h3 {
            margin: 0 0 8px 0;
            color: #dc2626;
          }
          p {
            margin: 0;
            font-family: monospace;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="error-box">
          <h3>⚠️ Preview Error</h3>
          <p>${message}</p>
        </div>
      </body>
      </html>
    `;

    doc.open();
    doc.write(errorHTML);
    doc.close();
  }

  /**
   * Clear the preview
   */
  clear(iframe) {
    if (!iframe) return;
    
    const doc = iframe.contentDocument || iframe.contentWindow.document;
    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <style>${this.defaultStyles}</style>
      </head>
      <body></body>
      </html>
    `);
    doc.close();
  }

  /**
   * Get iframe document
   */
  getDocument(iframe) {
    return iframe.contentDocument || iframe.contentWindow.document;
  }

  /**
   * Get iframe window
   */
  getWindow(iframe) {
    return iframe.contentWindow;
  }
}

export default PreviewManager;