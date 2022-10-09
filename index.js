const express = require('express');
const app = express();

const config = require('./config.json');

const cors = require('cors');
const jwt = require('jsonwebtoken');
const mysql = require("mysql2")

const ACCRESS_TOCKEN = config.ACCRESS_TOCKEN;
const authorisatiomMid = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if(!token){
        return res.json({status:"brak tokenu", error: token});
    }
    
    jwt.verify(token, ACCRESS_TOCKEN, (err, data)=>{
        if(err){
            return res.json({status:"No access", tocken:token});
        }
        req.user = data;       

        next();

    })
}
const connection = mysql.createConnection({
    host: config.URL_DB,
    user: 'root',
    database: 'liblary'
  });


  connection.connect(function(err) {
    err ? console.log(err) : console.log("Connected!");
  });



const userIsInDbMid = (req, res, next) => {
    const {Login} = req.body 
    if(typeof(Login) === "string"){
        connection.query("SELECT * FROM `users` WHERE `Login` LIKE " +`'${Login}'`, (err, result)=>{
               if(err){
                res.status(500).json({status:err})
               }
               else{
                if(result.length === 0 ){
                    next();
                }
                else{
                    res.status(101).json({status:"error", error:"user with this Login is in DB"})
                }
               }
        });
    }   
    else{
        res.status(400).json({ status: 'error', error:"invalid data"})
    }
}


app.use(cors());
app.use(express.json());





const checkIsAdmin = (req, res, next) => {
    if(req.body.token.length <= 1){
        res.status(400).json({ status: 'ERROR', error:"No Tocken"})
    }
    else{
        if(jwt.decode(req.body.token).IsAdmin === 1){
            next()
        }
        else{

            res.status(400).json({ status: 'ERROR', error:"No premision"})
        }   
    }
    
}
const checkIsUser = (req, res, next) => {
    if(req.body.token.length <= 1){
        res.status(400).json({ status: 'ERROR', error:"No Tocken"})
    }
    else{
        if(jwt.decode(req.body.token).IsAdmin === 0){
            next()
        }
        else{

            res.status(400).json({ status: 'ERROR', error:"No premision"})
        }   
    }
    
}






app.post("/registerUser",userIsInDbMid, async (req, res) => {
        const {Login, Password, Name} = req.body;
        
        if(typeof(Login) !== "string" || typeof(Password) !== "string" || typeof(Name) !== "string"){
            res.status(400).json({ status: 'error', error:"invalid data"})
        }
        else{
            const values = `(NULL, '${Name}', '${Login}', '${Password}', '0' )`
        const query = "INSERT INTO `users` (`ID_User`, `Name`, `Login`, `Password`, `IsAdmin`) VALUES "+ values;
        connection.query(query, (err, result) =>{
            err ? res.status(500).json({ status: 'error'}) : res.status(200).json({ status: 'OK', information: result})
        })
        }
});


app.post("/registerAdmin",userIsInDbMid, async (req, res) => {
    const {Login, Password, Name} = req.body;
        
    if(typeof(Login) !== "string" || typeof(Password) !== "string" || typeof(Name) !== "string"){
        res.status(400).json({ status: 'error', error:"invalid data"})
    }
    else{
        const values = `(NULL, '${Name}', '${Login}', '${Password}', '1' )`
    const query = "INSERT INTO `users` (`ID_User`, `Name`, `Login`, `Password`, `IsAdmin`) VALUES "+ values;
    connection.query(query, (err, result) =>{
        err ? res.status(500).json({ status: 'error'}) : res.status(200).json({ status: 'OK', information: result})
    })
    }
});

