import axios, { AxiosInstance } from 'axios';

export type CommonInput = {
  client_id: string;
  client_secret: string;
  application_id: string;
  organization_id: string;
};

export type SDKInitInput = CommonInput & {
  sdk_type: string;
  url: string;
};

export type LoginType =
  | 'login-username'
  | 'login-email'
  | 'login-phone'
  | 'login-cas'
  | 'login-token';

export type ResponseType = 'token' | 'id_token' | 'cas';

export type LoginInput = CommonInput & {
  type: LoginType;
  response_type: ResponseType;
  username: string;
  password: string;
  email: string;
  phone: string;
  region: string;
  redirect_uri?: string;
  country_code: string;
  session_option?: 'clear-all' | 'clear-last' | '';
  access_token?: string;
  ticket?: string;
  service?: string;
};

export type RegisterInput = CommonInput &
  Omit<LoginInput, 'response_type' | 'type'> & {
    metadata: {
      [key: string]: any;
    };
    sdk_type: string;
    name: string;
    first_name: string;
    last_name: string;
    affiliation: string;
    id_card: string;
    provider: string;
    code: string;
    state: string;
    method: string;
    email_code: string;
    phone_code: string;
    auto_sign_in: boolean;
    relay_state: string;
    captcha_type: string;
    captcha_token: string;
    mfa_type: string;
    passcode: string;
    recovery_code: string;
  };

export type LogoutInput = CommonInput & {
  refresh_token: string;
};

export type RefreshTokenInput = CommonInput & {
  refresh_token: string;
  grant_type: string;
};

export type ChangePasswordInput = CommonInput & {
  sdk_type: string;
  user_id: string;
  current_password: string;
  new_password: string;
};

export type ForgetPasswordOTPSendInput = CommonInput & {
  sdk_type: string;
  receiver_type: 'forget-phone' | 'forget-email';
  receiver: string;
};

export type ForgetPasswordOTPVerifyInput = ForgetPasswordOTPSendInput & {
  code: string;
};

export type GetOrganizationInput = CommonInput & {};
export type GetApplicationInput = CommonInput & {
  with_organization?: boolean;
};

export type GetUserInput = CommonInput & {
  user_id: string;
  sdk_type: string;
};
export type ForgetPasswordInput = CommonInput & {
  sdk_type: string;
  reference: string;
  password: string;
  password_confirm: string;
};

export class Access {
  data: any;
  api: AxiosInstance;

  private static instance: Access | null = null;

  constructor(data: any, api: AxiosInstance) {
    // if (data.error) throw new Error(data.error.message);
    this.data = data;
    this.api = api;
    if (!Access.instance) {
      Access.instance = this;
    }

    return Access.instance;
  }

