const express=require('express');
const bodyparser=require('body-parser');
const app=express();
const crypto = require("crypto");

const port=8000;

app.use(bodyparser.json());


const users=[];

//GET and POST requests
app.get('/',function(req,res){

   res.status(200).json({text:'Hello World'});
});


//registering a user
app.post('/api/alumni/register',function(req,res){
    
    try{
        const user = req.body;
        const i_d = crypto.randomBytes(4).toString("hex");
        var newuser={id: i_d,...user}
        users.push(newuser);
        console.log(users);
        res.status(201).json(newuser);
    }
    catch(err){
        console.log(err.message);
        res.status(500).json({message:err.message});
    }
       
});

app.get('/api/alumni/login', function(req, res) {
        const username = req.query.username;
        const pass = req.query.password;
        console.log(username,pass);
        const user = users.find(us => us.username === username && us.password === pass);
        delete user.password;
        if (user) {
            console.log(user);
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: "User not found" });
        }
});

app.put('/api/alumni/update/:id', function(req, res){

    const id = req.params.id;
    const updatedUser = req.body;

    const index = users.findIndex(us => us.id === id);
    //returns -1 is match not found
    if (index !== -1) {
        //here, values from updatedUser will override the values from users[index]
        users[index] = { ...users[index], ...updatedUser };
        const user = users[index];
        const required = { id: user.id, username: user.username, name: user.name, graduationYear: user.graduationYear, contactNumber: user.contactNumber, email: user.email, currentJob: user.currentJob };
        res.status(200).json(required);
    } else {
        res.status(404).json({ message: "User not found" });
    }

});


app.delete('/api/alumni/delete/:id',function(req,res){

        const id=req.params.id;
        users.splice(users.findIndex(user => user.id === id) , 1)

        res.status(204).json({message:"No Content"});

});

app.get('/api/alumni/all',function(req,res){

    const ans=users.map(us => {
        delete us.password;
        delete us.username;
        delete us.email;
        delete us.contactNumber;
        return us;
    });
    res.status(200).json(ans);
});


app.listen(port,(err)=>{
    if(err){
        console.log(`Error in running the server: ${err}`);
    }
    console.log(`Server is running on port: ${port}`);
});


