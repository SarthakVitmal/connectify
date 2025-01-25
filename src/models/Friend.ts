import mongoose from "mongoose";
import Schema from "mongoose"
import {models,model} from "mongoose"

const FriendSchema = new mongoose.Schema({
    userId:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    friendId:{
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

const Friend = models.Friend || model('Friend',FriendSchema);

export default Friend;