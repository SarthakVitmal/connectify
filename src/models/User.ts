import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    verificationToken: {
        type: String,
    },
    verificationTokenExpiration: {
        type: Date,
    },
    forgotPasswordToken: {
        type: String,
    },
    forgotPasswordTokenExpiration: {
        type: Date,
    },
    status:{
        type: String,
        enum: ['online','offline'],
        default: 'offline'
    },
    friends: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
});

const User = (mongoose.models && mongoose.models.User) || mongoose.model('User', UserSchema);
export default User;