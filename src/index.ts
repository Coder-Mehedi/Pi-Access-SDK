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
    refresh_token:
      'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySUQiOiI3Njk2ZDg1MC0zNjllLTRkM2YtYjgyMi1mZDgxNmY0OTlmOWYiLCJ0b2tlblR5cGUiOiJyZWZyZXNoLXRva2VuIiwiQXBwbGljYXRpb24iOiI1M2Q3NTliMi1mZjM4LTRhM2MtYmZiNC05OTE5OGJhMTU4NmUiLCJBcHBsaWNhdGlvblVzZXJJRCI6Ijc2OTZkODUwLTM2OWUtNGQzZi1iODIyLWZkODE2ZjQ5OWY5ZiIsIkVtYWlsIjoiaGFzYW5AeW9wbWFpbC5jb20iLCJhdWQiOiI1M2Q3NTliMi1mZjM4LTRhM2MtYmZiNC05OTE5OGJhMTU4NmUiLCJleHAiOjE2OTQ1MDAxMzAsImp0aSI6Ijc2OTZkODUwLTM2OWUtNGQzZi1iODIyLWZkODE2ZjQ5OWY5ZiIsImlhdCI6MTY5Mzg5NTMzMCwiaXNzIjoiNTNkNzU5YjItZmYzOC00YTNjLWJmYjQtOTkxOThiYTE1ODZlIiwibmJmIjoxNjkzODk1MzMwLCJzdWIiOiI3Njk2ZDg1MC0zNjllLTRkM2YtYjgyMi1mZDgxNmY0OTlmOWYifQ.RhSaHN7yWA2gMWGqwWWkUyybOORn8Vy3EvXGZn3YDTIpQY4Vq6uocjtm1LTqze7cxxxMNvveZhEABBoJIPPoAlMNN7mNFAUlmEyAPUCwLXAzLGPHxMfCwWESuWntXCSoqYxoQF530WAoY1obgF_44Uuv_YJrFV2a3y3FYVaM_ZkxoSzK6sZRPkNDCa0ZAcNcxxzRpjPSgTOHjfyHm9evo3_BfLAVWAam_BcMQ1XJUG4Iqb_-6qPwDVLhn_rdkPd1NwnxEhLGPe5bEzQLXjIeMOXAm3x3WmnpIshxjEncF241z_GOh7ebeI7aYkR2hcc29HZtTh4Jh31vRgYBq3_8T5DK9pdRBttidd2p4MQvEKZgWOMR487JA13mMDtKJq6l_GLBgt_wo1ek6g9gJymj972AfsmOr7dfKzWb8HLuAFBUDvlFHzmMufSH6obPKLCshx4abfldse1d3Pzy1n4uuuyOnv8Wociyr4WofjAfnKdFv5phGlBsy250BtqRk9gN7UoY8ip1KCfLg4keRoB-0Ti1P6XYNagrWvtvQ3WqLDhvXUmUpLksUOLoFyFuZXUmFRpFD75nOMoy-jfh1k4YerIzIrJ-fnceBTr9Nk-wxvzK4TfXsDoz__LfFCy1KMTDNnMB7otTTplLlNK0OkXhsRqra3gnmHX-FnFMOK0FbxE',
    grant_type: 'refresh_token',
  };

  const refreshTokenRes = await client.refreshToken(refreshTokenInput);
  console.log(refreshTokenRes);

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

// i want to create a npm package that will be used in react/next js project to authenticate user and get user data from the server
//
// 1. create a npm package

// sdk init with client
// type Config struct {
// 	ClientId       string `validate:"notempty"`
// 	ClientSecret   string `validate:"notempty"`
// 	ApplicationId  string `validate:"notempty"`
// 	OrganizationId string `validate:"notempty"`
// 	Url            string `validate:"notempty"`
// }

// /sdk-init

// {
//   "sdk_type": "frontend",
//   "client_id": "14a6b3d833",
//   "client_secret": "03d102b3c701c7113b80",
//   "application_id": "004f4f00-e014-46e5-bcd7-9794591ec064",
//   "organization_id": "f614aab9-36a9-426b-848d-c23ce0370434"
// }
//       "application_name": "DEFAULT_APPLICATION",
// "organization_name": "new_test",

// type SdkConfig struct {
// 	SdkType        string `json:"sdk_type"`
// 	ClientId       string `json:"client_id"`
// 	ClientSecret   string `json:"client_secret"`
// 	ApplicationId  string `json:"application_id"`
// 	OrganizationId string `json:"organization_id"`
// }

// "organization_id": "8ad5f6ae-6dbc-4ff0-a1d2-0234344166dd",
// "application_id": "53d759b2-ff38-4a3c-bfb4-99198ba1586e",
// "client_id": "b2aca2edb9",
// "client_secret": "302479106f4fc38d9ee4",
