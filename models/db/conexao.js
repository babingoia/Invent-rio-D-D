//Bibliotecas
const SQL = require('sqlite3').verbose();

class DB {
    constructor(caminho){
        this.caminho = caminho;
        this.db = null;
    }
 
    abrirConexao(){
        this.db = new SQL.Database(this.caminho, (err) =>{
            if (err){
                console.log('Erro com a conexão do banco!');
            } else{
                console.log('Conexão com o banco estabelecida com sucesso!');
            }
        });
    }

    fecharConexao(){
        this.db.close((err) => {
            if (err){
                console.log('Erro ao fechar conexão com banco de dados.');
            } else{
                console.log("conexão fechada");
            }
        });
    }

    recarregarConexao(){
        this.fecharConexao();
        this.abrirConexao();
    }
};

module.exports = DB;
