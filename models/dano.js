const CRUD = require('./crud');

class Dano{
    constructor(data){
        this.tabela_especifica = `dano`;
        this.id_dano = data.id_dano || this.id_dano || null;
        this.dano = data.dano || null;
    }
}

module.exports = Dano;