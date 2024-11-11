// Função principal que realiza o sorteio de números
function sortear() {
    let { quantidade, de, ate } = obterValoresEntradas();
    if (!quantidade) return; // Interrompe a execução em caso de erro

    // Gera os números sorteados
    let sorteados = gerarNumerosSorteados(quantidade, de, ate);

    // Exibe os números sorteados
    exibirResultadoModal(sorteados); // Altere para exibir no modal

    // Exibe uma mensagem de sucesso
    exibirMensagem('Sorteio realizado com sucesso!');

    // Atualiza o estado do botão de reiniciar
    alterarStatusBotao();

    // Salva o sorteio no histórico
    salvarHistorico(sorteados);
}

// Função que obtém e valida os valores de entrada
function obterValoresEntradas() {
    let quantidade = parseInt(document.getElementById('quantidade').value);
    let de = parseInt(document.getElementById('de').value);
    let ate = parseInt(document.getElementById('ate').value);

    // Valida os valores inseridos
    if (isNaN(de) || isNaN(ate) || isNaN(quantidade) || quantidade < 1) {
        exibirMensagem('Por favor, insira valores válidos e quantidade maior que zero.');
        return {}; // Retorna objeto vazio em caso de erro
    }

    if (de >= ate) {
        exibirMensagem('Campo "Do número" deve ser inferior ao campo "Até o número". Verifique!');
        return {}; // Retorna objeto vazio em caso de erro
    }

    if (quantidade > (ate - de + 1)) {
        exibirMensagem('Campo "Quantidade" deve ser menor ou igual ao intervalo informado.');
        return {}; // Retorna objeto vazio em caso de erro
    }

    return { quantidade, de, ate };
}

// Função que gera números sorteados únicos
function gerarNumerosSorteados(quantidade, de, ate) {
    let sorteados = [];
    
    // Loop para gerar números aleatórios até que a quantidade desejada seja atingida
    while (sorteados.length < quantidade) {
        let numero = obterNumeroAleatorio(de, ate);
        if (!sorteados.includes(numero)) sorteados.push(numero); // Adiciona número único ao array
    }

    return sorteados;
}

// Função que gera um número aleatório entre um mínimo e um máximo
function obterNumeroAleatorio(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min; // Gera número aleatório
}

// Função para exibir os números sorteados no Modal
function exibirResultadoModal(sorteados) {
    let modal = document.getElementById('modalResultado');
    let modalConteudo = document.getElementById('modalConteudo');
    modalConteudo.innerHTML = `Números sorteados: <strong>${sorteados.join(', ')}</strong>`;
    modal.style.display = 'block'; // Exibe o modal
}

// Função que fecha o modal
function fecharModal() {
    document.getElementById('modalResultado').style.display = 'none';
}

// Função que altera o estado do botão de reiniciar (habilita/desabilita)
function alterarStatusBotao() {
    let botao = document.getElementById('btn-reiniciar');
    botao.classList.toggle('container__botao');
    botao.classList.toggle('container__botao-desabilitado');
}

// Função para desabilitar o botão "Sortear" quando a quantidade for 0 ou inválida
function desabilitarBotaoSortear() {
    let botao = document.getElementById('btn-sortear');
    let quantidade = parseInt(document.getElementById('quantidade').value);
    
    if (quantidade < 1 || isNaN(quantidade)) {
        botao.disabled = true;  // Desabilita o botão de sorteio
    } else {
        botao.disabled = false;  // Habilita o botão de sorteio
    }
}

// Função que exibe mensagens de erro ou informação
function exibirMensagem(mensagem) {
    let mensagemElemento = document.getElementById('mensagem');
    mensagemElemento.innerHTML = mensagem;
    setTimeout(() => mensagemElemento.innerHTML = '', 3000); // Limpa a mensagem após 3 segundos
}

// Função para reiniciar os campos e resultados
function reiniciar() {
    // Limpa os campos de entrada
    limparCampos('quantidade', 'de', 'ate');
    
    // Reseta o resultado para uma mensagem padrão
    document.getElementById('resultado').innerHTML = '<label class="texto__paragrafo">Números sorteados: nenhum até agora</label>';
    
    // Atualiza o estado do botão de reiniciar
    alterarStatusBotao();
}

// Função genérica para limpar campos
function limparCampos(...ids) {
    ids.forEach(id => {
        document.getElementById(id).value = ''; // Limpa cada campo especificado
    });
}

// Função para salvar o histórico de sorteios
function salvarHistorico(sorteados) {
    let historico = JSON.parse(localStorage.getItem('historico')) || []; // Obtém o histórico do localStorage
    historico.push(sorteados); // Adiciona os números sorteados no histórico
    localStorage.setItem('historico', JSON.stringify(historico)); // Salva o histórico no localStorage
}

// Função para exibir o histórico de sorteios
function exibirHistorico() {
    let historico = JSON.parse(localStorage.getItem('historico')) || [];
    let resultado = document.getElementById('historico');
    resultado.innerHTML = historico.map((sorteios, index) => {
        return `<p>Sorteio ${index + 1}: ${sorteios.join(', ')}</p>`;
    }).join('');
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
    intervaloSorteio = setInterval(() => {
        sortear(); // Realiza o sorteio
    }, 2000); // Sorteia a cada 2 segundos
}

// Função para parar o sorteio automático
function pararSorteioAutomatico() {
    clearInterval(intervaloSorteio);
}

// Adiciona evento para exibir histórico ao clicar no botão
document.getElementById('btn-exibir-historico').addEventListener('click', exibirHistorico);

// Adiciona evento para exportar histórico ao clicar no botão
document.getElementById('btn-exportar-historico').addEventListener('click', exportarHistoricoCSV);

// Adiciona evento para excluir o histórico ao clicar no botão
document.getElementById('btn-excluir-historico').addEventListener('click', excluirHistorico);

// Adiciona eventos para validar e desabilitar o botão sortear enquanto o usuário digita
document.getElementById('quantidade').addEventListener('input', desabilitarBotaoSortear);
document.getElementById('de').addEventListener('input', desabilitarBotaoSortear);
document.getElementById('ate').addEventListener('input', desabilitarBotaoSortear);

// Adiciona eventos para iniciar e parar o sorteio automático
document.getElementById('btn-iniciar-sorteio').addEventListener('click', iniciarSorteioAutomatico);
document.getElementById('btn-parar-sorteio').addEventListener('click', pararSorteioAutomatico);

// Função para fechar o modal
document.getElementById('btn-fechar-modal').addEventListener('click', fecharModal);
