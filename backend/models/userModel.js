import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{type: String, required: true},
    email:{type: String, required: true, unique: true},
    password:{type: String, required: true},
    phone:{type: String, default:"0000000000"},
    department:{type:String, required:true}

})

const userModel = mongoose.models.user || mongoose.model('user', userSchema)
export default userModel