const { AuthenticationService, JWTStrategy } = require('@feathersjs/authentication');
const { LocalStrategy } = require('@feathersjs/authentication-local');
const { expressOauth } = require('@feathersjs/authentication-oauth');
const { OAuthStrategy } = require('@feathersjs/authentication-oauth');
const axios = require('axios');
const client = require('express');

class FacebookStrategy extends OAuthStrategy {
  async getProfile(authResult) {
    const app = this.props.app;
    console.log("auth_result ->", authResult)
    const accessToken = authResult.access_token;

    axios.get(`
    https://graph.facebook.com/v6.0/me?fields=id%2Cname%2Cemail&access_token=${accessToken}`).then((result) => {
      console.log(result);
      let users =
        client.service('users')
          .find({
            query: {
              email
            }
          }).then((result) => {
            let user = null;
            if (!result.total) {
              // user does not exist yet, create new user
              user = client
                .service('users')
                .create({ email });
            } else {
              user = users.data[0];
            }
          }).catch((err) => {
            console.log(err)
          });

    }).catch((err) => {
      console.log(err)
    });
  }

  async getEntityData(profile) {
    const baseData = await super.getEntityData(profile);
    return {
      ...baseData,
      name: profile.name,
      email: profile.email
    };
  }
}


module.exports = app => {
  const authentication = new AuthenticationService(app);

  authentication.register('jwt', new JWTStrategy());
  authentication.register('local', new LocalStrategy());
  // authentication.register('facebook', new FacebookStrategy(app));

  app.use('/authentication', authentication);
  app.configure(expressOauth());
};
