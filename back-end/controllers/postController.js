import Post from "../models/post.js";
import User from "../models/user.js";

export default {
  async postList(req, res, next) {
    try {

      // {
      //   id: '1231894',
      //   content: 'Chiều nay không có mưa rơi trên nhà em',
      //   authorInfor: {
      //     username: 'Tran Dan',
      //     avatar: 'ksld.xc,ksdasgd',
      //     id: '0120310231023023'
      //   },
      //   date: '19/2/1998',
      //   like: 23,
      //   isLiked: false,
      //   comments: []
      // }

      let params = {};
      if (req.query.user_id) {
        params.user_id = req.query.user_id;
      }
      const posts = await Post.find(params).sort({created_add: -1}).populate('user_id');
      let result = posts.map(item => {
        return {
          id: item._id,
          authorInfor: {
            username: item.user_id.username,
            avatar: item.user_id.avatar,
            id: item.user_id._id
          },
          content: item.text,
          date: item.created_add,
          like: item.likes,
          isLiked: false,
          comments: []
        }
      })

      res.json(result);
    } catch (error) {
      console.log(error);
      next(error)
    }
  },
  async createNewPost(req, res, next) {
    try {
      const post = new Post({
        user_id: req.userInfo.id,
        text: req.body.content,
      });
      const resPost = await post.save();
      res.json({id: resPost._id, date: resPost.created_add});
    } catch (error) {
      console.log(error);
      next(error)
    }
  }
} 