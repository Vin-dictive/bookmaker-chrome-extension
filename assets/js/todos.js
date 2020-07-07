	// Adding Hyperlinks for Bookmarks with links and getting the icon for the same
	function replaceLinks(str, title) {
		var regex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
		console.log('##', title);
		var replacedText = str.replace(regex, `<a href='$1' id='link' target='_blank'><img height="16" width="16" src='https://api.statvoo.com/favicon/?url=${str}'> ${title}</a>`);
		return(replacedText);
	}


	//check valid url
	function validURL(str) {
		var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
		  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
		  '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
		  '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
		  '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
		  '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
		return !!pattern.test(str);
	  }
	
	//get link title
	function getTitle(str){
		var title = $.ajax({
			async:false,
			url: `http://textance.herokuapp.com/title/${str}`,
			type:'get',
			dataType:"TEXT"
		}).responseText;
		console.log(title);

		if(title == "null value not allowed"){
			return str
		}
		else{
			return title;
		}
	}
	
	// Adds new list to the HTML page under the id add_bookmark
	function addNewList(){
		if($("#new_list_name").val()==""){
			//console.log($("#new_list_name").val());
		}
		else{
			var new_bookmark_name = $("#new_list_name").val();
			var v = new_bookmark_name.replace(/\s/g, '');
			//console.log($("#new_list_name").val());
			$("#add_bookmark").append(`<div class="card border-primary opacity_property mb-3 col-xs-6" id="${v}">
											<div class="card-header">
												<h4><span><i class="fa fa-trash" aria-hidden="true"></i></span>${new_bookmark_name}</h4>
											</div>
											<div class="card-body text-dark" id="dynamic">
												<ul id="${v}_list"></ul>
											</div>
											<div class="card-footer bg-transparent border-dark">
												<input type="text" placeholder="Add New Todo">
											</div>
										</div>`);
		}
		$("#new_list_name").val("");
	}


	//function to run the add new list funtion when button is clicked
	$("#new_bookmark").click(function(){
		addNewList();
	});


	//function to run the add new list funtion when enter is pressed
	$("#new_list_name").keypress(function(e){
		if(e.which == 13){
			addNewList();
		}
	});


	//to add the done style to the todo
	$("section").on("click", "p", function(){
		$(this).parent().removeClass("uncompleted");
		$(this).parent().toggleClass("completed");
	});
	

	//To delete a Todo
	$("section").on("click", "span", function(event){
		$(this).parent().fadeOut(500,function(){
			$(this).remove();
		});
		event.stopPropagation();
	});


	//To delete entire Todo list
	$("section").on("click", "h4 span", function(event){
		$(this).parent().parent().parent().fadeOut(500,function(){
			$(this).remove();
		});
		event.stopPropagation();
	});


	//adds a new todo tothe list
	$("section").on("keypress","input",function(e){
		if (e.which ==13){
			var new_todo = ($(this).val());
			if(validURL(new_todo)){
				var title = getTitle(new_todo);
				console.log('#', title);
				new_todo = replaceLinks(new_todo, title);
			}
			
			$(this).val("");
			var list_name = $(this).parent().parent().attr("id")+"_list";
			$(`section #${list_name}`).append(`<li id="scratch"><span><i class="fa fa-trash" aria-hidden="true"></i></span>${new_todo}<p class="shift-right close"><i class="fa fa-check" aria-hidden="true"></i></p></li>`);
		}
		//to check for links and make them hyperlinks
	});
	
	
	

