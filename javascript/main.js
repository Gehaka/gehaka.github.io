$(function (){

	var $submit = $("#submit");
	var $file = $("#file");
	var $img = $("#img");
	var $progress = $("#progress");

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
			$progress[0].hidden = false;
			console.log(file.name + " | " + file.size + " | " + file.type);

			$.ajax({
				url: "http://18.219.109.35/upload",
				type: "POST",

				data: new FormData($("#form")[0]),

				cache: false,
				contentType: false,
				processData: false,

				success: function(data){
					$progress[0].hidden = true;
					alert(data);
				},

				error: function(XMLHttpRequest, textStatus, errorThrown) {
					$progress[0].hidden = true;
                    alert("Status: " + textStatus + "\nError: " + errorThrown);
				},

				xhr: function() {
					var myXhr = $.ajaxSettings.xhr();
		            if (myXhr.upload) {
		                // For handling the progress of the upload
		                myXhr.upload.addEventListener('progress', function(e) {
		                    if (e.lengthComputable) {
		                        $("progress").attr({
		                            value: e.loaded,
		                            max: e.total,
		                        });
		                    }
		                } , false);
		            }
		            return myXhr;
				}
			});
		}
		else {
			alert("File is not an image");
		}
	});

});
