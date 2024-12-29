import mongoose from "mongoose";
import {model, models, Schema} from "mongoose"

const getISTTime = (): Date => {
    const now = new Date();
    const utcOffset = now.getTime() + now.getTimezoneOffset() * 60000; // Convert to UTC
    const istOffset = 5.5 * 3600000; // Add IST offset (5 hours 30 minutes)
    return new Date(utcOffset + istOffset);
  };


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
        default:getISTTime,
    },
    isRead:{
        type:Boolean,
        default:false
    }
})

const Message = models.Message || model('Message',MessageSchema)

export default Message;