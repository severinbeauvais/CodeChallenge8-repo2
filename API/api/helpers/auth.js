"use strict";

var jwt             = require("jsonwebtoken");
var jwksClient    = require('jwks-rsa');

var ISSUER          = process.env.SSO_ISSUER || "http://localhost:8888/auth/realms/master";
var JWKSURI         = process.env.SSO_JWKSURI || "http://localhost:8888/auth/realms/master/protocol/openid-connect/certs";
var winston         = require('winston');
var defaultLog      = winston.loggers.get('default');

var User = require('./models/user')

exports.verifyToken = function(req, authOrSecDef, token, callback) {
  defaultLog.info("verifying token", token);
  // scopes/roles defined for the current endpoint
  var currentScopes = req.swagger.operation["x-security-scopes"];
  function sendError() {
    return req.res.status(403).json({ message: "Error: Access Denied" });
  }

  // validate the 'Authorization' header. it should have the following format:
  //'Bearer tokenString'
  if (token && token.indexOf("Bearer ") == 0) {
    var tokenString = token.split(" ")[1];

    // If Keycloak is enabled, get the JWKSURI and process accordingly.  Else
    // use local environment JWT configuration.
    defaultLog.info("Keycloak Enabled, remote JWT verification.");
    const client = jwksClient({
      strictSsl: true, // Default value
      jwksUri: JWKSURI
    });

    const decodedJWT = jwt.decode(tokenString, { complete: true });

    console.log(decodedJWT);
    User.findOneAndUpdate(
      {
        email: decodedJWT.payload.email
      },
      {
        username: decodedJWT.payload.preferred_username,
        firstName: decodedJWT.payload.given_name,
        lastName: decodedJWT.payload.family_name,
        email: decodedJWT.payload.email
      },
      {
        upsert: true,
        new: true
      },
      function (err) {
        if(err) {
          console.log('user.put err: ', err);
        }
      });

    const kid = decodedJWT.header.kid;

    client.getSigningKey(kid, (err, key) => {
      if (err) {
        defaultLog.error("Signing Key Error:", err);
        callback(sendError());
      } else {
        const signingKey = key.publicKey || key.rsaPublicKey;

        _verifySecret(currentScopes, tokenString, signingKey, req, callback, sendError);
      }
    });
  } else {
    defaultLog.error("Token didn't have a bearer.");
    return callback(sendError());
  }
};

function _verifySecret (currentScopes, tokenString, secret, req, callback, sendError) {
  jwt.verify(tokenString, secret, function(
    verificationError,
    decodedToken
  ) {
    // defaultLog.info("verificationError:", verificationError);
    // defaultLog.info("decodedToken:", decodedToken);

    // check if the JWT was verified correctly
    if (verificationError == null &&
        Array.isArray(currentScopes) &&
        decodedToken &&
        decodedToken.realm_access.roles
    ) {
      defaultLog.info("JWT decoded:", decodedToken);

      // check if the role is valid for this endpoint
      var roleMatch = currentScopes.some(r=> decodedToken.realm_access.roles.indexOf(r) >= 0)
      defaultLog.info("currentScopes", currentScopes);
      defaultLog.info("decodedToken.realm_access.roles", decodedToken.realm_access.roles);
      defaultLog.info("role match", roleMatch);

      // check if the dissuer matches
      var issuerMatch = decodedToken.iss == ISSUER;
      defaultLog.info("decodedToken.iss", decodedToken.iss);
      defaultLog.info("ISSUER", ISSUER);
      defaultLog.info("issuerMatch", issuerMatch);

      if (roleMatch && issuerMatch) {
        // add the token to the request so that we can access it in the endpoint code if necessary
        req.swagger.params.auth_payload = decodedToken;
        defaultLog.info("JWT Verified.");
        return callback(null);
      } else {
        defaultLog.info("JWT Role/Issuer mismatch.");
        return callback(sendError());
      }
    } else {
      // return the error in the callback if the JWT was not verified
      defaultLog.info("JWT Verification Err:", verificationError);
      return callback(sendError());
    }
  });
}
