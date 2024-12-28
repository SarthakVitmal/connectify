import mongoose from "mongoose";
import {model, models, Schema} from "mongoose"

const MessageSchema = new mongoose.Schema({
    senderId:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    receiverId:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    content:{
        type:String,
        required:true
    },
    channel:{
        type:String,
        default:'global'
    },
    timestamp:{
        type:Date,
        default:Date.now()
    },
    isRead:{
        type:Boolean,
        default:false
    }
})

const Message = models.Message || model('Message',MessageSchema)

export default Message;