const { connection } = require('../dbConnect');

exports.registerUser = async (req, res) => {
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
}


