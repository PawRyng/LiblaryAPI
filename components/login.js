
const { connection } = require('../dbConnect');
const jwt = require('jsonwebtoken');
const config = require('../config.json');
const ACCRESS_TOCKEN = config.ACCRESS_TOCKEN;


exports.login = async (req, res) => {
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
};