  static async init(input: SDKInitInput): Promise<Access> {
    const api = axios.create({
      baseURL: input.url,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    try {
      const res = await api.post('/sdk-init', input);
      return new Access(res.data, api);
    } catch (error: any) {
      return new Access({ error }, api);
    }
  }

  async register(registerInput: RegisterInput) {
    try {
      const res = await this.api.post('/auth/signup', registerInput);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  }

  async login(loginInput: LoginInput) {
    const { session_option = '' } = loginInput;
    try {
      const res = await this.api.post('/auth/signin', {
        ...loginInput,
        session_option,
      });
      return res.data;
    } catch (error: any) {
      console.log(error);
      // throw error.response.data;
    }
  }

  async logout(logoutInput: LogoutInput) {
    try {
      const res = await this.api.post('/auth/signout', logoutInput);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  }

  async refreshToken(refreshTokenInput: RefreshTokenInput) {
    try {
      const res = await this.api.post('/auth/refresh', refreshTokenInput);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  }

  async getOrganization(getOrganizationInput: GetOrganizationInput) {
    try {
      const res = await this.api.post(
        `/sdk/organization`,
        getOrganizationInput
      );
      return res.data;
    } catch (error) {
      console.log(error);
    }
  }

  async getApplication(getApplicationInput: GetApplicationInput) {
    const { with_organization = false } = getApplicationInput;
    try {
      const res = await this.api.post(
        `/sdk/application?with_organization=${with_organization}`,
        getApplicationInput
      );
      return res.data;
    } catch (error: any) {
      return error.response.data;
    }
  }

  async getUser(getUserInput: GetUserInput) {
    try {
      const res = await this.api.post('/sdk/user', getUserInput);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  }

  async changePassword(changePasswordInput: ChangePasswordInput) {
    try {
      const res = await this.api.patch(
        '/sdk/user/change-password',
        changePasswordInput
      );
      return res.data;
    } catch (error: any) {
      console.log(error);
      // throw error.response.data;
    }
  }

  async forgetPasswordOTPSend(
    forgetPasswordOTPSendInput: ForgetPasswordOTPSendInput
  ) {
    try {
      const res = await this.api.post(
        '/forget-password/otp/send',
        forgetPasswordOTPSendInput
      );
      return res.data;
    } catch (error: any) {
      console.log(error);
      // throw error.response.data;
    }
  }

  async forgetPasswordOTPVerify(
    forgetPasswordOTPVerifyInput: ForgetPasswordOTPVerifyInput
  ) {
    try {
      const res = await this.api.post(
        '/forget-password/otp/verify',
        forgetPasswordOTPVerifyInput
      );
      return res.data;
    } catch (error: any) {
      console.log(error);
      // throw error.response.data;
    }
  }

  async forgetPassword(forgetPasswordInput: ForgetPasswordInput) {
    try {
      const res = await this.api.post(`/forget-password`, forgetPasswordInput);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  }
}

export default Access;

const main = async () => {
  const commonInput = {
    organization_id: '03e9eacf-0a50-4eef-855e-ab91f97f05d5',
    application_id: 'c80178cb-7b1e-4013-9fea-b4abf4c4cb02',
    client_id: '1ce52ca341',
    client_secret: 'cc0eb7dbb2c663850555',
  };

  const client = await Access.init({
    sdk_type: 'frontend',
    ...commonInput,
    url: 'http://localhost:9111',
  });

  // console.log({ client });

  const loginInput: LoginInput = {
    ...commonInput,
    type: 'login-username',
    response_type: 'token',
    username: 'mehedi',
    password: 'mehedi',
    email: 'mehedi@yopmail.com',
    phone: '1479503550',
    region: 'US',
    // redirect_uri: '',
    country_code: '',
    session_option: 'clear-all',
  };

  const logoutInput: LogoutInput = {
    ...commonInput,
    refresh_token: '',
  };

  const refreshTokenInput: RefreshTokenInput = {
    ...commonInput,
    refresh_token: '',
    grant_type: 'refresh_token',
  };

  const registerInput: RegisterInput = {
    ...commonInput,

    metadata: {
      name: 'onimesh mitra2',
      profile_picture: 'somecdnlink',
      has_business: false,
    },
    sdk_type: '',
    username: 'mehedi',
    password: 'mehedi',
    name: 'Mehedi Hasan',
    first_name: 'Mehedi',
    last_name: 'Hasan',
    email: 'mehedi@yopmail.com',
    phone: '1479503550',
    affiliation: '',
    id_card: '',
    region: '',
    provider: '',
    code: '',
    state: '',
    redirect_uri: 'https://example.com/callback',
    method: 'POST',
    email_code: '',
    phone_code: '',
    country_code: 'BD',
    auto_sign_in: true,
    relay_state: '',
    captcha_type: '',
    captcha_token: '',
    mfa_type: '',
    passcode: '',
    recovery_code: '',
  };

  // const registerRes = await client.register(registerInput);
  // console.log(registerRes);

  // const refreshTokenRes = await client.refreshToken(refreshTokenInput);
  // console.log(refreshTokenRes);

  // const logoutRes = await client.logout(logoutInput);
  // console.log(logoutRes);

  // const loginRes = await client.login(loginInput);
  // console.log(loginRes.data.data.data.user_id);
  // sign_in_resp_fields -> ["user_id"] && field_name_mappings -> {"user_id": "id"}

  // const getUserRes = await client.getUser({
  //   ...commonInput,
  //   user_id: 'cf188dae-bcf5-4069-9b4a-f4800561db31',
  //   sdk_type: 'frontend',
  // });
  // console.log(getUserRes);

  // const changePasswordRes = await client.changePassword({
  //   ...commonInput,
  //   sdk_type: 'frontend',
  //   user_id: 'cf188dae-bcf5-4069-9b4a-f4800561db31',
  //   current_password: 'mehedi',
  //   new_password: 'mehedi',
  // });
  // console.log(changePasswordRes);

  // const forgetPasswordOTPSendRes = await client.forgetPasswordOTPSend({
  //   ...commonInput,
  //   sdk_type: 'frontend',
  //   receiver_type: 'forget-phone',
  //   receiver: '1479503550',
  // });
  // console.log(forgetPasswordOTPSendRes);

  // const forgetPasswordOTPVerifyRes = await client.forgetPasswordOTPVerify({
  //   ...commonInput,
  //   sdk_type: 'frontend',
  //   receiver_type: 'forget-phone',
  //   receiver: '1479503550',
  //   code: '597985',
  // });
  // console.log(forgetPasswordOTPVerifyRes);

  // const forgetPasswordRes = await client.forgetPassword({
  //   ...commonInput,
  //   sdk_type: 'frontend',
  //   reference: 'n7gaHtXVmc0X',
  //   password_confirm: 'mehedi',
  //   password: 'mehedi',
  // });
  // console.log({ forgetPasswordRes });

  // const getOrganizationRes = await client.getOrganization(commonInput);
  // console.log(getOrganizationRes);

  // const getApplicationRes = await client.getApplication({
  //   ...commonInput,
  //   with_organization: true,
  // });
  // console.log(getApplicationRes);

  // console.log(loginRes);
  // setTimeout(() => {
  //   // console.log({ client });
  //   // console.log(client2.data);
  // });
};

main();

// 7696d850-369e-4d3f-b822-fd816f499f9f
