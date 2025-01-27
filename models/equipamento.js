const SQL = require('sqlite3').verbose();
const conexao = require('./db/conexao');
const Item = require('./item');

class Equipamento extends Item{
    constructor(data, db){
        super(data, db);
        this.tabela_especifica = 'equipamento';
        this.tipo = data.tipo;
        this.id_equipamento = data.id_equipamento;
    }

    criar(){
        super.criarItem().then(id_item => {
            const temp = this.tabela;
            this.tabela = this.tabela_especifica;

            const dados = {
                tipo: this.tipo
            }
            
            if (this.id_equipamento === null){
                console.log(`Começando a inserção de equipamento:`);
                this.inserir(dados).then(id_equipamento =>{
                    this.id_equipamento = id_equipamento;
                    
                    const dados_ligacao = {
                        id_item: this.id_item,
                        id_equipamento: this.id_equipamento
                    }
                    
                    this.ligar_tabelas(dados_ligacao, `${temp}_${this.tabela_especifica}`);
                    this.tabela = temp;
                    return id_equipamento;
                    }).catch(err =>{
                        console.log('Erro ao criar equipamento:', err);
                        this.tabela = temp;
                        return;
                    });
            } else {

                const dados_ligacao = {
                    id_item: id_item,
                    id_equipamento: this.id_equipamento
                }
                console.log(dados_ligacao);
                

                console.log("Inseirindo ligacao");
                this.ligar_tabelas(dados_ligacao, `${temp}_${this.tabela_especifica}`);
                this.tabela = temp;
            }
        }).catch(err => {
            console.log("Erro ao criar item:", err);
            this.tabela = temp;
        });
    }
}

module.exports = Equipamento;