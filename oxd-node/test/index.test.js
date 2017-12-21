const expect = require('chai').expect;
const nock = require('nock');
const sinon = require('sinon');

const config = {};
const index = require('../index')(config);

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
      https_extension: true,
      host: 'http://gluu.local.org:8553',
      op_host: 'https://gluu.local.org',
      authorization_redirect_uri: 'https://gluu.local.org:1338',
      scope: ['openid', 'email', 'profile', 'uma_protection'],
      claims_redirect_uri: ['https://gluu.local.org:1338'],
      grant_types: ['authorization_code'],
      client_name: 'oxd_http_client'
    };

    nock(request.host)
      .post('/setup-client', request)
      .reply(200, JSON.stringify(response));

    const callback = sinon.spy((err, res) => {
      expect(res.status).to.equal('ok');
      done();
    });

    index.setup_client(request, callback);
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
      done();
    });

    index.get_client_token(request, callback);
  });
});

describe('Register site', () => {
  it('Get client token request through oxd-https', (done) => {
    const response = {
      status: 'ok',
      data: {
        oxd_id: 'bcad760f-91ba-46e1-a020-05e4281d91b6',
        op_host: 'https://<op-hostname>'
      }
    };

    const request = {
      https_extension: true,
      host: 'http://gluu.local.org:8553',
      op_host: 'https://gluu.local.org',
      authorization_redirect_uri: 'https://client.example.org/',
      scope: ['openid', 'profile', 'email', 'uma_protection', 'uma_authorization'],
      grant_types: ['authorization_code', 'client_credentials'],
      protection_access_token: 'b75434ff-f465-4b70-92e4-b7ba6b6c58f2'
    };

    nock(request.host)
      .post('/register-site', request, { headers: 'Authorization b75434ff-f465-4b70-92e4-b7ba6b6c58f2' })
      .reply(200, JSON.stringify(response));

    const callback = sinon.spy((err, res) => {
      expect(res.status).to.equal('ok');
      done();
    });

    index.register_site(request, callback);
  });
});

describe('Update site', () => {
  it('Update site request through oxd-https', (done) => {
    const response = {
      status: 'ok',
      data: {
        oxd_id: 'bcad760f-91ba-46e1-a020-05e4281d91b6'
      }
    };

    const request = {
      https_extension: true,
      host: 'http://gluu.local.org:8553',
      oxd_id: 'bcad760f-91ba-46e1-a020-05e4281d91b6',
      scope: ['openid', 'profile', 'email', 'uma_protection', 'uma_authorization'],
      protection_access_token: 'b75434ff-f465-4b70-92e4-b7ba6b6c58f2'
    };

    nock(request.host)
      .post('/update-site', request, { headers: 'Authorization b75434ff-f465-4b70-92e4-b7ba6b6c58f2' })
      .reply(200, JSON.stringify(response));

    const callback = sinon.spy((err, res) => {
      expect(res.status).to.equal('ok');
      done();
    });

    index.update_site_registration(request, callback);
  });
});

describe('Get authorization url', () => {
  it('Get authorization url request through oxd-https', (done) => {
    const response = {
      status: 'ok',
      data: {
        authorization_url: 'https://gluu.local.org/oxauth/restv1/authorize?response_type=code&client_id=@!1736.179E.AA60.16B2!0001!8F7C.B9AB!0008!8A36.24E1.97DE.F4EF&redirect_uri=https://192.168.200.95/&scope=openid+profile+email+uma_protection+uma_authorization&state=473ot4nuqb4ubeokc139raur13&nonce=lbrdgorr974q66q6q9g454iccm'
      }
    };

    const request = {
      https_extension: true,
      host: 'http://gluu.local.org:8553',
      oxd_id: 'bcad760f-91ba-46e1-a020-05e4281d91b6',
      scope: ['openid', 'profile', 'email', 'uma_protection', 'uma_authorization'],
      protection_access_token: 'b75434ff-f465-4b70-92e4-b7ba6b6c58f2'
    };

    nock(request.host)
      .post('/get-authorization-url', request, { headers: 'Authorization b75434ff-f465-4b70-92e4-b7ba6b6c58f2' })
      .reply(200, JSON.stringify(response));

    const callback = sinon.spy((err, res) => {
      expect(res.status).to.equal('ok');
      done();
    });

    index.get_authorization_url(request, callback);
  });
});

