var express = require('express');
var bodyParser = require('body-parser')
var app = express();

var count=0;
var tasks=[];//


app.use(express.static('public'));
app.use(bodyParser.json());

app.get('/getTasks', function (req, res) {
   res.send(tasks);
});


app.post('/saveTask', function (req, res) {
    // console.log(req.data);
    var task=req.body;//obj
    console.log(task);
    task.id=count;
    tasks.push(task);
    res.send(count+'');
    count++;
 });
 app.put('/moveTask', function (req, res) {
    // console.log(req.data);
    var task=req.body;
    
    for(var i=0;i<tasks.length;i++){
        if(tasks[i].id==task.id){
            tasks[i].status=task.status;
        }
    }
    
    // tasks.push(task);
    res.send('Task Moved');
 });
 app.delete('/deleteTask', function(req,res){
    var task=req.body;
   for(var i=0;i<tasks.length;i++){
      if(tasks[i].id==task.id){
         tasks.splice(i,1);
      }
  }
  res.send('Task Deleted');
 });


var server = app.listen(5000, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
})
