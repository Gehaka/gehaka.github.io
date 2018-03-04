$(function (){

	var $submit = $("#submit");
	var $file = $("#file");
	var $img = $("#img");
	var $progress = $("#progress");
	var $video = $("#video");
	var $canvas = $("#canvas");
	var $localstream;

	$("#openCamera").on("click", function() {
		if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia){
			navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
				$localstream = stream;
				$img[0].hidden = true;
				$video[0].hidden = false;
				$video[0].src = window.URL.createObjectURL(stream);
				$video[0].play();
				$canvas[0].width = $video[0].width;
				$canvas[0].height = $video[0].height;
				$canvas[0].hidden = true;
				$submit[0].disabled = false;
			}, function(e) {
			  console.log('Reeeejected!', e);
			});
		}
	});

	$file.on("change", function() {
		var file = $file[0].files[0];
		if (file.type.search("image") >= 0){
			if ($video[0].src != ""){
				$video[0].pause();
				if ($localstream) $localstream.getTracks()[0].stop();
				$video[0].hidden = true;
			}
			$canvas[0].hidden = true;
			$img[0].hidden = false;
			$img[0].src = URL.createObjectURL(file);
			$submit[0].disabled = false;
			console.log(file.name + " | " + file.size + " | " + file.type);
		} else {
			$submit[0].disabled = true;
			alert("File is not an image");
		}
	});

	function sendImage(imageData){
		$.ajax({
			url: "http://18.219.109.35/upload",
			type: "POST",

			data: imageData,

			cache: false,
			contentType: false,
			processData: false,

			success: function(data){
				$progress[0].hidden = true;
				console.log("Code: \n" + data["code"]);
				console.log("Output: \n" + data["res"]);
				$("#code")[0].hidden = false;
				$("#result")[0].hidden = false;
				$("#codeText")[0].hidden = false;
				$("#resultText")[0].hidden = false;
				$("#codeText").html(data["code"]);
				$("#resultText").html(data["res"]);
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

	function dataURItoBlob(dataURI) {
	    // convert base64/URLEncoded data component to raw binary data held in a string
	    var byteString;
	    if (dataURI.split(',')[0].indexOf('base64') >= 0)
	        byteString = atob(dataURI.split(',')[1]);
	    else
	        byteString = unescape(dataURI.split(',')[1]);

	    // separate out the mime component
	    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

	    // write the bytes of the string to a typed array
	    var ia = new Uint8Array(byteString.length);
	    for (var i = 0; i < byteString.length; i++) {
	        ia[i] = byteString.charCodeAt(i);
	    }

	    return new Blob([ia], {type:mimeString});
	}

	$submit.on("click", function() {
		data = new FormData();

		if (!$img[0].hidden) {
			var file = $file[0].files[0];
			if (file.type.search("image") >= 0)
			{
				$progress[0].hidden = false;
				console.log(file.name + " | " + file.size + " | " + file.type);
				data.append("file", file);

				console.log(file);
				sendImage(data);
			}
			else {
				alert("File is not an image");
			}
		} else if (!$video[0].hidden || !$canvas[0].hidden) {
			$progress[0].hidden = false;
			$canvas[0].hidden = false;
			$canvas[0].getContext("2d").drawImage($video[0], 0, 0);
			blob = dataURItoBlob($canvas[0].toDataURL("image/png"));
			data.append("file", blob);
			$video[0].hidden = true;
			console.log(blob);
			sendImage(data);
		}
	});

});
