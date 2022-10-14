const { connection } = require('../dbConnect');


exports.editBook = async (req, res) => {
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
};