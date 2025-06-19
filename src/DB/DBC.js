import mongoose from "mongoose";

const DBC = async ()=>{
    mongoose.connect(process.env.DB_URL).then(()=>{
        console.log("DB connected");
    }).catch((err)=>{
        console.log("DB not connected",err);
    });

}
export default DBC;