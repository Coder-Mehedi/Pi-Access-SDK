import axios, { AxiosInstance } from 'axios';
import jwtDecode from 'jwt-decode';

export type CommonInput = {
  client_id: string;
  client_secret: string;
  application_id: string;
  organization_id: string;
};

export type SDKInitInput = CommonInput & {
  url: string;
};

export type LoginType =
  | 'login-username'
  | 'login-email'
  | 'login-phone'
  | 'login-cas'
  | 'login-token';

export type ResponseType = 'token' | 'id_token' | 'cas';

export type LoginInput = {
  type: LoginType;
  response_type: ResponseType;
  username?: string;
  password?: string;
  email?: string;
  phone?: string;
  redirect_uri?: string;
  session_option?: 'clear-all' | 'clear-last' | '';
  access_token?: string;
  ticket?: string;
  service?: string;
};

export type RegisterInput = Omit<LoginInput, 'response_type' | 'type'> & {
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
  receiver_type: 'forget-phone' | 'forget-email';
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
type refreshTokensWithResponseType = {
  [key: string]: string | null;
};
type RefreshTokenRequest = {
  input: RefreshTokenInput;
  resolve: (value: any) => void;
  reject: (reason?: any) => void;
};

export class Access {
  data: any;
  api: AxiosInstance;
  input: SDKInitInput | null = null;
  refreshTokensWithResponse: refreshTokensWithResponseType = {};
  refreshTokenQueue: RefreshTokenRequest[] = [];

  private static instance: Access | null = null;

  constructor(input: SDKInitInput) {
    // if (data.error) throw new Error(data.error.message);

    if (!Access.instance) {
      Access.instance = this;
    }

    this.input = input;
    this.api = axios.create({
      baseURL: input.url,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return Access.instance;
  }

  // static async init(input: SDKInitInput): Promise<Access> {
  //   const inputWithSdkType = { ...input, sdk_type: 'frontend' };

  //   const api = axios.create({
  //     baseURL: input.url,
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //   });

  //   try {
  //     const res = await api.post('/sdk-init', inputWithSdkType);
  //     return new Access(res.data, api, inputWithSdkType);
  //   } catch (error: any) {
  //     throw error.response;
  //   }
  // }

  async register(registerInput: RegisterInput) {
    try {
      const res = await this.api.post('/auth/signup', {
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
    const { session_option = '' } = loginInput;
    try {
      const res = await this.api.post('/auth/signin', {
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
      const res = await this.api.post('/auth/signout', {
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
    console.log('SDK: refresh token called');
    console.log('SDK: refresh token input', refreshTokenInput);
    console.log('SDK: refresh token queue', this.refreshTokenQueue);
    // console.log("SDK: refresh token map", this.refreshTokensWithResponse);

    const { refresh_token } = refreshTokenInput;

    const cachedRefreshToken = this.refreshTokensWithResponse[refresh_token];
    console.log('SDK: cached refresh token', cachedRefreshToken);

    if (cachedRefreshToken) return cachedRefreshToken;

    if (!cachedRefreshToken) {
      const promise = new Promise((resolve, reject) => {
        this.refreshTokenQueue.push({
          input: refreshTokenInput,
          resolve,
          reject,
        });
      });

      this.processQueue();

      return promise;
    }

    return null;
  }

  async processQueue() {
    if (this.refreshTokenQueue.length === 0) return;

    const { input, resolve, reject } = this.refreshTokenQueue.shift()!;

    try {
      const cachedRefreshToken =
        this.refreshTokensWithResponse[input.refresh_token];

      if (cachedRefreshToken === 'loading') {
        const promise = new Promise((resolve, reject) => {
          this.refreshTokenQueue.push({
            input: input,
            resolve,
            reject,
          });
        });

        this.processQueue();

        // return resolve(promise)
      }

      this.refreshTokensWithResponse[input.refresh_token] = 'loading';

      const res = await this.api.post('/auth/refresh', {
        ...input,
        ...this.input,
      });

      this.refreshTokensWithResponse[input.refresh_token] = res.data;

      // setTimeout(() => {
      //   delete this.refreshTokensWithResponse?.[input.refresh_token];
      // }, 10000);

      console.log('SDK: refresh token response', res.data);
      console.log('SDK: refresh token', this.refreshTokensWithResponse);

      resolve(res.data);
    } catch (error: any) {
      reject(error);
    }

    this.processQueue();
  }

  printCurrentRefreshTokens() {
    console.log(this.refreshTokensWithResponse);
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
      const res = await this.api.post('/sdk/user', {
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
      const res = await this.api.patch('/sdk/user/change-password', {
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
      const res = await this.api.post('/forget-password/otp/send', {
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
      const res = await this.api.post('/forget-password/otp/verify', {
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
//   "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySUQiOiIwM2VkZjZiMy04NGY3LTQ2OTUtOWI2Yy1iMjhmYjM5MzUyY2IiLCJ0b2tlblR5cGUiOiJyZWZyZXNoLXRva2VuIiwiQXBwbGljYXRpb24iOiJmOGY1ZmM1Mi1lNmNmLTQyYTktYjBhOC04OWY1YzRlMWE2ZTEiLCJBcHBsaWNhdGlvblVzZXJJRCI6IjUiLCJFbWFpbCI6IiIsIlNlc3Npb24iOiIxOGI4MTVmOS1lZTZjLTQ3MGQtYjNhNS1lZTVmN2ZhZGEyNjEiLCJhdWQiOiJmOGY1ZmM1Mi1lNmNmLTQyYTktYjBhOC04OWY1YzRlMWE2ZTEiLCJleHAiOjE3MDIyOTMyODcsImp0aSI6IjAzZWRmNmIzLTg0ZjctNDY5NS05YjZjLWIyOGZiMzkzNTJjYiIsImlhdCI6MTcwMTY4ODQ4NywiaXNzIjoiZjhmNWZjNTItZTZjZi00MmE5LWIwYTgtODlmNWM0ZTFhNmUxIiwibmJmIjoxNzAxNjg4NDg3LCJzdWIiOiI1In0.cynECTQBBenVPiyGMATplQOnSbdC2pDZrBNWgaMZ3SPAprlkYF_mpG09_TEwPkjVjBsTOVk4LKQ4AX17awgIq4fFubhxQb2n854e0RqdSVBLFHA9tRMJJDVQXID_pSV-khV5ioRCRjAIFsyAQybq0q_1eqHwKqOoFjof4QauSj4q7RvfnTidnJoW-TlV_Pa0_SbX-HdlSMs6RCmnzXqAIhhde9dfDO8A4vDq-GTOP8RfAfva86x_Lj4cgnO0CoZObgboZ5qGSE6oqQBwY8BWCfcSr5btedzM57Libr86Zv09Hib8lzWtVcBgw3UJ-AS-_lu3CTfmr5y3hKgAVfIzpG8Aq-ljc_lI1qCR5eZmTkTBnUWF5YykZQ-7UnbHo7OwVQzl6EK8BbjZeBXlwppP7xz-otD_uwW9ttx75qGUzZAzNC3fg6KF9SFUomI54U6VWvfJYXr8_v3R_FKcirTVXzPv44rdSZ042bcLWDuKBqny02asVojJuBMDuGXiw8AvKgcYjnhyxTKygHhi3ZLKay5slorVdvP1k1pNsCAOMGzdDKDAS62283tALYSn0Xab_NCCbhfV3FH4u_y-FULBY0yFXadGXb37BLWS94hsEILLO7s0mkj9NX1FYhQ9fpGKW4oCNf--ZQLfLsfEqpvsF230JxpVjBIe8gyZjlFQMwU";

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
//   access.refreshToken({
//     grant_type: "refresh_token",
//     refresh_token: REFRESH_TOKEN1,
//   });

//   access.refreshToken({
//     grant_type: "refresh_token",
//     refresh_token: REFRESH_TOKEN2,
//   });
// };

// main();
