console.log("O script details.js está rodando!");
const API_BASE_URL = 'http://localhost:3000/projetos';

/**
 * Busca um projeto específico pelo ID
 * @param {string|number} id - ID do projeto
 * @returns {Promise<Object>} Objeto do projeto
 */
async function fetchItemById(id) {
    const response = await fetch(`${API_BASE_URL}/${id}`);
    if (response.status === 404) {
        throw new Error('PROJETO_NAO_ENCONTRADO');
    }
    if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
    }
    const data = await response.json();
    return data;
}

/**
 * Renderiza os dados do projeto na página
 * @param {Object} item - Objeto do projeto
 */
function renderDetails(item) {
    // Atualiza o título da aba do navegador
    document.title = `${item.titulo} | Gearhead Project`;

    // Breadcrumb
    document.getElementById('breadcrumbTitle').textContent = item.titulo;

    // Imagem e Badge
    document.getElementById('detalheImagem').src = item.imagem;
    document.getElementById('detalheImagem').alt = item.titulo;
    document.getElementById('detalheBadge').textContent = item.potencia;

    // Informações principais
    document.getElementById('detalheCategoria').textContent = item.categoria;
    document.getElementById('detalheTitulo').textContent = item.titulo;
    document.getElementById('detalheDescricaoCurta').textContent = item.descricaoCurta;

    // Specs
    document.getElementById('detalhePotencia').textContent = item.potencia || 'N/D';
    document.getElementById('detalheMotor').textContent = item.motor || 'N/D';
    document.getElementById('detalheProprietario').textContent = item.proprietario || 'N/D';
    document.getElementById('detalheAno').textContent = item.ano || 'N/D';
    document.getElementById('detalhePais').textContent = item.pais || 'N/D';

    const precoFormatado = item.preco
        ? `R$ ${item.preco.toLocaleString('pt-BR')}`
        : 'Sob consulta';
    document.getElementById('detalhePreco').textContent = precoFormatado;

    // Descrição completa
    document.getElementById('detalheDescricaoCompleta').textContent = item.descricaoCompleta;

    // Tags - renderizadas como chips/badges
    const tagsContainer = document.getElementById('detalheTags');
    tagsContainer.innerHTML = '';
    if (item.tags && item.tags.length > 0) {
        item.tags.forEach(tag => {
            const chip = document.createElement('span');
            chip.classList.add('tag-chip');
            chip.textContent = `#${tag}`;
            tagsContainer.appendChild(chip);
        });
    } else {
        tagsContainer.innerHTML = '<p class="text-muted">Sem tags cadastradas.</p>';
    }
}

/**
 * Exibe uma mensagem de erro na tela
 * @param {string} mensagem - Mensagem de erro
 */
function showError(mensagem) {
    document.getElementById('loadingMsg').classList.add('d-none');
    document.getElementById('detailsContent').classList.add('d-none');

    const errorBox = document.getElementById('errorMsg');
    document.getElementById('errorText').innerHTML = mensagem;
    errorBox.classList.remove('d-none');
}

/**
 * Função principal: lê o ID da URL, busca e renderiza o projeto
 */
async function init() {
    // 1. Ler o parâmetro 'id' da URL usando URLSearchParams
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    // 2. Tratamento: ID ausente na URL
    if (!id) {
        showError(`
            <strong>Nenhum projeto selecionado.</strong><br>
            Nenhum ID foi encontrado na URL. 
            <a href="index.html" class="alert-link">Volte para a Home</a> e clique em "Ver Detalhes" em um projeto.
        `);
        return;
    }

    try {
        // 3. Busca o item pelo endpoint /projetos/{id}
        const projeto = await fetchItemById(id);

        // 4. Esconde loading e mostra conteúdo
        document.getElementById('loadingMsg').classList.add('d-none');
        document.getElementById('detailsContent').classList.remove('d-none');

        // 5. Renderiza os detalhes na tela
        renderDetails(projeto);

    } catch (error) {
        if (error.message === 'PROJETO_NAO_ENCONTRADO') {
            showError(`
                <strong>Projeto não encontrado.</strong><br>
                Não existe um projeto com o ID <code>${id}</code> na base de dados. 
                <a href="index.html" class="alert-link">Volte para a Home</a>.
            `);
        } else {
            showError(`
                <strong>Erro ao carregar o projeto.</strong><br>
                Verifique se o JSON Server está rodando em <code>http://localhost:3000</code>.<br>
                <small>Execute: <code>npx json-server --watch db/db.json --port 3000</code></small>
            `);
            console.error('Erro:', error);
        }
    }
}

// Inicia quando a página carrega
init();
