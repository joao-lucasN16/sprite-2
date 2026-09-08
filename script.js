// Toggle de Tema
function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
}

// Controle de Fonte
let currentScale = parseFloat(localStorage.getItem('font-scale')) || 1.0;

function adjustFontSize(delta) {
  // Limita a escala entre 0.85x e 1.35x
  currentScale = Math.min(Math.max(currentScale + delta, 0.85), 1.35);
  currentScale = Math.round(currentScale * 100) / 100;
  
  document.documentElement.style.setProperty('--font-scale', currentScale);
  localStorage.setItem('font-scale', currentScale);
}let allModels = [];

// Carrega os dados dos modelos
async function loadModels() {
  try {
    const response = await fetch('/assets/data/models.json');
    allModels = await response.json();
    renderModels(allModels);
  } catch (error) {
    console.error("Erro ao carregar o catálogo de modelos:", error);
  }
}

// Renderiza os cards na tela
function renderModels(models) {
  const container = document.getElementById('models-container');
  container.innerHTML = '';

  if (models.length === 0) {
    container.innerHTML = '<p>Nenhum modelo encontrado com os filtros selecionados.</p>';
    return;
  }

  models.forEach(model => {
    const card = document.createElement('article');
    card.className = 'model-card';
    card.innerHTML = `
      <img src="${model.image}" alt="${model.name}">
      <h3>${model.name}</h3>
      <p>Categoria: ${model.category}</p>
      <p>Autonomia: ${model.range} km</p>
      <p>Preço a partir de: R$ ${model.price.toLocaleString('pt-BR')}</p>
      <a href="/modelos/${model.slug}/" class="btn">Ver detalhes</a>
    `;
    container.appendChild(card);
  });
}

// Filtra a lista com base nas opções do usuário
function applyFilters() {
  const categoryValue = document.getElementById('category-filter').value;
  const minRangeValue = parseInt(document.getElementById('range-filter').value, 10) || 0;

  const filtered = allModels.filter(model => {
    const matchCategory = categoryValue === 'all' || model.category === categoryValue;
    const matchRange = model.range >= minRangeValue;
    return matchCategory && matchRange;
  });

  renderModels(filtered);
}

document.addEventListener('DOMContentLoaded', loadModels);
