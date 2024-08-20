import axios, { AxiosInstance } from "axios";
import jwtDecode from "jwt-decode";
export type CommonInput = {
  client_id: string;
  client_secret: string;
  application_id: string;
  organization_id: string;
};

export type BasicSDKInitInput = {
  application_id: string;
  organization_id: string;
  url: string;
};

export type SDKInitInput = {
  client_id: string;
  client_secret: string;
  application_id: string;
  organization_id: string;
  url: string;
};

export type LoginType =
  | "login-username"
  | "login-email"
  | "login-phone"
  | "login-cas"
  | "login-token";

export type ResponseType = "token" | "id_token" | "cas";

export type LoginInput = {
  type: LoginType;
  response_type: ResponseType;
  username?: string;
  password?: string;
  email?: string;
  phone?: string;
  redirect_uri?: string;
  session_option?: "clear-all" | "clear-last" | "";
  access_token?: string;
  ticket?: string;
  service?: string;
};

export type RegisterInput = Omit<LoginInput, "response_type" | "type"> & {
  metadata?: {
    [key: string]: any;
  };
  username: string;
  name?: string;
  first_name?: string;
  last_name?: string;
  state?: string;
  method?: string;
  email_code?: string;
  phone_code?: string;
  relay_state?: string;
  country_code?: string;
  confirm_password?: string;
};

export type LogoutInput = {
  refresh_token: string;
};

export type RefreshTokenInput = {
  refresh_token: string;
  grant_type: string;
};

export type ChangePasswordInput = {
  user_id: string;
  current_password: string;
  new_password: string;
};

export type ForgetPasswordOTPSendInput = {
  receiver_type: "forget-phone" | "forget-email";
  receiver: string;
};

export type ForgetPasswordOTPVerifyInput = ForgetPasswordOTPSendInput & {
  code: string;
};

export type GetOrganizationInput = {};
export type GetApplicationInput = {
  with_organization?: boolean;
};

export type GetUserInput = {
  user_id: string;
};
export type ForgetPasswordInput = {
  reference: string;
  password: string;
  password_confirm: string;
};
export type refreshTokensWithResponseType = {
  [key: string]: string | null;
};
export type RefreshTokenRequest = {
  input: RefreshTokenInput;
  resolve: (value: any) => void;
  reject: (reason?: any) => void;
};

export class AccessBase {
  data: any;
  api: AxiosInstance;
  input: BasicSDKInitInput | null = null;
  refreshTokensWithResponse: refreshTokensWithResponseType = {};
  refreshTokenQueue: RefreshTokenRequest[] = [];

  private static instance: AccessBase | null = null;

  constructor(input: BasicSDKInitInput) {
    // if (data.error) throw new Error(data.error.message);

    if (!AccessBase.instance) {
      AccessBase.instance = this;
    }

    this.input = input;
    this.api = axios.create({
      baseURL: input.url,
      headers: {
        "Content-Type": "application/json",
      },
    });

    return AccessBase.instance;
  }

  async register(registerInput: RegisterInput) {
    try {
      const res = await this.api.post("/auth/signup", {
        ...registerInput,
        ...this.input,
      });
      return res.data;
    } catch (error: any) {
      // console.log(error);
      throw error;
    }
  }

  async login(loginInput: LoginInput) {
    const { session_option = "" } = loginInput;
    try {
      const res = await this.api.post("/auth/signin", {
        ...loginInput,
        session_option,
        ...this.input,
      });
      return res.data.data.data;
    } catch (error: any) {
      // console.log(error);
      throw error;
    }
  }

  async logout(logoutInput: LogoutInput) {
    try {
      const res = await this.api.post("/auth/signout", {
        ...logoutInput,
        ...this.input,
      });
      return res.data;
    } catch (error: any) {
      console.log(error);
      throw error;
    }
  }

  async refreshToken(refreshTokenInput: RefreshTokenInput) {
    try {
      const res = await this.api.post("/auth/refresh", {
        ...refreshTokenInput,
        ...this.input,
      });
      return res.data;
    } catch (error: any) {
      throw error;
    }
  }

  printCurrentRefreshTokens() {
    console.log(this.refreshTokensWithResponse);
  }
}
export class Access extends AccessBase {
  constructor(input: SDKInitInput) {
    super(input);
  }

  async getOrganization(getOrganizationInput: GetOrganizationInput) {
    try {
      const res = await this.api.post(`/sdk/organization`, {
        ...getOrganizationInput,
        ...this.input,
      });
      return res.data;
    } catch (error: any) {
      // console.log(error);
      throw error;
    }
  }

