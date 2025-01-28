//libs


//Pegar itens da pagina
const telaAdicionar = document.getElementById('telaAdicionar');
const telaRemover = document.getElementById('telaRemover');
const btnAdicionar = document.querySelectorAll('.btnAdicionar');
const btnRemover = document.querySelectorAll('.btnRemover');
const btnAdicionarCancelar = document.getElementById('btnAdicionar-cancelar');
const btnRemoverCancelar = document.getElementById('btnRemover-cancelar');

//Funções genéricas
function deletarScraps(){
    console.log('Deletando colunas existentes...')
    const scraps = document.querySelectorAll('.scrap');

    scraps.forEach(scrap => {
        scrap.parentNode.removeChild(scrap);
    });
};

function abrirTela(tela){
    tela.style.display = 'flex';
    document.body.classList.add('blur-background');
};

function fecharTela(tela){
    tela.style.display = 'none';
    document.body.classList.remove('blur-background');
}

function puxar_itens(){
    window.api.getItens();
}

//Events listenners
btnAdicionar.forEach(botao => {
    botao.addEventListener('click', () => {abrirTela(telaAdicionar); puxar_itens();});
});

btnRemover.forEach(botao => {
    botao.addEventListener('click', () => {abrirTela(telaRemover); puxar_itens();});
});

console.log(btnAdicionarCancelar, btnRemoverCancelar);

btnAdicionarCancelar.addEventListener('click', () => {fecharTela(telaAdicionar); deletarScraps();});

btnRemoverCancelar.addEventListener('click', () => {fecharTela(telaRemover); deletarScraps();});
