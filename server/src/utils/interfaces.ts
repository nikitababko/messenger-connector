import { Document } from 'mongoose';

export interface IUser extends Document {
  fullname: string;
  username: string;
  account: string;
  password: string;
  avatar: string;
  role: string;
  gender: string;
  mobile: string;
  address: string;
  bio: string;
  website: string;
  friends: Array<object>;
  saved: Array<object>;
  _doc: object;
}

export interface INewUser {
  fullname: string;
  username: string;
  account: string;
  password: string;
}

export interface IDecodedToken {
  id?: string;
  newUser?: INewUser;
  iat: number;
  exp: number;
}
