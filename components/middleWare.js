
const { connection } = require('../dbConnect');
const jwt = require('jsonwebtoken');
const config = require('../config.json');
const ACCRESS_TOCKEN = config.ACCRESS_TOCKEN;
const ISBN = require( 'isbn-validate' );

exports.checkIsAdmin = (req, res, next) => {
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
exports.checkIsUser = (req, res, next) => {
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

exports.userIsInDbMid = (req, res, next) => {
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

exports.authorisatiomMid = (req, res, next) => {
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
exports.checkISBN = (req, res, next) =>{
    if(ISBN.Validate(req.body.ISBM)){
        next()
    }
    else{
        res.status(401).json({status:"This isn't ISBN code"});
    }
}