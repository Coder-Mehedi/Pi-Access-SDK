type CommonInput = {
  client_id: string;
  client_secret: string;
  application_id: string;
  organization_id: string;
};

type BasicSDKInitInput = {
  application_id: string;
  organization_id: string;
  url: string;
};

type AdvancedSDKInitInput = {
  client_id: string;
  client_secret: string;
  application_id: string;
  organization_id: string;
  url: string;
};

type LoginType =
  | "login-username"
  | "login-email"
  | "login-phone"
  | "login-cas"
  | "login-token";

type ResponseType = "token" | "id_token" | "cas";

type LoginInput = {
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

type RegisterInput = Omit<LoginInput, "response_type" | "type"> & {
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

type LogoutInput = {
  refresh_token: string;
};

type RefreshTokenInput = {
  refresh_token: string;
  grant_type: string;
};

type ChangePasswordInput = {
  user_id: string;
  current_password: string;
  new_password: string;
};

type ForgetPasswordOTPSendInput = {
  receiver_type: "forget-phone" | "forget-email";
  receiver: string;
};

type ForgetPasswordOTPVerifyInput = ForgetPasswordOTPSendInput & {
  code: string;
};

type GetOrganizationInput = {};
type GetApplicationInput = {
  with_organization?: boolean;
};

type GetUserInput = {
  user_id: string;
};
type ForgetPasswordInput = {
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
