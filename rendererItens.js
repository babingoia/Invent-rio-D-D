//Funções genéricas
function listarAlgunsItems(tabela){
    console.log('Iniciando carregamento de dados...');
    window.api.listSomeItems(tabela);
    console.log('Processo finalizado.');
};

function deletarScraps(){
    console.log('Deletando colunas existentes...')
    const scraps = document.querySelectorAll('.scrap');

    scraps.forEach(scrap => {
        scrap.parentNode.removeChild(scrap);
    });
};

//Elementos da página
let id_item = '';
const btnCadastrar = document.querySelector('#btnCadastrar');
const btnListarItens = document.querySelector('#btnListarItens');
const form = document.querySelector('#formItem');
const listar = document.querySelector('#listar');
const slcCategoria = document.querySelector('#slcCategoria');
const slcTipos = document.querySelector('#slcTipos');

//Chamadas de API
slcCategoria.addEventListener('change', () => {

    deletarScraps();

    console.log('Colunas deletadas. Iniciando chamada de novas colunas...', slcCategoria.value);
    window.api.getTipos(slcCategoria.value);

    slcTipos.removeAttribute('class', 'escondido');
    slcCategoria.setAttribute('class', 'escondido');

    if (!slcCategoria.value){
        deletarScraps();
        slcTipos.setAttribute('class', 'escondido');
        form.removeAttribute('class', 'escondido');
    }
});

btnCadastrar.addEventListener('click', () => {
    let data = {
        id_tipo: id_item,
        categoria: slcCategoria.value
    };

    const formChilds = form.querySelectorAll('input');

    formChilds.forEach(element => {
        let value = element.value
        if (!isNaN(parseFloat(value) && isFinite(value))){
            data[element.name] = Number(value);
        } else{
            data[element.name] = value;
        }
    });
    console.log(data);
        
    window.api.inserirItem(data);
});

btnListarItens.addEventListener('click', () => listarAlgunsItems(btnListarItens.className));

//Movimento

slcTipos.addEventListener('change', () => {
    id_item = slcTipos.value;
    
    deletarScraps();
    slcTipos.setAttribute('class', 'escondido');
    form.removeAttribute('class', 'escondido');

    return id_item;
})