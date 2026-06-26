
const coresUniversidades = {
  'USP': { color: '#fff', background: '#002d72' },
  'UNIFESP': { color: '#fff', background: '#006a4e' },
  'Mackenzie': { color: '#fff', background: '#003366' },
  'PUC-SP': { color: '#0056b3', background: '#ffe600' },
  'FGV': { color: '#fff', background: '#8b0000' },
  'Belas Artes': { color: '#000', background: '#b8860b' },
  'FAAP': { color: '#000', background: '#6a1b9a' },
  'FATEC-SP': { color: '#fff', background: 'linear-gradient(90deg, #1976d2 50%, #003366 50%)', gradient: true },
  'ESPM': { color: '#000', background: '#d32f2f' },
  'Insper': { color: '#000', background: '#e65a00' },
  'USJT': { color: '#7c3aed' },
  'São Judas': { color: '#000', background: '#8b0000' },
  'Cruzeiro do sul': { color: '#000', background: '#1e88e5' },
  'Anhembi Morumbi': { color: '#000', background: '#c40000' },
  'FMU': { color: '#000', background: '#00796b' },
  'UNIP': { color: '#c00' },
  'Uninove': { color: '#1976d2' },
  'UNICAMP': { color: '#fff', background: '#2e7d32' },
  'UNESP': { color: '#000', background: '#f57c00' },
  'UFSCar': { color: '#006633', background: '#ffe600' },
  'UFABC': { color: '#000', background: 'linear-gradient(90deg, #ffe600 50%, #ff9800 50%)', gradient: true },
  'PUC-Campinas': { color: '#fff', background: '#7a1f1f' },
  'ESALQ/USP': { color: '#000', background: '#ffe600' },
  'UMESP': { color: '#fff', background: '#00695c' }
};

window.addEventListener('DOMContentLoaded', function() {
  // Aplica cor/tinta nos títulos das cards (usa correspondência flexível)
  let appliedToCardTitles = 0;
  let spanCount = 0;
  document.querySelectorAll('.card-title').forEach(function(el) {
    const nome = el.textContent.trim();
    const cor = findFacultyColor(nome) || coresUniversidades[nome];
    if (!cor) return;
    if (cor.color) { el.style.setProperty('color', cor.color, 'important'); }
    if (cor.background) {
      if (cor.gradient) {
        // Aplicar o gradient no background
        el.style.setProperty('background', cor.background, 'important');
        el.style.display = 'inline-block';
        if (cor.color) {
          el.style.setProperty('color', cor.color, 'important');
        }
        // Garantir que não haja text-fill transparente
        el.style.removeProperty('-webkit-text-fill-color');
        el.style.removeProperty('text-fill-color');
      } else {
        el.style.setProperty('background-color', cor.background, 'important');
      }
    }
    appliedToCardTitles++;
    // Diagnóstico: log de valores aplicados para depuração no console
    try {
      const computed = window.getComputedStyle(el);
      console.log('universidade-cores: applied card-title', { text: nome, bgInline: el.style.backgroundColor, colorInline: el.style.color, computedBg: computed.backgroundColor, computedColor: computed.color });
    } catch (e) {
      // ignore
    }
  });

  function normalizeName(s) {
    return s ? s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^A-Z0-9]/gi, '').toUpperCase() : '';
  }

  function findFacultyColor(name) {
    const normalized = normalizeName(name);
    let match = null;
    Object.keys(coresUniversidades).forEach(function(key) {
      if (match) return;
      const normalizedKey = normalizeName(key);
      if (normalizedKey === normalized || normalizedKey.includes(normalized) || normalized.includes(normalizedKey)) {
        match = coresUniversidades[key];
      }
    });
    return match;
  }

  const facultyTitle = document.querySelector('.faculdade-titulo');
  if (facultyTitle) {
    const pageName = document.title ? document.title.trim() : '';
    let cor = findFacultyColor(pageName);
    if (!cor) {
      cor = findFacultyColor(facultyTitle.textContent || '');
    }
    let appliedToFacultyTitle = false;
    if (cor) {
      if (cor.gradient && cor.background) {
        facultyTitle.style.display = 'inline-block';
        facultyTitle.style.background = cor.background;
        facultyTitle.style.webkitBackgroundClip = 'text';
        facultyTitle.style.backgroundClip = 'text';
        facultyTitle.style.setProperty('-webkit-text-fill-color', 'transparent', 'important');
        facultyTitle.style.setProperty('text-fill-color', 'transparent', 'important');
        appliedToFacultyTitle = true;
      } else if (cor.color) {
        facultyTitle.style.setProperty('color', cor.color, 'important');
        appliedToFacultyTitle = true;
      }
    }
  }

  // Aplicar cor nos h3 com nomes de faculdades (para recomendacoes.html)
  (function applyColorsToH3() {
    document.querySelectorAll('h3').forEach(function(h3) {
      const text = h3.textContent.trim();
      const cor = findFacultyColor(text);
      if (cor && cor.color) {
        h3.style.setProperty('color', cor.color, 'important');
      }
    });
  })();

  // Aplicar cor nos nomes das faculdades onde quer que apareçam (exceto dentro de .homenagens)
  (function applyColorsToOccurrences() {
    const keys = Object.keys(coresUniversidades);
    // Tags a verificar onde os nomes costumam aparecer
    const selector = ' .card-title, .faculdade-titulo, h1, h2, h3, h4, h5, h6, p, a, li, span';
    // percorre todas as chaves e aplica substituição nos elementos de texto
    keys.forEach(function(key) {
      const corObj = coresUniversidades[key];
      if (!corObj) return;
      const color = corObj.color || null;
      if (!color) return;
      // criar regex escapando caracteres especiais, global e case-insensitive
      const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const re = new RegExp(escaped, 'gi');

      document.querySelectorAll(selector).forEach(function(el) {
        if (!el || !el.textContent) return;
        // não alterar conteúdo dentro da seção de homenagens
        if (el.closest && el.closest('.homenagens')) return;
        // não alterar h3 (já foi tratado acima)
        if (el.tagName === 'H3') return;
        // só tocar elementos que contenham o nome
        if (!re.test(el.textContent)) return;
        // substituir apenas o texto correspondente, preservando o HTML
        try {
          el.innerHTML = el.innerHTML.replace(re, function(match) {
            spanCount++;
            return '<span style="color:' + color + ' !important">' + match + '</span>';
          });
        } catch (e) {
          // se falhar (elemento sem innerHTML escrevível), ignorar
        }
      });
    });
  })();
  // Log diagnóstico: quantos títulos/cards/ocorrências foram afetados
  console.log('universidade-cores: appliedToCardTitles=', typeof appliedToCardTitles !== 'undefined' ? appliedToCardTitles : 0);
  console.log('universidade-cores: appliedToFacultyTitle=', typeof appliedToFacultyTitle !== 'undefined' ? appliedToFacultyTitle : false);
  console.log('universidade-cores: spanInjectedCount=', typeof spanCount !== 'undefined' ? spanCount : 0);
});
