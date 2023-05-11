import Post from "../models/post.js";
import User from "../models/user.js";

export default {
  async postList(req, res, next) {
    try {
      const currentUser = await User.findById(req.userInfo.id);
      const userIds = [...currentUser.friends, req.userInfo.id];
      console.log("userIds", userIds);
      let params = {};
      if (req.query.user_id) {
        params.user_id = req.query.user_id;
      } else {
        params.user_id = { $in: userIds };
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
  },
  async updateNewPost(req, res, next) {
    try {
      console.log(1111, req.params, req.body);
      await Post.findByIdAndUpdate(req.params.id, {text: req.body.content})
      res.json();
    } catch (error) {
      console.log(error);
      next(error)
    }
  },
  async deletePost(req, res, next) {
    try {
      const resPost = await Post.findByIdAndDelete(req.params.id);
      console.log(resPost);
      res.json();
    } catch (error) {
      console.log(error);
      next(error)
    }
  }
} 