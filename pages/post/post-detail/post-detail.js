var postsData = require('../../../data/posts-data.js')
var app = getApp();
Page({
    data: {
        isPlayingMusic: false
    },

    onLoad: function (option) {
        var postId = option.id;
        this.setData({
            currentPostId: postId
        })
        var postData = postsData.postList[postId];
        this.setData({
            postData: postData
        })
        // 收藏
        var postsCollected = wx.getStorageSync('posts_collected');
        if (postsCollected) {
            //如果存在，取对应的值值，并设置给当前data中的collected；
            var postCollected = postsCollected[postId];
            this.setData({
                collected: postCollected
            })
        } else {
            //如果不存在，设当前文章收藏为false，建立缓存；
            var postsCollected = {};
            postsCollected[postId] = false;
            wx.setStorageSync('posts_collected', postsCollected);
        }

        //音乐播放
        //获取全局状态，是否是当前页面在播放
        if (app.globalData.g_isPlayingMusic && app.globalData.g_currentMusicPostId === postId) {
            this.setData({
                isPlayingMusic: true
            })
        }
        this.setMusicMonitor();
    },
    //播放与暂停音乐
    setMusicMonitor: function () {
        var that = this;
        wx.onBackgroundAudioPlay(function () {
            that.setData({
                isPlayingMusic: true
            })
            //如果在播放，将信息写入全局变量
            app.globalData.g_isPlayingMusic = true;
            app.globalData.g_currentMusicPostId = that.data.currentPostId;
        });
        wx.onBackgroundAudioPause(function () {
            that.setData({
                isPlayingMusic: false
            })
            app.globalData.g_isPlayingMusic = false;
            app.globalData.g_currentMusicPostId = null;
        })

    },
    onCollectionTap: function (evebt) {
        var postsCollected = wx.getStorageSync('posts_collected');
        var postCollected = postsCollected[this.data.currentPostId];
        //收藏变未收藏，未收藏变收藏
        postCollected = !postCollected;
        //更改缓存
        postsCollected[this.data.currentPostId] = postCollected;
        //this.showModal(postsCollected,postCollected);
        this.showToast(postsCollected, postCollected);
        // wx.showToast({
        //     title:postCollected?"收藏成功":"取消收藏成功",
        //     duration:1000,
        //     icon:"success",
        // })
    },

    // showModal: function (postsCollected, postCollected) {
    //     var that = this;
    //     wx.showModal({
    //         title: "收藏",
    //         content: postCollected ? "收藏该文章？" : "取消收藏改文章？",
    //         showCancel: "true",
    //         cancelText: "取消",
    //         cancelColor: "red",
    //         confirmText: "确认",
    //         confirmColor: "#405f80",
    //         success: function (res) {
    //             if (res.confirm) {
    //                 //更新文章是否收藏的缓存值
    //                 wx.setStorageSync('posts_collected', postsCollected);
    //                 //更新数据绑定，从而实现切换图片
    //                 that.setData({
    //                     collected: postCollected
    //                 })
    //             }
    //         }
    //     })
    // },

    showToast: function (postsCollected, postCollected) {
        //更新文章是否收藏的缓存值
        wx.setStorageSync('posts_collected', postsCollected);
        //更新数据绑定，从而实现切换图片
        this.setData({
            collected: postCollected
        })
        wx.showToast({
            title: postCollected ? "收藏成功" : "取消收藏成功",
            duration: 1000,
            icon: "success",
        })
    },
    onShowTap: function (event) {
        var itemList = [
            "分享到微信好友",
            "分享到朋友圈",
            "分享到QQ",
            "分享到微博"
        ];
        wx.showActionSheet({
            itemList: itemList,
            itemColor: "#405f80",
            success: function (res) {
                //res.camcel 用户点击取消按钮
                //res.tapIndex 数组元素序号，从从0开始
                wx.showModal({
                    title: "用户" + itemList[res.tapIndex],
                    content: "用户是否取消?" + res.cancel + " 现在还无法实现分享功能，什么时候开始呢"
                })
            }
        })
    },
    onMusicTap: function () {
        var currentPostId = this.data.currentPostId;
        var postData = postsData.postList[currentPostId];
        var isPlayingMusic = this.data.isPlayingMusic;
        if (isPlayingMusic) {
            wx.pauseBackgroundAudio();
            this.setData({
                isPlayingMusic: false
            })
        } else {
            wx.playBackgroundAudio({
                dataUrl: postData.music.url,
                title: postData.music.title,
                coverImgUrl: postData.music.coverImg,
            });
            this.setData({
                isPlayingMusic: true
            })
        }
    }

})