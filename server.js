var mongo = require('mongodb');
var express = require('express');
var bodyParser = require('body-parser')
var app = express();
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
MongoClient.connect(url, function (err, db) {
   if (err) throw err;
   var dbo = db.db("ToDoList");
   dbo.createCollection("Users", function (err, res) {
      if (err) {
         console.log(err);
      }else{
         console.log("Collection created!");
      }
   });
      dbo.createCollection("Tasks", function (err, res) {
         if (err) {
            console.log(err);
         }else{
            console.log("Collection created!");
         }
      
      db.close();
   });
});
var count = 0;
var tasks = [];//
//

app.use(express.static('public'));
app.use(bodyParser.json());

app.get('/getTasks', function (req, res) {
   var userId=req.body;
   res.send(tasks);
});

app.post('/checkUserData', function (req, res) {
   var user = req.body;
   MongoClient.connect(url, {poolSize: 100},function (err, db) {
      if (err) throw err;
      var dbo = db.db("ToDoList");
      dbo.collection("Users").find({ name: user.name }).toArray(function (error,resultname) {
         if (resultname!=undefined && resultname.length>0) {
             res.send('username already exists');
             db.close();
            
         }else{
            dbo.collection("Users").find({ email: user.email }).toArray(function (error,resultmail) {
               if (resultmail!=undefined && resultmail.length>0) {
                  res.send('email already exists');
                  db.close();
               }else{
                  dbo.collection("Users").insertOne(user, function (err, result) {
                     console.log(result);
                     if (err) throw err;
                     res.send('yes');
                     db.close();
                  });
               }
            });
         }
      });
   });
});

app.post('/checkUserLogin', function (req, res) {
   var userInput = req.body;
   MongoClient.connect(url, {poolSize: 100},function (err, db) {
      if (err) throw err;
      var dbo = db.db("ToDoList");
      var query = {
         email: userInput.email,
         pw: userInput.pw
      };
      dbo.collection("Users").find(query).toArray(function (err,result){
         if (err) throw err;
         if(result.length==1){
            res.send(result[0]._id);
         }else{
            res.send('no');
         }
      })
   
   });
});


app.post('/saveTask', function (req, res) {
   // console.log(req.data);
   var task = req.body;//obj
   console.log(task);
   task.id = count;
   tasks.push(task);
   res.send(count + '');
   count++;
});
app.put('/moveTask', function (req, res) {
   // console.log(req.data);
   var task = req.body;

   for (var i = 0; i < tasks.length; i++) {
      if (tasks[i].id == task.id) {
         tasks[i].status = task.status;
      }
   }

   // tasks.push(task);
   res.send('Task Moved');
});
app.delete('/deleteTask', function (req, res) {
   var task = req.body;
   for (var i = 0; i < tasks.length; i++) {
      if (tasks[i].id == task.id) {
         tasks.splice(i, 1);
      }
   }
   res.send('Task Deleted');
});


var server = app.listen(5000, function () {
   var host = server.address().address
   var port = server.address().port

   console.log("Example app listening at http://%s:%s", host, port)
})
