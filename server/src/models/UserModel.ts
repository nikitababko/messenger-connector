import { Schema, model, Types } from 'mongoose';

import { IUser } from '../utils/interfaces';

const UserSchema = new Schema(
  {
    fullname: {
      type: String,
      required: [true, 'Please add your name.'],
      trim: true,
      maxLength: [20, 'Your name is up to 20 chars long.'],
    },

    username: {
      type: String,
      required: [true, 'Please add your name.'],
      trim: true,
      maxLength: [20, 'Your username is up to 20 chars long.'],
      unique: true,
    },

    account: {
      type: String,
      required: [true, 'Please add your email or phone'],
      trim: true,
      unique: true,
    },

    password: {
      type: String,
      required: [true, 'Please add your password'],
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

    gender: {
      type: String,
      default: 'male',
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
        ref: 'User',
      },
    ],

    saved: [
      {
        type: Types.ObjectId,
        ref: 'User',
      },
    ],
  },

  {
    timestamps: true,
  }
);

const UserModel = model<IUser>('User', UserSchema);

export default UserModel;
