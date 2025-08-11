class Produto { //criando uma classe para atributos de "peça"
    nome: string;
    codigo: number;
    quantidade: number;
    preco: number;

    constructor(n: string, c: number, q: number, p: number) { //cria um construtor para inicializar os atributos nome, codigo, quantidade e preco
        this.nome = n;
        this.codigo = c;
        this.quantidade = q;
        this.preco = p;
    }
}

class GerenciadorDeProduto { // cria uma classe para gerenciar os produtos 
    produtos: Array<Produto>;

    constructor() { // cria um construtor para inicializar "produtos"
        this.produtos = [];
    }
}

let gerenciador: GerenciadorDeProduto = new GerenciadorDeProduto(); // cria um objeto de uma classe e armazena ele em uma variável com o tipo indicado

function adicionarProduto(): void { // cria uma função para adicionar produtos
    let nomeInput = document.getElementById("nome") as HTMLInputElement;
    let codigoInput = document.getElementById("codigo") as HTMLInputElement;
    let quantidadeInput = document.getElementById("quantidade") as HTMLInputElement;
    let precoInput = document.getElementById("preco") as HTMLInputElement;

    let nome: string = nomeInput.value.trim();
    let codigo: number = Number(codigoInput.value.trim()); // .trim() remove espaços em branco no início e no final da string
    let quantidade: number = Number(quantidadeInput.value.trim());
    let preco: number = parseFloat(precoInput.value.trim());

    if (!nome || !codigo || !quantidade || !preco) { // verificação para caso o usuário não digite nada em algum dos campos
        alert("Preencha todos os campos!");
        return;
    }

    if (codigo <= 0 || quantidade <= 0 || preco <= 0) { // verificação para valor negativo ou == a zero
        alert('Proibido valores negativos ou valores iguais a zero.');
        return;
    }

    const nomeRegex = /^[A-Za-zÀ-ÿ\s]+$/; // declara uma constante nome
    if (!nomeRegex.test(nome)) { // verificação para o campo nome conter somente letras e espaços
        alert("O nome da peça deve conter apenas letras e espaços.");
        return;
    }

    for (let produto of gerenciador.produtos) { // loop controlado para não haver produtos com mesmo nome  e codigo
        if (produto.nome.toLowerCase() === nome.toLowerCase() && produto.codigo === codigo) {
            alert("Já existe um produto com o mesmo nome e código.");
            return;
        }
    }

    let tabela = document.getElementById("tabela-produtos"); // cria uma variavel para adicionar elementos em uma tabela
    let linha = document.createElement("tr"); // cria uma linha que vai ser adicionada na tabela 

    gerenciador.produtos.push(new Produto(nome, codigo, quantidade, preco)); // cria um novo produto e adiciona ele ao array de produtos que pertence ao objeto gerenciado

    localStorage.setItem("produtos", JSON.stringify(gerenciador.produtos)); // Guarda os valores na memória do navegador

    linha.innerHTML = `                    
        <td>${nome}</td>
        <td>${codigo}</td>
        <td>${quantidade}</td>
        <td>R$ ${preco.toFixed(2)}</td>
        <td class="acoes">
            <button onclick= "editarProduto(this)"> Editar </button>
            <button class="remover" onclick="removerProduto(this)"> Remover </button>
        </td>
    `; // monta uma linha de tabela com os dados de um produto (nome, código, quantidade, preço) e incluindo dois botões

    if (tabela) { //verifica se o elemento HTML com o ID "tabela" foi encontrado antes de tentar adicionar a linha
        tabela.appendChild(linha);
    } else {
        console.log("Elemento tabela não encontrado!"); // caso não passe pela verificação exiber "elemento tabela não encontrado"
    }

    // Limpar os campos após adicionar o produto
    limparCampos();
}

function limparCampos() { //função para limpar os campos nome, codigo, quantidade e preço
    (document.getElementById("nome") as HTMLInputElement).value = '';
    (document.getElementById("codigo") as HTMLInputElement).value = '';
    (document.getElementById("quantidade") as HTMLInputElement).value = '';
    (document.getElementById("preco") as HTMLInputElement).value = '';
}

