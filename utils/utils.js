
// 电影星星评价
function convertToStarsArray(stars) {
    var num = stars.toString().substring(0, 1);
    var array = [];
    for (var i = 1; i <= 5; i++) {
        if (i <= num) {
            array.push(1);
        } else {
            array.push(0);
        }
    }
    return array;
}


//请求数据函数
function http(url,callBack) {
    wx.request({
        url: url,
        method: 'GET',
        header: {
            "Content-Type": "json"
        },
        success: function (res) {
            callBack(res.data);
        }
    })
}


//演员表
function convertToCastString(casts) {
    var castsjoin = "";
    for(var idx in casts){
        castsjoin = castsjoin + casts[idx].name + "/";
    }
    return castsjoin.substring(0,castsjoin.length-2);
}

//演员图片和名字
function convertToCastInfos(casts) {
    var castsArray = []
    for(var idx in casts){
        var cast={
            img:casts[idx].avatars ? casts[idx].avatars.large : "",
            name:casts[idx].name
        }
        castsArray.push(cast);
    }
    return castsArray;
}


module.exports = {
    convertToStarsArray: convertToStarsArray,
    http:http,
    convertToCastString:convertToCastString,
    convertToCastInfos:convertToCastInfos
}