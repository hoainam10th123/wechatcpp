import mongoose from "mongoose";
import validator from "validator";

const userSchema = mongoose.Schema({
    displayName: {
        type: String,
        required: [true, "Please provide your name"],
    },
    email: {
        type: String,
        required: [true, "Please provide tour email address"],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, "Please provide a valid email address"],
    },
    password: {
        type: String,
        required: [true, 'Password is not empty'],
        minLength: [6, 'Password min length is 6'],
        maxLength: [128, 'Password max lenght is 128'],
    },
    picture: {
        type: String,
        default:"assets/user.png",
    },
    status: {
        type: String,
        default: "Hey there ! I am using whatsapp",
    },
    lastActive: {
        type: Date,
        default: Date.now()       
    }
}, {
    collection: "users",
    timestamps: true
})

userSchema.methods.toJSON = function () {
    let obj = this.toObject();
    delete obj.password;
    return obj;
};

export default mongoose.model('User', userSchema);