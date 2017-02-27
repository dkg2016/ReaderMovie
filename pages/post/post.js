var postsData = require('../../data/posts-data.js');

Page({
    data: {
    },
    onLoad: function () {
        this.setData({
            posts_key: postsData.postList
        })
        //console.log(posts_key);
    },
    onPostTap: function (event) {
        var postId = event.currentTarget.dataset.postid;
        wx.navigateTo({
            url: 'post-detail/post-detail?id=' + postId,
        })
    }
})