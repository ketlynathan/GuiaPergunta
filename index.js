const express = require("express"); //Importando o express
const app = express(); //Iniciando o express
const bodyParser = require("body-parser");
const connection = require("./database/database");
const Pergunta = require("./database/Pergunta");
const Resposta = require("./database/Resposta");
//Database
connection
    .authenticate()
    .then(() =>{
    console.log("conexão com o banco de dados feita!")
    })
    .catch((msgErro) =>{
    console.log(msgErro)
})
//estou dizendo para o express usar o EJS como view engine
app.set('view engine', 'ejs');
app.use(express.static('public'));
//body parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
//rotas
app.get("/", (req,res) => {
    Pergunta.findAll({raw: true, order:[
        ['id', 'DESC']
    ]}).then(perguntas =>{
        res.render("index",{
            perguntas: perguntas
        });
    });
});

app.get("/perguntar", (req,res) => {
    res.render("perguntar");
});

app.post("/salvarpergunta",(req,res)  => {
    var titulo = req.body.titulo;
    var descricao = req.body.descricao;
    Pergunta.create({
        titulo: titulo,
        descricao: descricao

    }).then(() =>{
        res.redirect("/");

    });
});

app.get("/Pergunta/:id", (req, res) => {
    var id = req.params.id;
    Pergunta.findOne({
        where: {id: id}
    }).then(pergunta => {
        if(pergunta != undefined){
         Resposta.findAll({
            where: {perguntaId: pergunta.id},
            order:[
                ['id', 'DESC']
            ] 
         }).then(respostas =>{
            res.render("pergunta", {
                pergunta: pergunta,
                respostas: respostas
            });
         });   
            
        }else{
            res.redirect("/");

        }
    })
});
app.post("/responder", (req, res) =>{
    var corpo = req.body.corpo;
    var perguntaId = req.body.pergunta;
    Resposta.create({
        corpo: corpo,
        perguntaId: perguntaId
    }).then(() =>{
        res.redirect("/pergunta/" + perguntaId);
    });
});

app.listen(4000,function(erro){
    if(erro){
        console.log("Ocorreu um erro!");

    }else{
        console.log("Servidor iniciado com sucesso!");

    }
})