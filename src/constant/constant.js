const dotenv=require('dotenv');
dotenv.config();

const DB_URL=`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASS}@devtinder.j9kvpom.mongodb.net/devTinder`;
// mongodb+srv://supreet7111999:<db_password>@devtinder.j9kvpom.mongodb.net/?retryWrites=true&w=majority&appName=devTinder

module.exports={
    DB_URL,
}