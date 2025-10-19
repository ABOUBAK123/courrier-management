// Shim minimal pour fournir des fonctions "trickle*" si elles ne sont pas fournies par l'environnement.
// USAGE: uniquement pour DEV / déploiement de test hors-plateforme Trickle.
// Remplacez par une implémentation réelle (SDK ou API) en production.

(function (win) {
  if (!win) return;

  // Helper pour réponse standard "liste vide"
  const emptyList = () => Promise.resolve({ items: [] });

  // Définit une fonction globale si elle n'existe pas
  const defineIfMissing = (name, fn) => {
    if (typeof win[name] === 'undefined') {
      try {
        Object.defineProperty(win, name, {
          configurable: true,
          writable: false,
          value: fn
        });
        console.info(`[trickle-shim] ${name} défini en fallback (DEV only)`);
      } catch (e) {
        win[name] = fn;
      }
    }
  };

  // Fonctions CRUD basiques : retourner des valeurs sûres pour éviter les ReferenceError.
  defineIfMissing('trickleListObjects', function (collectionName, limit = 100, includeData = false) {
    console.warn(`[trickle-shim] appel à trickleListObjects("${collectionName}") — fallback renvoyé`);
    // Fournir quelques réponses utiles pour UI (ex: directions, roles) si utile
    if (collectionName === 'directions') {
      return Promise.resolve({
        items: [{ objectId: 'DIR001', objectData: { code: 'DIR001', nom: 'Direction Générale' } }]
      });
    }
    if (collectionName === 'user') {
      return Promise.resolve({ items: [] });
    }
    return emptyList();
  });

  defineIfMissing('trickleCreateObject', function (collectionName, objectData) {
    console.warn(`[trickle-shim] appel à trickleCreateObject("${collectionName}") — fallback renvoyé`);
    return Promise.resolve({
      objectId: `local_${Date.now()}_${Math.random().toString(36).slice(2,8)}`,
      objectData: objectData || {}
    });
  });

  defineIfMissing('trickleUpdateObject', function (collectionName, objectId, updateData) {
    console.warn(`[trickle-shim] appel à trickleUpdateObject("${collectionName}", "${objectId}") — fallback renvoyé`);
    return Promise.resolve({ objectId, objectData: updateData || {} });
  });

  defineIfMissing('trickleDeleteObject', function (collectionName, objectId) {
    console.warn(`[trickle-shim] appel à trickleDeleteObject("${collectionName}", "${objectId}") — fallback renvoyé`);
    return Promise.resolve({ success: true });
  });

  defineIfMissing('trickleGetObject', function (collectionName, objectId) {
    console.warn(`[trickle-shim] appel à trickleGetObject("${collectionName}", "${objectId}") — fallback renvoyé`);
    return Promise.resolve(null);
  });

  // Optionnel : shim pour EmailAlerts / toastManager si du code les appelle sans vérification.
  if (!win.EmailAlerts) {
    win.EmailAlerts = {
      startMonitoring: function () { console.info('[trickle-shim] EmailAlerts.startMonitoring() noop'); },
      stopMonitoring: function () { console.info('[trickle-shim] EmailAlerts.stopMonitoring() noop'); }
    };
  }

  if (!win.toastManager) {
    win.toastManager = {
      loading: function (msg) { console.info('[trickle-shim toast] loading:', msg); return 'shim-loading-id'; },
      remove: function () { /* noop */ },
      success: function (msg) { console.info('[trickle-shim toast] success:', msg); },
      error: function (msg) { console.error('[trickle-shim toast] error:', msg); }
    };
  }

})(window);