app.post("/login", async (req, res) => {
    const {Login, Password} = req.body;
    const userLogin = "SELECT * FROM `users` WHERE `Login` LIKE " + `'${Login}' AND ` + "`Password` LIKE "+ `'${Password}'`;
    if(typeof(Login) !== "string" || typeof(Password) !== "string"){
        res.status(400).json({ status: 'error', error:"invalid data"})
    }
    else{
        connection.query(userLogin, (err, result)=>{
            if(err){
                res.status(500).json({ status: 'error'})
            }
            else{
                if(result.length <=0){
                    res.status(400).json({ status: 'error', error:"user does not exist"})
                }
                else{
                    const token = jwt.sign(result[0], ACCRESS_TOCKEN);
                    res.status(200).json({ status: 'OK', token})
                    
                }
            }
            
        })
    }
});



//Book

app.post("/AddBook",authorisatiomMid,checkIsAdmin, async (req, res) => {
    const {Title, Author, ISBM} = req.body;
    const ISBMQuery = "SELECT *  FROM `books` WHERE `ISBM` LIKE " + `'${ISBM}'`

    if(typeof(Title) !== "string" || typeof(Author) !== "string" || typeof(ISBM) !== "string" || ISBM.length !== 13){
        res.status(400).json({ status: 'error', error:"invalid data"})
    }
    else{
        connection.query(ISBMQuery, (err, result) => {
            if(err) {
                res.status(500).json({ status: 'error'})
             }
             else{
                if(result.length === 0){
                    const query = "INSERT INTO `books` (`Book_ID`, `borrowed_by`, `Title`, `ISBM`, `Author`) VALUES (NULL, NULL," +` '${Title}', '${ISBM}', '${Author}')`;
                    connection.query(query, (err, result) => err ? res.status(500).json({ status: 'error'}) : res.status(200).json({ status: 'OK'}))
                    
                }
                else{
                    res.status(400).json({ status: "Book with this ISBM is in DB"})
                }
            } 
        }
            )
    }
});


app.delete("/DeleteBook",authorisatiomMid,checkIsAdmin, async (req, res) => {
    const {ISBM} = req.body;
    if(typeof(ISBM) !== "string"){
        res.status(400).json({ status: 'error', error:"invalid data"})
    }
    else{
        const ISBMQuery = "SELECT *  FROM `books` WHERE `ISBM` LIKE " + `'${ISBM}'`

        connection.query(ISBMQuery, (err, result) => {
            if(err) {
                res.status(500).json({ status: 'error'})
             }
             else{
                if(result.length === 0){
                    res.status(400).json({ status: "Book with this ISBM is't in db"})
                }
                else{
                    const query = "DELETE FROM `books` WHERE `books`.`ISBM` =" +` '${ISBM}'`;
                    connection.query(query, (err, result) => err ? res.status(500).json({ status: 'error'}) : res.status(200).json({ status: 'OK'}))
                    
                }
            } 
        });        
    }
});

