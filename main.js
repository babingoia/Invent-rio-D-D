const { log } = require('console');
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const SQL = require('sqlite3').verbose();
const fs = require('fs');

/* 
Lembrar de deixar as tabelas no sql seguindo o seguinte padrão:

-> Ligação = nomeTabela1_nomeTabela2
-> Sempre deixar as tabelas no plural
-> ids da tabela de ligação refernciam a tabela original no singular. id_nomeTabelaOriginal

Comando pra empacotar com electrum:

-> electron-packager . inventario --platform=win32 --arch=x64 --out=Executavel/ --overwrite
*/

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

function ligar_tabelas(id_item, id_tipo, tabela){
    comando = `SELECT name FROM sqlite_master WHERE type='table' AND name=?;`;

        db.get(comando, [tabela], (err, row) => {

            if (err){
                console.log('Erro ao verificar a tabela de ligação.', err);
                return;
            
            } else if (row){
                console.log('Tabela de Ligação encontrada.');

                comando = `INSERT INTO ${tabela} VALUES (?, ?);`;

                db.run(comando, [id_item, id_tipo], (err) => {
                    if (err){
                        console.log('Erro ao tentar inserir valores na tabela de ligação.', err.message);
                        return;
                    }
                    console.log('Ligação realizada com sucesso!');
                });
            } else {
                console.log("Tabela de ligação não encontrada.");
            }
        });
};

function pegar_id(tabela, placeholder){
    let comando = `SELECT id FROM ${tabela} WHERE ${placeholder}`;

    db.get(comando, [], (err, row) => {
        
        if (err){
            console.log('Erro ao tentar obter ID.', err.message);
            return;
        }

        if (!row){
            console.log("id não existente.");
            return;
        }

        console.log('ID adquirido com sucesso!');
        return row;
    })
}

function pegar_tabelas_estrangeiras(data){
    console.log('Checando chaves estrangeiras...');
    
    let comando = `PRAGMA foreign_key_list(${data});`;

    return new Promise((resolve, reject) => {
        db.all(comando, [], function(err, rows) {
        
            if (err){
                console.log('erro ao tentar adquirir lista de chaves estrangeiras.', err.message);
                reject(err);
                return;
            }
    
            if (!rows || rows.length === 0) {
                console.log('Sem chaves estrangeiras nessa tabela.');
                resolve([]);
                return;
            }

            console.log('Chaves estrangeiras adquiridas.', rows);
            
            let promisses = rows.map(row => {
                return new Promise((resolve, reject) => {
                    console.log('Obtendo dados da chave...');
                
                    comando = `SELECT * FROM ${row.table};`;
                
                    db.all(comando, [], (err, rowsTabela) =>{
                    
                        if(err){
                            console.log('Erro ao adquirir tabela da chave.', err.message);
                            reject(err);
                            return;
                        }
        
                        if(!rowsTabela || rows.length === 0){
                            console.log('Não existem informações nessa tabela.');
                            resolve(null);
                        } else{
                            console.log('Dados da tabela adquiridos.');
                            resolve({ table: row.table, data: rowsTabela });
                        }
                    });
                });
                
            });

            Promise.all(promisses).then(results => {
                let tabelas = results.filter(result => result !== null);
                resolve(tabelas);
            }).catch(err => {
                reject(err);
            });
        });
    });
}

function adquirir_dados(tabela){
    console.log('Montando comando SQL...', tabela);
    
    comando = `SELECT * FROM ${tabela};`;

    console.log('Rodando comando no banco...');

    return new Promise((resolve, reject) => {
        db.all(comando, [], (err, tipos) => {
        
            if (err){
                console.log('Erro ao adquirir tipos', err);
                reject(err);
                return;
            }
    
            if (!tipos){
                console.log('Nenhum tipo encontrado.');
                resolve([]);
                return;
            }
    
            console.log('Colunas adquiridas:', tipos);
            resolve(tipos);
        });
    })
}

//let db = new SQL.Database('./db/mochilao.db');
let db = new SQL.Database('./db/testes.db');

ipcMain.on('getTipos', (event, data) => {
    
    let tabelas = pegar_tabelas_estrangeiras(data);
    let resultado = [];

    tabelas.then(tabelas => {
        console.log('Tabelas com chaves estrangeiras:', tabelas);
        let promisses = tabelas.map(tabela => adquirir_dados(tabela.table));
            Promise.all(promisses).then(resultado => {
                console.log('dados adquiridos de todas as tabelas:', resultado);
                event.reply('getTipos-response', resultado);
            }).catch(err => {
                console.error('Erro ao adquirir dados das tabelas:', err); 
                event.reply('getTipos-response', []);
            });
        }).catch(err => {
        console.error('Erro:', err); 
        event.reply('getTipos-response', []);
    });



    event.reply('getTipos-response', resultado);
})

ipcMain.on('inserir-item', (event, data) => {
    console.log('Iniciando compilação do comando sql...', data);
    
    let valores_consulta = [];
    let colunas_consulta = [];

    let dataCopia = { ...data };
    let regex = /\b(id(_\w*)?)\b/i;
    delete dataCopia['categoria'];
    
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
    
    db.run(comando, valores_consulta, function(err) {
        
        if (err){
            console.log('Erro ao executar comando.', err.message);
            return;
        }
        
        console.log("Item inserido com sucesso! Procurando id do item...")

        if(data.categoria === ''){
            return;
        }

        let id_item = this.lastID;
        let tabelaLigacao = `itens_${data.categoria}`;

        console.log(id_item);

        ligar_tabelas(id_item, data.id_tipo, tabelaLigacao);
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