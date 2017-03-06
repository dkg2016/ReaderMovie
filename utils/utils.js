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
            "Content-Type": "Json"
        },
        success: function (res) {
            callBack(res.data);
        }
    })
}



module.exports = {
    convertToStarsArray: convertToStarsArray,
    http:http
}