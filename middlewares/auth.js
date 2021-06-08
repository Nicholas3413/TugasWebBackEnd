const sql = require("mssql/msnodesqlv8");
const conn = new sql.ConnectionPool({
  database: "web1",
  server: "DALETBEIT",
  driver: "msnodesqlv8",
  options: {
    trustedConnection: true
  }
})

module.exports=function(req,res,next){
    const username= req.headers.username
    const password=req.headers.password
    const str="SELECT username FROM users where (username ='"+username+"' AND passwd='"+password+"')"
    console.log(str)
    conn.connect().then(()=>{
        conn.query(str, (err,rows,fields)=> {
//            console.log(rows.length)
//            console.log(rows[0])
//            if(rows.length>0){
//                next()
//            }
//            else{
//                res.send(401)
//            }
        if(rows.recordset.length===0){
            res.send(401)
        }

//        else if(rows.recordset[0].username===username){
//            console.log(rows.recordset[0].username)
//            next()
//        }
        else{
            next()
        }
        
    })
    })
}
