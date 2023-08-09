//draw ERL


var e_ip1=localStorage.getItem("e_ip");


var imgsrc ;
var myImg;

var e_img_src;
var e_img_src_reload;


var svg_div_var_cc;

var img_width;
var img_height;
var original_width ;
var original_height;
var aspect_width ;
var aspect_height;
var videoDict;
var videoDict_cc_p;
var videoDict_cc_p_s;

videoDict_cc_p = {};
videoDict_cc_p_s = {};

var new_width = 740;
var new_height = 500;
var dragging = false, drawing = false, startPoint;
var svg = d3.select('#imgCanv').append('svg').attr('height',new_height).attr('width',new_width).attr('id','svg_div')
//var svg_1 = d3.select('#imgCanv').append('svg_1').attr('height',new_height).attr('width',new_width).attr('id','svg_div_1')
$("#svg_div").css("display","none");
//$("#svg_div_1").css("display","none");
var points = [], g;
var str1=[];
var count_click = -1;
var idxs = [];
idxs.push(0);
var polygon_no = 0;
var RoadDict={};
var RoadDict_int_cc={};

var only_points = [];
var dragger = d3.behavior.drag().on('drag', handleDrag).on('dragend', function(d){
    dragging = false;
});

//capture images to  svg
function capture(video)
{


    var baseImage = new Image();
    baseImage.setAttribute('crossOrigin', 'anonymous');
    baseImage.src = e_img_src;

    var canvas = document.getElementById('output');


    canvas.width = new_width;
    canvas.height = new_height;
    var w = new_width;
    var h = new_height;
    var ctx = canvas.getContext('2d');
    ctx.drawImage(baseImage, 0, 0, w, h);

    return canvas;


}

//convert image to svg for draw ERL
function myfun1()
{
    var dataURL;

    var img = new Image();
    img.crossOrigin = '*';
    img.onload = function() {
        var canvas = document.getElementById('output');
        var ctx = canvas.getContext('2d');


        canvas.height = new_height;
        canvas.width = new_width;
        var w = new_width;
        var h = new_height;
        ctx.drawImage(this, 0, 0, w, h);
        dataURL = canvas.toDataURL();
        div_canv = document.getElementById("imgCanv");
        div_canv.style.backgroundImage='url('+dataURL+')'
        $("#svg_div").css("display","inline-block");
        $("#output").hide();
        return dataURL;
    };
    img.src = e_img_src;


    $("#imgCanv").width(new_width).height(new_height);
    myImg = document.getElementById("video_p");
    original_width = img_width;
    original_height = img_height;
    aspect_width = 0;
    aspect_height = 0;
    videoDict = {};
    aspect_width = original_width/new_width;
    aspect_height = original_height/new_height;
    $('#perimeter_img_reload').hide();


    svg.on('mouseup', function()
    {

        if(dragging) return;
        drawing = true;
        startPoint = [d3.mouse(this)[0], d3.mouse(this)[1]];
        if(svg.select('g.drawPoly').empty()) g = svg.append('g').attr('class', 'drawPoly');
        if(d3.event.target.hasAttribute('is-handle'))
        {
            var idx_end = count_click;
            //console.log('idx_end',idx_end);
            idxs.push(idx_end);
            //console.log(idxs);
            closePolygon(idx_end);
            return;
        };
        console.log("mouse this "+d3.mouse(this));
        if (d3.mouse(this))
            count_click = count_click + 1;
        console.log('count click',count_click);

        str1.push(d3.mouse(this))
        points.push(d3.mouse(this));
        g.select('polyline').remove();
        var polyline = g.append('polyline').attr('points', points).style('fill', 'none')
            .attr('stroke', '#000');
        for(var i = 0; i < points.length; i++)
        {
            g.append('circle')
                .attr('cx', points[i][0])
                .attr('cy', points[i][1])
                .attr('r', 4)
                .attr('fill', 'yellow')
                .attr('stroke', '#000')
                .attr('is-handle', 'true')
                .style({cursor: 'pointer'});
        }
    });

    svg.on('mousemove', function() {
        if(!drawing) return;
        var g = d3.select('g.drawPoly');
        g.select('line').remove();
        var line = g.append('line')
            .attr('x1', startPoint[0])
            .attr('y1', startPoint[1])
            .attr('x2', d3.mouse(this)[0] + 2)
            .attr('y2', d3.mouse(this)[1])
            .attr('stroke', '#11d7fa')
            .attr('stroke-width', 2);
    })
};


