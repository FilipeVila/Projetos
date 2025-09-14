// O evento 'DOMContentLoaded' garante que o script só rode após a estrutura HTML ser totalmente carregada.
document.addEventListener('DOMContentLoaded', () => {

    /* ========================================================= */
    /* --- SEÇÃO 1: Lógica de Navegação do Menu                  --- */
    /* ========================================================= */
    
    // Seleciona todos os links do menu e todas as calculadoras
    const menuItems = document.querySelectorAll('.menu-item');
    const calculators = document.querySelectorAll('.calculator-grid');

    /**
     * Inicializa a navegação, garantindo que apenas a calculadora de Juros Compostos
     * esteja visível no carregamento da página.
     */
    const initializeNavigation = () => {
        calculators.forEach(calc => {
            // Esconde todas as calculadoras, exceto a que tem o ID 'juroscompostos'
            if (calc.id !== 'juroscompostos') {
                calc.classList.add('hidden');
            }
        });
    };

    /**
     * Lida com o evento de clique nos botões do menu, alternando a exibição das calculadoras.
     * @param {Event} event - O objeto de evento do clique.
     */
    const handleMenuClick = (event) => {
        event.preventDefault(); // Evita que o link recarregue a página

        const itemClicked = event.currentTarget;
        const calculatorToShow = itemClicked.dataset.calculator; // Pega o nome da calculadora do atributo data-

        // Remove a classe 'active' de todos os itens do menu para desativá-los visualmente
        menuItems.forEach(item => item.classList.remove('active'));
        // Adiciona a classe 'active' ao item que foi clicado
        itemClicked.classList.add('active');

        // Esconde todas as calculadoras
        calculators.forEach(calc => calc.classList.add('hidden'));
        
        // Encontra e exibe a calculadora correspondente ao item clicado
        const contentToShow = document.getElementById(calculatorToShow);
        if (contentToShow) {
            contentToShow.classList.remove('hidden');
        }
    };

    // Adiciona o listener de clique para cada item do menu
    menuItems.forEach(item => {
        item.addEventListener('click', handleMenuClick);
    });

    // Chama a função de inicialização ao carregar a página
    initializeNavigation();


    /* ========================================================= */
    /* --- SEÇÃO 2: Funções de Formatação de Inputs              --- */
    /* ========================================================= */
    
    // Seleciona os campos de input do formulário
    const capitalInicialInput = document.getElementById('capital-inicial');
    const taxaJurosInput = document.getElementById('taxa-juros');

    /**
     * Formata um valor numérico para o formato de moeda brasileira (R$).
     * @param {HTMLInputElement} input - O elemento input a ser formatado.
     */
    const formatarMoeda = (input) => {
        // Remove caracteres que não são dígitos ou vírgula, e substitui a vírgula por ponto
        let valor = input.value.replace(/[^\d,]/g, '').replace(',', '.');
        if (valor === '') return; // Sai da função se o valor for vazio
        
        const valorNumerico = parseFloat(valor);
        if (!isNaN(valorNumerico)) {
            // Formata o número para o padrão de moeda e atualiza o valor do input
            input.value = valorNumerico.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        }
    };

    /**
     * Formata um valor numérico para o formato de porcentagem (%).
     * @param {HTMLInputElement} input - O elemento input a ser formatado.
     */
    const formatarPorcentagem = (input) => {
        // Remove a vírgula, substitui por ponto e remove o símbolo de porcentagem
        let valor = input.value.replace(',', '.').replace('%', '').trim();
        if (valor === '') return;
        
        const valorNumerico = parseFloat(valor);
        if (!isNaN(valorNumerico)) {
            // Formata o número com duas casas decimais e adiciona o símbolo de porcentagem
            input.value = `${valorNumerico.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} %`;
        }
    };

    /**
     * Remove a formatação de moeda ou porcentagem de um input para permitir o cálculo.
     * @param {HTMLInputElement} input - O elemento input a ter a formatação removida.
     */
    const removerFormatacao = (input) => {
        // Remove todos os caracteres de formatação
        let valor = input.value.replace('R$', '').replace('%', '').replace(/\./g, '').replace(',', '.').trim();
        input.value = valor;
    };

    // Adiciona os listeners de foco e perda de foco para os inputs de valor
    capitalInicialInput.addEventListener('focusout', () => formatarMoeda(capitalInicialInput));
    capitalInicialInput.addEventListener('focus', () => removerFormatacao(capitalInicialInput));
    taxaJurosInput.addEventListener('focusout', () => formatarPorcentagem(taxaJurosInput));
    taxaJurosInput.addEventListener('focus', () => removerFormatacao(taxaJurosInput));


    /* ========================================================= */
    /* --- SEÇÃO 3: Lógica da Calculadora de Juros Compostos     --- */
    /* ========================================================= */

    // Seleciona o formulário e a área de resultado
    const jurosForm = document.getElementById('juros-form');
    const resultadoDiv = document.getElementById('resultado-juros');

    /**
     * Realiza o cálculo de juros compostos e exibe o resultado.
     * @param {Event} event - O objeto de evento de 'submit' do formulário.
     */
    const calcularJuros = (event) => {
        event.preventDefault(); // Impede o envio padrão do formulário, que recarregaria a página

        // Obtém e trata os valores dos inputs para garantir que sejam números
        const capitalInicial = parseFloat(capitalInicialInput.value.replace('R$', '').replace(/\./g, '').replace(',', '.'));
        let taxaJuros = parseFloat(taxaJurosInput.value.replace('%', '').replace(',', '.'));
        const periodo = parseFloat(document.getElementById('periodo').value);

        // Validação de dados robusta para evitar erros de cálculo
        if (isNaN(capitalInicial) || isNaN(taxaJuros) || isNaN(periodo) || capitalInicial < 0 || taxaJuros < 0 || periodo < 0) {
            resultadoDiv.innerHTML = '<p><strong>Resultado:</strong> Por favor, insira valores numéricos positivos válidos.</p>';
            return;
        }

        // Converte a taxa de porcentagem para decimal para o cálculo
        taxaJuros /= 100;
        
        // Fórmula do cálculo de juros compostos
        const montante = capitalInicial * Math.pow((1 + taxaJuros), periodo);
        const jurosGanhos = montante - capitalInicial;

        // Renderiza os resultados de forma segura na div de resultado
        resultadoDiv.innerHTML = `
            <p><strong>Resultado:</strong></p>
            <p>Capital Inicial: ${capitalInicial.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
            <p>Taxa de Juros: ${(taxaJuros * 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}% ao ano</p>
            <p>Período: ${periodo} anos</p>
            <p>Montante Final: <strong>${montante.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong></p>
            <p>Juros Ganhos: ${jurosGanhos.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
        `;
    };

    // Adiciona o listener para o evento de 'submit' do formulário
    jurosForm.addEventListener('submit', calcularJuros);
});