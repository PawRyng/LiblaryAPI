const { connection } = require('../dbConnect');


exports.showBooks = async (req, res) => {
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
};


