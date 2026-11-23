(function() {
    // Static injector ID
    const INJECTOR_ID = '0023';
    
    // ===== IMPORT.JS FORMAT ADAPTER =====
    // Generates ready-to-use JavaScript import files
    // Export → save as templates/game-<name>.js → add it to templates/list.js → done
    
    const ImportJSFormat = {
        // ===== FORMAT INFO =====
        getFormatName: function() {
            return 'IMPORT.JS';
        },
        
        getDescription: function() {
            return 'Ready-to-use import file (save as .js)';
        },
        
        getVersion: function() {
            return '1.0.0';
        },
        
        getFileExtension: function() {
            return 'js';
        },
        
        // ===== SERIALIZE (JSON → Import.js format) =====
        serialize: function(jsonData) {
            // Extract name and create safe ID
            const nestName = jsonData.name || 'Import';
            const safeId = nestName.toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')  // Replace non-alphanumeric with hyphens
                .replace(/^-+|-+$/g, '');      // Remove leading/trailing hyphens
            
            // Create description from first tab or default
            let description = 'Imported structure';
            if (jsonData.data && jsonData.data.tabs && jsonData.data.tabs.tabs) {
                const tabNames = jsonData.data.tabs.tabs.map(t => t.label || t.name).join(', ');
                if (tabNames) {
                    description = `Includes: ${tabNames}`;
                }
            }
            
            // Serialize the export data as JSON string (readable format).
            // It sits inside a JS template literal, so backslashes, backticks
            // and "${" are escaped; the browser undoes this when it runs the file.
            const exportDataString = JSON.stringify(jsonData, null, 2)
                .replace(/\\/g, '\\\\')
                .replace(/`/g, '\\`')
                .replace(/\$\{/g, '\\${');
            
            // Generate the complete import file
            const output = [];
            output.push('// ===== GT50 IMPORT FILE =====');
            output.push('// escaped: template-literal');
            output.push(`// Generated: ${new Date().toISOString()}`);
            output.push(`// Name: ${String(nestName).replace(/\s+/g, " ")}`);
            output.push('//');
            output.push('// INSTALLATION:');
            output.push(`// 1. Save this file as: templates/game-${safeId}.js`);
            output.push('// 2. Add that file name to templates/list.js');
            output.push('// 3. Reload The Joystick Journal');
            output.push('// 4. Find it in Create New → Import tab');
            output.push('');
            output.push('(function() {');
            output.push('    // Wait for registry to be available');
            output.push('    if (!window.GT50 || !window.GT50.Imports) {');
            output.push('        console.error(\'Import registry not available\');');
            output.push('        return;');
            output.push('    }');
            output.push('    ');
            output.push('    // Export data in JSON format');
            output.push('    const exportedData = `' + exportDataString + '`;');
            output.push('    ');
            output.push('    // Register the import');
            output.push('    window.GT50.Imports.register({');
            const q = (t) => String(t).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n').replace(/\r/g, '\\r');
            output.push(`        id: '${safeId}',`);
            output.push(`        name: '${q(nestName)}',`);
            output.push(`        description: '${q(description)}',`);
            output.push('        data: exportedData');
            output.push('    });');
            output.push('    ');
            output.push(`    console.log('✓ Import registered: ${q(nestName)}');`);
            output.push('})();');
            output.push('');
            
            return output.join('\n');
        },
        
        // ===== DESERIALIZE (Import.js → JSON format) =====
        deserialize: function(formatData) {
            // Extract the JSON data from between backticks
            const match = (formatData.match(/const exportedData = `([\s\S]*?)`;\s*\/\/ Register the import/) || formatData.match(/const exportedData = `([\s\S]*?)`;/));
            if (!match || !match[1]) {
                throw new Error('Could not extract export data from import file');
            }
            
            return JSON.parse(this.readData(formatData, match[1]));
        },
        
        // The JSON as the browser would see it after running the file
        readData: function(fileText, raw) {
            let text = raw;
            if (fileText.indexOf('// escaped: template-literal') !== -1) {
                text = raw.replace(/\\([\\`$])/g, '$1');
            }
            // older files: fall back to the tolerant reader for stray escapes
            try { JSON.parse(text); return text; }
            catch (e) {
                const fixed = text.replace(/\\\\|\\(["\/bfnrtu])|\\/g, (m, ok) => m === '\\\\' ? m : (ok ? m : ''));
                return fixed;
            }
        },

        // ===== VALIDATE =====
        validate: function(formatData) {
            try {
                // Check if it looks like an import file
                if (!formatData.includes('window.GT50.Imports.register')) {
                    return { valid: false, error: 'Not a GT50 import file' };
                }
                
                // Try to extract and parse the data
                const match = (formatData.match(/const exportedData = `([\s\S]*?)`;\s*\/\/ Register the import/) || formatData.match(/const exportedData = `([\s\S]*?)`;/));
                if (!match || !match[1]) {
                    return { valid: false, error: 'Could not extract export data' };
                }
                
                const parsed = JSON.parse(this.readData(formatData, match[1]));
                
                // Validate structure
                if (!parsed.version || !parsed.data || !parsed.data.tabs || !parsed.data.tabComponents) {
                    return { valid: false, error: 'Invalid data structure in import file' };
                }
                
                return { valid: true };
            } catch (error) {
                return { valid: false, error: error.message };
            }
        }
    };
    
    // ===== REGISTER FORMAT =====
    if (window.GT50Lib && window.GT50Lib.ImpEx) {
        window.GT50Lib.ImpEx.registerFormat(ImportJSFormat);
        console.log('✓ IMPORT.JS format adapter registered');
    } else {
        console.error('Cannot register IMPORT.JS format: ImpEx not available');
    }
    
    // ===== INJECT RIGHT SECTION (for plugin UI) =====
    setTimeout(() => {
        const container = document.getElementById('cards-plugins');
        if (container) {
            const cards = container.children;
            for (let card of cards) {
                const filename = card.querySelector('div:last-child');
                if (filename && filename.textContent === 'format-import.js') {
                    const rightSection = document.createElement('div');
                    rightSection.style.cssText = `
                        width: 60px;
                        height: 100%;
                        background: var(--primary);
                        border-left: var(--border-width) solid var(--border-color);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 12px;
                        font-weight: 700;
                        color: var(--color-10);
                    `;
                    rightSection.textContent = INJECTOR_ID;
                    card.appendChild(rightSection);
                    break;
                }
            }
        }
    }, 100);
})();
