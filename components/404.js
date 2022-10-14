exports.error404 = async res =>{
    res.json({ status: "Book with this ISBM is't in db"})
}