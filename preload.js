const {contextBridge, ipcRenderer } =  require('electron');

contextBridge.exposeInMainWorld(
    'api', {
        inserir: (data) => ipcRenderer.send('inserir', data),
        listAllItems: () => ipcRenderer.send('list-all-items'),
        listSomeItems: (tabela) => ipcRenderer.send('list-some-items', tabela),
        getTipos: (data) => ipcRenderer.send('getTipos', data)
    }
);

ipcRenderer.on('getTipos-response', (event, colunas) => {
    const slcTipos = document.getElementById('slcTipos');
    const tiposInfo = document.getElementById('tiposInfo');
    const cabecalho = document.getElementById('cabecalho');

    

    Object.keys(colunas[0]).forEach(chave =>{
        cabecalho.innerHTML += `<td class="scrap">${chave}</td>`;
    });

    colunas.forEach(coluna => {
        let option = document.createElement('option');

        option.setAttribute('class', 'scrap');
        option.setAttribute('value', coluna.id);
        option.innerHTML = coluna.id;
        slcTipos.appendChild(option);

        let tr = document.createElement('tr');
        tr.setAttribute('class', 'scrap');

        Object.values(coluna).forEach(valor => {
            tr.innerHTML += `<td>${valor}</td>`;
        })

        tiposInfo.appendChild(tr);
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