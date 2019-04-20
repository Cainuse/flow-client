/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
function generateJWT() {
  // Header
  var oHeader = { alg: "HS256", typ: "JWT" };
  // Payload
  var oPayload = {};

  var tNow = KJUR.jws.IntDate.get("now");
  var tEnd = KJUR.jws.IntDate.get("now + 1day");
  oPayload.iss = "projectAcession2019FlowProject";
  oPayload.sub = "643c8dea-a7d4-4b76-a9cb-dc2539152686";
  oPayload.nbf = tNow;
  oPayload.iat = tNow;
  oPayload.exp = tEnd;
  oPayload.jti = "55cc89cf-dd5d-4958-beb8-968e7101ed17";
  oPayload.aud = "b12b5e97-08c5-4dd5-942b-648e9db2cf98";
  // Sign JWT, password=616161
  var sHeader = JSON.stringify(oHeader);
  var sPayload = JSON.stringify(oPayload);
  return KJUR.jws.JWS.sign(
    "HS256",
    sHeader,
    sPayload,
    "42342789-e592-498a-9113-001b4c130336"
  );
}
