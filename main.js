//Bibliotecas
const { log } = require('console');
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const CRUD = require('./models/crud');
const Item = require('./models/item');
const DB = require('./models/db/conexao');

/* 
Lembrar de deixar as tabelas no sql seguindo o seguinte padrão:

-> Ligação = nomeTabela1_nomeTabela2
-> Sempre deixar as tabelas no plural
-> ids da tabela de ligação refernciam a tabela original no singular. id_nomeTabelaOriginal

Comando pra empacotar com electrum:

-> electron-packager . inventario --platform=win32 --arch=x64 --out=Executavel/ --overwrite
*/

//Variaveis Globais
//let db = new SQL.Database(path.join(__dirname, 'db/mochilao.db'));
let db = new DB('./db/testes.db');
db.abrirConexao();


//Funções genéricas
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

function criar_item(data, categoria){
    switch (categoria){
        case 'equipamento':
            let equipamento = new Equipamento(data, db);
            return equipamento;
        case 'armas':
            let arma = new Arma(data, db);
            return arma;
        case 'armaduras':
            let armadura = new Armadura(data, db);
            return armadura;
        case 'recipiente':
            let recipiente = new Recipiente(data, db);
            return recipiente;
        case 'montaria':
            let montaria = new Montaria(data, db);
            return montaria;
    } 
}

function ligar_tabelas(tabela, id1, id2){
    let comando = `INSERT INTO ${tabela} VALUES (?, ?);`

    db.run(comando, [id1, id2], (err) => {
        if (err){
            console.log('Erro ao inserir dados na tabela de ligação', tabela, [id1, id2]);
            return;
        }

        console.log('Dados inseridos na tabela de ligação com sucesso!');
    });
}
//Funções com event listeners

ipcMain.on('getTipos', (event, data) => {
    console.log("data do get tipos", data);
    
    if (!data){
        console.log(`Nenhum dado obtido.`);
        return;
    }

    let operacoes = new CRUD(data, db);
    console.log(operacoes);
    

    operacoes.lerTudo().then(dados => {
        dados.push({
            tabela: data
        })
        event.reply('getTipos-response', dados);
    });
})

ipcMain.on('inserir-item', (event, data) => {
    console.log(data);

    let categoria = data.categoria;
    let fks = data.ids;
    delete data['categoria'];
    delete data['ids'];

    let data_item = {
        nome: data.nome,
        preco: data.preco,
        peso: data.peso,
        descricao: data.descricao
    };

    Object.keys(data_item).forEach(chave => {
        delete data[chave];
    });

    let item1 = new Item(data_item);
    let item2 = criar_item(data, categoria);

    item1.criar();
    item2.criar();

    let tabela_ligacao = `${item1.tabela}_${item2.tabela}`

    ligar_tabelas(tabela_ligacao, item1.id, item2.id);
});

app.whenReady().then(() => {
    create_window();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0){
            create_window();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin'){
        db.fecharConexao();
        app.quit();
    }
});