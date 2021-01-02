
//ready function to check for login state
function readyFunction(){
    if(localStorage.username)
        window.location.replace("index.html");
};
readyFunction();

//Handling events in document.ready method
$(document).ready(function(){
    $( "#loginForm" ).on( "submit", function( event ) {
        event.preventDefault();
        var formData = $( this ).serializeArray();
        var userdata = {};
        for(var i = 0; i<formData.length; i++)
            userdata[formData[i]['name']] = formData[i]['value'];

        $.ajax({
            url: "http://localhost:3000/login",
            headers:{'Content-Type': 'application/x-www-form-urlencoded'},
            type:"POST",
            dataType:"json",
            data: userdata,
            // type: "POST",
            // crossDomain:true,
            // dataType:"json",
            // contentType: 'application/x-www-form-urlencoded',
            // data: userdata,
            // secure: true,
            // headers: {
            //     'Access-Control-Allow-Origin': '*',
            // },
            success: function( data, textStatus, jQxhr ){
                localStorage.setItem('username', userdata['username']);
                if(data.message == 'true')
                    window.location.replace('index.html');
                else{
                    alert("Incorrect Password")
                }
            },
            error: function( jqXhr, textStatus, errorThrown ){
                alert("Could not connect to server");
            }
        });
    });
});
