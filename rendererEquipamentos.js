//Funções genéricas
function listarAlgunsItems(tabela){
    console.log('Iniciando carregamento de dados...');
    window.api.listSomeItems(tabela);
    console.log('Processo finalizado.');
};

//Pegando elementos da pagina

const btnListarEquipamentos = document.querySelector('#btnListarEquipamentos');

btnListarEquipamentos.addEventListener('click', () => listarAlgunsItems(btnListarEquipamentos.className));