  async getApplication(getApplicationInput: GetApplicationInput) {
    const { with_organization = false } = getApplicationInput;
    try {
      const res = await this.api.post(
        `/sdk/application?with_organization=${with_organization}`,
        { ...getApplicationInput, ...this.input }
      );
      return res.data;
    } catch (error: any) {
      throw error;
    }
  }

  async getUserInfo(token: string) {
    const decodedToken = jwtDecode(token);
    return decodedToken;
  }

  async getUser(getUserInput: GetUserInput) {
    try {
      const res = await this.api.post("/sdk/user", {
        ...getUserInput,
        ...this.input,
      });
      return res.data;
    } catch (error: any) {
      // console.log(error);
      throw error;
    }
  }

  async changePassword(changePasswordInput: ChangePasswordInput) {
    try {
      const res = await this.api.patch("/sdk/user/change-password", {
        ...changePasswordInput,
        ...this.input,
      });
      return res.data;
    } catch (error: any) {
      console.log(error);
      throw error;
    }
  }

  async forgetPasswordOTPSend(
    forgetPasswordOTPSendInput: ForgetPasswordOTPSendInput
  ) {
    try {
      const res = await this.api.post("/forget-password/otp/send", {
        ...forgetPasswordOTPSendInput,
        ...this.input,
      });
      return res.data;
    } catch (error: any) {
      // console.log(error);
      throw error;
    }
  }

  async forgetPasswordOTPVerify(
    forgetPasswordOTPVerifyInput: ForgetPasswordOTPVerifyInput
  ) {
    try {
      const res = await this.api.post("/forget-password/otp/verify", {
        ...forgetPasswordOTPVerifyInput,
        ...this.input,
      });
      return res.data;
    } catch (error: any) {
      // console.log(error);
      throw error;
    }
  }

  async forgetPassword(forgetPasswordInput: ForgetPasswordInput) {
    try {
      const res = await this.api.post(`/forget-password`, {
        ...forgetPasswordInput,
        ...this.input,
      });
      return res.data;
    } catch (error: any) {
      // console.log(error);
      throw error;
    }
  }
}

export default Access;

// const REFRESH_TOKEN1 =
//   "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySUQiOiIwMGE5ZmNmZC03NDhjLTQ2N2EtOTBjZi05NzY3NjhjMGFmOGYiLCJ0b2tlblR5cGUiOiJyZWZyZXNoLXRva2VuIiwiQXBwbGljYXRpb24iOiJmOGY1ZmM1Mi1lNmNmLTQyYTktYjBhOC04OWY1YzRlMWE2ZTEiLCJBcHBsaWNhdGlvblVzZXJJRCI6IjE4IiwiRW1haWwiOiIiLCJTZXNzaW9uIjoiYTM4NDBhOGUtOTdiZS00YTcwLWJjNmQtYzM1YmM1NDZjZDYxIiwiYXVkIjoiZjhmNWZjNTItZTZjZi00MmE5LWIwYTgtODlmNWM0ZTFhNmUxIiwiZXhwIjoxNzExNTE2ODcyLCJqdGkiOiIwMGE5ZmNmZC03NDhjLTQ2N2EtOTBjZi05NzY3NjhjMGFmOGYiLCJpYXQiOjE3MTA5MTIwNzIsImlzcyI6ImY4ZjVmYzUyLWU2Y2YtNDJhOS1iMGE4LTg5ZjVjNGUxYTZlMSIsIm5iZiI6MTcxMDkxMjA3Miwic3ViIjoiMTgifQ.Ma__AXeAdDj0UzmhXt198Fil42cbCX1vaBVVxAc8lXL-XnKtMp-n1bp46Ld8B8h7T1M2Xd_ix4LpQQMzYsWSDNDNiRSe4XQPeflpmhKF4mbfgVtaa_-Lx01NNXdkTqMh_MhHE3oFY7hY0IUpPo9gdGmm2p8e0i7lNwmK3sR68FuZFA7dZ7bQRb7t36-1HtHzoauLXqnX2dJvmGony-AfNi9aI9Rq_Ad--APlPrKaF4PZcYszyJJ44VFbKXdV4mcenxH-mBm-mypQbl2RRTYi0hOu77FGqgmgCb90tbk5qTNybOOOahH5XjQdlix2GhcBWMs6H4OitsuSqO6nWHqZT1h9c_XzzbPYHE8y0IZGDZpCxbEuehrqhQ0QxWeQruUNuGYw-KgQ8p4Mj_k-Mo5jF6JW-1FSz82A0_I0PCuxfS-uqYNbqjEtWsTEzlZy5PLwy7xnRRDbqW7MVHUYN0Nd12tLEdfCAsVjp8kWr96VWGM2nGI-ObF_xdxR0G9ZtZ8tXD58r00LoSyfS0bVLPxMpenWD9nIGbeejT_nhPKcLQ1Ch2HglVe59CK1J5Y9l5QLXQpBsINbsVy1hftRNXdIB85_0WWwuPn_Tfm3mR8-bEYNCBlzL-O_ouPQXqiVKRInQVh9Gs0aOIQj6-u6Dyd8Ye1tWbiOL5YJGroiyURxzi0";

