const SQL = require('sqlite3').verbose();
const conexao = require('./db/conexao');
const CRUD = require('./crud');

class Item extends CRUD {
    constructor(data, db){
        super('itens', db)
        this.id_item = data.id;
        this.nome = data.nome;
        this.preco = data.preco;
        this.peso = data.peso;
        this.descricao = data.descricao;
    }

    criarItem() {
        const dados = {
            nome: this.nome,
            preco: this.preco,
            peso: this.peso,
            descricao: this.descricao
        }

        return this.inserir(dados).then(id => {
            this.id = id;
            return id;
        }).catch(err => {
            throw err;
        })
    }
}

module.exports = Item;