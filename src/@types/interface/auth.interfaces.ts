export interface ILoginRequest {
  email: string;
  password: string;
}

export interface ISignupRequest {
  username: string;
  email: string;
  password: string;
}

export interface IAuthResponse {
  // data: {
    access_token: {
      token: string;
    // };
  };
}