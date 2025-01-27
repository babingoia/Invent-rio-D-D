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

function verificar_selects(selects){
    let i = 0;
    const quantidade_selects = selects.length;

    selects.forEach(select =>{
        select.addEventListener('change', () => {
            if (!select.classList.contains('escondido')){
                ids[select.id] = select.value;
                i++;
                select.setAttribute('class', 'escondido');

                if (i === quantidade_selects){
                    console.log(ids);
                    deletarScraps();
                    form.removeAttribute('class', 'escondido');
                }
            }
        });
    });
}

//Elementos da página
let ids = {};
const btnCadastrar = document.querySelector('#btnCadastrar');
const btnListarItens = document.querySelector('#btnListarItens');
const form = document.querySelector('#formItem');
const listar = document.querySelector('#listar');
const slcCategoria = document.querySelector('#slcCategoria');
const slcTipos = document.querySelector('#slcTipos');
const tiposInfo = document.querySelector('#tiposInfo');

//Outras variaveis
const config_mutation = {
    childList: true,
    subtree: true
}
const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation =>{
        mutation.addedNodes.forEach(node =>{
            if (node.nodeType === 1 && node.tagName.toLowerCase() === 'select'){
                console.log('Select criado:', node);
                
                const selects = tiposInfo.querySelectorAll('select');
                verificar_selects(selects);
            }
        });
    });
});

//Chamadas de API
slcCategoria.addEventListener('change', () => {

    deletarScraps();

    console.log('Colunas deletadas. Iniciando chamada de novas colunas...', slcCategoria.value);
    window.api.getTipos(slcCategoria.value);

    slcCategoria.setAttribute('class', 'escondido');
    tiposInfo.removeAttribute('class', 'escondido');

    if (!slcCategoria.value){
        deletarScraps();
        form.removeAttribute('class', 'escondido');
    }
});

btnCadastrar.addEventListener('click', () => {
    let data = {
        categoria: slcCategoria.value,
        id_equipamento: Number(Object.values(ids)[0])
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
observer.observe(tiposInfo, config_mutation);


//Movimento

/*
slcTipos.addEventListener('change', () => {
    id_item = slcTipos.value;
    
    deletarScraps();
    slcTipos.setAttribute('class', 'escondido');
    

    return id_item;
});
*/