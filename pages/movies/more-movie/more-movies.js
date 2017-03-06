// pages/movies/more-movie/more-movies.js
var app = getApp();
var util = require('../../../utils/utils.js');
Page({
  data: {
    movies:{},
    requestUrl:"",
    totalCount: 0,
    isEmpty:true,
  },
  onLoad: function (options) {
    var category = options.category;
    console.log(category);
    wx.setNavigationBarTitle({
      title: category,
    });
    var dataUrl = "";
    switch (category) {
      case "正在热映":
        dataUrl = app.globalData.doubanBase + "/v2/movie/in_theaters";
        break;
      case "即将上映":
        dataUrl = app.globalData.doubanBase + "/v2/movie/coming_soon";
        break;
      case "豆瓣Top250":
        dataUrl = app.globalData.doubanBase + "/v2/movie/top250";
        break;
    }
    this.setData({
      requestUrl:dataUrl
    })
    util.http(dataUrl, this.processDoubanData);
  },
  
  onScrollLower:function(){
      console.log("加载更多");
      var nextUrl = this.data.requestUrl + "?start="+this.data.totalCount + "&count=20";
      util.http(nextUrl, this.processDoubanData);
  },

  processDoubanData: function (moviesDouban) {
    var movies = [];
    for (var idx in moviesDouban.subjects) {
      var subject = moviesDouban.subjects[idx];
      var title = subject.title;
      if (title.length >= 6) {
        title = title.substring(0, 6) + "...";
      }
      var temp = {
        stars: util.convertToStarsArray(subject.rating.stars),
        title: title,
        average: subject.rating.average,
        coverageUrl: subject.images.large,
        movieId: subject.id
      }
      movies.push(temp)
    }
    var totalMovies = {}
    this.setData({
      totalCount:this.data.totalCount+20
    });
    if(!this.data.isEmpty){
      
    }
    this.setData({
      movies:movies
    });
  }
})