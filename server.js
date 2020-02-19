const express = require('express');
const server = express();
const nunjucks = require('nunjucks');

//configurando servidoes para apresentar arquivos estáticos
server.use(express.static('public'))

//habilitar body do formulário
server.use(express.urlencoded({ extended: true }))


//configurar a conexao com o banco de dados
const Pool = require('pg').Pool
const db = Pool({
    user: 'postgres',
    password: '91208887',
    host: 'localhost',
    port: 5432,
    database: 'doe'
})

//configurando template engine
nunjucks.configure("./", {
    express: server,
    noCache: true
})

server.get("/", (req, res) => {
    
    db.query("SELECT * FROM donors", function (err, result) {
        if (err) return res.send("erro no banco de dados")
        
        const donors = result.rows;
        return res.render("index.html", { donors })
    })

    
})

server.post("/", (req, res) => {
    //pegar dados do formulário
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    //colocar valores dentro do SQL
    const query = `
        INSERT INTO donors ("name", "email", "blood")
        VALUES ($1, $2, $3)`

    const values = [name, email, blood]

    db.query(query, values, function (err) {
        if (err) return res.send("erro no banco de dados")

        return res.redirect("/")
    })


})


server.listen(3000, () => {
    console.log("Servidor rodando");

})

