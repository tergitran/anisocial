import mongoose from "mongoose";

const Schema = mongoose.Schema;

const PostSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User'},
  text: String,
  likes: [{ type: Schema.Types.ObjectId }], // user
  comments: [{type: Schema.Types.ObjectId}], // other comment
  created_add: {type: Schema.Types.Date, default: Date.now} 
});

export default mongoose.model('Post', PostSchema, 'post')