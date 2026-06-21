// =============================================
// Gearhead Project - script.js (Home)
// Autor: Victor Dourado
// Descrição: Busca projetos do JSON Server e renderiza os cards
// =============================================

const API_URL = 'http://localhost:3000/projetos';

// Armazena todos os itens para filtrar sem nova requisição
let todosOsProjetos = [];

/**
 * Busca todos os projetos do JSON Server
 * @returns {Promise<Array>} Array de projetos
 */
async function fetchItems() {
    const response = await fetch(API_URL);
    if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
    }
    const data = await response.json();
    return data;
}

/**
 * Cria e retorna o elemento HTML do card de um projeto
 * @param {Object} item - Objeto do projeto
 * @returns {HTMLElement} Elemento article com o card
 */
function createCard(item) {
    const article = document.createElement('article');
    article.classList.add('col-12', 'col-md-6', 'col-lg-4');
    article.setAttribute('data-categoria', item.categoria);

    // Formata o preço em BRL
    const precoFormatado = item.preco
        ? `R$ ${item.preco.toLocaleString('pt-BR')}`
        : 'Sob consulta';

    article.innerHTML = `
        <div class="card-item h-100">
            <div class="badge-tech">${item.potencia}</div>
            <img src="${item.imagem}" alt="${item.titulo}" loading="lazy">
            <div class="card-content">
                <span class="card-categoria">${item.categoria}</span>
                <h3>${item.titulo}</h3>
                <p>${item.descricaoCurta}</p>
                <div class="card-footer-info">
                    <span class="card-preco">${precoFormatado}</span>
                    <a href="details.html?id=${item.id}" class="btn-detalhes">
                        Ver Detalhes <i class="fas fa-arrow-right"></i>
                    </a>
                </div>
            </div>
        </div>
    `;
    return article;
}

/**
 * Limpa o container e renderiza os cards na tela
 * @param {Array} items - Array de projetos a serem exibidos
 */
function renderCards(items) {
    const container = document.getElementById('cardsContainer');
    container.innerHTML = ''; // Limpa o conteúdo atual

    if (items.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fas fa-search fa-3x text-muted mb-3"></i>
                <p class="text-muted">Nenhum projeto encontrado para esta categoria.</p>
            </div>
        `;
        return;
    }

    items.forEach(item => {
        const card = createCard(item);
        container.appendChild(card);
    });
}

/**
 * Filtra os cards por categoria clicada no menu lateral
 * @param {string|null} categoria - Nome da categoria ou null para todos
 * @param {HTMLElement} linkEl - Elemento <a> clicado
 */
function filtrarPorCategoria(categoria, linkEl) {
    // Atualiza a classe active no menu
    document.querySelectorAll('.side-menu ul li a').forEach(a => a.classList.remove('active'));
    if (linkEl) linkEl.classList.add('active');

    const filtrados = categoria
        ? todosOsProjetos.filter(p => p.categoria === categoria)
        : todosOsProjetos;

    renderCards(filtrados);
}

/**
 * Filtra os cards pelo texto digitado na busca
 */
function filterCards() {
    const termo = document.getElementById('searchInput').value.toLowerCase().trim();
    const filtrados = todosOsProjetos.filter(p =>
        p.titulo.toLowerCase().includes(termo) ||
        p.descricaoCurta.toLowerCase().includes(termo) ||
        p.categoria.toLowerCase().includes(termo) ||
        (p.tags && p.tags.some(tag => tag.toLowerCase().includes(termo)))
    );
    renderCards(filtrados);
}

/**
 * Função principal: inicializa a aplicação
 * Chama fetchItems() e depois renderCards()
 */
async function init() {
    const loadingMsg = document.getElementById('loadingMsg');
    const errorMsg = document.getElementById('errorMsg');
    const cardsContainer = document.getElementById('cardsContainer');

    try {
        // Busca os dados
        todosOsProjetos = await fetchItems();

        // Esconde loading e mostra cards
        loadingMsg.classList.add('d-none');
        cardsContainer.classList.remove('d-none');

        renderCards(todosOsProjetos);

    } catch (error) {
        console.error('Falha ao carregar projetos:', error);
        loadingMsg.classList.add('d-none');
        errorMsg.classList.remove('d-none');
    }
}

// Permite buscar apertando Enter
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keydown', e => {
            if (e.key === 'Enter') filterCards();
        });
    }
});

// Inicia a aplicação ao carregar a página
init();
