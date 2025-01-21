//Funções genéricas
function listarAlgunsItems(tabela){
    console.log('Iniciando carregamento de dados...');
    window.api.listSomeItems(tabela);
    console.log('Processo finalizado.');
};

//Elementos da página
const btnCadastrar = document.querySelector('#btnCadastrar');
const btnListarItens = document.querySelector('#btnListarItens');

const listar = document.querySelector('#listar');
const slcCategoria = document.querySelector('#slcCategoria');
const slcTipos = document.querySelector('#slcTipos');

//Chamadas de API
slcCategoria.addEventListener('change', () => {

    console.log('Deletando colunas existentes...')
    const scraps = document.querySelectorAll('.scrap');

    scraps.forEach(scrap => {
        scrap.parentNode.removeChild(scrap);
    });

    console.log('Colunas deletadas. Iniciando chamada de novas colunas...', slcCategoria.value);
    window.api.getTipos(slcCategoria.value);
});

btnCadastrar.addEventListener('click', () => {
    let data = {
        id_tipo: slcTipos.value,
        categoria: slcCategoria.value
    };

    const form = document.querySelector('#formItem');
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