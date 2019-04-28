// server.js
// where your node app starts

// Configuration de la base de donnée
var knex = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: ".data/db.sqlite3"
    },
    debug: true,
});

// init project
const express = require('express');
const bodyP = require('body-parser');
require('express-async-errors');
const app = express();
app.use(bodyP.urlencoded({ extended: false }));

const consolidate = require('consolidate');
app.engine('html', consolidate.nunjucks);
app.set('view engine', 'nunjucks');
//app.set('views', 'views');


// On ajoute une route pour l'url /
app.get('/', function(req, res)
              {
                res.send('Hello !!!');
              }
);

app.get('/signin', function(req, res)
              {
                //res.send('Hello !!!');
                res.sendFile(__dirname + '/public/ajoutUser.html');
              }
);

// On ajoute une route pour l'url /signin
app.post('/signin', async function(req, res)
              {
                  if(req.body.login != '' && req.body.pass != '')
                  {
                    let insert = await knex.raw('INSERT INTO users VALUES (?, ?, ?, ?, ?)',
                                [ req.body.login, req.body.pass, req.body.name, req.body.color1, req.body.color2]);
                  }
                  res.redirect('/signin');
              }
);

// On ajoute une route pour l'url /logoutet
app.get('/logoutet', function(req, res)
              {
                
              }
);

// On ajoute une route pour l'url /userlist
app.get('/userlist', async function(req, res)
              {
                let usersListe = await knex('users').select('*');
                console.log('ici');
                res.render('usersList.html', {'listes': usersListe});
              }
);



app.listen(process.env.PORT);