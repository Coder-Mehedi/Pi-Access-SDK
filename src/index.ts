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
      return res.data;
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
    console.log('SDK: refresh token map', this.refreshTokensWithResponse);

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
