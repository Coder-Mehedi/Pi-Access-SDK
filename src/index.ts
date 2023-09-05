import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:9111',
  headers: {
    'Content-Type': 'application/json',
  },
});

const sdkInitApi = async (sdkInitInput: SDKInitInput) => {
  try {
    const res = await api.post('/sdk-init', sdkInitInput);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

const loginApi = async (loginInput: LoginInput) => {
  try {
    const res = await api.post('/auth/signin', loginInput);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

const logoutApi = async (logoutInput: LogoutInput) => {
  try {
    const res = await api.post('/auth/signout', logoutInput);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

const refreshTokenApi = async (refreshTokenInput: RefreshTokenInput) => {
  try {
    const res = await api.post('/auth/refresh', refreshTokenInput);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

const registerApi = async (registerInput: RegisterInput) => {
  try {
    const res = await api.post('/auth/signup', registerInput);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

type CommonInput = {
  client_id: string;
  client_secret: string;
  application_id: string;
  organization_id: string;
};

type SDKInitInput = CommonInput & {
  sdk_type: string;
};

type LoginInput = CommonInput & {
  type: string;
  response_type: string;
  username: string;
  password: string;
  email: string;
  phone: string;
  region: string;
  redirect_uri: string;
  country_code: string;
};

type RegisterInput = CommonInput &
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

type LogoutInput = CommonInput & {
  refresh_token: string;
};

type RefreshTokenInput = CommonInput & {
  refresh_token: string;
  grant_type: string;
};

class Access {
  data: any;

  private static instance: Access | null = null;

  constructor(data: any) {
    this.data = data;
    if (!Access.instance) {
      Access.instance = this;
    }

    return Access.instance;
  }

  static async init(input: SDKInitInput): Promise<Access> {
    const initRes = sdkInitApi(input);
    return new Access({ ...initRes, ...input });
  }

  async register(registerInput: RegisterInput) {
    return await registerApi(registerInput);
  }

  async login(loginInput: LoginInput) {
    return await loginApi(loginInput);
  }

  async logout(logoutInput: LogoutInput) {
    return await logoutApi(logoutInput);
  }

  async refreshToken(refreshTokenInput: RefreshTokenInput) {
    return await refreshTokenApi(refreshTokenInput);
  }
}

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
    username: 'mehedi1',
    password: 'mehedi',
    name: 'Mehedi Hasan',
    first_name: 'Mehedi',
    last_name: 'Hasan',
    email: 'mehedi1@yopmail.com',
    phone: '1479503553',
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

  const registerRes = await client.register(registerInput);
  console.log(registerRes);

  // const refreshTokenRes = await client.refreshToken(refreshTokenInput);
  // console.log(refreshTokenRes);

  // const logoutRes = await client.logout(logoutInput);
  // console.log(logoutRes);

  // const loginRes = await client.login(loginInput);
  // console.log(loginRes);

  // console.log(loginRes);
  // setTimeout(() => {
  //   // console.log({ client });
  //   // console.log(client2.data);
  // });
};

main();
