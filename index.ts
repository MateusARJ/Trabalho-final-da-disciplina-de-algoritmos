
class Produto {
    nome: string;
    codigo: number;
    quantidade: number;
    preco: number;

    constructor(n: string, c: number, q: number, p: number) {
        this.nome = n;
        this.codigo = c;
        this.quantidade = q;
        this.preco = p;
    }
}

class GerenciadorDeProduto {
    produtos: Array<Produto>;

    constructor() {
        this.produtos = [];
    }
}

let gerenciador: GerenciadorDeProduto = new GerenciadorDeProduto();

function adicionarProduto() {
    let nomeInput = document.getElementById("nome") as HTMLInputElement;
    let codigoInput = document.getElementById("codigo") as HTMLInputElement;
    let quantidadeInput = document.getElementById("quantidade") as HTMLInputElement;
    let precoInput = document.getElementById("preco") as HTMLInputElement;

    let nome: string = nomeInput.value.trim();
    let codigo: number = Number(codigoInput.value.trim()); // .trim() remove espaços em branco no início e no final da string
    let quantidade: number = Number(quantidadeInput.value.trim());
    let preco: number = parseFloat(precoInput.value.trim());

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

    for (let produto of gerenciador.produtos) {
        if (produto.nome.toLowerCase() === nome.toLowerCase() && produto.codigo === codigo) {
            alert("Já existe um produto com o mesmo nome e código.");
            return;
        }
    }

    let tabela = document.getElementById("tabela-produtos");
    let linha = document.createElement("tr");

    gerenciador.produtos.push(new Produto(nome, codigo, quantidade, preco));

    localStorage.setItem("produtos", JSON.stringify(gerenciador.produtos)); // Guarda os valores na memória do navegador

    linha.innerHTML = `
        <td>${nome}</td>
        <td>${codigo}</td>
        <td>${quantidade}</td>
        <td>R$:${preco.toFixed(2)}</td>
        <td class="acoes">
            <button onclick= "editarProduto(this)"> Editar </button>
            <button class="remover" onclick="removerProduto(this)"> Remover </button>
        </td>
    `;

    if (tabela) {
        tabela.appendChild(linha);
    } else {
        console.log("Elemento tabela não encontrado!");
    }

    // Limpar os campos após adicionar
    limparCampos();
}

function limparCampos() {
    (document.getElementById("nome") as HTMLInputElement).value = '';
    (document.getElementById("codigo") as HTMLInputElement).value = '';
    (document.getElementById("quantidade") as HTMLInputElement).value = '';
    (document.getElementById("preco") as HTMLInputElement).value = '';
}

