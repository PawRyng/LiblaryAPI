const { connection } = require('../dbConnect');

exports.deleteBook = async (req, res) => {
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
};