//Bibliotecas
const { log } = require('console');
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const CRUD = require('./models/crud');
const Item = require('./models/item');
const Equipamento = require('./models/equipamento');
const DB = require('./models/db/conexao');
const Arma = require('./models/arma');

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

function criar_item(categoria, data=null, ){
    switch (categoria){

        case 'equipamento':
            if (data === null){
                let example_object = new Equipamento({
                    id: 1,
                    nome: 'string',
                    preco: 999.9,
                    peso: 999.9,
                    descricao: 'string',
                    id_equipamento: 1,
                    tipo: 'string'
                }, db);
                return example_object;
            }

            let equipamento = new Equipamento(data, db);
            console.log(`Equipamento criado com sucesso!`);
            return equipamento;

        case 'armas':
            if (data === null){
                let example_object = new Arma({
                    id: 1,
                    nome: 'string',
                    preco: 999.9,
                    peso: 999.9,
                    descricao: 'string',
                    id_dano: 1,
                    id_tipos_arma: 1,
                    id_tipos_dano: 1
                }, db);
                return example_object;
            }

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

//IPC MAIN

ipcMain.on('getTipos', (event, data) => {
    console.log("data do get tipos", data);
    
    if (!data){
        console.log(`Nenhum dado obtido.`);
        return;
    }

    let operacoes = new CRUD(data, db);
    let example_object = criar_item(data);
    console.log(operacoes, example_object);

    operacoes.lerTudo().then(dados => {
        dados.push({
            tabela: data,
            example_object: example_object
        });
        console.log(dados);
        event.reply('getTipos-response', dados);
    });
})

ipcMain.on('inserir-item', (event, data) => {
    console.log(data);

    let categoria = 'armas';
    //let categoria = data.categoria;
    delete data['categoria'];
    delete data['ids'];

    let item = criar_item(categoria);
    console.log(`Item criado: ${item}`);
    item.criar();
});

ipcMain.on('getItens', (event) => {
    let operacoes = new CRUD(`itens`, db);

    operacoes.lerTudo().then((dados) =>{
        console.log(dados);
        
        event.reply('getItens-response', dados);
    }).catch((err) => {
        console.error('Erro ao pegar itens:', err);
    });
});

//APP

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