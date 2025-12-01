import mongoose from "mongoose";
await mongoose.connect('mongodb://localhost:27017/myapp');
const User = mongoose.model('User',{
    name:String,
    email:String,
});
await new User({ name: 'Test-User', email:'test@test.com'}).save();