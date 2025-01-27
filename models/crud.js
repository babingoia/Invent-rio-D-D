const DB = require('./db/conexao');
const SQL = require('sqlite3').verbose();

class CRUD {
    constructor(tabela, conexao){
        this.tabela = tabela;
        this.conexao = conexao;
    }

    ligar_tabelas(dados, tabela_ligacao){
        let colunas = Object.keys(dados).join(', ');
        let placeholder = Object.keys(dados).map(() => '?').join(', ');
        let valores = Object.values(dados);
        let comando =  `INSERT INTO ${tabela_ligacao} (${colunas}) VALUES (${placeholder})`;

        return new Promise((resolve, reject) => {
            this.conexao.db.run(comando, valores, (err) =>{
                if (err){
                    console.log("Erro ao tentar ligar itens.");
                    reject(err);
                    return;
                }

                console.log("Conexão feita com sucesso!");
                resolve();
            });
        })
    }

    inserir(dados){
        let colunas = Object.keys(dados).join(', ');
        let placeholder = Object.keys(dados).map(() => '?').join(', ');
        let valores = Object.values(dados);
        let comando =  `INSERT INTO ${this.tabela} (${colunas}) VALUES (${placeholder})`;

        return new Promise((resolve, reject) => {
            this.conexao.db.run(comando, valores, function(err) {
                if (err){
                    console.log('Erro ao inserir dado.');
                    reject(err);
                    return;
                }

                console.log(`Dado inserido com sucesso na tabela ${this.tabela}.`);
                resolve(this.lastID);
            });
        })
    };
    
    lerTudo(){
        let comando = `SELECT * FROM ${this.tabela};`
        return new Promise((resolve, reject) => {
            this.conexao.db.all(comando, [], (err, rows) => {
                if (err){
                    console.log(`Erro ao tentar pegar dados da tabela ${this.tabela}`);
                    reject(err);
                    return;
                }

                if(rows.length === 0){
                    console.log(`Nenhum dado encontrado na tabela ${this.tabela}`);
                    resolve(null);
                    return;
                }
                console.log(`Dados pegos com sucesso na tabela ${this.tabela}`);
                resolve(rows);
            });
        })
    }

    lerID(tabela, id){
        let comando = `SELECT * FROM ${tabela} WHERE id=?`

        return new Promise((resolve, reject) => {
            this.conexao.db.get(comando, [id], (err, rows) => {
                if (err){
                    console.log(`Erro ao capturar item com esse id: ${id}`);
                    reject(err);
                    return;
                }

                if (rows.length === 0){
                    console.log(`Nenhum item encontrado com esse id: ${id}`);
                    resolve(null);
                    return; 
                }

                console.log(`Item(s) capturado(s): ${rows}`);
                resolve(rows);
            });
        });
    }
    
    deletar(){};
    
    atualiazar(){};
}

module.exports = CRUD;