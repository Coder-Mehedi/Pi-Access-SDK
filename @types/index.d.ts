type SDKInitInput = {
  sdk_type: string;
  client_id: string;
  client_secret: string;
  application_id: string;
  organization_id: string;
};

type LoginInput = {
  type: string;
  response_type: string;
  organization_id: string;
  username: string;
  password: string;
  email: string;
  phone: string;
  region: string;
  application_id: string;
  client_id: string;
  client_secret: string;
  redirect_uri: string;
  country_code: string;
};
