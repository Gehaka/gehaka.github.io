$(function (){

	var $submit = $("#submit");
	var $file = $("#file");
	var $img = $("img");

	$file.on("change", function() {
		var file = $file[0].files[0];
		if (file.type.search("image") >= 0){
			$submit[0].disabled = false;
			$img[0].src = URL.createObjectURL(file);
			console.log(file.name + " | " + file.size + " | " + file.type);
		} else {
			$submit[0].disabled = true;
			alert("File is not an image");
		}
	});

	$submit.on("click", function() {
		var file = $file[0].files[0];
		if (file.type.search("image") >= 0)
		{
			alert(file.name + " | " + file.size + " | " + file.type);

			$.ajax({
				url: "http://18.219.109.35/test?test=danke",
				type: "GET",

				// data: new FormData($("#form")[0]),

				cache: false,
				contentType: false,
				processData: false,

				success: function(data){
					alert("got " + data);
				},

				xhr: function() {
					var myXhr = $.ajaxSettings.xhr();
		            if (myXhr.upload) {
		                // For handling the progress of the upload
		                myXhr.upload.addEventListener('progress', function(e) {
		                    if (e.lengthComputable) {
		                        $('progress').attr({
		                            value: e.loaded,
		                            max: e.total,
		                        });
		                    }
		                } , false);
		            }
		            return myXhr;
				}
			}).done(function(){
				alert("done");
			}).fail(function(){
				alert("fail");
			});
		}
		else {
			alert("File is not an image");
		}
	});

});
