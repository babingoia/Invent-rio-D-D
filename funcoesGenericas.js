function listarAlgunsItems(tabela){
    console.log('Iniciando carregamento de dados...');
    window.api.listSomeItems(tabela);
    console.log('Processo finalizado.');
};