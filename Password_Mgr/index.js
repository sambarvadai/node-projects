import bcrypt from "bcrypt";
import promptModule from "prompt-sync";
import { MongoClient, ReturnDocument } from "mongodb";
const prompt = promptModule();
const dbURL = "mongodb://localhost:27017";
const client = new MongoClient(dbURL);
let hasPassword = false;
let passWordCollection, authCollection;
const dbName = 'pwdManager';
// const mockDB = {passwords:{}};
const main = async()=>{
    try{
        await client.connect();
        console.log("Connected successfully to MongoDB");
        const db = client.db(dbName);
        authCollection = db.collection('auth');
        passWordCollection = db.collection('passwords');
        const hashedPwd =  await authCollection.findOne({type:"auth"});
        hasPassword = !!hashedPwd;
    }
    catch(error)
    {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
}
const showMenu = async ()=>{
    console.log(`
        1. View Passwords
        2. Manage new Password
        3. Verify Password
        4. Exit
        5. Find password by source`);
        const resp = prompt("Choose an option: ");
        switch(resp){
            case "1": await viewPass();
            break;
            case "2": await promptManageNewPass();
            break;
            case "3": await promptOldPass();
            break;
            case "4": process.exit(0);
                break;
            case "5": await searchPassBySource();
                break;
            default:
                console.log("Invalid option. Please try again.");
                await showMenu();
                break;
        }
};
const viewPass = async() =>{
    const passwords = await passWordCollection.find({}).toArray();
    passwords.forEach(({source, password}, idx)=>{
        console.log(`${idx+1}. ${source}: ${password}`);
    });
showMenu();
}
const promptManageNewPass = async () => {
    const source = prompt("Enter the name for password:");
    const password = prompt("Enter the associated password:");
    const hashNum = prompt('Enter the number of salt rounds(default salt rounds is 11):');
    const hashedpassword = bcrypt.hashSync(password, parseInt(hashNum) || 11);
    await passWordCollection.findOneAndUpdate(
        { source },
        { $set: { password } }, {
        returnDocument: "after",
        upsert: true
    }
    );
    console.log(`Password for ${source} has been saved`);
    showMenu();
};
const promptNewPassword = async()=>{
    console.log("No existing password found. Please set a new password.");
    const newPass = prompt("Enter your new password:");
    const saltNum = prompt('Enter the number of salt rounds(default salt rounds is 11):');
    await saveNewPass(newPass,saltNum);
}
const saveNewPass = async (password,saltNum) => {
    const hash = bcrypt.hashSync(password, parseInt(saltNum));
    await authCollection.insertOne({ type: "auth", hash, saltNum },);
    console.log(`Password hashed and saved to Mock DB`);
    showMenu();
}
const compareHashedPassword = async (password) => {
    const { hash, saltNum } = await authCollection.findOne({ type: "auth" });
    return bcrypt.compareSync(password, hash);
};
const promptOldPass = async() =>{
    let verified  = false;
    while(!verified){
    const oldPass = prompt("Enter your current password:");
    const res = await compareHashedPassword(oldPass);
    if(res){
        console.log('Password verified successfully.');
        verified = true;
        showMenu();
    }
    else{
        console.log('Incorrect password. Please try again.');
    }
    }
};
const searchPassBySource = async () => {
    const src = prompt("Enter the source to search for:");
    const values = await passWordCollection.find({source:src}).toArray();
    if(values.length === 0 )
    {
        console.log("No passwords were found for the given source.");
    }
    else {
        values.forEach(({ source, password }, idx) => {
            console.log(`${idx + 1}. ${source}: ${password}`);
        });
    }
    showMenu();
}
await main();
if(!hasPassword) promptNewPassword();
else promptOldPass();