function carregarProdutosSalvos() { //função para carregar os produtos salvos 
    let produtosSalvos = localStorage.getItem("produtos");

    if (produtosSalvos) {
        gerenciador.produtos = JSON.parse(produtosSalvos);

        const tabela = document.getElementById("tabela-produtos") as HTMLTableSectionElement;

        tabela.innerHTML = ''; // limpa a tabela

        for (let produto of gerenciador.produtos) {
            let linha = document.createElement("tr");
            linha.innerHTML = `
                <td>${produto.nome}</td>
                <td>${produto.codigo}</td>
                <td>${produto.quantidade}</td>
                <td>R$ ${produto.preco.toFixed(2)}</td>
                <td class="acoes">
                    <button onclick="editarProduto(this)">Editar</button>
                    <button class="remover" onclick="removerProduto(this)">Remover</button>
                </td>
            `;
            tabela.appendChild(linha);
        }
    }
}

function removerProduto(botao: HTMLButtonElement): void { //função para remover os produtos que o usuário quiser
    let linha = botao.parentElement?.parentElement as HTMLTableRowElement;
    let codigo = Number(linha.cells[1].textContent);

    // Remover objetos do array.
    gerenciador.produtos = gerenciador.produtos.filter(p => p.codigo !== codigo);

    linha.remove();

    localStorage.setItem("produtos", JSON.stringify(gerenciador.produtos));
}

let codigoEmEdicao: number | null = null;

function editarProduto(botao: HTMLButtonElement): void {
    let linha = botao.parentElement?.parentElement as HTMLTableRowElement;

    let nome: string = linha.cells[0].textContent || '';
    let codigo: number = Number(linha.cells[1].textContent);
    let quantidade: number = Number(linha.cells[2].textContent);
    let precoTexto: string = linha.cells[3].textContent || '';
    let preco = Number(precoTexto.replace('R$:', '').trim());

    // Preenche os campos
    (document.getElementById("nome") as HTMLInputElement).value = nome;
    (document.getElementById("codigo") as HTMLInputElement).value = codigo.toString();
    (document.getElementById("quantidade") as HTMLInputElement).value = quantidade.toString();
    (document.getElementById("preco") as HTMLInputElement).value = preco.toString();

    // Salva o código em edição
    codigoEmEdicao = codigo;

    // Troca o botão "Adicionar Produto" por "Salvar Edição"
    let botaoAdicionar = document.querySelector("button[onclick='adicionarProduto()']") as HTMLButtonElement;
    botaoAdicionar.textContent = "Salvar Edição";
    botaoAdicionar.setAttribute("onclick", "salvarEdicao()");
}

