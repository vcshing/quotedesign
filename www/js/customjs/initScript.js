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
    var cardHtml = "";
    // Loading flag
    var loading = false;

    var page = 1;
    // Attach 'infinite' event handler
    appendDesignCard();

    $$('.infinite-scroll').on('infinite', function() {
        // Exit, if loading in progress
        if (loading) return;
        // Set loading flag
        loading = true;

        setTimeout(function() {
            appendDesignCard()
        }, 1000);
    });




    function appendDesignCard() {
        loading = false;
        $.ajax({
            type: 'POST',
            url: 'http://gogogo.synology.me/api/genword/getlist.php',
            data: {
                "page": page,
                "lang": lang
            },
            dataType: 'JSON',
            success: function(response) {
                if (response.status == 1) {

                    if (response.result.length == 0) {
                        myApp.detachInfiniteScroll($$('.infinite-scroll'));
                        $$('.infinite-scroll-preloader').remove();
                        return;
                    } else {

                        for (var i = 0; i < response.result.length; i++) {
                            cardHtml += "			<div class=\"card\">";
                            cardHtml += "				  <div class=\"card-content\">";
                            cardHtml += "";
                            cardHtml += "<img class=\"designImage\" data-id=\"" + response.result[i].master_id + "\" src=\"" + response.result[i].path + "\" width=\"100%\">";
                            cardHtml += "";
                            cardHtml += "				  <\/div>";
                            cardHtml += "				  <div class=\"card-footer\">";
                            cardHtml += "					<a href=\"#\" class=\"publishQuoteListLike\"  data-id=\"" + response.result[i].master_id + "\" >Like (" + "<span>" + response.result[i].likecount + "</span>" + ")<\/a>";
                            cardHtml += "		<a href=\"#\" class=\"publishQuoteListShare\"  data-path=\"" + response.result[i].path + "\" >Share<\/a>";
                            cardHtml += "		<a href=\"#\" class=\"publishQuoteListDownload\"  data-path=\"" + response.result[i].path + "\" >Download<\/a>";
                            cardHtml += "				  <\/div>";
                            cardHtml += "				<\/div>";
                        }
                    }


                    // Append new items
                    $$('.loopCardContent').append(cardHtml);

                    // Update last loaded index
                    page++;

                    $(".publishQuoteListLike").bind("click", function(e) {
                        //debugger;


                        var self = $(this);
                         

                        if (getCookie("like", $(this).attr("data-id"), "0") != "1") {
                            $.ajax({
                                type: 'POST',
                                url: 'http://gogogo.synology.me/api/genword/addlike.php',
                                data: {
                                    "masterid": self.attr("data-id"),
                                },
                                dataType: 'JSON',
                                success: function(response) {
                                    if (response.status == 1) {
                                        setCookieIndex("like", self.attr("data-id"), "1");
                                        self.find("span").html(parseInt(self.find("span").html()) + 1);
                                        if (typeof(window.plugins) != "undefined") {
                                            window.plugins.toast.showShortTop('Liked', function(a) {}, function(b) {})
                                        }
                                    }
                                }
                            });
                        } else {
                            if (typeof(window.plugins) != "undefined") {
                                window.plugins.toast.showShortTop('You already Liked', function(a) {}, function(b) {})
                            }

                        }
                    });

                    $(".publishQuoteListShare").bind("click", function(e) {
                        window.plugins.socialsharing.share(" ", " ", $(this).attr("data-path"), "");
                    });

                    var enableDownload = 1;
                    $(".publishQuoteListDownload").bind("click", function(e) {
                        if (enableDownload == 1) {
                            enableDownload = 0;
                            imgurl = $(this).attr("data-path");
                            //DownloadFile(imgurl, "Cosplay", MD5(imgurl)) ;

                            var success = function(msg) {
                                myApp.alert("Saved to gallery");
                                enableDownload = 1;
                            };

                            var error = function(err) {
                                alert("Fail to Save");
                                enableDownload = 1;
                            };

                            saveImageToPhone(encodeURI(imgurl), success, error);

                        }

                    });


                } else {
                    // alert("Server Error, Please Try Again Later");
                }
            },
            error: function(response) {
                //alert("Server Error, Please Try Again Later");
            }
        });
    }
})
