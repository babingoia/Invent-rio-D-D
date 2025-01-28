const CRUD = require('./crud');

class TiposDano{
    constructor(data){
        this.tabela_especifica = `tipos_dano`;
        this.id_tipo_dano = data.id_tipo_dano || null;
        this.tipo_dano = data.tipo_dano || null;
    }
};

module.exports = TiposDano;