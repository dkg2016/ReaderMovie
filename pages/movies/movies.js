var util = require('../../utils/utils.js')
var app = getApp();
Page({
    data: {
        inTheaters: {},
        comingSoon: {},
        top250: {},
        searchResult: {},
        containerShow: true,
        searchPanelShow: false
    },

    onLoad: function (event) {
        var inTheatersUrl = app.globalData.doubanBase + "/v2/movie/in_theaters" + "?count=3";
        var comingSoonUrl = app.globalData.doubanBase + "/v2/movie/coming_soon" + "?count=3";
        var top250Url = app.globalData.doubanBase + "/v2/movie/top250" + "?count=3";

        //请求数据的地址
        this.getMovieListData(inTheatersUrl, "inTheaters", "正在热映");
        this.getMovieListData(comingSoonUrl, "comingSoon", "即将上映");
        this.getMovieListData(top250Url, "top250", "豆瓣Top250");
    },

    //点击“更多”
    onMoreTap: function (event) {
        var category = event.currentTarget.dataset.category;
        wx.navigateTo({
            url: 'more-movie/more-movies?category=' + category
        })
    },

    //点击电影页面
    onMovieTap: function (event) {
        var movieId = event.currentTarget.dataset.movieid;
        wx.navigateTo({
            url: 'movie-detail/movie-detail?id=' + movieId
        })
    },

    //发起请求
    getMovieListData: function (url, settedKey, categoryTitle) {
        var that = this;
        wx.request({
            url: url,
            method: 'GET',
            header: {
                "Content-Type": "Json"
            },
            success: function (res) {
                //处理豆瓣数据
                that.processDoubanData(res.data, settedKey, categoryTitle)
            }
        })
    },

    //关闭搜索页面
    onCancelImgTap: function (event) {
        this.setData({
            containerShow: true,
            searchPanelShow: false,
            searchResult: {}
        })
    },


    //点击搜索
    onBindFocus: function (event) {
        this.setData({
            containerShow: false,
            searchPanelShow: true
        })
    },

    //开始搜索
    onBindConfirm: function (event) {
        var text = event.detail.value;  //获得输入框中的内容
        var searchUrl = app.globalData.doubanBase + "/v2/movie/search?q=" + text;
        this.getMovieListData(searchUrl, "searchResult", "");
    },

    processDoubanData: function (moviesDouban, settedKey, categoryTitle) {
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
        var readyData = {};
        readyData[settedKey] = {
            categoryTitle: categoryTitle,
            movies: movies
        }
        this.setData(readyData);
    }
})