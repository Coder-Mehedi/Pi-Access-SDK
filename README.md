### Store the common input in a variable

```
const commonInput = {
  organization_id: '03e9eacf-0a50-4eef-855e-ab91f97f05d5',
  application_id: 'c80178cb-7b1e-4013-9fea-b4abf4c4cb02',
  client_id: '1ce52ca341',
  client_secret: 'cc0eb7dbb2c663850555',
};
```

### Initialize the client with the following code

```
const client = await Access.init({
  ...commonInput,
  url: 'http://localhost:9111',
});

// console.log({ client });

```

#### Now you can use the client to call the api methods like below

```
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

const loginRes = await client.login(loginInput);
console.log(loginRes.data.data.data.user_id);
```

you can use sign_in_resp_fields && field_name_mappings to get the user_id from the response

sign_in_resp_fields -> ["user_id"] &&
field_name_mappings -> {"user_id": "id"}

```
const logoutInput: LogoutInput = {
  ...commonInput,
  refresh_token: '',
};

const logoutRes = await client.logout(logoutInput);
console.log(logoutRes);
```

```
const refreshTokenInput: RefreshTokenInput = {
  ...commonInput,
  refresh_token: '',
  grant_type: 'refresh_token',
};

const refreshTokenRes = await client.refreshToken(refreshTokenInput);
console.log(refreshTokenRes);
```

```
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

const registerRes = await client.register(registerInput);
console.log(registerRes);
```

```
const getUserRes = await client.getUser({
  ...commonInput,
  user_id: 'cf188dae-bcf5-4069-9b4a-f4800561db31',
  sdk_type: 'frontend',
});
console.log(getUserRes);
```

```
const changePasswordRes = await client.changePassword({
  ...commonInput,
  sdk_type: 'frontend',
  user_id: 'cf188dae-bcf5-4069-9b4a-f4800561db31',
  current_password: 'mehedi',
  new_password: 'mehedi',
});
console.log(changePasswordRes);
```

```
const forgetPasswordOTPSendRes = await client.forgetPasswordOTPSend({
  ...commonInput,
  sdk_type: 'frontend',
  receiver_type: 'forget-phone',
  receiver: '1479503550',
});
console.log(forgetPasswordOTPSendRes);

```

```
const forgetPasswordOTPVerifyRes = await client.forgetPasswordOTPVerify({
  ...commonInput,
  sdk_type: 'frontend',
  receiver_type: 'forget-phone',
  receiver: '1479503550',
  code: '597985',
});
console.log(forgetPasswordOTPVerifyRes);
```

```
const forgetPasswordRes = await client.forgetPassword({
  ...commonInput,
  sdk_type: 'frontend',
  reference: 'n7gaHtXVmc0X',
  password_confirm: 'mehedi',
  password: 'mehedi',
});
console.log({ forgetPasswordRes });
```

```
const getOrganizationRes = await client.getOrganization(commonInput);
console.log(getOrganizationRes);
```

```
const getApplicationRes = await client.getApplication({
  ...commonInput,
  with_organization: true,
});
console.log(getApplicationRes);

```
