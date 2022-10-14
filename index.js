const express = require('express');
const app = express();
const DbConnect = require("./dbConnect")
const Routes = require("./Routers")





app.use(express.json());

app.use("/", Routes)

DbConnect.connection.connect(function(err) {
  err ? console.log(err) : console.log("Connected!");
});




app.listen("3001", ()=>{
    console.log("3001")
})



