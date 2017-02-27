var postsData = require('../../../data/posts-data.js')
Page({
    data:{

    },
    onLoad: function (option) {
        var postId = option.id;
        this.setData({
            currentPostId:postId
        })
        var postData = postsData.postList[postId];
        this.setData({
            postData: postData
        })
        // var postsCollected = {
        //     1:"true",
        //     2:"false",
        //     3:"true", 
        // }
        var postsCollected = wx.getStorageSync('posts_collected');
        if (postsCollected) {
            var postCollected = postsCollected[postId];
            this.setData({
                collected: postCollected
            })
        }else {
            var postsCollected = {};
            postsCollected[postId] = false;
            wx.setStorageSync('posts_collected', postsCollected );
        }
    },
    onCollectionTap:function(evebt) {
        var postsCollected = wx.getStorageSync('posts_collected');
        var postCollected = postsCollected[this.data.currentPostId];
        //收藏变微收藏，未收藏变收藏
        postCollected = !postCollected;
        postsCollected[this.data.currentPostId] = postCollected;
        //this.showModal(postsCollected,postCollected);
        this.showToast(postsCollected,postCollected);
        // wx.showToast({
        //     title:postCollected?"收藏成功":"取消收藏成功",
        //     duration:1000,
        //     icon:"success",
        // })
    },
    showModal:function(postsCollected,postCollected){
         var that = this;
         wx.showModal({
            title:"收藏",
            content:postCollected?"收藏该文章？":"取消收藏改文章？",
            showCancel:"true",
            cancelText:"取消",
            cancelColor:"red",
            confirmText:"确认",
            confirmColor:"#405f80",
            success:function(res) {
                if(res.confirm){
                   //更新文章是否收藏的缓存值
                    wx.setStorageSync('posts_collected', postsCollected);
                    //更新数据绑定，从而实现切换图片
                    that.setData({
                        collected:postCollected
                    }) 
                }
            }
        })
    },
    showToast:function(postsCollected,postCollected){
        //更新文章是否收藏的缓存值
        wx.setStorageSync('posts_collected', postsCollected);
        //更新数据绑定，从而实现切换图片
        this.setData({
            collected:postCollected
        }) 
        wx.showToast({
            title:postCollected?"收藏成功":"取消收藏成功",
            duration:1000,
            icon:"success",
        })
    }
})