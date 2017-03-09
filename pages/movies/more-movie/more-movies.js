// pages/movies/more-movie/more-movies.js
var app = getApp();
var util = require('../../../utils/utils.js');
Page({
  data: {
    movies: {},
    requestUrl: "",  //请求数据地址
    totalCount: 0,
    isEmpty: true,
  },
  onLoad: function (options) {
    var category = options.category; //获取到的页面
    wx.setNavigationBarTitle({  //设置页面标题
      title: category,
    });
    var dataUrl = "";
    switch (category) {  //根据页面标题，确定请求数据地址
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
      requestUrl: dataUrl //确定请求地址
    })
    util.http(dataUrl, this.processDoubanData); //调用函数，处理数据
  },

  //点击电影看详情
  onMovieTap: function (event) {
    var movieId = event.currentTarget.dataset.movieid;
    wx.navigateTo({
      url: '../movie-detail/movie-detail?id=' + movieId
    })
  },

  //触底刷新新数据，“加载更多”
  onReachBottom: function () {
    var nextUrl = this.data.requestUrl + "?start=" + this.data.totalCount + "&count=18";
    util.http(nextUrl, this.processDoubanData);
    //loading 开始
    wx.showNavigationBarLoading()
  },
  //下拉刷新
  onPullDownRefresh: function (event) {
    var refreshUrl = this.data.requestUrl + "?star=0&count=18";
    this.setData({
      movies: {},
      isEmpty: true,
      totalCount: 0
    })
    util.http(refreshUrl, this.processDoubanData);
    wx.stopPullDownRefresh();
  },

  //如果要绑定新加载的数据，需要同旧有的数据合并在一起
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

    //如果数据非空，链接新旧数据
    if (!this.data.isEmpty) {
      totalMovies = this.data.movies.concat(movies);
    } else {
      totalMovies = movies;
      this.setData({
        isEmpty: false
      })
    }
    this.setData({
      movies: totalMovies
    });
    this.setData({
      totalCount: this.data.totalCount + 18
    });

    //loading 结束
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh()
  }
})