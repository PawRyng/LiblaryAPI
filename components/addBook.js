const { connection } = require('../dbConnect');


exports.addBook = async (req, res) => {
    const {Title, Author, ISBM} = req.body;
    const ISBMQuery = "SELECT *  FROM `books` WHERE `ISBM` LIKE " + `'${ISBM}'`

    if(typeof(Title) !== "string" || typeof(Author) !== "string" || typeof(ISBM) !== "string"){
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
                    res.status(400).json({ status: "Book with this ISBN is in DB"})
                }
            } 
        }
            )
    }
};