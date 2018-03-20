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
  it('Register site request through oxd-https', (done) => {
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

    index.update_site(request, callback);
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
      scope: ['openid', 'profile', 'email', 'uma_protection'],
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
      refresh_token: '0b9f1518-15aa-47b2-9477-d4c607447e18',
      scope: ['openid', 'profile'],
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
        claims: {
          sub: ['248289761001'],
          name: ['Jane Doe'],
          given_name: ['Jane'],
          family_name: ['Doe'],
          preferred_username: ['j.doe'],
          email: ['janedoe@example.com'],
          picture: ['http://example.com/janedoe/me.jpg']
        }
      }
    };

    const request = {
      https_extension: true,
      host: 'http://gluu.local.org:8553',
      oxd_id: 'bcad760f-91ba-46e1-a020-05e4281d91b6',
      access_token: '88bba7f5-961c-4b71-8053-9ab35f1ad395',
      protection_access_token: 'b75434ff-f465-4b70-92e4-b7ba6b6c58f2'
    };

    nock(request.host)
      .post('/get-user-info', request, { headers: 'Authorization b75434ff-f465-4b70-92e4-b7ba6b6c58f2' })
      .reply(200, JSON.stringify(response));

    const callback = sinon.spy((err, res) => {
      expect(res.status).to.equal('ok');
      done();
    });

    index.get_user_info(request, callback);
  });
});

describe('Get logout uri', () => {
  it('Get logout uri request through oxd-https', (done) => {
    const response = {
      status: 'ok',
      data: {
        uri: 'https://<server>/end_session?id_token_hint=<id token>&state=<state>&post_logout_redirect_uri=<...>'
      }
    };

    const request = {
      https_extension: true,
      host: 'http://gluu.local.org:8553',
      oxd_id: 'bcad760f-91ba-46e1-a020-05e4281d91b6',
      protection_access_token: 'b75434ff-f465-4b70-92e4-b7ba6b6c58f2'
    };

    nock(request.host)
      .post('/get-logout-uri', request, { headers: 'Authorization b75434ff-f465-4b70-92e4-b7ba6b6c58f2' })
      .reply(200, JSON.stringify(response));

    const callback = sinon.spy((err, res) => {
      expect(res.status).to.equal('ok');
      done();
    });

    index.get_logout_uri(request, callback);
  });
});

describe('UMA rs protect', () => {
  it('UMA rs protect request through oxd-https', (done) => {
    const response = {
      status: 'ok'
    };

    const request = {
      https_extension: true,
      host: 'http://gluu.local.org:8553',
      oxd_id: '6F9619FF-8B86-D011-B42D-00CF4FC964FF',
      protection_access_token: 'b75434ff-f465-4b70-92e4-b7ba6b6c58f2',
      resources: [
        {
          path: '/photo',
          conditions: [
            {
              httpMethods: [
                'GET'
              ],
              scope_expression: {
                rule: {
                  and: [
                    {
                      or: [
                        {
                          var: 0
                        },
                        {
                          var: 1
                        }
                      ]
                    },
                    {
                      var: 2
                    }
                  ]
                },
                data: [
                  'http://photoz.example.com/dev/actions/all',
                  'http://photoz.example.com/dev/actions/add',
                  'http://photoz.example.com/dev/actions/internalClient'
                ]
              }
            },
            {
              httpMethods: [
                'PUT',
                'POST'
              ],
              scope_expression: {
                rule: {
                  and: [
                    {
                      or: [
                        {
                          var: 0
                        },
                        {
                          var: 1
                        }
                      ]
                    },
                    {
                      var: 2
                    }
                  ]
                },
                data: [
                  'http://photoz.example.com/dev/actions/all',
                  'http://photoz.example.com/dev/actions/add',
                  'http://photoz.example.com/dev/actions/internalClient'
                ]
              }
            }
          ]
        }
      ]
    };

    nock(request.host)
      .post('/uma-rs-protect', request, { headers: 'Authorization b75434ff-f465-4b70-92e4-b7ba6b6c58f2' })
      .reply(200, JSON.stringify(response));

    const callback = sinon.spy((err, res) => {
      expect(res.status).to.equal('ok');
      done();
    });

    index.uma_rs_protect(request, callback);
  });
});

