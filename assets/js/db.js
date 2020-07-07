
//login check
function readyFunction(){
    if(localStorage.length == 0)
        window.location.replace("login.html");
};
readyFunction();

// // Clears the DB for fresh creation
// function clearDB(){
//     var data = {};
//     data['username'] = localStorage.username;
//     client.connect(function(err, client){
//         if(err)
//             throw err;
//         const db = client.db(dbName);
//         const userCollection = db.collection('bookmark');
//         userCollection.remove({'username':data['username']});
//         console.log("Deletion complete");
//     });
// }

//Update database with current state in the application
function updateDB(){
    var bookmarkData = [];
    var temp = {};
    temp['username'] = localStorage.username;
    
    $('#add_bookmark').children('div').each(function(){
        var nameoflist = $(this).attr('id');
        var bk = [];
        //traversing DOM for the list elements
        var a = $(this).children('.card-header');
        var b = a.children('h4').text();
        var v = $(this).children(`#dynamic`);
        var w = v.children(`#${nameoflist}_list`);
        //for each list element check whether it is a URI or plaintext and push it in the database accordingly.
        w.children('li').each(function(){
            // console.log($(this).children());
            let values;
            if($(this).find('a').length!=0){
                values = $(this).children()[1].outerHTML;
                console.log(values);
            }
            else{
                values = $(this).text();
            }

            //Check for strikethrough if completed todo
            if($(this).attr("class")=='completed')
            {
                console.log("complete function triggered")
                bk.push({
                    'values':values,
                    'done':'completed'
                });
            }
            else
            {
                bk.push({
                    'values':values,
                    'done':'uncompleted'
                });
            }
            
        })
        // console.log(bk);
        bookmarkData.push({
                'actualHeader' : b,
                'header' : nameoflist,
                'header_list' : bk
                    });
      });
      temp['data'] = bookmarkData;
      console.log(temp);
      $.ajax({
        url: 'http://localhost:3000/save',
        dataType: 'json',
        type: 'post',
        data: temp,
        success: function( responseData, textStatus, jQxhr ){
            console.log("saved");
        },
        error: function( jqXhr, textStatus, errorThrown ){
            console.log("Could not connect");
        }
    });
      
    //   client.connect(function(err, client){
    //     if(err)
    //         throw err;
    //     const db = client.db(dbName);
    //     const userCollection = db.collection('bookmark');
    //     userCollection.update({'username':data['username']},{$set:{data}},{ upsert: true});
    //     console.log("Update complete");
    // });
}

//To extract data from database to update current state of application
function queryDB(){
    var data = {};
    data['username'] = localStorage.username;
    $.ajax({
        url: `http://localhost:3000/query`,
        dataType: 'json',
        type: 'post',
        data: data,
        success: function( resultData, textStatus, jQxhr ){
            console.log(resultData)
            resultData.forEach(function(item,index){
                console.log(item['actualHeader']);
                console.log(item['header']);
                var headerName = item['header'];
                $("#add_bookmark").append(`<div class="card border-primary opacity_property mb-3 col-xs-6" id="${headerName}">
											<div class="card-header">
												<h4><span><i class="fa fa-trash" aria-hidden="true"></i></span>${item.actualHeader}</h4>
											</div>
											<div class="card-body text-dark" id="dynamic">
												<ul id="${headerName}_list"></ul>
											</div>
											<div class="card-footer bg-transparent border-dark">
												<input type="text" placeholder="Add New Todo">
											</div>
                                        </div>`);
                item['header_list'].forEach(function(item,index){
                    console.log(item);
                    var new_todo = '';
                    var list_name = headerName+"_list";
			        $(`section #${list_name}`).append(`<li class="${item.done}"><span><i class="fa fa-trash" aria-hidden="true"></i></span>${item.values}<p class="close"><i class="fa fa-check" aria-hidden="true"></i></p></li>`);
                });
            })
        },
        error: function( jqXhr, textStatus, errorThrown ){
            console.log("Could not connect to server");
        }
    });
    // client.connect(function(err, client){
    //     if(err)
    //         throw err;
    //     const db = client.db(dbName);
    //     const userCollection = db.collection('bookmark');
    //     userCollection.findOne({'username':data['username']},function(err,result){
    //         if(err) throw err;
            
    //     });

    // });
}


//update everything in the database and sign out function
function signOut(){
    event.preventDefault();
    var data = {};
    data['username'] = localStorage.username;
    // updateDB();
    localStorage.clear();
    window.location.replace('login.html')
}

//Handling remaining events.
$(document).ready(function(){
    var data = {};
    data['username'] = localStorage.username;
    queryDB();

    $("#Save_bookmark").on( "submit", function( event ) {
        event.preventDefault();
        updateDB();
    });
});
