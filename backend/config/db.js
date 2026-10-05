const mysql=require("mysql2");
const db=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"kashyap",
    database:"event_management"
});

db.connect((err)=>{
    if(err){
        console.log("error in connecting the database");
        return;
    }
    console.log("Database Connected");
});

module.exports=db;