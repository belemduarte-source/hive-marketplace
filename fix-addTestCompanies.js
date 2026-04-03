// ============================================================================
// IMPROVED VERSION - Replace the addTestCompanies function in b2b-marketplace.html
// Lines 3320-3337 - Replace with this:
// ============================================================================

window.addTestCompanies = function() {
  console.log('%c=== ADD TEST COMPANIES INITIATED ===', 'color: #f97316; font-weight: bold; font-size: 12px;');

  try {
    // Verify map exists
    if (typeof map === 'undefined') {
      throw new Error('Global "map" variable não existe');
    }

    if (typeof L === 'undefined') {
      throw new Error('Leaflet (L) não está carregado');
    }

    const empresas = [
      { lat: 38.7223, lng: -9.1393, nome: 'Construções Lisboa', emoji: '🏗️' },
      { lat: 41.1579, lng: -8.6291, nome: 'TechSolutions Porto', emoji: '💼' },
      { lat: 41.5454, lng: -8.4265, nome: 'Eletrox Braga', emoji: '⚡' },
      { lat: 40.2833, lng: -7.5, nome: 'Clínica Covilhã', emoji: '🏥' },
      { lat: 37.0141, lng: -7.9102, nome: 'Transportes Faro', emoji: '🚚' }
    ];

    console.log(`Adicionando ${empresas.length} empresas...`);

    let addedCount = 0;
    empresas.forEach((e, index) => {
      try {
        console.log(`  [${index + 1}/${empresas.length}] Criando marcador para ${e.nome}...`);

        // Create marker
        const marker = L.marker([e.lat, e.lng], {
          title: e.nome
        });

        // Bind popup
        marker.bindPopup(`
          <div style="font-weight: bold; text-align: center;">
            <div style="font-size: 24px; margin-bottom: 5px;">${e.emoji}</div>
            <div>${e.nome}</div>
          </div>
        `);

        // Add to map
        marker.addTo(map);

        addedCount++;
        console.log(`  ✅ ${e.nome} adicionado`);

      } catch (itemErr) {
        console.error(`  ❌ ERRO em ${e.nome}:`, itemErr.message);
      }
    });

    // Center map on first company
    if (empresas.length > 0) {
      const firstCompany = empresas[0];
      map.setView([firstCompany.lat, firstCompany.lng], 7);
      console.log(`Mapa centrado em ${firstCompany.nome}`);
    }

    console.log(`%c✅ COMPLETO: ${addedCount} empresas adicionadas ao mapa`, 'color: #22c55e; font-weight: bold; font-size: 12px;');
    alert(`✅ ${addedCount} empresas adicionadas ao mapa!\n\nAbre o console (F12) para detalhes.`);

  } catch (mainErr) {
    console.error('%c❌ ERRO CRÍTICO:', 'color: #dc2626; font-weight: bold;', mainErr.message);
    console.error('Stack:', mainErr.stack);
    alert(`❌ ERRO CRÍTICO:\n\n${mainErr.message}\n\nConsole detalhes: F12`);
  }
};

// ============================================================================
// IMPROVED WRAPPER - Replace lines 3340-3348 with this:
// ============================================================================

window.add5 = function() {
  console.log('%c>>> add5() wrapper called', 'color: #0ea5e9; font-size: 11px;');

  try {
    // Call the main function
    window.addTestCompanies();
  } catch (wrapperErr) {
    console.error('%c❌ Wrapper Error:', 'color: #dc2626; font-weight: bold;', wrapperErr.message);
    alert(`❌ Wrapper Error:\n\n${wrapperErr.message}`);
  }
};

// ============================================================================
// DIAGNOSTIC HELPER - Can be called from console to verify everything
// ============================================================================

window.diagnosticCheck = function() {
  console.clear();
  console.log('%c╔═══════════════════════════════════════════╗', 'color: #f97316; font-weight: bold;');
  console.log('%c║ B2B MARKETPLACE - DIAGNOSTIC CHECK ║', 'color: #f97316; font-weight: bold;');
  console.log('%c╚═══════════════════════════════════════════╝', 'color: #f97316; font-weight: bold;');

  console.log('%c1. Global Variables:', 'color: #f97316; font-weight: bold;');
  console.log('   map:', typeof window.map !== 'undefined' ? '✅ EXISTS' : '❌ MISSING');
  console.log('   L (Leaflet):', typeof L !== 'undefined' ? '✅ EXISTS' : '❌ MISSING');
  console.log('   companies:', Array.isArray(window.companies) ? `✅ [${window.companies.length} items]` : '❌ MISSING');

  console.log('%c2. Functions:', 'color: #f97316; font-weight: bold;');
  console.log('   addTestCompanies:', typeof window.addTestCompanies === 'function' ? '✅ DEFINED' : '❌ NOT DEFINED');
  console.log('   add5:', typeof window.add5 === 'function' ? '✅ DEFINED' : '❌ NOT DEFINED');

  console.log('%c3. Map Status:', 'color: #f97316; font-weight: bold;');
  if (typeof map !== 'undefined') {
    console.log('   Center:', map.getCenter());
    console.log('   Zoom:', map.getZoom());
    console.log('   Bounds:', map.getBounds());
  }

  console.log('%c4. To test, run:', 'color: #f97316; font-weight: bold;');
  console.log('   add5()  or  addTestCompanies()');

  console.log('%c✅ Diagnostic complete!', 'color: #22c55e; font-weight: bold;');
};

// ============================================================================
// AUTO-RUN DIAGNOSTIC ON CONSOLE FOR TESTING
// Uncomment if needed for debugging:
// diagnosticCheck();
