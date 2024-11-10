// Função principal que realiza o sorteio de números
function sortear() {
    let { quantidade, de, ate } = obterValoresEntradas();
    if (!quantidade) return; // Interrompe a execução em caso de erro

    // Gera os números sorteados
    let sorteados = gerarNumerosSorteados(quantidade, de, ate);

    // Exibe os números sorteados
    exibirResultado(sorteados);

    // Atualiza o estado do botão de reiniciar
    alterarStatusBotao();
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

// Função que exibe os números sorteados no elemento de resultado
function exibirResultado(sorteados) {
    let resultado = document.getElementById('resultado');
    resultado.innerHTML = `<label class="texto__paragrafo">Números sorteados: ${sorteados.join(', ')}</label>`;
}

// Função que altera o estado do botão de reiniciar (habilita/desabilita)
function alterarStatusBotao() {
    let botao = document.getElementById('btn-reiniciar');
    botao.classList.toggle('container__botao');
    botao.classList.toggle('container__botao-desabilitado');
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
