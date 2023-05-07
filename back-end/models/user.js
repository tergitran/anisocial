import mongoose from "mongoose";

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  avatar: String, // file path to user's avatar
  friends: [{type: Schema.Types.ObjectId, ref: 'User'}], // array of user ids that the user is friends with
  friendRequestsSent: [{type: Schema.Types.ObjectId, ref: 'User'}], // array of user ids that the user has sent friend requests to
  friendRequestsReceived: [{type: Schema.Types.ObjectId, ref: 'User'}], // array of user ids that the user has received friend requests from
  description: String
});


export default mongoose.model('User', UserSchema, 'user')