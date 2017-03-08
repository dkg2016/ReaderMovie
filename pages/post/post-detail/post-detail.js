var postsData = require('../../../data/posts-data.js')
var app = getApp();
Page({
    data: {

        // 默认音乐播放状态为false
        isPlayingMusic: false
    },

    onLoad: function (option) {
        
        // 获得上一个页面的单击事件传递过来的参数
        var postId = option.id;

        this.setData({
            currentPostId: postId
        })

        // 获得对应ID的数据
        var postData = postsData.postList[postId];

        // 设置数据
        this.setData({
            postData: postData
        })


        // 收藏功能
        // 取得缓存
        var postsCollected = wx.getStorageSync('posts_collected');

        // 如果缓存存在，取得对应的值，并设置给当前data中的collected；
        if (postsCollected) {    
            var postCollected = postsCollected[postId];
            this.setData({
                collected: postCollected
            })

        // 如果不存在，设当前文章收藏为false（默认），建立缓存；
        } else {
            var postsCollected = {};
            postsCollected[postId] = false;
            wx.setStorageSync('posts_collected', postsCollected);
        }

        // 音乐播放功能
        // 获取全局状态，是否是当前页面在播放
        if (app.globalData.g_isPlayingMusic && app.globalData.g_currentMusicPostId === postId) {
            this.setData({
                isPlayingMusic: true
            })
        }

        //监听音乐状态
        this.setMusicMonitor();
    },

    setMusicMonitor: function () {
        var that = this;

        //音乐播放状态
        wx.onBackgroundAudioPlay(function () {
            that.setData({
                isPlayingMusic: true
            })
            //如果在播放，将信息写入全局变量
            app.globalData.g_isPlayingMusic = true;
            app.globalData.g_currentMusicPostId = that.data.currentPostId;
        });

        //音乐暂停状态
        wx.onBackgroundAudioPause(function () {
            that.setData({
                isPlayingMusic: false
            })
            app.globalData.g_isPlayingMusic = false;
            app.globalData.g_currentMusicPostId = null;
        });

        //音乐停止状态
        wx.onBackgroundAudioStop(function () {
            that.setData({
                isPlayingMusic: false
            })
            app.globalData.g_isPlayingMusic = false;
            app.globalData.g_currentMusicPostId = null;
        });
    },

    //点击收藏按钮
    onCollectionTap: function (event) {
        var postsCollected = wx.getStorageSync('posts_collected');
        var postCollected = postsCollected[this.data.currentPostId];

        //收藏变未收藏，未收藏变收藏
        postCollected = !postCollected;

        //更改缓存
        postsCollected[this.data.currentPostId] = postCollected;

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

        //发出消息通知
        wx.showToast({
            title: postCollected ? "收藏成功" : "取消收藏成功",
            duration: 1000,
            icon: "success",
        })
    },

    //分享功能
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

    //点击音乐按钮
    onMusicTap: function () {
        var currentPostId = this.data.currentPostId;
        var postData = postsData.postList[currentPostId];
        var isPlayingMusic = this.data.isPlayingMusic;

        //如果正在播放，暂停；如果正在暂停，开始播放；
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