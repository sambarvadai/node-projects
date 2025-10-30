import { appendFileSync, writeFileSync } from 'fs';
import { createInterface } from 'readline';
import { promisify } from 'util';
import { createObjectCsvWriter } from 'csv-writer';
import prompt from 'prompt';
prompt.start();
prompt.message = "";
const writerObj = createObjectCsvWriter({
    path:'./contacts.csv',
    append:true,
    header:[
      {id:'name', title:'Name'},
      {id:'number',title:'Number'},
      {id:'email', title:'Email'},
      {id:'date', title:'Date Added'}
    ]
});
class Person{
    constructor(name="",number="",email="", dateAdded = new Date().toISOString()){
        this.name = name;
        this.number = number;
        this.email = email;
        this.date = dateAdded;
    }
   async saveToCSV(){
    try{
        const {name, number, email, date} = this;
        await writerObj.writeRecords([{name, number, email, date}]);
        console.log(`Contact ${name} saved successfully.`);
    }
    catch (err){
        console.log(err);
    }
   }
}
const startApp = async () =>{
const ques = {
    properties:{
        name:{title:'Enter Name'},
        number:{
            title: 'Enter Number',
            pattern:/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/,
            message:'Number must be in the format of XXX-XXX-XXXX'
        },
        email:{
            title:'Enter email',
            pattern:/\S+@\S+\.\S+/,
            message: 'Email must be in the format of xxxx@xxx.com'
        }
    }
}
const responses = await prompt.get(ques);
const PersonObj = new Person(responses.name, responses.number, responses.email);
await PersonObj.saveToCSV();
const {again} = await prompt.get([
    {name:'again',description:'Do you wish to add another contact? y/n'}
]);
if(again.toLowerCase() === 'y'){
    await startApp();
};
}
startApp();