//UPDATE 
app.post("/EditBook",authorisatiomMid,checkIsAdmin, async (req, res) => {
    const {ISBM, Title, Author, NewISBM} = req.body;
    if(typeof(ISBM) !== "string"){
        res.status(400).json({ status: 'error', error:"invalid data"})
    }
    else{
        const ISBMQuery = "SELECT * FROM `books` WHERE `ISBM` LIKE " + `'${ISBM}'`

        connection.query(ISBMQuery, (err, result) => {
            if(err) {
                res.status(500).json({ status: 'error'})
            }
            else{
                if(result.length === 0){
                    res.status(400).json({ status: "Book with this ISBM is't in db"})
                }
                else{
                    const Book = result[0];
                    const Book_ID = Book.Book_ID;
                    console.log(Book)
                    const queryTitle = "UPDATE `books` SET `Title` = '"+Title+"' WHERE `books`.`Book_ID` = "+ Book_ID;
                    const queryISBM = "UPDATE `books` SET `ISBM` = '"+NewISBM+"' WHERE `books`.`Book_ID` = "+ Book_ID;
                    const queryAuthor = "UPDATE `books` SET `Author` = '"+Author+"' WHERE `books`.`Book_ID` = "+ Book_ID;
                    if(Title !== Book.Title && typeof(Title) == "string") connection.query(queryTitle, err => err && res.status(500).json({ status: 'error'}))
                    if(Author !== Book.Author && typeof(Author) == "string") connection.query(queryAuthor, err => err && res.status(500).json({ status: 'error'}))
                    if(ISBM !== NewISBM && typeof(NewISBM) == "string" && NewISBM.length === 13) {
                        connection.query(queryISBM, (err, result) => err && res.status(500).json({ status: 'error'}))
                        const NewISBMQuery = "SELECT *  FROM `books` WHERE `ISBM` LIKE " + `'${NewISBM}'`
                        connection.query(NewISBMQuery, (err, result) => { err ? res.status(500).json({ status: 'error'}) : res.status(200).json({ status: result[0]})})
                    }
                    else{
                        connection.query(ISBMQuery, (err, result) => { err ? res.status(500).json({ status: 'error'}) : res.status(200).json({ status: result[0]})})
                    }
                
                }
            } 
        });        
    }
});
//show books ? borrowed = true then you see browed books
app.post("/ShowAllBooks",authorisatiomMid, async req => {
    const queryAllBooks = "SELECT Title, Author, ISBM FROM `books`"
    const queryNoBorrowedBooks = "SELECT Title, Author, ISBM  FROM `books` WHERE `borrowed_by` IS NULL"
    if(req.query.borrowed == "true"){
        connection.query(queryNoBorrowedBooks, (err, result) =>{
            if(err){
                res.status(500).json({status:"error"})
            }
            else{
                res.status(200).json(result)
            }
        })
    }
    else{
        connection.query(queryAllBooks, (err, result) =>{
            if(err){
                res.status(500).json({status:"error"})
            }
            else{
                res.status(200).json(result)
            }
        })
    }
});



app.post("/BorrowBook",authorisatiomMid,checkIsUser, async (req, res) => {
    const {ISBM, token} = req.body;
    const ISBMQuery = "SELECT *  FROM `books` WHERE `ISBM` LIKE " + `'${ISBM}'`

    if(typeof(ISBM) === "string"){
        connection.query(ISBMQuery, (err, result)=>{
            if(err){
                res.status(500).json({ status: 'error'})
            }
            else{
                const Book = result[0]
                if(Book.borrowed_by){
                    res.status(200).json({ status: 'This book is borrowed'})
                }
                else{
                    const ID_User = jwt.decode(req.body.token).ID_User
                    const brroweQuery = "UPDATE `books` SET `borrowed_by` = '"+ID_User+"' WHERE `books`.`Book_ID` = "+Book.Book_ID;
                    connection.query(brroweQuery, err => err ? res.status(500).json({ status: 'error'}) : res.status(200).json({ status: 'OK'}) )

                }
            }
        })
    }
    else{
        res.status(400).json({ status: 'error', error:"invalid data"})
    }
    
});

app.post("/ReturnBook",authorisatiomMid,checkIsUser, async (req, res) => {
    const {ISBM, token} = req.body;
    const ISBMQuery = "SELECT *  FROM `books` WHERE `ISBM` LIKE " + `'${ISBM}'`

    if(typeof(ISBM) === "string"){
        connection.query(ISBMQuery, (err, result)=>{
            if(err){
                res.status(500).json({ status: 'error'})
            }
            else{
                const Book = result[0]
                if(Book.borrowed_by === jwt.decode(req.body.token).ID_User){
                    const returnQuery ="UPDATE `books` SET `borrowed_by` = NULL WHERE `books`.`Book_ID` = "+Book.Book_ID
                    connection.query(returnQuery, err => err ? res.status(500).json({ status: 'error'}) : res.status(200).json({ status: 'OK'}) )
                    
                }
                else{
                    res.status(400).json({ status: 'You dont borrowed this book'})
                }
            }
        })
    }
    else{
        res.status(400).json({ status: 'error', error:"invalid data"})
    }
    
});




app.listen("3001", ()=>{
    console.log("3001")
})



