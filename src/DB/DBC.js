import mongoose from "mongoose";

const DBC = async ()=>{
    mongoose.connect(process.env.URI_ONLINE).then(()=>{
        console.log(`DB connected on URL ${process.env.URI_ONLINE}`);
    }).catch((err)=>{
        console.log("DB not connected",err);
    });

}
export default DBC;