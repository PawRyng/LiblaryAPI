const express = require('express');
const router = express.Router();

const Login = require("./components/login")
const AddBook = require("./components/addBook")
const BorrowBook = require("./components/borrowBook")
const DeleteBook = require("./components/deleteBook")
const EditBook = require("./components/editBook")
const RegisterAdmin = require("./components/registerAdmin")
const RegisterUser = require("./components/registerUser")
const ReturnBook = require("./components/returnBook")
const ShowBooks = require("./components/showBooks")
const MiddleWare = require("./components/middleWare");
const Error404 = require("./components/404")

const {checkIsAdmin, checkIsUser, userIsInDbMid, authorisatiomMid, checkISBN} = MiddleWare;
router
.route("/login")
.post(Login.login)
router
.route("/registerAdmin")
.put(userIsInDbMid, RegisterAdmin.registerAdmin)
router
.route("/registerUser")
.put(userIsInDbMid, RegisterUser.registerUser)
router
.route("/AddBook")
.put(authorisatiomMid, checkIsAdmin, checkISBN, AddBook.addBook)
router
.route("/DeleteBook")
.delete(authorisatiomMid,checkIsAdmin, checkISBN, DeleteBook.deleteBook)
router
.route("/BorrowBook")
.post(authorisatiomMid,checkIsUser, checkISBN, BorrowBook.borrowBook)
router
.route("/ReturnBook")
.post(authorisatiomMid,checkIsUser, checkISBN, ReturnBook.returnBook)
router
.route("/EditBook")
.post(authorisatiomMid,checkIsAdmin, checkISBN, EditBook.editBook)
router
.route("/ShowAllBooks")
.search(authorisatiomMid, ShowBooks.showBooks)


module.exports = router