function closePolygon(idx)
{
    var temp = [];
    var poly_points = [];
    svg.select('g.drawPoly').remove();
    var g = svg.append('g');
    g.append('polygon')
        .attr('points', points)
        .style('fill', getRandomColor())
        .style('fill-opacity','0.4');
    polygon_no = polygon_no + 1
    var name = prompt("Please Enter Region Name","");
    console.log("original Width"+original_width);
    console.log("original Height"+original_height);
    console.log("New Width"+new_width);
    console.log("New Height"+new_height);
    console.log("Aspect Width"+aspect_width);
    console.log("Aspect Height"+aspect_height);
    if(name == "")
    {
        name = "";
    }
    if (name == null)
    {
        //alert("cancelled");
        g.remove();
        poly_points = [];
        polygon_no = polygon_no-1;
    }
    else
    {

        for (i=0; i<idxs.length;i++)
        {
            if(idx == idxs[i])
            {
                if (i == 1)
                {
                    // console.log("first poly")
                    for(j=0;j<=idx;j++)
                    {
                        poly_points.push(str1[j]);
                    }
                    console.log(poly_points);
                }
                else
                {
                    // console.log("not first poly");
                    //console.log(i,idxs[i-1]+1,idxs[i]);
                    for(j= idxs[i-1]+1;j<=idxs[i];j++)
                    {
                        poly_points.push(str1[j]);
                    }
                    console.log(poly_points);
                }

            }
        }
        ///////////////// ROAD NAME DISPLAY //////////////////
        var x=(poly_points[0][0]+poly_points[2][0])/2;
        var y=(poly_points[0][1]+poly_points[2][1])/2;
        svg.append("text")
            .text(name)
            .attr("class","tooltipText")
            .attr("stroke-width","0")
            .attr("fill","#000000")
            .attr("transform","translate("+x+","+y+")")
            .attr("font-weight","bold")

        //////////////////////////////////////////////////////

        for (j=0;j<poly_points.length;j++)
        {
            console.log('points before scaling '+poly_points[j][0]+' '+poly_points[j][1]);
            poly_points[j][0] = poly_points[j][0] * aspect_width ;
            poly_points[j][1]=  poly_points[j][1] * aspect_height;
            console.log('points after scaling '+poly_points[j][0]+' '+poly_points[j][1]);

        }
        RoadDict[name] = JSON.stringify(poly_points);
        // drawing =false;
        // dragging =true;
        svg_div_var_cc = $('#svg_div').clone().html();



//    RoadDict_int_cc

        console.log(RoadDict);

        localStorage.setItem('perimeterBoundary',JSON.stringify(RoadDict));
        $('#transparent-input').empty()
        $('#transparent-input').val(Object.keys(JSON.parse(localStorage.getItem('perimeterBoundary')))[0])


    }
    // temp = temp.concat(poly_points);
    // only_points.push(temp);
    // videoDict['POINTS'] = JSON.stringify(only_points);
    videoDict['POINTS'] = JSON.stringify(RoadDict);
    console.log(videoDict);








    for(var i = 0; i < points.length; i++)
    {
        var circle = g.selectAll('circles')
            .data([points[i]])
            .enter()
            .append('circle')
            .attr('cx', points[i][0])
            .attr('cy', points[i][1])
            .attr('r', 4)
            .attr('fill', '#FDBC07')
            .attr('stroke', '#000')
            .attr('is-handle', 'true')
            .style({cursor: 'move'})
            .call(dragger);
    }
    points.splice(0);
    drawing = false;
}

function handleDrag() {
    if(drawing) return;
    var dragCircle = d3.select(this), newPoints = [], circle;
    dragging = true;
    var poly = d3.select(this.parentNode).select('polygon');
    var circles = d3.select(this.parentNode).selectAll('circle');
    dragCircle
        .attr('cx', d3.event.x)
        .attr('cy', d3.event.y);
    for (var i = 0; i < circles[0].length; i++) {
        circle = d3.select(circles[0][i]);
        newPoints.push([circle.attr('cx'), circle.attr('cy')]);
    }
    poly.attr('points', newPoints);
}

