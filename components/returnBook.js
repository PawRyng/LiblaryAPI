const { connection } = require('../dbConnect');
const jwt = require('jsonwebtoken');
const config = require('../config.json');
const ACCRESS_TOCKEN = config.ACCRESS_TOCKEN;


exports.returnBook = async (req, res) => {
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
    
};
