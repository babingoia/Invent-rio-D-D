//Libs
const {contextBridge, ipcRenderer, desktopCapturer } =  require('electron');

//Variveis globais

//Chamadas da API
contextBridge.exposeInMainWorld(
    'api', {
        inserirItem: (data) => ipcRenderer.send('inserir-item', data),
        getTipos: (data) => ipcRenderer.send('getTipos', data),
        getItens: () => ipcRenderer.send('getItens')
    }
);

//Funções genéricas
function desenhar_string(objeto, pai){
    //Obtendo chave do objeto
    const chave = Object.keys(objeto)[0];

    //Criando elementos
    const input = document.createElement('input');
    const label = document.createElement('label');

    //Adicionando scrap
    input.setAttribute('class', 'scrap');
    label.setAttribute('class', 'scrap');

    //Adicionando caracteristicas da label
    label.textContent = chave;
    label.setAttribute('for', chave);

    //Adicionando caracteristicas do input
    input.setAttribute('name', chave);
    input.setAttribute('id', chave);
    input.type = 'text'

    //Colocando eles no objeto pai
    pai.appendChild(label);
    pai.appendChild(input);
}

function desenhar_number(objeto, pai){
    //Obtendo chave do objeto
    const chave = Object.keys(objeto)[0];

    //Criando elementos
    const input = document.createElement('input');
    const label = document.createElement('label');

    //Adicionando a classe scrap
    input.setAttribute('class', 'scrap');
    label.setAttribute('class', 'scrap');

    //Adicionando caracteristicas da label
    label.textContent = chave;
    label.setAttribute('for', chave);
    
    //Adicionando caracteristicas do input
    input.setAttribute('name', chave);
    input.setAttribute('id', chave);
    input.type = 'number';
    input.step = 'any';

    //Adicionando ambos ao objeto pai
    pai.appendChild(label);
    pai.appendChild(input);
}

function desenhar_bool(objeto, pai){
        //Obtendo chave do objeto
        const chave = Object.keys(objeto)[0];

        //Criando elementos
        const checkbox = document.createElement('input');
        const label = document.createElement('label');
    
        //Adicionando a classe scrap
        checkbox.setAttribute('class', 'scrap');
        label.setAttribute('class', 'scrap');
    
        //Adicionando caracteristicas da label
        label.textContent = chave;
        label.setAttribute('for', chave);
        
        //Adicionando caracteristicas do checkbox
        checkbox.setAttribute('name', chave);
        checkbox.setAttribute('id', chave);
        checkbox.type = 'checkbox';
    
        //Adicionando ambos ao objeto pai
        pai.appendChild(label);
        pai.appendChild(checkbox);
}

function desenhar_option(objeto, pai){
    //Pegar valor e chave do objeto
    const valor = Object.values(objeto)[0];
    const chave = Object.keys(objeto)[0];

    //criar option
    const option = createElement('option');

    //Adicionando valores ao option
    option.value = valor;
    option.textContent = valor;

    //Inserir option no pai
    pai.appendChild(option)
}

function criar_select(pai){
    //Criando elementos básicos
    const select = document.createElement('select');
    const optionVazia = document.createElement('option');

    //Adicionando classe scrap
    select.setAttribute('class', 'scrap');

    //Adicionando caracteristicas do option
    optionVazia.selected = true;
    optionVazia.disabled = true;

    //Colocando option no select
    select.appendChild(optionVazia);

    //Colocando select no objeto pai
    pai.appendChild(select);
    return select;
}

function criar_cabecalho(chaves, tabela){
    //Cria o cabecalho 
    const cabecalho = document.createElement('tr');

    //Adiciona os itens no cabecalho
    objeto.forEach(chave => {
        cabecalho.innerHTML += `<td>${chave}</td>`
    });

    //Coloca o cabecalho dentro da tabela
    tabela.appendChild(cabecalho);
    return cabecalho;
}

