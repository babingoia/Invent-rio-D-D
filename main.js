const { log } = require('console');
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const SQL = require('sqlite3').verbose();
const fs = require('fs');

function create_window(){
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            enableRemoteModule: false
        }
    });

    win.loadFile('index.html');

    win.webContents.openDevTools();
}

function criar_backup(){
    const dbPath = './db/mochilao.db';
    const pastaBackups = './db/Backups';

    const timestamp = new Date().toISOString().replace(/[-:.]/g, '');
    const backupPath = path.join(pastaBackups, `inventario_backup_${timestamp}.db`);

    fs.copyFile(dbPath, backupPath, (err) => {
        if (err){
            console.log('Erro ao criar backup', err);
        } else {
            console.log('Backup criado com sucesso!', backupPath);
        }
    });
}

//let db = new SQL.Database('./db/mochilao.db');
let db = new SQL.Database('./db/testes.db');

ipcMain.on('getTipos', (event, data) => {

    console.log('Montando comando SQL...', data);
    
    const comando_selecionar_colunas = `SELECT * FROM ${data};`;

    console.log('Rodando comando no banco...');

    db.all(comando_selecionar_colunas, [], (err, tipos) => {
        
        if (err){
            console.log('Erro ao adquirir tipos', err);
            return;
        }

        if (!tipos){
            console.log('Nenhum tipo encontrado.');
            return;
        }

        console.log('Colunas adquiridas:', tipos);
    
        event.reply('getTipos-response', tipos);
    });
})

ipcMain.on('inserir-item', (event, data) => {
    console.log('Iniciando compilação do comando sql...', data);
    
    let valores_consulta = [];
    let colunas_consulta = [];

    let dataCopia = { ...data };
    let regex = /\b(id(_\w*)?)\b/i;
    
    Object.keys(dataCopia).forEach(chave => {
        
        if (regex.test(chave)){
            delete dataCopia[chave];
            return;
        }
        
        colunas_consulta.push(chave);
        valores_consulta.push(dataCopia[chave]);
    });

    console.log("Sua data ficou assim:", dataCopia);

    let colunas = colunas_consulta.join(', ');
    let placeholders = colunas_consulta.map(() => '?').join(', ');
    
    let comando = `INSERT INTO itens (${colunas}) VALUES (${placeholders})`;

    console.log('Comando montado.', comando);
    
    db.run(comando, valores_consulta);

    console.log("Item inserido com sucesso! Procurando id do item...")
    
    db.get(`SELECT id FROM itens WHERE nome=? AND preco=? AND peso=? AND descricao=?;`,valores_item, (err, id_item) => {
        if (err){
            console.log('Erro ao tentar capturar id do item.', err)
            return;
        }

        if(!id_item){
            console.log('Id de item não encontrada.')
            return;
        }

        console.log('Id do item pego com sucesso! Iniciando ligação...', id_item);

        comando = `INSERT INTO itens_${data.categoria} VALUES (?, ?);`
        db.run(comando, [id_item.id, data.id_tipo]);
    });
});



ipcMain.on('list-all-items', (event) => {
    console.log('Inserindo comando sql...');
    db.all('SELECT * FROM itens;', [], (erro, dados) => {
        if (erro){
            throw erro;
        }
        event.reply('list-all-items-response', dados);
    });
    console.log('Dados carregados');
});

ipcMain.on('list-some-items', (event, tabela) => {
    console.log('Inserindo comando sql...', tabela);
    db.all(`SELECT * FROM ${tabela} ORDER BY id DESC LIMIT 5;`, [], (erro, dados) => {
        if (erro){
            throw erro;
        }

        if (!dados){
            console.log('Nenhum item encontrado', dados);
        }

        console.log('Dados Carregados', dados);
        event.reply('list-some-items-response', dados);
    });
});

app.whenReady().then(() => {
    create_window();
    criar_backup();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0){
            create_window();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin'){
        db.close();
        app.quit();
    }
});