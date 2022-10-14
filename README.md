﻿# LiblaryAPI
/registerUser
required: Login,Password,Name

/registerAdmin
required: Login,Password,Name

/login
required: Login,Password

/AddBook
required: Title, Author, ISBM and bearer Token in header

/DeleteBook
required: ISBM and bearer Token in header

/EditBook
required: ISBM and bearer Token in header

/ShowAllBooks
required: Token in header
If you add ../ShowAllBooks?borrowed = true in URL then you see borrowed books

/BorrowBook
required: ISBM, Token in header

/ReturnBook
required: ISBM, Token in header
