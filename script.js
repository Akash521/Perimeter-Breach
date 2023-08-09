function CaptureFrame(){
    var jsonObjVerify = {
        cam_url: getCamList[i].location[j].camera[k].cam_input_url,
      };
      var settings = {
        async: true,
        crossDomain: true,
        url: "/capture_frame",
        method: "POST",
        headers: {
          "content-type": "application/json",
          "cache-control": "no-cache",
        },
        processData: false,
        data: JSON.stringify(jsonObjVerify),
      };
      $.ajax(settings).done(function (response) {
        if (response.Failure) {
          $(".modal-backdrop.fade.in").remove();
          eventName.checked = false;
          if (response.Failure == "Invalid RTSP/RTMP url") {
            Messenger().post({
              message:
                "Stream not found, Please try again after some time.",
              type: "error",
              showCloseButton: true,
            });
          } else {
            Messenger().post({
              message: response.Failure,
              type: "error",
              showCloseButton: true,
            });
          }
          return;
        }
        var PerimiterJSON = {
          img: response.data.breach_image,
          width: response.data.image_width,
          height: response.data.image_height,
        };

        localStorage.setItem(
          "breach_image_perimeter",
          JSON.stringify(PerimiterJSON)
        );

        // perimeter_checkbox_value
        // console.log(eventName)
        say_thanks_overlay_1(eventName);
        // perimeter_arr.push(EventName);
        // EventsArrayList.push(EventName);
        // EventsArrayList_Demo.push(EventName);
      });
}