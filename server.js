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

// session
var session = require('express-session');

app.use(session({
    secret: '12345',
    resave: false,
    saveUninitialized: false,
}));

// On ajoute une route pour l'url /
app.get('/', function(req, res)
              {
                if(req.session.login)
                {
                  res.redirect('/userlist');
                }
                else
                {
                  res.render('connexion.html');
                }
              }
);

// On ajoute une route pour l'url / (post)
app.post('/', async function(req, res)
              {
                if(req.body.login != '' && req.body.pass != '')
                {
                    try
                    {
                      var connect = await knex('users').select('*')
                                                        .where('login', req.body.login)
                                                        .andWhere('pass', req.body.pass);
                      if(connect.length != 0)
                      {
                        req.session.login = connect[0].login;
                        req.session.name = connect[0].name;
                        req.session.color1 = connect[0].color1;
                        req.session.color2 = connect[0].color2;
                        res.redirect('/userlist');
                      }
                      else
                      {
                        res.render('connexion.html', { message : 'Login ou mot de passe incorrect', 'login' : req.body.login});
                      }
                     
                    }catch(error)
                    {
                      
                    }
                }
                else
                {
                  res.redirect('/');
                }
              }
);

app.get('/signin', function(req, res)
              {
                //res.sendFile(__dirname + '/public/ajoutUser.html');
                res.render('ajoutUser.html');
              }
);

// On ajoute une route pour l'url /signin
app.post('/signin', async function(req, res)
              {
                  if(req.body.login != '' && req.body.pass != '')
                  {
                    if(req.body.pass === req.body.confPass)
                    {
                      try
                      {
                        let insert = await knex.raw('INSERT INTO users VALUES (?, ?, ?, ?, ?)',
                                    [ req.body.login, req.body.pass, req.body.name, req.body.color1, req.body.color2]);
                        res.redirect('/');
                      }catch(error)
                      {
                        res.render('ajoutUser.html', { existe : 'Ce nom est déja utilisé',
                                                     'login' : req.body.login,
                                                    'pass' : req.body.pass,
                                                    'name' : req.body.name,
                                                    'color1' : req.body.color1,
                                                    'color2' : req.body.color2
                                                     });
                      }
                    }
                    else
                    {
                      res.render('ajoutUser.html', {'login' : req.body.login,
                                                  'pass' : req.body.pass,
                                                  'name' : req.body.name,
                                                  'color1' : req.body.color1,
                                                  'color2' : req.body.color2,
                                                  'confirmation' : 'mode de passe différent'
                                                 });
                    }
                      
                  }
                  else if(req.body.login === '' && req.body.pass === '')
                  {
                    res.render('ajoutUser.html', { message : 'Ce champs ne peux pas être vide' });
                  }
                  else
                  {
                    res.render('ajoutUser.html', {'login' : req.body.login,
                                                  'pass' : req.body.pass,
                                                  'name' : req.body.name,
                                                  'color1' : req.body.color1,
                                                  'color2' : req.body.color2
                                                 }
                               );
                  }
              }
);

// On ajoute une route pour l'url /logout
app.get('/logout', function(req, res)
              {
                req.session.login = null;
                req.session.name = null;
                req.session.color1 = null;
                req.session.color2 = null;
                res.redirect('/');
              }
);

// On ajoute une route pour l'url /userlist
app.get('/userlist', async function(req, res)
              {
                if(req.session.login)
                {
                  let usersListe = await knex('users').select('*');
                  console.log('ici');
                  res.render('usersList.html', {'listes': usersListe, 'userConnect': req.session.name});
                }
                else
                {
                  res.redirect('/');
                }
              }
);



app.listen(process.env.PORT);