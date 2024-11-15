// Função principal que realiza o sorteio de números
function sortear() {
    let { quantidade, de, ate } = obterValoresEntradas();
    if (!quantidade) return; // Interrompe a execução em caso de erro

    // Gera e exibe os números sorteados
    let sorteados = gerarNumerosSorteados(quantidade, de, ate);
    console.log("Números sorteados:", sorteados);  // Log para depuração

    // Exibe mensagem de sucesso e atualiza o estado do botão de reiniciar
    exibirMensagem('Sorteio realizado com sucesso!');
    alterarStatusBotao();

    // Salva o sorteio no histórico
    salvarHistorico(sorteados);

    // Exibe os números sorteados no campo de resultado
    document.getElementById('resultado').innerHTML = `<label class="texto__paragrafo">Números sorteados: ${sorteados.join(', ')}</label>`;
}

// Função que obtém e valida os valores de entrada
function obterValoresEntradas() {
    let quantidade = parseInt(document.getElementById('quantidade').value);
    let de = parseInt(document.getElementById('de').value);
    let ate = parseInt(document.getElementById('ate').value);

    if (isNaN(de) || isNaN(ate) || isNaN(quantidade) || quantidade < 1) {
        return exibirMensagem('Por favor, insira valores válidos e quantidade maior que zero.') || {};
    }

    if (de >= ate) return exibirMensagem('Campo "Do número" deve ser inferior ao campo "Até o número". Verifique!') || {};
    if (quantidade > (ate - de + 1)) return exibirMensagem('Campo "Quantidade" deve ser menor ou igual ao intervalo informado.') || {};

    return { quantidade, de, ate };
}

// Função que gera números sorteados únicos
function gerarNumerosSorteados(quantidade, de, ate) {
    let sorteados = new Set();
    while (sorteados.size < quantidade) {
        sorteados.add(obterNumeroAleatorio(de, ate));
    }
    return [...sorteados]; // Converte o Set de volta para um array
}

// Função que gera um número aleatório entre um mínimo e um máximo
function obterNumeroAleatorio(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Função para alterar o estado do botão de reiniciar (habilita/desabilita)
function alterarStatusBotao() {
    let botao = document.getElementById('btn-reiniciar');
    botao.classList.toggle('container__botao');
    botao.classList.toggle('container__botao-desabilitado');
}

// Função para desabilitar o botão "Sortear" quando a quantidade for 0 ou inválida
function desabilitarBotaoSortear() {
    let botao = document.getElementById('btn-sortear');
    let quantidade = parseInt(document.getElementById('quantidade').value);
    botao.disabled = isNaN(quantidade) || quantidade < 1;
}

// Função para exibir mensagens de erro ou informação
function exibirMensagem(mensagem) {
    let mensagemElemento = document.getElementById('mensagem');
    mensagemElemento.innerHTML = mensagem;
    setTimeout(() => mensagemElemento.innerHTML = '', 3000); // Limpa a mensagem após 3 segundos
}

// Função para reiniciar os campos e resultados
function reiniciar() {
    limparCampos('quantidade', 'de', 'ate');
    document.getElementById('resultado').innerHTML = '<label class="texto__paragrafo">Números sorteados: nenhum até agora</label>';
    alterarStatusBotao();
}

// Função genérica para limpar campos
function limparCampos(...ids) {
    ids.forEach(id => document.getElementById(id).value = ''); // Limpa cada campo especificado
}

// Função para salvar o histórico de sorteios
function salvarHistorico(sorteados) {
    let historico = JSON.parse(localStorage.getItem('historico')) || [];
    historico.push(sorteados);
    localStorage.setItem('historico', JSON.stringify(historico));
}

// Função para exibir o histórico de sorteios
function exibirHistorico() {
    let historico = JSON.parse(localStorage.getItem('historico')) || [];
    let resultado = document.getElementById('historico');
    resultado.innerHTML = historico.map((sorteios, index) => 
        `<p>Sorteio ${index + 1}: ${sorteios.join(', ')}</p>`
    ).join('');
}

// Função para excluir o histórico de sorteios
function excluirHistorico() {
    if (confirm('Tem certeza que deseja excluir todo o histórico?')) {
        localStorage.removeItem('historico');
        exibirHistorico(); // Atualiza o histórico após exclusão
    }
}

// Função para exportar o histórico para CSV
function exportarHistoricoCSV() {
    let historico = JSON.parse(localStorage.getItem('historico')) || [];
    let csvContent = 'Sorteio, Números Sorteados\n';
    historico.forEach((sorteio, index) => {
        csvContent += `${index + 1}, ${sorteio.join(', ')}\n`;
    });

    let blob = new Blob([csvContent], { type: 'text/csv' });
    let link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'historico_sorteios.csv';
    link.click();
}

// Função para iniciar sorteio automático
let intervaloSorteio;
function iniciarSorteioAutomatico() {
    intervaloSorteio = setInterval(sortear, 2000); // Sorteia a cada 2 segundos
}

// Função para parar o sorteio automático
function pararSorteioAutomatico() {
    clearInterval(intervaloSorteio);
}

// Adiciona eventos para as interações
document.getElementById('btn-exibir-historico').addEventListener('click', exibirHistorico);
document.getElementById('btn-exportar-historico').addEventListener('click', exportarHistoricoCSV);
document.getElementById('btn-excluir-historico').addEventListener('click', excluirHistorico);
document.getElementById('quantidade').addEventListener('input', desabilitarBotaoSortear);
document.getElementById('de').addEventListener('input', desabilitarBotaoSortear);
document.getElementById('ate').addEventListener('input', desabilitarBotaoSortear);
document.getElementById('btn-iniciar-sorteio').addEventListener('click', iniciarSorteioAutomatico);
document.getElementById('btn-parar-sorteio').addEventListener('click', pararSorteioAutomatico);