function criar_tabela(objetos){
    //Separando as chaves do objeto
    const chaves = Object.keys(objetos[0]);

    //Criando tabela e cabecalho
    const tabela = document.createElement('table');
    criar_cabecalho(chaves,tabela);

    //Colocando classe scrap na tabela
    tabela.setAttribute('class', 'scrap');

    //Adicionando valores da tabela
    objetos.forEach( objeto => {
        const linha = document.createElement('tr');

        Object.values(objeto).forEach(valor =>{
            linha.innerHTML += `<td>${valor}</td>`;
        });
    });
}
//EventListenenrs

//Desenha na tela a resposta do getTipos
ipcRenderer.on('getTipos-response', (event, data) => {
    console.log(`Get tipos:`, data);

    //Declarando contador e lista de tabelas
    let i = 0;
    let metadados = data[data.length - 1]

    //Puxando a div que vai receber todas as informações
    const tiposInfo = document.querySelector('#tiposInfo');

    //Criando estrutura de cada tabela
    Object.keys(metadados).forEach(tabela => {
       
        //Criando elementos
        const cabecalho = document.createElement('tr');
        const table = document.createElement('table');
        const label = document.createElement('label');
        const select = document.createElement('select');
        const optionVazia = document.createElement('option');
        const br1 = document.createElement('br');
        const br2 = document.createElement('br');

        //Colocando classe scrap pra todos os elementos
        table.setAttribute('class', 'scrap')
        label.setAttribute('class', 'scrap');
        select.setAttribute('class', 'scrap');
        br1.setAttribute('class', 'scrap');
        br2.setAttribute('class', 'scrap');

        //Colocando identificação pra quem precisa
        select.setAttribute('id', `select-${i}`);
        table.setAttribute('id', `table-${i}`);

        //Colocando nome da label
        label.textContent = tabela;

        //Criando option vazia
        optionVazia.disabled = true;
        optionVazia.selected = true;

        //Colocando dados no cabecalho
        Object.keys(data[0]).forEach(chave => {
            cabecalho.innerHTML += `<td>${chave}</td>`
        });
    
        //Colocando as coisas uma dentro da outra
        select.appendChild(optionVazia);
        table.appendChild(cabecalho);
        tiposInfo.appendChild(label);
        tiposInfo.appendChild(select);
        tiposInfo.appendChild(table);
        tiposInfo.appendChild(br1);
        tiposInfo.appendChild(br2);
        
        //Incrementando o contador
        i++
    });

    //Zerando contador pra igualar o select com os dados
    i = 0;
    data.pop();


    data.forEach(obj => {
        console.log(`Objeto: ${obj}`);
        
        //Selecionando select criado anteriormente
        const select = document.getElementById(`select-${i}`);
        const tabela = document.getElementById(`table-${i}`);

        //Criando uma option pra cada dado.
        const option = document.createElement('option');
        option.value = obj.id;
        option.textContent = obj.id;
        select.appendChild(option);


        //Colocando dados na tabela
        const tr = document.createElement('tr');
        Object.values(obj).forEach(valor => {
            tr.innerHTML += `<td>${valor}</td>`;
        });

        tabela.appendChild(tr);
    });
});

ipcRenderer.on('getItens-response', (event, data) => {
    const pais = document.querySelectorAll('.dados');
    let selects = [];

    pais.forEach(pai => {
        let select = criar_select(pai);
        selects.push(select);
    })

    selects.forEach(select => {
        console.log(select);
        
        data.forEach(dado => {
            const option = document.createElement('option');
            
            option.value = dado.id;
            option.textContent = dado.nome;
    
            select.appendChild(option)
        });
    });

});

//Carrega a janela do electron
window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
        const element = document.getElementById(selector);
        if (element) element.innerHTML = text;
    };

    for (const dependency of ['chrome', 'node', 'electro,']){
        replaceText(`${dependency}-version, process.versions[dependency]`);
    }
});