describe('UMA RS check access', () => {
  it('UMA RS check access request through oxd-https', (done) => {
    const response = {
      status: 'ok',
      data: {
        access: 'granted'
      }
    };

    const request = {
      https_extension: true,
      host: 'http://gluu.local.org:8553',
      oxd_id: 'bcad760f-91ba-46e1-a020-05e4281d91b6',
      rpt: 'eyJ0 ... NiJ9.eyJ1c ... I6IjIifX0.DeWt4Qu ... ZXso',
      path: '/posts',
      http_method: 'GET',
      protection_access_token: 'b75434ff-f465-4b70-92e4-b7ba6b6c58f2'
    };

    nock(request.host)
      .post('/uma-rs-check-access', request, { headers: 'Authorization b75434ff-f465-4b70-92e4-b7ba6b6c58f2' })
      .reply(200, JSON.stringify(response));

    const callback = sinon.spy((err, res) => {
      expect(res.status).to.equal('ok');
      done();
    });

    index.uma_rs_check_access(request, callback);
  });

  it('UMA RS check access request through oxd-https, Resource is not Protected Error Response', (done) => {
    const response = {
      status: 'error',
      data: {
        error: 'invalid_request',
        error_description: 'Resource is not protected. Please protect your resource first with uma_rs_protect command.'
      }
    };

    const request = {
      https_extension: true,
      host: 'http://gluu.local.org:8553',
      oxd_id: 'bcad760f-91ba-46e1-a020-05e4281d91b6',
      rpt: 'eyJ0 ... NiJ9.eyJ1c ... I6IjIifX0.DeWt4Qu ... ZXso',
      path: '/posts',
      http_method: 'GET',
      protection_access_token: 'b75434ff-f465-4b70-92e4-b7ba6b6c58f2'
    };

    nock(request.host)
      .post('/uma-rs-check-access', request, { headers: 'Authorization b75434ff-f465-4b70-92e4-b7ba6b6c58f2' })
      .reply(200, JSON.stringify(response));

    const callback = sinon.spy((err, res) => {
      expect(res.status).to.equal('error');
      done();
    });

    index.uma_rs_check_access(request, callback);
  });

  it('UMA RS check access request through oxd-https, Access Denied with Ticket Response', (done) => {
    const response = {
      status: 'ok',
      data: {
        access: 'denied',
        'www-authenticate_header': 'UMA realm="example",as_uri="https://as.example.com",error="insufficient_scope",ticket="016f84e8-f9b9-11e0-bd6f-0021cc6004de"',
        ticket: '016f84e8-f9b9-11e0-bd6f-0021cc6004de'
      }
    };

    const request = {
      https_extension: true,
      host: 'http://gluu.local.org:8553',
      oxd_id: 'bcad760f-91ba-46e1-a020-05e4281d91b6',
      rpt: 'eyJ0 ... NiJ9.eyJ1c ... I6IjIifX0.DeWt4Qu ... ZXso',
      path: '/posts',
      http_method: 'GET',
      protection_access_token: 'b75434ff-f465-4b70-92e4-b7ba6b6c58f2'
    };

    nock(request.host)
      .post('/uma-rs-check-access', request, { headers: 'Authorization b75434ff-f465-4b70-92e4-b7ba6b6c58f2' })
      .reply(200, JSON.stringify(response));

    const callback = sinon.spy((err, res) => {
      expect(res.status).to.equal('ok');
      expect(res.data.ticket).to.be.a('string');
      done();
    });

    index.uma_rs_check_access(request, callback);
  });
});

