const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended : true}));
const router = express.Router();

app.set('view engine','pug');

app.use('/assets', express.static('assets'));



/////////////////DB///////////////////////////
//necessary imports
const bcrypt = require('bcryptjs');
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb+srv://vinay_1998:2W7Q2P4RHWKCDrDR@bookmarker-cofya.gcp.mongodb.net/bookmarker?retryWrites=true&w=majority';
const dbName = 'bookmarker';
const client = new MongoClient(url);

router.post('/login',function(req,res){
  console.log('You have logged in!!')
  data = req.body;
  client.connect(function(err, client){
    if(err)
        throw err;
    console.log("Connected successfully.");
    const db = client.db(dbName);
    const userCollection = db.collection('user');
    userCollection.find({'username':data['username']}).limit(1).toArray(function(err, result){
        if(result == null || result.length == 0)
            alert('User not found.');
        else{
            temp = bcrypt.hashSync(req.body.password)
            console.log(temp);
            var hash = result[0]['passwordHash'];
            if(bcrypt.compareSync(data['password'], hash)){
              console.log('Successful login.');
              res.status(200).send({"message":"true"});
            }
            else{
              console.log('Incorrect password');
              res.status(200).send({"message":"false"})
            }
        }
    });
  });
});

router.post('/query',function(req,res){
  console.log('You have queried!!');
  data = req.body;
  
  client.connect(function(err, client){
    if(err)
        throw err;
    const db = client.db(dbName);
    const userCollection = db.collection('bookmark');
    try{
      userCollection.findOne({'username':data['username']},function(err,result){
        if(err) throw err;
        if(result === null) {res.status(200).send({})}
        else {
          var data = result['data']
          res.status(200).send(data);
        }
      });
    }
    catch(err) {
      console.log(err);
    }

  });
})

router.post('/save',function(req,res){
  console.log('You have saved!!');
  data = req.body.data;
  username = req.body.username;
  console.log(data)
  client.connect(function(err, client){
    if(err)
        throw err;
    const db = client.db(dbName);
    const userCollection = db.collection('bookmark');
    userCollection.update({'username':username},{$set:{data}},{ upsert: true});
    console.log("Update complete");
    res.status(200).send();
  });

})


/////////////////DB///////////////////////////

//add the router
app.use('/', router);
app.listen(process.env.port || 3000);

console.log('Running at Port 3000');