describe('Get tokens by code', () => {
  it('Get tokens by code request through oxd-https', (done) => {
    const response = {
      status: 'ok',
      data: {
        access_token: 'SlAV32hkKG',
        expires_in: 3600,
        refresh_token: 'aaAV32hkKG1',
        id_token: 'eyJ0 ... NiJ9.eyJ1c ... I6IjIifX0.DeWt4Qu ... ZXso',
        id_token_claims: {
          iss: 'https://server.example.com',
          sub: '24400320',
          aud: 's6BhdRkqt3',
          nonce: 'n-0S6_WzA2Mj',
          exp: 1311281970,
          iat: 1311280970,
          at_hash: 'MTIzNDU2Nzg5MDEyMzQ1Ng'
        }
      }
    };

    const request = {
      https_extension: true,
      host: 'http://gluu.local.org:8553',
      oxd_id: 'bcad760f-91ba-46e1-a020-05e4281d91b6',
      code: '0b9f1518-15aa-47b2-9477-d4c607447e18',
      state: '6q1ec90hn6ui4ipigv91hrbodj',
      protection_access_token: 'b75434ff-f465-4b70-92e4-b7ba6b6c58f2'
    };

    nock(request.host)
      .post('/get-tokens-by-code', request, { headers: 'Authorization b75434ff-f465-4b70-92e4-b7ba6b6c58f2' })
      .reply(200, JSON.stringify(response));

    const callback = sinon.spy((err, res) => {
      expect(res.status).to.equal('ok');
      done();
    });

    index.get_tokens_by_code(request, callback);
  });
});

describe('Get access token by refresh token', () => {
  it('Get access token by refresh token request through oxd-https', (done) => {
    const response = {
      status: 'ok',
      data: {
        access_token: 'SlAV32hkKG',
        expires_in: 3600,
        refresh_token: 'aaAV32hkKG1',
        id_token: 'eyJ0 ... NiJ9.eyJ1c ... I6IjIifX0.DeWt4Qu ... ZXso',
        id_token_claims: {
          iss: 'https://server.example.com',
          sub: '24400320',
          aud: 's6BhdRkqt3',
          nonce: 'n-0S6_WzA2Mj',
          exp: 1311281970,
          iat: 1311280970,
          at_hash: 'MTIzNDU2Nzg5MDEyMzQ1Ng'
        }
      }
    };

    const request = {
      https_extension: true,
      host: 'http://gluu.local.org:8553',
      oxd_id: 'bcad760f-91ba-46e1-a020-05e4281d91b6',
      code: '0b9f1518-15aa-47b2-9477-d4c607447e18',
      state: '6q1ec90hn6ui4ipigv91hrbodj',
      protection_access_token: 'b75434ff-f465-4b70-92e4-b7ba6b6c58f2'
    };

    nock(request.host)
      .post('/get-access-token-by-refresh-token', request, { headers: 'Authorization b75434ff-f465-4b70-92e4-b7ba6b6c58f2' })
      .reply(200, JSON.stringify(response));

    const callback = sinon.spy((err, res) => {
      expect(res.status).to.equal('ok');
      done();
    });

    index.get_access_token_by_refresh_token(request, callback);
  });
});

describe('Get user info', () => {
  it('Get user info request through oxd-https', (done) => {
    const response = {
      status: 'ok',
      data: {
        access_token: 'SlAV32hkKG',
        expires_in: 3600,
        refresh_token: 'aaAV32hkKG1',
        id_token: 'eyJ0 ... NiJ9.eyJ1c ... I6IjIifX0.DeWt4Qu ... ZXso',
        id_token_claims: {
          iss: 'https://server.example.com',
          sub: '24400320',
          aud: 's6BhdRkqt3',
          nonce: 'n-0S6_WzA2Mj',
          exp: 1311281970,
          iat: 1311280970,
          at_hash: 'MTIzNDU2Nzg5MDEyMzQ1Ng'
        }
      }
    };

    const request = {
      https_extension: true,
      host: 'http://gluu.local.org:8553',
      oxd_id: 'bcad760f-91ba-46e1-a020-05e4281d91b6',
      access_token: '88bba7f5-961c-4b71-8053-9ab35f1ad395'
    };

    nock(request.host)
      .post('/get-access-token-by-refresh-token', request, { headers: 'Authorization b75434ff-f465-4b70-92e4-b7ba6b6c58f2' })
      .reply(200, JSON.stringify(response));

    const callback = sinon.spy((err, res) => {
      expect(res.status).to.equal('ok');
      done();
    });

    index.get_access_token_by_refresh_token(request, callback);
  });
});
