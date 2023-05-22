const express =require('express');
const mysql=require('mysql');
const cors = require("cors");
const bcrypt = require('bcrypt');
const bodyParser=require("body-parser");
const cookieparser=require("cookie-parser")
const session=require("express-session");
const saltRounds = 10;

const PORT=process.env.PORT || 3001;

const app=express()
app.use(cors({
    origin:"http://localhost:3000",
    credentials:true,
}));
app.use(express.json());
app.use(cookieparser());
app.use(bodyParser.urlencoded({extended:true}));
app.use(session({
    key:"userId",
    secret:"atanu",
    resave:false,
    saveUninitialized:false,
    // cookie:{
    //     expires:60*60*60*24,
    // }
}))

const db=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'`newdb`'
})
app.get("/",(req,res)=>{
    res.send("true");
})

app.post("/register",(req,res)=>{
    const Email=req.body.Email;
    const Password=req.body.Password;
    bcrypt.hash(password,saltRounds,(errr,hash)=>{
        const data={
            Username:req.body.Username,
            Email:req.body.Email,
            Password:hash, 
            
            
       };
       if(errr)
       {
        console.log(err);
       }
       else{
        let sqll=`select * from user where Email='${Email}'`;
        db.query(sqll,(er,ress)=>{
            if(ress?.length > 0)
            {
                res.send({msg:"User Email Already Present"})

            }
            else{
                let sql="INSERT INTO user SET ?";
                db.query(sql,data,(err,result)=>{
                    if(err)
                    {
                        console.log(err)
                    }
                    else{
                        //  console.log(result);
                         res.send(result);
                        // res.send()
            
                    }
                })
            }
        })
       }
    })   
})
app.post("/registerAdmin",(req,res)=>{
    const Email=req.body.Email;
    const Password=req.body.Password;
    bcrypt.hash(Password,saltRounds,(errr,hash)=>{
        const data={
       
            Email:req.body.Email,
            Password:hash, 
           
       };
       if(errr)
       {
        console.log(err);
       }
       else{
        let sqll=`select * from admin where Email='${Email}'`;
        db.query(sqll,(er,ress)=>{
            if(ress.length > 0)
            {
                res.send({msg:"User Email Already Present"})

            }
            else{
                let sql="INSERT INTO admin SET ?";
                db.query(sql,data,(err,result)=>{
                    if(err)
                    {
                        console.log(err)
                    }
                    else{
                        //  console.log(result);
                         res.send(result);
                        // res.send()
            
                    }
                })
            }
        })

       }

    })     
})

app.post("/login",(req,res)=>{
   const Email=req.body.Email;
    const Password=req.body.Password;

    // console.log(email);
        
      
        let sql=`select * from user where Email='${Email}'`;
        // console.log(sql);
        db.query(sql,(err,result)=>{
            if(err)
            {
                // res.send({err:err})
                console.log(err);
            }
            else{
              
               if(result.length > 0)
               {
                bcrypt.compare(password,result[0].password,(errr,response)=>{
                    if(response)
                    {
                        req.session.user=result;
                        // console.log(req.session.user);
                     
                     res.send({login:true,useremail:Email});
                    }
                    else{
                     res.send({login:false,msg:"Wrong Password"});
                    
                    }
                })

                

               }
               else{
                    res.send({login:false,msg:"User Email Not Exits"});
                // console.log("noo email ")
               }
                
    
            }
        })

      
    
     
})

app.post("/loginAdmin",(req,res)=>{
    const Email=req.body.Email;
     const Password=req.body.Password;
 
     // console.log(email);
         
       
         let sql=`select * from admin where Email='${Email}'`;
         // console.log(sql);
         db.query(sql,(err,result)=>{
             if(err)
             {
                 // res.send({err:err})
                 console.log(err);
             }
             else{
               
                if(result.length > 0)
                {
                 bcrypt.compare(Password,result[0].Password,(errr,response)=>{
                     if(response)
                     {
                         req.session.user=result;
                         // console.log(req.session.user);
                      
                      res.send({login:true,useremail:Email});
                     }
                     else{
                      res.send({login:false,msg:"Wrong Password"});
                     
                     }
                 })
 
                 
 
                }
                else{
                     res.send({login:false,msg:"User Email Not Exits"});
                 // console.log("noo email ")
                }
                 
     
             }
         })

 })
   
app.get("/login",(req,res)=>{
    if(req.session.user)
    {
        res.send({login:true,user:req.session.user});
    }
    else{
        res.send({login:false});
    }
})



app.listen(PORT,()=>{
    console.log(`app running in ${PORT}` )
})
