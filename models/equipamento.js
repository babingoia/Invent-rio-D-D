const SQL = require('sqlite3').verbose();
const conexao = require('./db/conexao');
const CRUD = require('./crud');

class Equipamento extends CRUD{
    constructor(data, db){
        super('equipamento', db);
        this.tipo = data.tipo;
        this.id = null;
    }

    criar(item){
        const dados = {
            tipo: this.tipo
        };
        this.inserir(dados).then(id => {
            this.id = id;
            return id;
        });
    }
}

module.exports = Equipamento;