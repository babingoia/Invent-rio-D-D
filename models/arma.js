const SQL = require('sqlite3').verbose();
const conexao = require('./db/conexao');
const CRUD = require('./crud');

class Arma extends CRUD {
    constructor(data){
        super('armas', db);
        this.id_dano = data.id_dano || null;
        this.id_tipos_arma = data.id_tipos_arma || null;
        this.id_tipos_dano = data.id_tipos_dano || null;
    }

    criar(){
        const data = {
            id_dano: this.id_dano,
            id_tipos_arma: this.id_tipos_arma,
            id_tipos_dano: this.id_tipos_dano
        }

        return
    }
}