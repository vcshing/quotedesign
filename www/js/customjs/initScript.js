myApp.onPageInit('register', function(page) {
    // Do something here for "about" page

    $('.save-storage-data').on('click', function() {


    });


})


myApp.onPageInit('login', function(page) {
    // Do something here for "about" page

    $('.save-storage-data').on('click', function() {

    });


})

myApp.onPageInit('quotelist', function(page) {
 var cardHtml="";
// Loading flag
var loading = false;
 
var page=1;
 // Attach 'infinite' event handler
appendDesignCard();

$$('.infinite-scroll').on('infinite', function () {
  // Exit, if loading in progress
  if (loading) return;
  // Set loading flag
  loading = true;
  
  setTimeout(function () {appendDesignCard()  }, 1000);
});        

function appendDesignCard(){

    // Reset loading flag
    loading = false;
 
 //   if (lastIndex >= maxItems) {
      // Nothing more to load, detach infinite scroll events to prevent unnecessary loadings
 //     myApp.detachInfiniteScroll($$('.infinite-scroll'));
      // Remove preloader
 //     $$('.infinite-scroll-preloader').remove();
 //     return;
  //  }
 

 $.ajax({
  type: 'POST',
  url: 'http://gogogo.synology.me/api/genword/getlist.php',
  data: {"page":page,"lang":lang},
  dataType: 'JSON',
  success: function(response){
	  if(response.status==1){

		if(response.result.length==0){
		  myApp.detachInfiniteScroll($$('.infinite-scroll'));
		  $$('.infinite-scroll-preloader').remove();
		  return;
		}else{
		
		 for (var i = 0; i < response.result.length ; i++) {
			cardHtml += "			<div class=\"card\">";
			cardHtml += "				  <div class=\"card-content\">";
			cardHtml += "";
			cardHtml += "<img class=\"designImage\" data-id=\""+response.result[i].master_id+"\" src=\""+response.result[i].path+"\" width=\"100%\">";
			cardHtml += "";
			cardHtml += "				  <\/div>";
			cardHtml += "				  <div class=\"card-footer\">";
			cardHtml += "					<a href=\"#\" class=\"link\"  data-id=\""+response.result[i].master_id+"\" >Like ("+response.result[i].likecount+")<\/a>";
			cardHtml += "				  <\/div>";
			cardHtml += "				<\/div>";
		 }
		}
		
		 
			// Append new items
			$$('.loopCardContent').append(cardHtml);
		 
			// Update last loaded index
			page++;
	  }else{
		 // alert("Server Error, Please Try Again Later");
	  }
  },
	error: function(response) {
		//alert("Server Error, Please Try Again Later");
	}
});



	
} 
})
