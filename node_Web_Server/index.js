import ejs from "ejs";
import Fastify from "fastify";
import fastifyStatic from "@fastify/static";
import {join} from "path";
import operatingHours from "./data/operatingHours.js";
import menuItem from "./data/menuItem.js";
import fastifyView from "@fastify/view";
const publicPath = join(process.cwd(), "public");

const app = Fastify({
    logger:true
});
app.register(fastifyStatic,{
    root: publicPath,
    prefic:"/public/",
});
app.register(fastifyView,{
    engine:{
        ejs:ejs,
    }
});
const PORT =3000;
app.get("/",(request,response)=>{
    response.view("views/index.ejs",{name:"What's Fare is Fair"});
});
app.get("/menu",(request,response)=>{
    response.view("views/menu.ejs",{menuItem});
});
app.get("/hours",(request,response)=>{
    const days = [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
    ];
    response.view("views/hours.ejs",{operatingHours,days});
});app.listen({port:PORT},(err,address)=>{
    if (err) throw err;
    console.log(`Server is running at http://localhost:${PORT}`);
});
