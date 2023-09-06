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

export type LoginInput = CommonInput & {
  type: string;
  response_type: string;
  username: string;
  password: string;
  email: string;
  phone: string;
  region: string;
  redirect_uri: string;
  country_code: string;
  session_option?: 'clear-all' | 'clear-last' | '';
};

export type RegisterInput = CommonInput &
  Omit<LoginInput, 'response_type'> & {
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
        `/organization/${getOrganizationInput.organization_id}`,
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
        `/application/${getApplicationInput.application_id}?with_organization=${with_organization}`,
        getApplicationInput
      );
      return res.data;
    } catch (error: any) {
      return error.response.data;
    }
  }

  async getUser(getUserInput: GetUserInput) {
    try {
      const res = await this.api.post('/user', getUserInput);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  }

  async changePassword(changePasswordInput: ChangePasswordInput) {
    try {
      const res = await this.api.patch(
        '/user/change-password',
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
    client_id: 'b2aca2edb9',
    client_secret: '302479106f4fc38d9ee4',
    application_id: '53d759b2-ff38-4a3c-bfb4-99198ba1586e',
    organization_id: '8ad5f6ae-6dbc-4ff0-a1d2-0234344166dd',
  };

  const client = await Access.init({
    sdk_type: 'frontend',
    ...commonInput,
    url: 'http://localhost:9111',
  });

  const loginInput: LoginInput = {
    ...commonInput,
    type: 'login-username',
    response_type: 'token',
    username: 'hasan',
    password: 'mehedi',
    email: 'john.doe@yopmail.com',
    phone: '1795035563',
    region: 'US',
    redirect_uri: 'http://localhost:3000',
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
    type: '',
    username: 'mehedi2',
    password: 'mehedi',
    name: 'Mehedi Hasan',
    first_name: 'Mehedi',
    last_name: 'Hasan',
    email: 'mehedi2@yopmail.com',
    phone: '1479503554',
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

  // const getUserRes = await client.getUser({
  //   ...commonInput,
  //   user_id: '7696d850-369e-4d3f-b822-fd816f499f9f',
  //   sdk_type: 'frontend',
  // });
  // console.log(getUserRes);

  // const changePasswordRes = await client.changePassword({
  //   ...commonInput,
  //   sdk_type: 'frontend',
  //   user_id: '7696d850-369e-4d3f-b822-fd816f499f9f',
  //   current_password: 'mehedi',
  //   new_password: 'mehedi',
  // });
  // console.log(changePasswordRes);

  // const forgetPasswordOTPSendRes = await client.forgetPasswordOTPSend({
  //   ...commonInput,
  //   sdk_type: 'frontend',
  //   receiver_type: 'forget-phone',
  //   receiver: '1479503552',
  // });
  // console.log(forgetPasswordOTPSendRes);

  // const forgetPasswordOTPVerifyRes = await client.forgetPasswordOTPVerify({
  //   ...commonInput,
  //   sdk_type: 'frontend',
  //   receiver_type: 'forget-phone',
  //   receiver: '1479503552',
  //   code: '074446',
  // });
  // console.log(forgetPasswordOTPVerifyRes);

  // const forgetPasswordRes = await client.forgetPassword({
  //   ...commonInput,
  //   sdk_type: 'frontend',
  //   reference: 'T9LpYHeafIMi',
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
