const express = require('express');
const app = express();
const path = require('path')
const fs = require('fs')
const bodyParser = require('body-parser')
const cors = require('cors');
const nodemailer = require('nodemailer');
const  mongoose  = require('mongoose');
const { type } = require('os');
const { error } = require('console');

app.use(bodyParser.json())
app.use(cors())
app.use(express.static(path.join(__dirname,'Assets')));

mongoose
.connect(
    "mongodb+srv://zankhnavaghela2:OHDe0EMUqsW6DIsN@cluster0.rqwr1qz.mongodb.net/?retryWrites=true&w=majority&appname=Cluster0"
)
.then(()=> console.log("mongodb connected"))
.catch((err)=>console.log("mongo error",err))

const contactSchema = new mongoose.Schema({
    name:{
        type: String,
        require: true
    },
    email:{
        type: String,
        require: true
    },
    mobile:{
        type:String,
        require: true
    },
    message:{
        type: String,
        require: true
    },
});

const contact = mongoose.model("contactdata",contactSchema);

const newsletterSchema = new mongoose.Schema({
    email:{
        type: String,
        require: true
    },
});

const newsletter = mongoose.model("newsletter",newsletterSchema);

app.post('/contact',async(req,res)=>{
    const{name,email,mobile,message} = req.body;
    const newcontact = await contact.create({
        name,
        email,
        mobile,
        message,
    })

    const transporter = nodemailer.createTransport({
        service:'gmail',
        auth:{
            user:'zankhnavaghela2@gmail.com',
            pass:'ohqj mxwe hbbq huhj',
        },
    });

    const mailoptions = {
        from: 'zankhnavaghela2@gmail.com',
        to: email,
        subject: 'Start Your Journey in abroad',
        html:`
        <p>Dear, ${name}</p>
        <p>Thank You for visiting our website.</p>
        <p>are you looking for study in abroad or visit in abroad</p>
        <p>We are here to answer your questions related</p>
        <p>I hope this mail is help you</p>
        <p>Best Regards,</p>
        <p>Consultant Team</p>`
        ,
    };
    const mail = await transporter.sendMail(mailoptions);
    console.log(mail.response)
    res.json({li:'true',message:"Thank You"})
});

app.post('/newsletter',async(req,res)=>{
    const{email} = req.body;
    const nnewsletter = await newsletter.create({       
        email,
    })
    res.json({li:'true',message:"Thank You"})
});

app.get('/grid',(req,res)=>{
    const filePath = path.join(__dirname,'Grid.json');
    fs.readFile(filePath,'utf-8',(err,data)=>{
        if(err){
            console.error('Error for reading Grid.json:',err);
            return res.status(500).json({success:false,message:'Error for reading the file'});
        }

        try{
            let jsonData = JSON.parse(data);
            const updatedJson = jsonData.map(item =>{
                if(item.img){
                    item.img = 'http://' + req.get('host') + item.img;
                }
                return item;
            });
            res.json({success:true,data:updatedJson});
        }
        catch(parseErr){
            console.error('Error parsing JSON:',parseErr);
            res.status(500).json({success:false,message:'Error parsing JSON data'})
        }
    })
})

app.listen(3034,() =>{
    console.log("You are connected with server")
})