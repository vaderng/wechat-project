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
    imgpath:null,
    avatarPath: null,
    realShow: false,
    imgheight: 0,
    imgwidth: 0
  },

  //事件处理函数
  onLoad: function () {
    let that = this
    //获取系统信息
    wx.getSystemInfo({
      success: function (res) {
        windowWidth = res.windowWidth;
        windowHeight = res.screenHeight - 130;
        console.log(windowWidth,windowHeight)
        that.setData({
          canvasHeight: windowHeight,
          imageWidth1: windowWidth * 0.,
          imageHeight1: windowHeight * 0.6,

        });
        that.canvasContext = wx.createCanvasContext('myCanvas', this);
        that.drawImage();

      },
    })
  },

  // 绘制初始界面
  drawImage: function () {
    // var that = this;
    // const ctx = wx.createCanvasContext('myCanvas', this);
    var bgPath = '../../images/bg1.png';
    var bg = '../../images/bg4.png';
    var QRPath = '../../images/bg.png';
    this.canvasContext.setFillStyle(WHITE);
    console.log(windowWidth, windowHeight)
    this.canvasContext.fillRect(0, 0, windowWidth, windowHeight);
    
    var logoheight = windowWidth * 150 / 640
    var logoposy = windowHeight - windowWidth * 150 / 640
    //绘制背景图片
    this.canvasContext.drawImage(bg, 0, 0, windowWidth, logoposy)
    console.log('logoposy', logoposy)
    // 画logo
    this.canvasContext.drawImage(QRPath, 0, logoposy, windowWidth, logoheight);
    // ctx.drawImage(bgPath, windowWidth * 0.1, 0, windowWidth * 0.8, windowWidth * 1.1);

    // ctx.draw();
    this.canvasContext.draw(false, function () {
      console.log('callback1--------------->');
    });
  },

  /**
   * 生成分享图到朋友圈
   */
  shareMoments: function () {
    var that = this;
    //没有分享图先用 canvas 生成，否则直接预览
    if (that.data.targetSharePath) {
      that.setData({
        realShow: false
      })
    } else {
      that.showLoading();
      that.touchStart();
    }
  },

  //开始上传照
  touchStart: function (e) {
    var that = this;
    
    // that.canvasContext = wx.createCanvasContext("myCanvas")

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
            console.log('getimageinfo',res.path)
            
            var logoheight = windowWidth * 150 / 640
            // var logoposy = windowHeight - imageposy
            var logoposy = windowHeight - logoheight

            var imageHeight = logoposy * 0.9
            var imagewidth = imageHeight * imgwidth / imgheight
            
            var imageposx = windowWidth / 2 - imagewidth / 2
            var imageposy = logoposy / 2 - imageHeight / 2 
            
            console.log('imageHeight = ', imageHeight)
            
            that.canvasContext.drawImage(res.path, imageposx, imageposy, imagewidth, imageHeight)
            var bg = '../../images/bg4.png'
            that.canvasContext.drawImage(bg, 0, 0, windowWidth, logoposy)
            var QRPath = '../../images/bg.png';
            that.canvasContext.drawImage(QRPath, 0, logoposy, windowWidth, logoheight);

            that.setData({
              imgpath: res.path,
              // realShow: true
            })
  
            console.log('画图完毕')
            //绘制到 canvas 上
            that.canvasContext.draw()
            // that.canvasContext.draw(false, function () {
            //   console.log('callback--------------->');
            //   that.saveCanvasImage();
            // });
          },
          
        })        
      }
    })
  },

  touchMove: function (e) {
    var that = this

    //获取到当前画笔（手触摸的位置）的x、y坐标
    // let tmpX = e.changedTouches[0].x
    let tmpY = e.changedTouches[0].y
    var imgpath = that.data.imgpath

    var logoheight = windowWidth * 150 / 640
    var logoposy = windowHeight - logoheight

    var imagewidth = windowWidth * 0.9
    var imageHeight = imagewidth * imgheight/imgwidth
    // var imagewidth = imageHeight * imgwidth / imgheight
    var bg3 = '../../images/bg3.png'
    that.canvasContext.drawImage(bg3, 0, 0, windowWidth, logoposy)
    that.canvasContext.drawImage(imgpath, windowWidth/2 - imagewidth / 2, tmpY - imageHeight/2, imagewidth, imageHeight)
    var bg = '../../images/bg4.png'
    that.canvasContext.drawImage(bg, 0, 0, windowWidth, logoposy)
    var QRPath = '../../images/bg.png';
    that.canvasContext.drawImage(QRPath, 0, logoposy, windowWidth, logoheight);
    that.canvasContext.draw()
    // that.canvasContext.draw(false, function () {
    //   console.log('callback--------------->');
    //   that.saveCanvasImage();
    // });
    // that.canvasContext.draw(false, function () {
    //   // console.log('callback--------------->');

    //   // setTimeout(function () {
    //   //   console.log('我是xx')
    //   // }, 3000);
    // });
  },




  showLoading: function () {
    wx.showLoading({
      title: '极客加载中...',
    })
  },

  /**
   * 保存到相册
   */
  saveImageTap: function () {
    var that = this;
    console.log('保存照片')
    // that.showLoading();
    that.saveCanvasImage();
    that.requestAlbumScope();
  },

  //转化为图片
  saveCanvasImage: function () {
    var that = this;
    wx.canvasToTempFilePath({
      canvasId: 'myCanvas',
      success: function (res) {
        console.log('转化为照片', res.tempFilePath)
        that.setData({
          targetSharePath: res.tempFilePath,
          // realShow: true
        })
        that.requestAlbumScope();
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
          showCancel: false,
          success: function (res) {
            console.log('转化为照片', res.tempFilePath);
            that.setData({
              targetSharePath: null,
              // realShow: true
            })
          },
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
