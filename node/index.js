const express = require('express')
const app = express();
const port = 3000;

const config = {
    host: 'db',
    port: 3306,
    database: 'nodedb',
    user: 'root',
    password: 'root'
}

const mysql = require('mysql');
const connection = mysql.createConnection(config);
const sql = `CREATE TABLE IF NOT EXISTS people (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255) NOT NULL);`;
connection.query(sql);
connection.end()

const names = [
    'Alice',
    'Bob',
    'Charlie',
    'David',
    'Emma',
    'Frank',
    'Grace',
    'Hannah',
    'Isaac',
    'Julia'
];

app.get('/', (req, res) => {
    const connection = mysql.createConnection(config);
    connection.connect();

    const randomName = names[Math.floor(Math.random() * names.length)];
    const sqlInsert = `INSERT INTO people(name) VALUES('${randomName}')`;
    connection.query(sqlInsert, (insertError) => {
        if (insertError) {
            console.error(insertError);
            res.status(500).send('Falha ao inserir dados');
            connection.end();
            return;
        }

        const sqlSelect = `SELECT * FROM people;`;
        connection.query(sqlSelect, (selectError, results) => {
            if (selectError) {
                console.error(selectError);
                res.status(500).send('Falha ao consultar dados');
                connection.end();
                return;
            }

            let peopleList = '<ul>';
            results.forEach(person => {
                peopleList += `<li>${person.name}</li>`;
            });
            peopleList += '</ul>';

            res.send(`<h1>Full Cycle Rocks!</h1>${peopleList}`);
            connection.end();
        });
    });
});


app.listen(port, () => {
    console.log('Executando...')
})