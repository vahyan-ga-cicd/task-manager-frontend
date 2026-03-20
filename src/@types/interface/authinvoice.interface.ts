export interface ILoginRequest {
  email: string;
  password: string;
}

export interface ISignupRequest {
  //   user_id: string;
  username: string;
  email: string;
  password: string;
  mobile_number: string;
}
export interface IUserData {
  user_id: string;
  password: string;
  username: string;
  email: string;
  mobile_number: string;
}
export interface IAuthResponse {
  // data: {
  token: string;
}
