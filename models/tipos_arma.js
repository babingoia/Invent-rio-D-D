const CRUD = require('./crud');

class TiposArma{
    constructor(data){
        this.tabela_especifica = `tipos_arma`;
        this.id_tipos_arma = data.tipos_arma || null;
        this.tipo = data.tipo || null;
    }
}

module.exports = TiposArma;