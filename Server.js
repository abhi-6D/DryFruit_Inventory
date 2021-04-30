const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongClient = require('mongodb').MongClient;
const { MongoClient } = require('mongodb');

var db;
var s;

MongoClient.connect('mongodb://localhost:27017/DryFruit_Store',(err,database)=>{
    if(err) return console.log(err)
    db = database.db('DryFruit_Store')
    app.listen(5100,()=>{
        console.log('Listening at port number 5100...')
    })
})

app.set('view engine','ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/',(req,res)=>{
    db.collection('df').find().toArray((err,result)=>{
        if(err) return console.log(err)
        res.render('login.ejs',{data: result})
    })
})

app.get('/home',(req,res)=>{
    db.collection('df').find().toArray((err,result)=>{
        if(err) return console.log(err)
        res.render('homepage.ejs',{data: result})
    })
})

app.get('/create',(req,res)=>{
    res.render('add.ejs')
})

app.get('/update',(req,res)=>{
    res.render('update.ejs')
})

app.get('/delete',(req,res)=>{
    res.render('delete.ejs')
})

app.post('/login',(req,res)=>{
    db.collection('user').find().toArray((err,result)=>{
        if(err) return console.log(err)

        for(var i=0;i<result.length;i++){
            if(result[i].name==req.body.username){
                res.redirect('/home')
                break
            }
            else{
                res.render('login.ejs')
            }
        }
    })
})
app.post('/AddData',(req,res)=>{
    db.collection('df').save(req.body,(err,result)=>{
        if(err) return console.log(err)
    res.redirect('/home')
    })
})
app.post('/delete',(req,res)=>{

    db.collection('df').findOneAndDelete({product_id:req.body.id}, (err,result)=>{
        if(err) return console.log(err)
    res.redirect('/home')
    })
})

app.post('/update',(req,res)=>{
    var query = {$set:{cost_price:req.body.cost,selling_price:req.body.sell,stock_available:req.body.stock}}
    db.collection('df').findOneAndUpdate({product_id:req.body.pid},query,(err,result)=>{
        if(err) throw err
    res.redirect('/home')
    })
})