const mongoose=require("mongoose");
const userSchema=mongoose.Schema({
    userID: { 
        type: String, 
        unique: true
     },
    username: { 
        type: String, 
        unique: true
    },
    email: { 
        type: String, 
        unique: true, 
        lowercase:true
    },
    password: { 
        type: String
    },
    firstName: { 
        type: String 
    },
    lastName: { 
        type: String 
    },
    role: { 
        type: String, 
        enum :["user","admin"],
        default: "user" 
    },
    accountStatus: { 
        type: String, 
        enum :["active","inactive"],
        default: "Active" 
    }
},
{
    timestamps:true
});

module.exports=mongoose.model("User",userSchema);