import axios, { AxiosError, AxiosInstance } from 'axios';
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

export class Access {
  data: any;
  api: AxiosInstance;
  input: SDKInitInput | null = null;

  private static instance: Access | null = null;

  constructor(data: any, api: AxiosInstance, input: SDKInitInput | null) {
    // if (data.error) throw new Error(data.error.message);
    this.data = data;
    this.api = api;
    this.input = input;

    if (!Access.instance) {
      Access.instance = this;
    }

    return Access.instance;
  }

  static async init(input: SDKInitInput): Promise<Access> {
    const inputWithSdkType = { ...input, sdk_type: 'frontend' };

    const api = axios.create({
      baseURL: input.url,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    try {
      const res = await api.post('/sdk-init', inputWithSdkType);
      return new Access(res.data, api, inputWithSdkType);
    } catch (error: any) {
      throw error;
      // throw error;
    }
  }

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
    try {
      const res = await this.api.post('/auth/refresh', {
        ...refreshTokenInput,
        ...this.input,
      });
      return res.data;
    } catch (error: any) {
      throw error;

      // console.log(error);
    }
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

async function main() {
  const client = await Access.init({
    organization_id: 'a3961e2e-28b4-4fbe-9598-5beb19ee86c44',
    application_id: 'f8fca1d7-edec-4348-96da-143ea429e373',
    client_id: 'a6c4c590ae',
    client_secret: 'b1883a734d266ff985a1',
    url: 'http://54.169.254.219:8088',
  });
  console.log(client);
}
main();
