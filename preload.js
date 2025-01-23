const {contextBridge, ipcRenderer } =  require('electron');

contextBridge.exposeInMainWorld(
    'api', {
        inserirItem: (data) => ipcRenderer.send('inserir-item', data),
        listAllItems: () => ipcRenderer.send('list-all-items'),
        listSomeItems: (tabela) => ipcRenderer.send('list-some-items', tabela),
        getTipos: (data) => ipcRenderer.send('getTipos', data)
    }
);

ipcRenderer.on('getTipos-response', (event, data) => {
    const [ resultado, tabelas ] = data;
    console.log('Ipc renderer ON, dados:', resultado, tabelas, data);

    const tiposInfo = document.getElementById('tiposInfo');
    let i = 0;
    let lista_labels = [];

    tiposInfo.removeAttribute('class', 'escondido');

    tabelas.forEach(tabela =>{
        const label = document.createElement('label');
        label.innerHTML = tabela;
        label.setAttribute('class', 'scrap');
        label.setAttribute('for', `${tabela}`);
        lista_labels.push(label)
    });
        
    resultado.forEach(infos =>{
        
        if (infos.length === 0){
            return;
        }

        console.log('Infos:', infos);

        const table = document.createElement('table');
        const cabecalho = document.createElement('tr');
        const select = document.createElement('select');
        const optionVazia = document.createElement('option');
        const br = document.createElement('br');
        const br2 = document.createElement('br');

        tiposInfo.appendChild(br2);
        tiposInfo.appendChild(lista_labels[i]);
        select.setAttribute('id', `${tabelas[i]}`);
        tiposInfo.appendChild(br);
        

        select.setAttribute('class', 'scrap');
        tiposInfo.appendChild(select);

        optionVazia.disabled = true;
        optionVazia.selected = true;
        select.appendChild(optionVazia);

        table.setAttribute('class', 'scrap');
        table.appendChild(cabecalho);
        tiposInfo.appendChild(table);



        Object.keys(infos[0]).forEach(chave =>{
            cabecalho.innerHTML += `<td class="scrap">${chave}</td>`;
        })

        infos.forEach(coluna => {
            
            let option = document.createElement('option');
    
            option.setAttribute('class', 'scrap');
            option.setAttribute('value', coluna.id);
            option.innerHTML = coluna.id;
            select.appendChild(option);
    
            let tr = document.createElement('tr');
            tr.setAttribute('class', 'scrap');
    
            Object.values(coluna).forEach(valor => {
                console.log(valor);
                
                tr.innerHTML += `<td>${valor}</td>`;
            })
    
            table.appendChild(tr);
        });

        i++;
    });
});

ipcRenderer.on('list-all-items-response', (event, items) => {
    const tableBody = document.getElementById('listar');
    tableBody.innerHTML = '';

    items.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${item.id}</td>
            <td>${item.nome}</td>
            <td>${item.preco}</td>
            <td>${item.peso}</td>
            <td>${item.descricao}</td>
        `;
        tableBody.appendChild(tr);
    });
})

ipcRenderer.on('list-some-items-response', (event, items) => {
    const tableBody = document.getElementById('listar');
    tableBody.innerHTML = '';

    items.forEach(item => {
        const tr = document.createElement('tr');

        Object.values(item).forEach(valor => {
            tr.innerHTML += `<td>${valor}</td>`;
        })

        tableBody.appendChild(tr);
    });
})

window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
        const element = document.getElementById(selector);
        if (element) element.innerHTML = text;
    };

    for (const dependency of ['chrome', 'node', 'electro,']){
        replaceText(`${dependency}-version, process.versions[dependency]`);
    }
});