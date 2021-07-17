const { Schema, Types, model } = require('mongoose');

const UserSchema = new Schema(
  {
    fullname: {
      type: String,
      required: true,
      trim: true,
      maxLength: 25,
    },

    username: {
      type: String,
      required: true,
      trim: true,
      maxLength: 25,
      unique: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      maxLength: 25,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    avatar: {
      type: String,
      default:
        'https://res.cloudinary.com/nikitababko/image/upload/v1616588775/Avatars/avatar_g5b8fp.png',
    },

    role: {
      type: String,
      default: 'user',
    },

    mobile: {
      type: String,
      default: '',
    },

    address: {
      type: String,
      default: '',
    },

    bio: {
      type: String,
      default: '',
      maxLength: 200,
    },

    website: {
      type: String,
      default: '',
    },

    friends: [
      {
        type: Types.ObjectId,
        ref: 'user',
      },
    ],
  },
  { timestamps: true }
);

module.exports = model('User', UserSchema);
