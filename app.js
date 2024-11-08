// Função principal que realiza o sorteio de números
function sortear() {
    // Obtém os valores inseridos pelo usuário e os converte para inteiros
    let quantidade = parseInt(document.getElementById('quantidade').value);
    let de = parseInt(document.getElementById('de').value);
    let ate = parseInt(document.getElementById('ate').value);
    
    // Verifica se os valores inseridos são válidos
    if (isNaN(de) || isNaN(ate) || isNaN(quantidade) || quantidade < 1) {
        exibirMensagem('Por favor, insira valores válidos e quantidade maior que zero.');
        return; // Interrompe a execução da função
    }

    // Verifica se 'de' é menor que 'ate'
    if (de >= ate) {
        exibirMensagem('Campo "Do número" deve ser inferior ao campo "Até o número". Verifique!');
        return; // Interrompe a execução da função
    } else if (quantidade > (ate - de + 1)) {
        // Verifica se a quantidade é maior que o intervalo
        exibirMensagem('Campo "Quantidade" deve ser menor ou igual ao intervalo informado.');
        return; // Interrompe a execução da função
    }

    // Array para armazenar os números sorteados
    let sorteados = [];
    
    // Loop para gerar números aleatórios até que a quantidade desejada seja atingida
    while (sorteados.length < quantidade) {
        let numero = obterNumeroAleatorio(de, ate); // Gera um número aleatório
        
        // Verifica se o número já foi sorteado
        if (!sorteados.includes(numero)) {
            sorteados.push(numero); // Adiciona o número ao array
        }
    }
    
    // Exibe os números sorteados no elemento resultado
    let resultado = document.getElementById('resultado');
    resultado.innerHTML = `<label class="texto__paragrafo">Números sorteados: ${sorteados.join(', ')}</label>`;

    // Atualiza o estado do botão de reiniciar
    alterarStatusBotao();
}

// Função que gera um número aleatório entre um mínimo e um máximo
function obterNumeroAleatorio(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min; // Gera e retorna um número inteiro aleatório
}

// Função que altera o estado do botão de reiniciar
function alterarStatusBotao() {
    let botao = document.getElementById('btn-reiniciar');
    if (botao.classList.contains('container__botao-desabilitado')) {
        // Se o botão estiver desabilitado, habilita
        botao.classList.remove('container__botao-desabilitado');
        botao.classList.add('container__botao');
    } else {
        // Se o botão estiver habilitado, desabilita
        botao.classList.remove('container__botao');
        botao.classList.add('container__botao-desabilitado');
    }   
}

// Função que exibe mensagens de erro ou informação
function exibirMensagem(mensagem) {
    let mensagemElemento = document.getElementById('mensagem');
    mensagemElemento.innerHTML = mensagem;
    setTimeout(() => {
        mensagemElemento.innerHTML = ''; // Limpa a mensagem após 3 segundos
    }, 3000);
}

// Função para reiniciar os campos e resultados
function reiniciar() {
    // Limpa os campos de entrada
    document.getElementById('quantidade').value = '';
    document.getElementById('de').value = '';
    document.getElementById('ate').value = '';
    
    // Reseta o resultado para uma mensagem padrão
    document.getElementById('resultado').innerHTML = '<label class="texto__paragrafo">Números sorteados: nenhum até agora</label>';
    
    // Atualiza o estado do botão de reiniciar
    alterarStatusBotao(); 
}
