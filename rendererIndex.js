//Pegar itens da pagina
const telaAdicionar = document.getElementById('telaAdicionar');
const telaRemover = document.getElementById('telaRemover');
const btnAdicionar = document.querySelectorAll('.btnAdicionar');
const btnRemover = document.querySelectorAll('.btnRemover');
const btnAdicionarCancelar = document.getElementById('btnAdicionar-cancelar');
const btnRemoverCancelar = document.getElementById('btnRemover-cancelar');

//Funções genéricas
function abrirTela(tela){
    tela.style.display = 'flex';
    document.body.classList.add('blur-background');
};

function fecharTela(tela){
    tela.style.display = 'none';
    document.body.classList.remove('blur-background');
}

//Events listenners
btnAdicionar.forEach(botao => {
    botao.addEventListener('click', () => abrirTela(telaAdicionar));
});

btnRemover.forEach(botao => {
    botao.addEventListener('click', () => abrirTela(telaRemover));
});

btnAdicionarCancelar.addEventListener('click', () => fecharTela(telaAdicionar));

btnRemoverCancelar.addEventListener('click', () => fecharTela(telaRemover));
