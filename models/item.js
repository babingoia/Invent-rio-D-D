const SQL = require('sqlite3').verbose();
const conexao = require('./db/conexao');
const CRUD = require('./crud');

class Item extends CRUD {
    constructor(dados, db){
        super('itens', db)
        this.id = dados.id;
        this.nome = dados.nome;
        this.preco = dados.preco;
        this.peso = dados.peso;
        this.descricao = dados.descricao;
    }

    criar() {
        const dados = {
            nome: this.nome,
            preco: this.preco,
            peso: this.peso,
            descricao: this.descricao
        }

        return this.inserir(dados).then(id => {
            this.id = id;
            return id;
        });
    }
}

module.exports = Item;