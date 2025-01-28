const SQL = require('sqlite3').verbose();
const conexao = require('./db/conexao');
const Item = require('./item');
const Dano = require('./dano');
const TiposArma = require('./tipos_arma');
const TiposDano = require('./tipos_dano');

class Arma extends Item {
    constructor(data, db){
        super(data, db);
        this.tabela_especifica = `armas`;
        this.id_arma = data.id_arma || null;
        this.dano = new Dano(data);
        this.tipos_arma = new TiposArma(data);
        this.tipos_dano = new TiposDano(data);
    }

    pegar_estrangeiras(){

    }

    criar(){
        super.criarItem().then(id_item => {
            const temp = this.tabela;
            this.tabela = this.tabela_especifica;

            const dados = {
                id_dano: this.dano,
                id_tipos_arma: this.tipos_arma,
                id_tipos_dano: this.tipos_dano
            };
            
            if (this.id_arma === null){
                console.log(`Começando a inserção de arma:`);
                this.inserir(dados).then(id_arma =>{
                    this.id_arma = id_arma;
                    
                    const dados_ligacao = {
                        id_item: this.id_item,
                        id_arma: this.id_arma
                    }
                    
                    this.ligar_tabelas(dados_ligacao, `${temp}_${this.tabela_especifica}`);
                    this.tabela = temp;
                    return id_arma;
                    }).catch(err =>{
                        console.log('Erro ao criar arma:', err);
                        this.tabela = temp;
                        return;
                    });
            } else {

                const dados_ligacao = {
                    id_item: id_item,
                    id_arma: this.id_arma
                }
                console.log(dados_ligacao);
                

                console.log("Inseirindo ligacao de arma");
                this.ligar_tabelas(dados_ligacao, `${temp}_${this.tabela_especifica}`);
                this.tabela = temp;
            }
        }).catch(err => {
            console.log("Erro ao criar item:", err);
            this.tabela = temp;
        });
    }
}

module.exports = Arma;