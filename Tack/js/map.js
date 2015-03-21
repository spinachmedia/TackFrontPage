var markerList = new google.maps.MVCArray();

function successCallback(position) {
    var latlng = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
    var opts = {
        zoom: 15,
        center: latlng,
        disableDefaultUI: true,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById("map_canvas"), opts);
}
function errorCallback(error) {
   document.getElementById("map_canvas").innerHTML = 'Geolocationが利用できません';
}

/**
 * ピンを立てる。
 */
var createMarker = function(map,lat,lng,comment,category){
    var latlng=new google.maps.LatLng(lat, lng);
    
    var image;
    if(category == "FOOD"){
        image = "https://maps.google.com/mapfiles/ms/icons/red-dot.png";
    }else if(category == "SCENE"){
        image = "https://maps.google.com/mapfiles/ms/icons/blue-dot.png";
    }else{
        image = "https://maps.google.com/mapfiles/ms/icons/green-dot.png";
    }
    
    var marker = new google.maps.Marker({
        position: latlng,
        map: map,
        animation: google.maps.Animation.DROP,
        icon: image
    });
    var myInfoWindow = new google.maps.InfoWindow({
        content: comment
    });
    myInfoWindow.open(map, marker);
    google.maps.event.addListener(myInfoWindow, "closeclick", function() {
        google.maps.event.addListenerOnce(marker, "click", function(event) {
          myInfoWindow.open(map, marker);
        });
    });
    
    markerList.push(marker);
}

var refreshMap = function(lat,lng){
    markerList.forEach(function(marker, idx) {
      marker.setMap(null);
    });
    getCommentListWithLocation(lat,lng);
}

var visibleToggleMap = function(category){
    
    markerList.forEach(function(marker, idx) {
        if(category == "FOOD"){
            if(marker.icon　==　"https://maps.google.com/mapfiles/ms/icons/red-dot.png"){
                if(marker.visible){
                    marker.setVisible(false);
                }else{
                    marker.setVisible(true);
                }
            }
        }else if(category == "SCENE"){
            if(marker.icon　==　"https://maps.google.com/mapfiles/ms/icons/blue-dot.png"){
                if(marker.visible){
                    marker.setVisible(false);
                }else{
                    marker.setVisible(true);
                }
            }
        }else if(category == "ACTIVITY"){
            if(marker.icon　==　"https://maps.google.com/mapfiles/ms/icons/green-dot.png"){
                if(marker.visible){
                    marker.setVisible(false);
                }else{
                    marker.setVisible(true);
                }
            }
        }
    });
       
}


//

var getCommentListWithLocation = function(lat,lng){
    
    $.ajax({
        type: "GET",
        //URLで検索条件を指定
        url: "https://api-datastore.appiaries.com/v1/dat/_sandbox/Basho/comment_latlng/-;",
        headers: {
            'Content-Type': 'application/json',
            'X-APPIARIES-TOKEN': "app259a60881817bd612ac7c6fd10"
        },
        dataType: "json", 
    }).done(function(data, status, xhr) {
        //成功時の処理
        displayCommentList(data);
    }).fail(function(data, status, xhr) {
        //失敗時の処理
    }).always(function(data, status, xhr) {
        //共通の処理
    });  
       
}

var displayCommentList = function(data){
    for(var i = 0 ; i < data._total ; i++){
        //console.log(data._objs[i].lat);
        createMarker(map,data._objs[i].lat,data._objs[i].lng,data._objs[i].comment,data._objs[i].category);
    }
}

//ネイティブ連携用
var sendingCommentWidthLocation = function(comment, lat, lng){
    
    $.ajax({
            type: "POST",
            url: "https://api-datastore.appiaries.com/v1/dat/_sandbox/Basho/comment_latlng",
            data: JSON.stringify({
                "lat": lat,
                "lng": lng,
                "comment": comment,
            }),
            headers: {
                'Content-Type': 'application/json',
                'X-APPIARIES-TOKEN': 'app259a60881817bd612ac7c6fd10'
            },
            dataType: "text", 
        }).done(function(data, status, xhr) {
            //成功時の処理
        }).fail(function(data, status, xhr) {
            //失敗時の処理
        }).always(function(data, status, xhr) {
            //共通の処理
        });   
    
}