// const REFRESH_TOKEN2 =
//   "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySUQiOiJlMmMyYWE0Ni03OGVlLTQ5Y2ItYWZmNy05MzJjNzc1MzZhNTAiLCJ0b2tlblR5cGUiOiJyZWZyZXNoLXRva2VuIiwiQXBwbGljYXRpb24iOiJmOGY1ZmM1Mi1lNmNmLTQyYTktYjBhOC04OWY1YzRlMWE2ZTEiLCJBcHBsaWNhdGlvblVzZXJJRCI6IjciLCJFbWFpbCI6IiIsIlNlc3Npb24iOiI3MWJmODY5Mi1hNjYyLTQ1NWMtYWE0Mi1lYWFhYmE2NDhjMjMiLCJhdWQiOiJmOGY1ZmM1Mi1lNmNmLTQyYTktYjBhOC04OWY1YzRlMWE2ZTEiLCJleHAiOjE3MDIyOTM1MDQsImp0aSI6ImUyYzJhYTQ2LTc4ZWUtNDljYi1hZmY3LTkzMmM3NzUzNmE1MCIsImlhdCI6MTcwMTY4ODcwNCwiaXNzIjoiZjhmNWZjNTItZTZjZi00MmE5LWIwYTgtODlmNWM0ZTFhNmUxIiwibmJmIjoxNzAxNjg4NzA0LCJzdWIiOiI3In0.Fjg8oqxF5xuk7fYw8Qx1K3yooiXoOc2w-bAYZSZnfGiZaFc3mi3rLVg2g_Uszc0jOJTIPEWW2jOTx31_jEA0kNqSOLqp4O14UAHnmLwaPsi3Uv0kaxY2jjl_bSAwk-kSdwboR5ej1vFPIwLgCQIyJDobyK-bKswczqAL4UH0mPauQ4hfFCa69nVf348_gYGW57yH97jFWmm_HNf1Bm1QG99PfwT2li3zd3G5bN5fCSMf0t86NsZOGfgiTIzODUwRE4Bp7YDFKFKBe60F7dSf5mBZz1UjmgOrOkrSx3YzLPGnNscIqD901IEFy_LOJ0ekMuzb0C__D--JcfNRHWP3nn50s393izvvOAyecypSYhwZFZI-qwBF2y4svKu9--WdocY6HZCu4OnxQBXh9USdLC3CacT6wE9JSyAPaFgnPA-SK_jf_cwfEyK-ud5L_l0ZJbo92sf6ciIN_L4Q-OxkfB_ltPwHBtxihAzgOPFK6a6Eso0meAw5EQIsDVxjnlb3ci0E8hmfAIxjcHDqieXjAEKNy7HblTUZNXa03HSwDjRx2NW_4aBaZrLAUfnxxfVZ84VQJcRhVO3XUvvnTTbdRkf-y633SMjd8MuClLRUVkRSYsw46pYtDJ3UZ1OV0tzNY82cuH3LBAme6uBVJG9KdE-4wJ-AgcW7qdEC9z5v93Y";

// const access = new Access({
//   url: "http://43.224.110.115:8088",
//   organization_id: "e7c80e31-9ce2-47b7-b4de-bc6c95755ff0",
//   application_id: "f8f5fc52-e6cf-42a9-b0a8-89f5c4e1a6e1",
//   client_id: "def25c0319",
//   client_secret: "de04a1d0279491f26d89",
// });
// const main = async () => {
//   console.log(
//     await access.refreshToken({
//       grant_type: "refresh_token",
//       refresh_token: REFRESH_TOKEN1,
//     })
//   );

//   // access.refreshToken({
//   //   grant_type: "refresh_token",
//   //   refresh_token: REFRESH_TOKEN2,
//   // });
// };

// main();
