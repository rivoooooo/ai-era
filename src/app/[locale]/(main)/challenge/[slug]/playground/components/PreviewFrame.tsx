'use client';

import { useMemo } from 'react';
import { ChallengeFile } from '../utils';

interface PreviewFrameProps {
  codeSource: ChallengeFile[];
  importSource: string;
  sandboxType: 'html' | 'javascript' | 'react' | 'vue';
}

function buildImportMap(importSource: string): string {
  if (!importSource) return '';
  
  const imports: Record<string, string> = {};
  
  const lines = importSource.split('\n').filter(line => line.trim());
  
  lines.forEach(line => {
    const match = line.match(/import\s+.*?\s+from\s+['"]([^'"]+)['"]/);
    if (match) {
      const url = match[1];
      const pkgMatch = url.match(/https?:\/\/esm\.sh\/([^@]+)/);
      if (pkgMatch) {
        const pkg = pkgMatch[1];
        imports[pkg] = url;
        imports[pkg + '/'] = url + '/';
      } else {
        imports[url] = url;
      }
    }
  });
  
  return JSON.stringify({ imports }, null, 2);
}

function generateHtmlDocument(codeSource: ChallengeFile[], importSource: string, sandboxType: string): string {
  const importMap = buildImportMap(importSource);
  
  const htmlFile = codeSource.find(f => f.language === 'html' || f.filename.endsWith('.html'));
  const jsFile = codeSource.find(f => f.language === 'javascript' || f.filename.endsWith('.js') || f.filename.endsWith('.jsx'));
  const cssFile = codeSource.find(f => f.language === 'css' || f.filename.endsWith('.css'));
  const vueFile = codeSource.find(f => f.language === 'vue' || f.filename.endsWith('.vue'));
  const reactFile = codeSource.find(f => f.language === 'react' || f.filename.endsWith('.jsx') || f.filename.endsWith('.tsx'));
  
  const htmlContent = htmlFile?.content || '';
  const jsContent = jsFile?.content || '';
  const cssContent = cssFile?.content || '';
  const vueContent = vueFile?.content || '';
  const reactContent = reactFile?.content || '';
  
  let scriptSection = '';
  
  if (sandboxType === 'vue' && vueContent) {
    scriptSection = `<script type="importmap">
{
  "imports": {
    "vue": "https://esm.sh/vue@3.4.0",
    "vue/": "https://esm.sh/vue@3.4.0/",
    "htm": "https://esm.sh/htm@3.1.1"
  }
}
</script>
<script type="module">
import { createApp, ref, computed } from 'vue';
import htm from 'htm';

const html = htm.bind(createApp);

${vueContent}
</script>`;
  } else if (sandboxType === 'react' && reactContent) {
    const reactImportMap = importMap || `{
  "imports": {
    "react": "https://esm.sh/react@18.2.0",
    "react-dom/": "https://esm.sh/react-dom@18.2.0/",
    "htm": "https://esm.sh/htm@3.1.1"
  }
}`;
    
    scriptSection = `<script type="importmap">${reactImportMap}</script>
<script type="module">
import React from 'react';
import { createRoot } from 'react-dom/client';
import htm from 'htm';

const html = htm.bind(React);

${reactContent}

const root = createRoot(document.getElementById('root'));
root.render(html(App));
</script>`;
  } else if (importSource) {
    scriptSection = `<script type="module">
${importSource}
</script>`;
  }
  
  if (jsContent && !sandboxType.includes('react') && !sandboxType.includes('vue')) {
    if (importSource) {
      scriptSection = `<script type="module">
${importSource}

try {
  ${jsContent}
} catch (err) {
  console.error('Error:', err);
  document.body.innerHTML += '<pre style="color: #ff3333; margin-top: 20px;">' + err.message + '</pre>';
}
</script>`;
    } else {
      scriptSection = `<script>
try {
  ${jsContent}
} catch (err) {
  console.error('Error:', err);
  document.body.innerHTML += '<pre style="color: #ff3333; margin-top: 20px;">' + err.message + '</pre>';
}
</script>`;
    }
  }

  if (htmlContent) {
    let html = htmlContent;
    
    const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/);
    const styleContent = styleMatch ? styleMatch[1] : '';
    const combinedCss = cssContent + (styleContent ? '\n' + styleContent : '');
    
    if (combinedCss) {
      html = html.replace(/<style>[\s\S]*?<\/style>/, '');
      html = html.replace('</head>', `<style>\n${combinedCss}\n</style></head>`);
    }
    
    if (scriptSection) {
      if (html.includes('<div id="root"></div>') || html.includes('<div id="app"></div>')) {
        html = html.replace('</body>', `${scriptSection}</body>`);
      } else {
        html = html.replace('</body>', `${scriptSection}</body>`);
      }
    }
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ${!sandboxType.includes('react') && !sandboxType.includes('vue') && importMap ? `<script type="importmap">${importMap}</script>` : ''}
</head>
${html}
</html>`;
  }
  
  if (sandboxType === 'react' || sandboxType === 'vue') {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ${scriptSection}
</head>
<body>
  <div id="root"></div>
</body>
</html>`;
  }
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; padding: 16px; background: #0a0a0a; color: #33ff00; font-family: monospace; }
    ${cssContent}
  </style>
  ${importMap ? `<script type="importmap">${importMap}</script>` : ''}
</head>
<body>
  ${scriptSection}
</body>
</html>`;
}

export default function PreviewFrame({ codeSource, importSource, sandboxType = 'html' }: PreviewFrameProps) {
  const srcDoc = useMemo(() => {
    if (!codeSource || codeSource.length === 0) {
      return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin: 0; padding: 20px; background: #0a0a0a; color: #666; font-family: monospace; }
  </style>
</head>
<body>
  <p>No preview available</p>
</body>
</html>`;
    }
    return generateHtmlDocument(codeSource, importSource, sandboxType);
  }, [codeSource, importSource, sandboxType]);

  return (
    <div className="h-full flex flex-col bg-[var(--card)] border border-[var(--border)]">
      <div className="flex items-center justify-between px-4 py-2 bg-[var(--muted)] border-b border-[var(--border)]">
        <span className="text-xs font-medium uppercase tracking-wider text-[var(--primary)]">
          Preview
        </span>
        <span className="text-xs text-[var(--muted-foreground)]">
          {codeSource?.length > 0 && `${codeSource.length} files`}
        </span>
      </div>
      <div className="flex-1 min-h-0 p-0">
        <iframe
          srcDoc={srcDoc}
          title="Preview"
          sandbox="allow-scripts allow-modals allow-same-origin"
          className="w-full h-full border-0"
          key={srcDoc}
        />
      </div>
    </div>
  );
}
