$(document).ready(function(){
	var posts = [];	
	$(".post").focusin(function(){
		$(this).addClass('post-active');
		$(".post-box").addClass('post-box-active');
	})
	$(".post").focusout(function(){
		$(this).removeClass('post-active');
		$(".post-box").removeClass('post-box-active');
	})

	// Initialize Firebase
  	var config = {
	    apiKey: "AIzaSyCqbVKLCS5wSugPDzgWgEghZxqcHanloUM",
	    authDomain: "chatz-49c1e.firebaseapp.com",
	    databaseURL: "https://chatz-49c1e.firebaseio.com",
	    projectId: "chatz-49c1e",
	    storageBucket: "chatz-49c1e.appspot.com",
	    messagingSenderId: "204851493578"
	  };
  	firebase.initializeApp(config);

  	// Get a reference to the database service
	var database = firebase.database();

	database.ref('posts').orderByChild('id').on('value', function(snapshot) {
		$(".post-area").html("");
	    snapshot.forEach(function(childSnapshot){
	  		var childKey = childSnapshot.key;
	  		var childData = childSnapshot.val();
	  		var post_text = childData.post;
	  		var post = "<div class='row'><div class='col-sm-8 col-md-6 col-lg-6 col-sm-offset-2 col-md-offset-3 col-lg-offset-3 box'><div class='box-title'><div class='row'><div class='col-xs-1' align='right'><span class='glyphicon glyphicon-user' style='margin-top:10px;''></span></div><div class='col-xs-11' align='left' style='padding:0'>Anonymous<div style='font-size:8pt;color:#BDBDBD'>"+childData.datetime+"</div></div></div></div><textarea class='box-content' disabled>"+post_text+"</textarea></div></div>";
			var precomments = "<div class='row'><div class='col-sm-8 col-md-6 col-lg-6 col-sm-offset-2 col-md-offset-3 col-lg-offset-3 comment'><div class='post-comment'><div class='comment-area'>";
			var comments = "";
			var inputcomment = "</div><div class='row' style='margin-top:10px;'><div class='col-xs-10'><input type='text' id='"+childKey+"' class='input-comment form-control' placeholder='write comment' maxlength='160'></div><div class='col-xs-2'><button type='button' class='btn btn-primary btn-xs submit-comment' style='margin-top:5px;'>Submit</button></div></div></div></div></div>";
			
			//generate comments
	  		database.ref('posts/'+childKey+'/comments').once('value', function(commentsSnapshot) {
	  			commentsSnapshot.forEach(function(perCommentSnapshot){
	  				comments += "<textarea class='comment-section' disabled>"+perCommentSnapshot.val().comment+"</textarea><div style='font-size:8pt;color:#BDBDBD;border-bottom:1px solid #bdbdbd;margin-bottom:5px;'>"+perCommentSnapshot.val().datetime+"</div>";
	  			});		
	  		});

			$(".post-area").append(post+precomments+comments+inputcomment);		
			$('.box-content').each(function(){
				$(this).height( $(this)[0].scrollHeight );
			})	
			$('.comment-section').each(function(){
				$(this).height( $(this)[0].scrollHeight-10 );
			})	
	  	});			    
	});

	$("#post-data").submit(function(){
		var uid = database.ref().child('posts').push().key;
		var currentId = parseInt($("#last-post-id").val())-1;
		if($("#post-text").val()!="" && $("#post-text").val()!=null && $("#post-text").val().length<=160){		
		  	database.ref('posts/' + uid).set({
		  		id: currentId,
		    	post: $("#post-text").val(),
		    	datetime: getDateTime(),
		  	});
		  	$("#last-post-id").val(currentId);
		  	$("#post-text").val("");
		}else{
			alert("allowed char is between 1-160");
		}
	})

	$(document).on('click', '.submit-comment', function(){
		var uid = database.ref().child('posts/' + postUid + '/comments').push().key;
		var postUid = $(this).parents('.post-comment').find('.input-comment').attr('id');
		var comment = $(this).parents('.post-comment').find('.input-comment').val();
		if(comment!="" && comment!=null && comment.length<=160){
			database.ref('posts/' + postUid + '/comments/'+uid).set({
		  		comment: comment,
		  		datetime: getDateTime()
		  	});
		}
	})

	function getDateTime(){
		var today = new Date();
		var date = today.getDate()+'/'+(today.getMonth()+1)+'/'+today.getFullYear();
		var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
		var datetime = time+" "+date;
		return datetime;
	}
	setLastId();
	function setLastId(){
		database.ref('posts').limitToLast(1).once('value').then(function(snapshot) {
			snapshot.forEach(function(childSnapshot){
		  		var childKey = childSnapshot.key;
		  		var childData = childSnapshot.val();
		  		
				$("#last-post-id").val(childData.id);
			});
		});
	}

	autosize(document.querySelectorAll('textarea'));
})