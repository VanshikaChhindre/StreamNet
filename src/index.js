import dotenv from "dotenv"
dotenv.config({path: './env'})
import connectDB from './db/indexDB.js';




connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000, ()=>{
        console.log(`Server is running at port: ${process.env.PORT}`)
    })
})
.catch((err)=>{
    console.log("MongoDB failed!!!", err);
})
