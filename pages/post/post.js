/*加载数据*/
var postsData = require('../../data/posts-data.js');

Page({
    data: {
    },

    // 引入本地数据
    onLoad: function () {
        this.setData({
            posts_key: postsData.postList
        })
    },

    // 文章单击事件
    onPostTap: function (event) {
        var postId = event.currentTarget.dataset.postid;
        wx.navigateTo({
            url: 'post-detail/post-detail?id=' + postId,
        })
    },
    
    //轮播图单击事件
    onSwiperTap:function(event){
        var postId = event.target.dataset.postid;
        wx.navigateTo({
            url: 'post-detail/post-detail?id=' + postId,
        })
    }
})

/* 以data-开头，多个单词由连字符-链接，不能有大写(大写会自动转成小写)*/
/*如data-element-type，最终在 event.target.dataset 中会将连字符转成驼峰elementType*/