const express=require("express");
const cors=require("cors");
const mongoose = require("mongoose");

const Usuario = require("./models/Usuario");


const app=express();
const port= 3600;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

/*CONEXION CON MONGO DB Trb.8PeG9eAfr6j*/
mongoose.connect("mongodb://Arturo:<Arturo21>@ac-tsejomw-shard-00-00.8atiiau.mongodb.net:27017,ac-tsejomw-shard-00-01.8atiiau.mongodb.net:27017,ac-tsejomw-shard-00-02.8atiiau.mongodb.net:27017/?ssl=true&replicaSet=atlas-twezgn-shard-0&authSource=admin&appName=Cluster0")
.then(
    ()=>console.log("MongoDB conectado al proyecto")
)
.catch(
    err => console.log(err)
);
let idActual=3;

app.get("/api/usuarios", async(req,res)=>{
    const usuarios = await Usuario.find();
    res.json(usuarios);
});

app.post("/api/usuarios", async(req,res)=>{
    const nuevo = new Usuario(
        {
            nombre:req.body.nombre,
            email:req.body.email,
            genero:req.body.genero,
            plataformas:req.body.plataformas
        }
    );
    
    const guardado = await nuevo.save();

    res.json(guardado);
});

app.put("/api/usuarios/:id", async(req, res)=>{
    
    const usuarioActualizado = await Usuario.findByIdAndUpdate(
        req.params.id,
        {
            nombre:req.body.nombre,
            email:req.body.email,
            genero:req.body.genero,
            plataformas:req.body.plataformas
        },
        {new:true}
    );
    res.json(usuarioActualizado);


});

app.listen(port, ()=>{
    console.log("Listening at http://localhost:3600");
});