function salvarEdicao(): void { //função para salvar a edição feita 
    let nomeInput = document.getElementById("nome") as HTMLInputElement;
    let codigoInput = document.getElementById("codigo") as HTMLInputElement;
    let quantidadeInput = document.getElementById("quantidade") as HTMLInputElement;
    let precoInput = document.getElementById("preco") as HTMLInputElement;

    let nome: string = nomeInput.value.trim();
    let codigo: number = Number(codigoInput.value.trim());
    let quantidade: number = Number(quantidadeInput.value.trim());
    let preco: number = parseFloat(precoInput.value.trim());

    // Validar os dados (mesma validação da função adicionarProduto)
    if (!nome || !codigo || !quantidade || !preco) {
        alert("Preencha todos os campos!");
        return;
    }

    if (codigo <= 0 || quantidade <= 0 || preco <= 0) {
        alert('Proibido valores negativos ou valores iguais a zero.');
        return;
    }

    const nomeRegex = /^[A-Za-zÀ-ÿ\s]+$/;
    if (!nomeRegex.test(nome)) {
        alert("O nome da peça deve conter apenas letras e espaços.");
        return;
    }

    // Verificar se temos um código para edição (garantir que estamos editando um produto válido)
    if (codigoEmEdicao === null) {
        alert("Nenhum produto selecionado para edição.");
        return;
    }

    // Encontrar o índice do produto que está sendo editado no array
    let indiceProduto = gerenciador.produtos.findIndex(produto => produto.codigo === codigoEmEdicao);

    if (indiceProduto === -1) {
        alert("Produto não encontrado no catálogo.");
        return;
    }

    for (let i = 0; i < gerenciador.produtos.length; i++) {
        if (i !== indiceProduto) {
            let produto = gerenciador.produtos[i];
            if (produto.nome.toLowerCase() === nome.toLowerCase() && produto.codigo === codigo) {
                alert("Já existe outro produto com o mesmo nome e código.");
                return;
            }
        }
    }

    // Atualizar os dados do produto no objeto dentro do array
    gerenciador.produtos[indiceProduto] = { nome, codigo, quantidade, preco };

    // Salvar no localStorage
    localStorage.setItem("produtos", JSON.stringify(gerenciador.produtos));

    // Atualizar a tabela inteira para refletir as mudanças
    carregarProdutosSalvos();

    // Resetar o botão para "Adicionar Produto" e sua função original
    let botaoAdicionar = document.querySelector("button[onclick='salvarEdicao()']") as HTMLButtonElement;
    botaoAdicionar.textContent = "Adicionar Produto";
    botaoAdicionar.setAttribute("onclick", "adicionarProduto()");

    limparCampos();

    // Limpar a variável que indica edição
    codigoEmEdicao = null;

}

function buscarProdutos(): void { // função para buscar produtos dentro da tabela
    let nomeInput = document.getElementById("nome") as HTMLInputElement;
    let codigoInput = document.getElementById("codigo") as HTMLInputElement;
    let quantidadeInput = document.getElementById("quantidade") as HTMLInputElement;

    let nome: string = nomeInput.value.trim();
    let codigo: string = codigoInput.value.trim();
    let quantidade: string = quantidadeInput.value.trim();

    let tabela = document.getElementById("tabela-produtos") as HTMLTableSectionElement;
    tabela.innerHTML = '';

    // Caso todos os campos estejam vazios
    if (nome === '' && codigo === '' && quantidade === '') {
        for (let produto of gerenciador.produtos) {
            let linha = document.createElement("tr");
            linha.innerHTML = `
                <td>${produto.nome}</td>
                <td>${produto.codigo}</td>
                <td>${produto.quantidade}</td>
                <td>R$ ${produto.preco.toFixed(2)}</td>
                <td class="acoes">
                    <button onclick="editarProduto(this)">Editar</button>
                    <button class="remover" onclick="removerProduto(this)">Remover</button>
                </td>
            `;
            tabela.appendChild(linha);
        }
        return;
    }

    // Busca filtrada
    let encontrou: boolean = false;

    for (let produto of gerenciador.produtos) {
        let nomeEncontrado: boolean = nome !== '' && produto.nome.toLowerCase() === nome.toLowerCase();
        let codigoEncontrado: boolean = codigo !== '' && produto.codigo === Number(codigo);
        let quantidadeEncontrada: boolean = quantidade !== "" && produto.quantidade === Number(quantidade);

        if (nomeEncontrado || codigoEncontrado || quantidadeEncontrada) {
            let linha = document.createElement("tr");
            linha.innerHTML = `
                <td>${produto.nome}</td>
                <td>${produto.codigo}</td>
                <td>${produto.quantidade}</td>
                <td>R$ ${produto.preco.toFixed(2)}</td>
                <td class="acoes">
                    <button onclick="editarProduto(this)">Editar</button>
                    <button class="remover" onclick="removerProduto(this)">Remover</button>
                </td>
            `;
            tabela.appendChild(linha);
            encontrou = true;
        }
    }

    // Só exibe a mensagem se não encontrar nada
    if (!encontrou) {
        tabela.innerHTML = `<tr><td colspan="5">Produto não encontrado.</td></tr>`;
    }
}

window.onload = carregarProdutosSalvos; // Quando atualizar janela será carregado os produtos registrados