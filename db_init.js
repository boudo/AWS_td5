// Configuration de la base de donnée

var knex = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: ".data/db.sqlite3"
    },
    debug: true,
});

// On crée la table user
async function createTableUsers()
{
  var tableUsers = await knex.schema.createTable('users', function (table)
                                        {
                                          table.string('login').primary();
                                          table.string('pass').notNullable();
                                          table.string('name');
                                          table.string('color1', 10);
                                          table.string('color2', 10);
                                        }
  );
    
}

// On supprime la table si elle existe
async function deleteTableUsers()
{
  var delet = await knex.raw(`DROP TABLE IF EXISTS users`);
}

// On ajoute un affichage pour le detaille des colonnes
async function columnInfos()
{
  var info = await knex('users').columnInfo();
}

// On ajoute des utilisateur par défaut
async function ajoutUserDefault()
{
  var ajout1 = await knex.raw('INSERT INTO users VALUES (?, ?, ?, ?, ?)',
                               [ 'ibar', '123', 'Ibrahim', 'red', 'black' ]
                             );
}
async function ajoutUserDefault1()
{
  var ajout1 = await knex.raw('INSERT INTO users VALUES (?, ?, ?, ?, ?)',
                               [ 'ibar1', '123', 'Ibrahim', 'blue', 'green' ]
                             );
}

// On affiche le contenu de la table
async function afficheTableUsers()
{
  var affiche = await knex('users').select('*');
  console.log(affiche);
}


deleteTableUsers();
createTableUsers();
columnInfos();
ajoutUserDefault();
ajoutUserDefault1();
afficheTableUsers();