describe('UMA rp get rpt', () => {
  it('UMA rp get rpt request through oxd-https', (done) => {
    const response = {
      status: 'ok',
      data: {
        access_token: 'SSJHBSUSSJHVhjsgvhsgvshgsv',
        token_type: 'Bearer',
        pct: 'c2F2ZWRjb25zZW50',
        upgraded: true
      }
    };

    const request = {
      https_extension: true,
      host: 'http://gluu.local.org:8553',
      oxd_id: 'bcad760f-91ba-46e1-a020-05e4281d91b6',
      ticket: '016f84e8-f9b9-11e0-bd6f-0021cc6004de',
      protection_access_token: 'b75434ff-f465-4b70-92e4-b7ba6b6c58f2'
    };

    nock(request.host)
      .post('/uma-rp-get-rpt', request, { headers: 'Authorization b75434ff-f465-4b70-92e4-b7ba6b6c58f2' })
      .reply(200, JSON.stringify(response));

    const callback = sinon.spy((err, res) => {
      expect(res.status).to.equal('ok');
      done();
    });

    index.uma_rp_get_rpt(request, callback);
  });

  it('UMA rp get rpt request through oxd-https, Needs Info Error Response', (done) => {
    const response = {
      status: 'error',
      data: {
        error: 'need_info',
        error_description: 'The authorization server needs additional information in order to determine whether the client is authorized to have these permissions.',
        details: {
          error: 'need_info',
          ticket: 'ZXJyb3JfZGV0YWlscw==',
          required_claims: [
            {
              claim_token_format: [
                'http://openid.net/specs/openid-connect-core-1_0.html#IDToken'
              ],
              claim_type: 'urn:oid:0.9.2342.19200300.100.1.3',
              friendly_name: 'email',
              issuer: ['https://example.com/idp'],
              name: 'email23423453ou453'
            }
          ],
          redirect_user: 'https://as.example.com/rqp_claims?id=2346576421'
        }
      }
    };

    const request = {
      https_extension: true,
      host: 'http://gluu.local.org:8553',
      oxd_id: 'bcad760f-91ba-46e1-a020-05e4281d91b6',
      ticket: '016f84e8-f9b9-11e0-bd6f-0021cc6004de',
      protection_access_token: 'b75434ff-f465-4b70-92e4-b7ba6b6c58f2'
    };

    nock(request.host)
      .post('/uma-rp-get-rpt', request, { headers: 'Authorization b75434ff-f465-4b70-92e4-b7ba6b6c58f2' })
      .reply(200, JSON.stringify(response));

    const callback = sinon.spy((err, res) => {
      expect(res.status).to.equal('error');
      expect(res.data.details.error).to.equal('need_info');
      done();
    });

    index.uma_rp_get_rpt(request, callback);
  });

  it('UMA rp get rpt request through oxd-https, Invalid Ticket Error Response', (done) => {
    const response = {
      status: 'error',
      data: {
        error: 'invalid_ticket',
        error_description: 'Ticket is not valid (outdated or not present on Authorization Server).'
      }
    };

    const request = {
      https_extension: true,
      host: 'http://gluu.local.org:8553',
      oxd_id: 'bcad760f-91ba-46e1-a020-05e4281d91b6',
      ticket: '016f84e8-f9b9-11e0-bd6f-0021cc6004de',
      protection_access_token: 'b75434ff-f465-4b70-92e4-b7ba6b6c58f2'
    };

    nock(request.host)
      .post('/uma-rp-get-rpt', request, { headers: 'Authorization b75434ff-f465-4b70-92e4-b7ba6b6c58f2' })
      .reply(200, JSON.stringify(response));

    const callback = sinon.spy((err, res) => {
      expect(res.status).to.equal('error');
      expect(res.data.error).to.equal('invalid_ticket');
      done();
    });

    index.uma_rp_get_rpt(request, callback);
  });
});

