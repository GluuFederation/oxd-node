const expect = require('chai').expect;
const nock = require('nock');
const sinon = require('sinon');

const index = require('../index')({});

describe('Setup client', () => {
  it('Setup client request through oxd-https', (done) => {
    const response = {
      status: 'ok',
      data: {
        oxd_id: '6F9619FF-8B86-D011-B42D-00CF4FC964FF',
        op_host: '<op host>',
        client_id: '<client id>',
        client_secret: '<client secret>',
        client_registration_access_token: '<Client registration access token>',
        client_registration_client_uri: '<URI of client registration>',
        client_id_issued_at: '<client_id issued at>',
        client_secret_expires_at: '<client_secret expires at>'
      }
    };

    const request = {
      op_host: 'https://gluu.local.org',
      authorization_redirect_uri: 'https://gluu.local.org:1338',
      scope: ['openid', 'email', 'profile', 'uma_protection'],
      claims_redirect_uri: ['https://gluu.local.org:1338'],
      grant_types: ['authorization_code'],
      client_name: 'oxd_http_client'
    };

    nock(request.url)
      .post('/get-client-token', request)
      .reply(200, JSON.stringify(response));

    const callback = sinon.spy((err, res) => {
      expect(res.status).to.equal('ok');
      done();
    });

    index.get_client_token(request, callback);
  });
});

describe('Get client token', () => {
  it('Get client token request through oxd-https', (done) => {
    const response = {
      status: 'ok',
      data: {
        scope: 'openid profile uma_protection uma_authorization email',
        access_token: 'b75434ff-f465-4b70-92e4-b7ba6b6c58f2',
        expires_in: 299,
        refresh_token: null
      }
    };

    const request = {
      https_extension: true,
      host: 'http://gluu.local.org:8553',
      op_host: 'https://gluu.local.org',
      client_id: '@!4068.62D5.C8A8.F3C0!0001!B574.28AF!0008!49C4.4450.51F0.240D',
      client_secret: '8d32aaff-92b5-4f87-9c0f-4a5bea2fb89e',
      scope: ['openid', 'email', 'profile', 'uma_protection']
    };

    nock(request.host)
      .post('/get-client-token', request)
      .reply(200, JSON.stringify(response));

    const callback = sinon.spy((err, res) => {
      expect(res.status).to.equal('ok');
      expect(res.data.access_token).to.equal('b75434ff-f465-4b70-92e4-b7ba6b6c58f2');
      done();
    });

    index.get_client_token(request, callback);
  });
});
