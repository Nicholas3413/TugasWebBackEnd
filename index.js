const express = require('express')
var cors=require('cors')
const app = express()
app.use(cors())
 app.use(express.json())
 app.use(express.urlencoded({ extended: true }))
const sql = require("mssql/msnodesqlv8");
const conn = new sql.ConnectionPool({
  database: "web1",
  server: "DALETBEIT",
  driver: "msnodesqlv8",
  options: {
    trustedConnection: true
  }
})
const routerUser=require('./routers/users.js')
const auth=require('./middlewares/auth.js')


app.get('/', (req, res)=>{
 res.send(
 `<html>
<body>
 <form action="/todo" method="POST">
 <input name="deskripsi"></input>
 <button>Add</button> 
 </form>
</body>
 </html>`
 )
})



app.post('/todo',auth, (req, res)=>{
 console.log('sudah terhandle oleh post di /todo')
 console.log(req.body.deskripsi)

    var sql="insert into todo values ('"+req.body.deskripsi+"')"
    
    conn.connect().then(()=>{
       conn.query(sql, (err, result) => {
        if (!err) {
            console.log('Successfully added information.')
            
        } else {
            console.log(result)
            console.log('Was not able to add information to database.');
        } 
    })
})
    res.json({id:404,deskripsi:req.body.deskripsi})
})
 
app.get('/todo',auth, (req, res) => {
    conn.connect().then(()=>{
       conn.query('Select * from todo', (err, result) => {
           res.json(result.recordset)
    })
})
})

app.delete('/todo/:id',auth,(req,res)=>{
    console.log("sedang dihapus")
    conn.connect().then(()=>{
        const que="Delete from todo where id='"+req.params.id+"'"
        console.log(que)
        conn.query(que,(err,result)=>{
            console.log(err)
            res.json(result)
        })
    })
})

app.use(routerUser)

app.listen(3000)