//draw random color line on image
function getRandomColor()
{
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++)
    {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

//open ERL modal box
say_thanks_overlay_1 =function(){
    // $('#myModal2').modal('show');
    int_detect_cc();
};


//get image to draw ERL
function int_detect_cc(){
    var perimeterImageDetails=JSON.parse(localStorage.getItem('breach_image_perimeter'));
    var capture_fram_img_cc_width =perimeterImageDetails.width;
    var capture_fram_img_cc_height = perimeterImageDetails.height;
    $('#video_p').attr('src', '');
    $('#imgCanv').attr('style', '');
    $('#svg_div').empty();
    RoadDict={};
    videoDict={};
    polygon_no=0;
    // e_img_src="http://"+localStorage.getItem("e_ip")+"/nginx/"+capture_fram_img_cc;
    // e_img_src="http://18.191.186.107/nginx/ravenfs/saurabh/image_thumbnail.jpg";
    // e_img_src ="http://"+base_domainip+"/nginx/"+perimeterImageDetails.img;
    e_img_src= perimeterImageDetails.img;
    var image = document.getElementById("video_p");
    image.src = e_img_src;
    console.log(e_img_src);
    $("#iVideo").css("display","none");
    img_width = capture_fram_img_cc_width;
    img_height = capture_fram_img_cc_height;
    myfun1();
    $('#svg_div')[0].innerHTML = svg_div_var_cc;
    $("#int_per_cc").show();
    RoadDict ={};

}

//reload ERL image for perimeter
function int_detect_cc_reload(){
    localStorage.removeItem('perimeterBoundary');
    $('#transparent-input').val('')
    $('#video_p').attr('src', '');
    $('#imgCanv').attr('style', '');
    $('#svg_div').empty();
    svg_div_var_cc=null;
    RoadDict={};
    videoDict={};
    polygon_no=0;

    var jsonObjReloadPerimeter={
        "cam_url":$('#cameraUrl-field-DXB').val()
    }

    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "http://"+base_domainip+"/event-app/capture_frame/saurabh/saurabh",
        "method": "POST",
        "headers": {
            "content-type": "application/json",
            "cache-control": "no-cache",
        },
        "processData": false,
        "data": JSON.stringify(jsonObjReloadPerimeter)
    }

    $.ajax(settings).done(function (response) {
        if(response.status=="success"){
            var PerimiterJSON={
                "img":response.breach_image,
                "width":response.image_width,
                "height":response.image_height,
            }
            localStorage.setItem('breach_image_perimeter',JSON.stringify(PerimiterJSON));

            e_img_src_reload=null;
            var perimeterObjJson=JSON.parse(localStorage.getItem('breach_image_perimeter'));
            e_img_src_reload="http://"+base_domainip+"/nginx/"+perimeterObjJson.img;
            var image = document.getElementById("video_p");
            image.src = e_img_src_reload;
            console.log(e_img_src_reload);

            $("#iVideo").css("display","none");
//
            img_width = perimeterObjJson.width;
            img_height = perimeterObjJson.height;

            // drawing =true;
            // dragging =false;
            var dataURL;
            var img = new Image();
            img.crossOrigin = '*';
            img.src = e_img_src_reload;
            console.log(e_img_src);
            img.onload = function() {
                var canvas = document.getElementById('output');
                var ctx = canvas.getContext('2d');
                canvas.height = new_height;
                canvas.width = new_width;
                var w = new_width;
                var h = new_height;
                ctx.drawImage(this, 0, 0, w, h);
                dataURL = canvas.toDataURL();
                console.log(dataURL);
                div_canv = document.getElementById("imgCanv");
                div_canv.style.backgroundImage='url('+dataURL+')'
                $("#svg_div").css("display","inline-block");
                $("#output").hide();
                return dataURL;



            };
            $("#imgCanv").width(new_width).height(new_height);
            myImg = document.getElementById("video_p");
            original_width = img_width;
            original_height = img_height;
            aspect_width = 0;
            aspect_height = 0;
            videoDict = {};
            aspect_width = original_width/new_width;
            aspect_height = original_height/new_height;
            console.log(original_width)
            console.log(original_height)
            console.log(new_width)
            console.log(new_height)
            console.log(aspect_width)
            console.log(aspect_height)
            $('#perimeter_img_reload').hide();
            svg.on('mouseup', function()
            {

                if(dragging) return;
                drawing = true;
                startPoint = [d3.mouse(this)[0], d3.mouse(this)[1]];
                if(svg.select('g.drawPoly').empty()) g = svg.append('g').attr('class', 'drawPoly');
                if(d3.event.target.hasAttribute('is-handle'))
                {
                    var idx_end = count_click;
                    //console.log('idx_end',idx_end);
                    idxs.push(idx_end);
                    //console.log(idxs);
                    closePolygon(idx_end);
                    return;
                };
                console.log("mouse this "+d3.mouse(this));
                if (d3.mouse(this))
                    count_click = count_click + 1;
                console.log('count click',count_click);

                str1.push(d3.mouse(this))
                points.push(d3.mouse(this));
                g.select('polyline').remove();
                var polyline = g.append('polyline').attr('points', points).style('fill', 'none')
                    .attr('stroke', '#000');
                for(var i = 0; i < points.length; i++)
                {
                    g.append('circle')
                        .attr('cx', points[i][0])
                        .attr('cy', points[i][1])
                        .attr('r', 4)
                        .attr('fill', 'yellow')
                        .attr('stroke', '#000')
                        .attr('is-handle', 'true')
                        .style({cursor: 'pointer'});
                }
            });

            svg.on('mousemove', function() {
                if(!drawing) return;
                var g = d3.select('g.drawPoly');
                g.select('line').remove();
                var line = g.append('line')
                    .attr('x1', startPoint[0])
                    .attr('y1', startPoint[1])
                    .attr('x2', d3.mouse(this)[0] + 2)
                    .attr('y2', d3.mouse(this)[1])
                    .attr('stroke', '#53DBF3')
                    .attr('stroke-width', 1);
            })
        }
    });








};

//reset ERL
function resetPerimeterDXB(){
    // document.getElementById("int_checkbox_cc").checked = false;
    $("#svg_div").empty();
    // str1=[];
    points=[];
    svg_div_var_cc=null;
    videoDict_cc_p_s['Intrusion Detection']=[];
    polygon_no=0;
    RoadDict={}
    $('#transparent-input').val('');
    // drawing =true;
    // dragging =false;
    localStorage.removeItem('perimeterBoundary');
}

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};