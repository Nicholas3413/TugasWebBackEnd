const express =require('express')
const router=express.Router()

const sql = require("mssql/msnodesqlv8");
const conn = new sql.ConnectionPool({
  database: "web1",
  server: "DALETBEIT",
  driver: "msnodesqlv8",
  options: {
    trustedConnection: true
  }
})

const auth=require('../middlewares/auth.js')

//router.get('/tuser', (req, res)=>{
// res.send(
// `<html>
//<body>
// <form action="/user" method="POST">
// <input name="username"></input>
// <input name="password"></input>
// <button>Add</button> 
// </form>
//</body>
// </html>`
// )
//})

router.get('/user',auth,(req,res)=>{
    conn.connect().then(()=>{
       conn.query('Select * from users', (err, result) => {
           res.json(result.recordset)
           
    })
})
})
router.post('/user',(req,res,next)=>{
    const str="SELECT username FROM users"
    conn.connect().then(()=>{
        conn.query(str, (err,rows,fields)=> {
            if(rows.recordset.length>0){
                auth(req,res,next)
            }
            else{
                next()
            }
        })
    })
    
},(req,res)=>{
    var sql="insert into users values ('"+req.body.username+"','"+req.body.password+"')"
    var sql2="select * from users where username='"+req.body.username+"'"
    conn.connect().then(()=>{
       conn.query(sql+sql2, (err, result) => {
        if (!err) {
            console.log('Successfully added information.')
            console.log(result.recordset)
            res.json({id:result.recordset[0].id,username:result.recordset[0].username})
        } else {
            console.log(result)
            console.log('Was not able to add information to database.');
        } 
           
//        conn.query('SELECT SCOPE_IDENTITY()',(err,result)=>{
//            var noname=""
//        console.log(result.recordset[0].noname)
    })
    })
})
    

router.delete('/user/:id',auth,(req,res,next)=>{
    const str="SELECT username FROM users"
    conn.connect().then(()=>{
        conn.query(str, (err,rows,fields)=> {
            if(rows.recordset.length===1){
                res.send('cannot delete user')
            }
            else{
                next()
            }
        })
    })
},(req,res)=>{
    conn.connect().then(()=>{
        const que="Delete from users where id='"+req.params.id+"'"
        console.log(que)
        conn.query(que,(err,result)=>{
            console.log(err)
            res.json('user deleted')
        })
    })
})

module.exports=router