function carregarProdutosSalvos() {
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
                <td>R$:${produto.preco.toFixed(2)}</td>
                <td class="acoes">
                    <button onclick="editarProduto(this)">Editar</button>
                    <button class="remover" onclick="removerProduto(this)">Remover</button>
                </td>
            `;
            tabela.appendChild(linha);
        }
    }
}

function removerProduto(botao: HTMLButtonElement) {
    let linha = botao.parentElement?.parentElement as HTMLTableRowElement;
    const codigo = Number(linha.cells[1].textContent);

    // Remover do array.
    gerenciador.produtos = gerenciador.produtos.filter(p => p.codigo !== codigo);

    linha.remove();

    localStorage.setItem("produtos", JSON.stringify(gerenciador.produtos));
}

let codigoEmEdicao: number | null = null;

function editarProduto(botao: HTMLButtonElement) { // Pendente
    let linha = botao.parentElement?.parentElement as HTMLTableRowElement;

    const nome = linha.cells[0].textContent || '';
    const codigo = Number(linha.cells[1].textContent);
    const quantidade = Number(linha.cells[2].textContent);
    const precoTexto = linha.cells[3].textContent || '';
    const preco = Number(precoTexto.replace('R$:', '').trim());

    // Preenche os campos
    (document.getElementById("nome") as HTMLInputElement).value = nome;
    (document.getElementById("codigo") as HTMLInputElement).value = codigo.toString();
    (document.getElementById("quantidade") as HTMLInputElement).value = quantidade.toString();
    (document.getElementById("preco") as HTMLInputElement).value = preco.toString();

    // Salva o código em edição
    codigoEmEdicao = codigo;

    // Troca o botão "Adicionar Produto" por "Salvar Edição"
    const botaoAdicionar = document.querySelector("button[onclick='adicionarProduto()']") as HTMLButtonElement;
    botaoAdicionar.textContent = "Salvar Edição";
    botaoAdicionar.setAttribute("onclick", "salvarEdicao()");
}

function salvarEdicao() {
    let nomeInput = document.getElementById("nome") as HTMLInputElement;
    let codigoInput = document.getElementById("codigo") as HTMLInputElement;
    let quantidadeInput = document.getElementById("quantidade") as HTMLInputElement;
    let precoInput = document.getElementById("preco") as HTMLInputElement;

    let nome = nomeInput.value.trim();
    let codigo = Number(codigoInput.value.trim());
    let quantidade = Number(quantidadeInput.value.trim());
    let preco = parseFloat(precoInput.value.trim());

    // 3. Validar os dados (mesma validação da função adicionarProduto)
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

    // 4. Verificar se temos um código para edição (garantir que estamos editando um produto válido)
    if (codigoEmEdicao === null) {
        alert("Nenhum produto selecionado para edição.");
        return;
    }

    // 5. Encontrar o índice do produto que está sendo editado no array
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

    // 6. Atualizar os dados do produto no array
    gerenciador.produtos[indiceProduto] = { nome, codigo, quantidade, preco };

    // 7. Salvar no localStorage
    localStorage.setItem("produtos", JSON.stringify(gerenciador.produtos));

    // 8. Atualizar a tabela inteira para refletir as mudanças
    carregarProdutosSalvos();

    // 9. Resetar o botão para "Adicionar Produto" e sua função original
    const botaoAdicionar = document.querySelector("button[onclick='salvarEdicao()']") as HTMLButtonElement;
    botaoAdicionar.textContent = "Adicionar Produto";
    botaoAdicionar.setAttribute("onclick", "adicionarProduto()");

    limparCampos();

    // 11. Limpar a variável que indica edição
    codigoEmEdicao = null;

}

function buscarProdutos() {
    let nomeInput = document.getElementById("nome") as HTMLInputElement;
    let codigoInput = document.getElementById("codigo") as HTMLInputElement;
    let quantidadeInput = document.getElementById("quantidade") as HTMLInputElement;

    let nome = nomeInput.value.trim();
    let codigo = codigoInput.value.trim();
    let quantidade = quantidadeInput.value.trim();

    let tabela = document.getElementById("tabela-produtos") as HTMLTableSectionElement;
    tabela.innerHTML = '';

    for (let produto of gerenciador.produtos) {
        let nomeEncontrado = nome !== '' && produto.nome.toLowerCase() === nome.toLowerCase();
        let codigoEncontrado = codigo !== '' && produto.codigo === Number(codigo);
        let quantidadeEncontrada = quantidade !== "" && produto.quantidade === Number(quantidade);

        if (nomeEncontrado || codigoEncontrado || quantidadeEncontrada) {
            let linha = document.createElement("tr");
            linha.innerHTML = `
                <td>${produto.nome}</td>
                <td>${produto.codigo}</td>
                <td>${produto.quantidade}</td>
                <td>R$:${produto.preco.toFixed(2)}</td>
                <td class="acoes">
                    <button onclick="editarProduto(this)">Editar</button>
                    <button class="remover" onclick="removerProduto(this)">Remover</button>
                </td>
            `;
            tabela.appendChild(linha);
            return;
        }

        if (nome === '' && codigo === '' && quantidade === '') {
            for (let produto of gerenciador.produtos) {
                let linha = document.createElement("tr");
                linha.innerHTML = `
                    <td>${produto.nome}</td>
                    <td>${produto.codigo}</td>
                    <td>${produto.quantidade}</td>
                    <td>R$:${produto.preco.toFixed(2)}</td>
                    <td class="acoes">
                        <button onclick="editarProduto(this)">Editar</button>
                        <button class="remover" onclick="removerProduto(this)">Remover</button>
                    </td>
                `;
                tabela.appendChild(linha);
            }

            return;
        }
    }

    tabela.innerHTML = `<tr><td colspan="5">Produto não encontrado.</td></tr>`;
}

window.onload = carregarProdutosSalvos; // Quando atualizar janela será carregado os produtos registrados