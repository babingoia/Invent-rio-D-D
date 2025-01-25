//Libs
const {contextBridge, ipcRenderer } =  require('electron');

//Variveis globais

//Chamadas da API
contextBridge.exposeInMainWorld(
    'api', {
        inserirItem: (data) => ipcRenderer.send('inserir-item', data),
        getTipos: (data) => ipcRenderer.send('getTipos', data)
    }
);

//Funções genéricas



//EventListenenrs

//Desenha na tela a resposta do getTipos
ipcRenderer.on('getTipos-response', (event, data) => {
    console.log(`Get tipos:`, data);
    let i = 1;
    let metadados = data[data.length - 1]

    const tiposInfo = document.querySelector('#tiposInfo');

    metadados.forEach(tabela => {
       
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
        select.setAttribute('id', i);

        //Colocando nome da label
        label.value = tabela;

        //Criando option vazia
        optionVazia.disabled = true;
        optionVazia.selected = true;

        //Colocando dados no cabecalho
        Object.keys(data[0]).forEach(chave => {
            cabecalho.value += `<td>${chave}</td>`
        });
    
        //Colocando as coisas uma dentro da outra
        select.appendChild(optionVazia);
        table.appendChild(tr);
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


    data.forEach(obj => {
        //Selecionando select criado anteriormente
        let select = document.querySelector(`#${i}`);

        //Criando uma option pra cada dado.
        let option = createElement('option');
        option.value = obj.id;
        select.appendChild(option);


        //Incrementando o contador
        i++;
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