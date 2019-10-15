// 编写缓存数据库操作类
var util = require('../util/util.js')
// 1
// var DBPost=function(){//定义构造函数DBPost
//   this.storageKeyName='postList';//将post数据在缓存数据库中的键postList
//   // 赋值给构造函数的this变量

//   // 所有的文章本地缓存存储键值
// }

// DBPost.prototype={//构造函数的原型链
//   // getAllPostData可得到全部文章信息（被构造函数的实例继承）
//   getAllPostData:function(){
//     var res = wx.getStorageSync(this.storageKeyName);
//     if(!res){//如果缓存不存q在
//       // res = require('../data/data.js').postList;//则将重新加载data.js数据文件，并存入到缓存数据库中
//       this.execSetStorageSync(res);
//     }
//     return res;
//   },

//   //本地缓存 保存/更新
//   execSetStorageSync:function(data){
//     wx.setStorageSync(this.storageKeyName, data);
//   }
// };

// // 向外部模块暴露接口
// module.exports = {
//   DBPost:DBPost//输出DBPost
// };


// 2
// 用ES6新特性Class、Module来改写缓存操作类
class DBPost{
  constructor(postId){
    this.storageKeyName='postList';
    this.postId=postId;
  }

  // 得到全部文章信息
  getAllPostData(){
    var res = wx.getStorageSync(this.storageKeyName);
    if(!res){
      res = require('../data/data.js').postList;//!!!
      this.initPostList(res);
    }
    return res;
  }

  // 获取指定id号的文章数据
  getPostItemById(){
    var postsData = this.getAllPostData();
    var len = postsData.length;
    for(var i=0;i<len;i++)
    {
      if(postsData[i].postId == this.postId)
      {
        return{
          // 当前文章在缓存数据库数组的编号
          index:i,
          data:postsData[i]
        }
      }
    }
  }

  //更新Post数据 本地的点赞、评论信息、收藏、阅读量
  updatePostData(category,newComment){
    var itemData = this.getPostItemById(),
      postData = itemData.data,
      allPostData = this.getAllPostData();
  switch(category){
    case'collect':
    // 处理收藏情况
      if(!postData.collectionStatus){
        // 如果当前是未收藏
        postData.collectionNum++;
        postData.collectionStatus=true;
    }
      else{
        //  如果当前是已收藏
        postData.collectionNum--;
        postData.collectionStatus = false;
    }
      break;
    //处理点赞情况 
    case'up':
      if(!postData.upStatus){
        postData.upNum++;
        postData.upStatus=true;
      }else{
        postData.upNum--;
        postData.upStatus=false;
      }
      break;
    // 处理评论情况
    case'comment':
      postData.comments.push(newComment);
      postData.commentNum++;
      break;
    case'reading':
      postData.readingNum++;
      break;
    default:
      break;
  }
  // 更新缓存数据库
  allPostData[itemData.index]=postData;
  this.execSetStorageSync(allPostData);
  return postData;
  }

// 收藏文章
  collect(){
    return this.updatePostData('collect');
  }
// 点赞文章
  up(){
    return this.updatePostData('up');
  }

  // 获取文章的评论数据
  getCommentData(){
    var itemData = this.getPostItemById().data;
    // 按照时间降序排列评论
    itemData.comments.sort(this.compareWithTime);
    var len=itemData.comments.length,
      comment;
    for(var i=0;i<len;i++){
      // 将comment中的时间戳转换成可阅读格式???
      comment=itemData.comments[i];
      comment.create_time=util.getDiffTime(comment.create_time,true);
    }
    return itemData.comments;
  }

// 将时间按照降序排列，保证最新的评论在最上方
  compareWithTime(value1,value2){
    var flag=parseFloat(value1.create_time)-parseFloat(value2.create_time);
    if(flag<0){
      return 1;
    }else if(flag>0){
      return -1;
    }else{
      return 0;
    }
}

  //发表评论
  newComment(newComment){
    this.updatePostData('comment',newComment);
  }

  //保存或者更新缓存数据
  execSetStorageSync(data){
    wx.setStorageSync(this.storageKeyName, data);
  }

  // 阅读数+1
  addReadingTimes() {
    this.updatePostData('reading');
  }
};
export{DBPost}