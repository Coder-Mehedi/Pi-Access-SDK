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
