import User from "../models/user.js";

export default {
  async getUser(req, res) {
    /**
     *  interface User {
          username: string,
          no_friends: number,
          id: string,
          avatar: string,
          description: string
        }
     */
    try {
      const user = await User.findById(req.params.id);
      const dataRes = {
        username: user.username,
        no_friends: user.friends.length,
        id: user._id,
        avatar: user.avatar,
        description: user.description || 'Tell about yourself...'
      }
      res.status(200).json(dataRes);
    } catch (error) {
      console.log(error);
    }
  },
  async getFriends(req, res) {
    const { status } = req.query;
    const user = await User.findById(req.userInfo.id).populate("friends").populate("friendRequestsSent").populate("friendRequestsReceived");
    let result = [];
    switch (+status) {
      case 1:
        result = user.friends;
        break;
      case 2:
        result = user.friendRequestsReceived;
        break;
      case 3:
        result = user.friendRequestsSent;
        break;
      default:
        break;
    }
    result = result.map(user => {
      return {
        username: user.username,
        avatar: user.avatar,
        id: user._id
      }
    })
    res.status(200).json(result);
  },
  async getAllPeople(req, res) {
    try {
      /**
       * return list not friends, not sent, not receive
       */

      const specificUserId = req.userInfo.id; // replace with the _id of the specific user

      const users = await User.find({
        $and: [
          { _id: { $ne: specificUserId } }, // exclude the specific user
          { friends: { $not: { $elemMatch: { $eq: specificUserId } } } }, // exclude users who are already friends
          { friendRequestsSent: { $not: { $elemMatch: { $eq: specificUserId } } } }, // exclude users to whom the specific user has sent friend requests
          { friendRequestsReceived: { $not: { $elemMatch: { $eq: specificUserId } } } } // exclude users who have sent friend requests to the specific user
        ]
      })
      console.log("user", users);
      const result = users.map(user => {
        return {
          username: user.username,
          avatar: user.avatar,
          id: user._id
        }
      })

      // console.log(result);
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
    }
  },
  async sentFriendRequest(req, res) {
    try {
      const specificUserId = req.userInfo.id;
      const {id} = req.body;
      const userSent = await User.findById(id);
      if (userSent) {
        // todo: run parallel
        let doc1 = await User.updateOne({_id: specificUserId}, {$addToSet: { friendRequestsSent: id }});
        let doc2 = await User.updateOne({_id: id}, {$addToSet: { friendRequestsReceived: specificUserId }});
        res.status(200).json({});
      }
    } catch (error) {
      console.log(error);
      res.status(400);
    }
  },
  async cancelFriendRequest(req, res) {
    try {
      const specificUserId = req.userInfo.id;
      const {id} = req.body;
      const userSent = await User.findById(id);
      if (userSent) {
        // todo: run parallel
        let doc1 = await User.updateOne({_id: specificUserId}, {$pull: { friendRequestsSent: id }});
        let doc2 = await User.updateOne({_id: id}, {$pull: { friendRequestsReceived: specificUserId }});
        res.status(200).json({});
      }
    } catch (error) {
      console.log(error);
      res.status(400);
    }
  },
  async acceptFriendRequest(req, res) {
    try {
      const specificUserId = req.userInfo.id;
      const {id} = req.body;
      const userSent = await User.findById(id);
      if (userSent) {
        // todo: run parallel
        let doc1 = await User.updateOne({_id: specificUserId}, {$pull: { friendRequestsReceived: id }});
        let doc2 = await User.updateOne({_id: id}, {$pull: { friendRequestsSent: specificUserId }});
        let doc3 = await User.updateOne({_id: specificUserId}, {$addToSet: { friends: id }});
        let doc4 = await User.updateOne({_id: id}, {$addToSet: { friends: specificUserId }});
        res.status(200).json({});
      }
    } catch (error) {
      console.log(error);
      res.status(400);
    }
  },
  async declineFriendRequest(req, res) {
    try {
      const specificUserId = req.userInfo.id;
      const {id} = req.body;
      const userSent = await User.findById(id);
      if (userSent) {
        // todo: run parallel
        let doc1 = await User.updateOne({_id: specificUserId}, {$pull: { friendRequestsReceived: id }});
        let doc2 = await User.updateOne({_id: id}, {$pull: { friendRequestsSent: specificUserId }});
        res.status(200).json({});
      }
    } catch (error) {
      console.log(error);
      res.status(400);
    }
  },
  async unfriend(req, res) {
    try {
      const specificUserId = req.userInfo.id;
      const {id} = req.body;
      const userSent = await User.findById(id);
      if (userSent) {
        // todo: run parallel
        let doc3 = await User.updateOne({_id: specificUserId}, {$pull: { friends: id }});
        let doc4 = await User.updateOne({_id: id}, {$pull: { friends: specificUserId }});

        res.status(200).json({});
      }
    } catch (error) {
      console.log(error);
      res.status(400);
    }
  },
  async updateUser(req, res) {
    try {
      const id = req.userInfo.id;
      const {file: avatar, description} = req.body;
      const user = await User.findById(id);
      console.log("userrr", user);
      user.avatar = avatar ?? user.avatar;
      user.description = description ?? user.description;
      await user.save();
      res.status(200).json({});
    } catch (error) {
      console.log(error);
      res.status(400);
    }
  }
} 