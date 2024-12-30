import mongoose from "mongoose";
import Schema from "mongoose"
import {models,model} from "mongoose"

const ContactSchema = new mongoose.Schema({
    userId:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    contactId:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    status:{
        type:String,
        enum:['offline','online'],
        default:'offline'
    },
    lastMessage:{
        type:String,
        default:''
    }
},{
    timestamps:true
})

const Contact = models.Contact || model('Contact',ContactSchema)

export default Contact;