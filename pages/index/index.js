//index.js
//获取应用实例
const app = getApp()

var windowWidth;
var windowHeight;
var imgwidth;
var imgheight;
const TEXT_COLOR = '#000000';
const WHITE = '#FFFFFF';
const THEME_COLOR = '#FF555C';
const GRAY_COLOR = '#333333';
const TINT_COLOR = '#747474';
const temp = 0.01;
//图片长宽比
const scale = 1.78;
//背景图高度
const bgScale = 0.5;


Page({
  data: {
    nickname: 'Geek',
    canvasHeight: 0,
    imageWidth: 0,
    imageHeight: 0,
    targetSharePath: null,
    avatarPath: null,
    realShow: false,
    imgheight:0,
    imgwidth:0
  },

  //事件处理函数
  onLoad: function () {
    let that = this
    //获取系统信息
    wx.getSystemInfo({
      success: function(res) {
        windowWidth = res.windowWidth;
        windowHeight = res.screenHeight - 180;

        that.setData({
          // canvasWidth: canvasWidth,
          // canvasHeight: canvasHeight,
          // screenWidth: canvasWidth/2,
          // screenHeight: canvasHeight/2，
          canvasHeight: windowHeight,
          imageWidth: windowWidth * 0.7,
          imageHeight: windowHeight * 0.7
        })
        that.drawImage();
        
      },
    })
  },

  // 绘制初始界面
  drawImage: function () {
    var that = this;
    const ctx = wx.createCanvasContext('myCanvas', this);
    var bgPath = '../../images/bg1.png';
    var bg = '../../images/bg3.png';
    var QRPath = '../../images/bg.png';
    ctx.setFillStyle(WHITE);
    console.log(windowWidth, windowHeight)
    ctx.fillRect(0, 0, windowWidth, windowHeight);
    //绘制背景图片
    ctx.drawImage(bg, 0, 0, windowWidth, windowHeight)

    // 画logo
    var logoheight = windowWidth * 100 / 640
    var logoposy = windowHeight - windowWidth * 100 / 640
    console.log('logoposy',logoposy)
    ctx.drawImage(QRPath, 0, logoposy, windowWidth, logoheight);
    // ctx.drawImage(bgPath, windowWidth * 0.1, 0, windowWidth * 0.8, windowWidth * 1.1);

    ctx.draw(false, function () {
      console.log('callback--------------->');
    });
  },


  //开始上传照
  touchStart: function(e){
    var that = this;
    var QRPath = '../../images/bg.png';
    that.canvasContext = wx.createCanvasContext("myCanvas")

    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        // console.log('chooseimage = ',that.canvasContext)
        // imgwidth = imgwidth
        // imgheight = imgheight
        wx.getImageInfo({
          src: res.tempFilePaths[0],
          success(res) {
            imgwidth = res.width
            imgheight = res.height
            console.log(imgwidth)
            console.log(imgheight)
            console.log(res.path)
            var bg = '../../images/bg3.png'
            var imagewidth = windowWidth * 0.8
            var imageHeight = imagewidth * imgheight / imgwidth
            var imageposx = windowWidth /2 - imagewidth / 2
            var imageposy = windowHeight/2 - imageHeight / 2
            // var logoposy = windowHeight - windowWidth * 100 / 640
            var logoposy = windowHeight - imageposy + 20
            var logoheight = windowWidth * 100 / 640
            console.log('imageHeight = ', imageHeight)
            that.canvasContext.drawImage(bg, 0, 0, windowWidth, windowHeight)
            that.canvasContext.drawImage(res.path, imageposx, imageposy, imagewidth, imageHeight )
            that.canvasContext.drawImage(QRPath, 0, logoposy, windowWidth, logoheight);
            that.canvasContext.draw()
          },
        })
        // var tmpActions = that.canvasContext.getActions()
        // wx.drawCanvas({
        //   canvasId: 'myCanvas',
        //   reserve: true,
        //   actions: tmpActions
        // })
        
      }
    })
    // that.saveCanvasImage();
  },
  
  //转化为图片
  saveCanvasImage: function () {
    var that = this;
    wx.canvasToTempFilePath({
      canvasId: 'myCanvas',
      success: function (res) {
        console.log('转化为照片',res.tempFilePath);
        that.setData({
          targetSharePath: res.tempFilePath,
          // realShow: true
        })
      },
      complete: function () {
        that.hideLoading();
      }
    }, this)
  },

  hideLoading: function () {
    wx.hideLoading();
  },
  /**
   * 保存到相册
   */
  saveImageTap: function () {
    var that = this;
    that.saveCanvasImage();
    that.requestAlbumScope();
  },


  /**
   * 检测相册权限
   */
  requestAlbumScope: function () {
    var that = this;
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.writePhotosAlbum']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          that.saveImageToPhotosAlbum();
        } else {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success(res) {
              that.saveImageToPhotosAlbum();
            },
            fail() {
              wx.showModal({
                title: '提示',
                content: '你需要授权才能保存图片到相册',
                success: function (res) {
                  if (res.confirm) {
                    wx.openSetting({
                      success: function (res) {
                        if (res.authSetting['scope.writePhotosAlbum']) {
                          that.saveImageToPhotosAlbum();
                        } else {
                          console.log('用户未同意获取用户信息权限-------->success');
                        }
                      },
                      fail: function () {
                        console.log('用户未同意获取用户信息权限-------->fail');
                      }
                    })
                  }
                }
              })
            }
          })
        }
      }
    })
  },

  saveImageToPhotosAlbum: function () {
    var that = this;
    wx.saveImageToPhotosAlbum({
      filePath: that.data.targetSharePath,
      success: function () {
        wx.showModal({
          title: '',
          content: '✌️图片保存成功，\n快去分享到朋友圈吧',
          showCancel: false
        })
        that.hideDialog();
      }
    })
  },

  closeModel: function () {
    this.hideDialog();
  },

  hideDialog: function () {
    this.setData({
      realShow: false,
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
