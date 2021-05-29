var userId;
function changePage(){
    window.location="reg.html";
}
function registerUser(){
    var username=document.getElementById('userName').value;
    var userEmail=document.getElementById('exampleInputEmail1').value;
    var password=document.getElementById('Password1').value;
    var repeatedpassword=document.getElementById('RepeatPassword1').value;
    if(repeatedpassword!=password){
        alert('password doesnt match')
    }else{
        var objUser={
        name: username,
        email: userEmail,
        pw: password
    };
    axios.post('http://localhost:5000/checkUserData',objUser)
  .then((response) => {
      if(response.data=='yes'){
        window.location="http://localhost:5000/index.html";
      }else{alert(response.data);}   
  },error=>console.log(error));
        
    }
}

function login(){
    var email=document.getElementById('exampleInputEmail1').value;
    var password=document.getElementById('exampleInputPassword1').value;
    var userLogin={
        email: email,
        pw: password
    };
    axios.post('http://localhost:5000/checkUserLogin',userLogin)
  .then((response) => { 
      if(response.data=='no'){
          alert('Wrong password or email');
      }else{
          userId=response.data;
          window.location="http://localhost:5000/index.html";
      };
    });

};


var idd;
var idd2;

var arr=[];
function taskAdding(id, ul, valueOftitle){
    var li=document.createElement('li');
    var button=document.createElement('button');
    var tAttribute=document.createAttribute('type');
    tAttribute.value='button';
    button.setAttributeNode(tAttribute);
    

    var bAttribute=document.createAttribute('data-bs-toggle');
    bAttribute.value='modal';
    button.setAttributeNode(bAttribute);

    var butAttribute=document.createAttribute('data-bs-target');
    butAttribute.value='#taskModal';
    button.setAttributeNode(butAttribute);
    button.addEventListener('click',modalButton);
    button.textContent=valueOftitle;

    li.append(button);//='<button type="button"> </button>'
    var draggable=document.createAttribute('draggable');
    draggable.value='true';
    button.setAttributeNode(draggable);
    var idAttr=document.createAttribute('id');
    idAttr.value=id;
    button.setAttributeNode(idAttr);
    button.addEventListener('dragstart',drag);
    ul.append(li);
    

}
function save2(){
    
    var valueOftitle=document.getElementById('title').value;
    var valueOfDescr=document.getElementById('floatingTextarea2').value;
    var obj={
        id: '',
        title: valueOftitle,
        description: valueOfDescr,
        status: 'toDo'
    };
    
    var li=document.createElement('li');
    var button=document.createElement('button');
    var tAttribute=document.createAttribute('type');
    tAttribute.value='button';
    button.setAttributeNode(tAttribute);
    

    var bAttribute=document.createAttribute('data-bs-toggle');
    bAttribute.value='modal';
    button.setAttributeNode(bAttribute);

    var butAttribute=document.createAttribute('data-bs-target');
    butAttribute.value='#taskModal';
    button.setAttributeNode(butAttribute);
    button.addEventListener('click',modalButton);
    button.textContent=valueOftitle;

    li.append(button);//='<button type="button"> </button>'
    var draggable=document.createAttribute('draggable');
    draggable.value='true';
    button.setAttributeNode(draggable);
    
    //send obj to server
    //req.body=obj;
    axios.post('http://localhost:5000/saveTask', obj)
      .then((response) => {
        obj.id=response.data;//id
        var id=document.createAttribute('id');
        id.value=response.data;
        button.setAttributeNode(id);
      }, (error) => {
        console.log(error);
      });

    arr.push(obj);
    button.addEventListener('dragstart',drag);
    var todo=document.getElementById('todo');
    todo.append(li);
    document.getElementById('title').value='';
    document.getElementById('floatingTextarea2').value='';
}
function modalButton(event){
    
    var pDescr=document.getElementById('taskDesc');
    var htitle=document.getElementById('taskTitle');
    for (var i=0;i<arr.length;i++){
        if (arr[i].id==event.target.id){
            htitle.value=arr[i].title;
            pDescr.value=arr[i].description;
            idd=arr[i].id;
            if(arr[i].status=='done'){
                document.getElementById("bSave").style.display='none';
                document.getElementById("bEdit").style.display='none';
            }else{
                document.getElementById("bSave").style.display='none';
                document.getElementById("bEdit").style.display='block';
    
            }
        }
    }
}
function myFunction(){
    axios.get('http://localhost:5000/getTasks',userId)
      .then((response) => {
          arr=response.data;
          for (var i=0;i<response.data.length;i++){
              if(response.data[i].status=='toDo'){
                taskAdding(response.data[i].id, document.getElementById('todo'), response.data[i].title);
                  
              }else if(response.data[i].status=='inProgress'){
                taskAdding(response.data[i].id, document.getElementById('inProgress'), response.data[i].title);
            }else if(response.data[i].status=='done'){
                taskAdding(response.data[i].id, document.getElementById('done'), response.data[i].title);
            }
          }
      }, (error) => {
        console.log(error);
      });
    document.getElementById("bSave").style.display='none';
}
function edit(){
    document.getElementById("bSave").style.display='block';
    document.getElementById("bEdit").style.display='none';
    var htitle=document.getElementById('taskTitle');
    var pDescr=document.getElementById('taskDesc');
    htitle.readOnly=false;
    pDescr.readOnly=false;
}
    
function save(event){
    document.getElementById("bSave").style.display='none';
    document.getElementById("bEdit").style.display='block';
    var htitle=document.getElementById('taskTitle');
    var pDescr=document.getElementById('taskDesc');
    htitle.readOnly=true;
    pDescr.readOnly=true;
    var but=document.getElementById(idd);
    for (var i=0;i<arr.length;i++){
        if (arr[i].id==idd){
            arr[i].title=htitle.value;
            arr[i].description=pDescr.value;
            
        }
    }
    
    but.textContent=htitle.value;
}
function liRemove(){
    var ulID=document.getElementById('todo');
    var ulID2=document.getElementById('inProgress');
    for (let i = 0; i < ulID.childNodes.length; i++) {
        
        if( ulID.childNodes[i].hasChildNodes()==false && ulID.childNodes[i].tagName=='LI'){
            ulID.childNodes[i].remove();
        }
      }
      for (let j = 0; j < ulID2.childNodes.length; j++) {
        
        if( ulID2.childNodes[j].hasChildNodes()==false && ulID2.childNodes[j].tagName=='LI'){
            ulID2.childNodes[j].remove();
        }
      }
    

}

function deletee(event){
    for (var i=0;i<arr.length;i++){
        if(arr[i].id==idd){
            
            var liTarget=document.getElementById(idd);
            liTarget.parentNode.remove();
            axios.delete('http://localhost:5000/deleteTask', {data:arr[i]})
            .then((response) => {
              alert(response.data);
            }, (error) => {
              console.log(error);
            });
            arr.splice(i,1);
        }
    }
}