describe('UMA rp get claims gathering url', () => {
  it('UMA rp get claims gathering url request through oxd-https', (done) => {
    const response = {
      status: 'ok',
      data: {
        url: 'https://as.com/restv1/uma/gather_claims?client_id=@!1736.179E.AA60.16B2!0001!8F7C.B9AB!0008!AB77!1A2B&ticket=4678a107-e124-416c-af79-7807f3c31457&claims_redirect_uri=https://client.example.com/cb&state=af0ifjsldkj',
        state: 'af0ifjsldkj'
      }
    };

    const request = {
      https_extension: true,
      host: 'http://gluu.local.org:8553',
      oxd_id: 'bcad760f-91ba-46e1-a020-05e4281d91b6',
      ticket: '016f84e8-f9b9-11e0-bd6f-0021cc6004de',
      claims_redirect_uri: 'https://client.example.com/cb',
      protection_access_token: 'b75434ff-f465-4b70-92e4-b7ba6b6c58f2'
    };

    nock(request.host)
      .post('/uma-rp-get-claims-gathering-url', request, { headers: 'Authorization b75434ff-f465-4b70-92e4-b7ba6b6c58f2' })
      .reply(200, JSON.stringify(response));

    const callback = sinon.spy((err, res) => {
      expect(res.status).to.equal('ok');
      done();
    });

    index.uma_rp_get_claims_gathering_url(request, callback);
  });
});

describe('Remove site', () => {
  it('Remove site request through oxd-https', (done) => {
    const response = {
      status: 'ok'
    };

    const request = {
      https_extension: true,
      host: 'http://gluu.local.org:8553',
      oxd_id: '6F9619FF-8B86-D011-B42D-00CF4FC964FF',
      protection_access_token: 'b75434ff-f465-4b70-92e4-b7ba6b6c58f2',
    };

    nock(request.host)
      .post('/remove-site', request, { headers: 'Authorization b75434ff-f465-4b70-92e4-b7ba6b6c58f2' })
      .reply(200, JSON.stringify(response));

    const callback = sinon.spy((err, res) => {
      expect(res.status).to.equal('ok');
      done();
    });

    index.remove_site(request, callback);
  });
});


describe('Introspect Access Token', () => {
  it('Introspect Access Token request through oxd-https', (done) => {
    const response = {
		status: 'ok',
		data: {
			active: true,
			client_id: 'l238j323ds-23ij4',
			username: 'John Black',
			scopes: ['read', 'write'],
			token_type:'bearer',
			sub: 'jblack',
			aud: 'l238j323ds-23ij4',
			iss: 'https://as.gluu.org/',
			exp: 1419356238,
			iat: 1419350238,
			acr_values: ['basic','duo'],
			extension_field: 'twenty-seven'
			}
		};

    const request = {
      https_extension: true,
      host: 'http://gluu.local.org:8553',
      oxd_id: '6F9619FF-8B86-D011-B42D-00CF4FC964FF',
      access_token: 'b75434ff-f465-4b70-92e4-b7ba6b6c58f2',
    };

    nock(request.host)
      .post('/introspect-access-token', request)
      .reply(200, JSON.stringify(response));

    const callback = sinon.spy((err, res) => {
      expect(res.status).to.equal('ok');
      done();
    });

    index.introspect_access_token(request, callback);
  });
});


describe('Introspect RPT', () => {
  it('Introspect RPT request through oxd-https', (done) => {
    const response = {
		status:'ok',
		data:{
			active:true,
			exp:1256953732,
			iat:1256912345,
			permissions:[
			{
				resource_id:'112210f47de98100',
				resource_scopes:[
					'view',
                    'http://photoz.example.com/dev/actions/print'
                ],
                exp:1256953732
            }]
		}
	};

    const request = {
      https_extension: true,
      host: 'http://gluu.local.org:8553',
      oxd_id: '6F9619FF-8B86-D011-B42D-00CF4FC964FF',
      rpt: 'b75434ff-f465-4b70-92e4-b7ba6b6c58f2',
    };

    nock(request.host)
      .post('/introspect-rpt', request)
      .reply(200, JSON.stringify(response));

    const callback = sinon.spy((err, res) => {
      expect(res.status).to.equal('ok');
      done();
    });

    index.introspect_rpt(request, callback);
  });
});