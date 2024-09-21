# TODO

[ ] Quitar de core/main lo que pueda depender de la creación de modulos
[ ] Translate everything to English
[ ] Verify where should be the headers info
[ ] Invert dependency gateway->module
[ ] When the function is not configured at port, response error
[ ] Update NX version (19.*)
[ ] Implement the unit tests (jest)
[ ] Implement rate limit  https://kinsta.com/knowledgebase/api-rate-limit/
[ ] Implement Docker
[x] Dynamic Routing - gateway
[x] Service Discovery - gateway
[x] Authentication - gateway
[x] Authorization - gateway (route privacy vs token role)
[x] Roles - gateway (route privacy)
[x] Encryption
[x] Error Handling - main domain (Result - Error)
[ ] Move nx library from libs/core/main to libs/core
[ ] Move nx library from libs/core/gateway to libs/gateway
- MFA
- Keys management
- Vulnerabilities scan
- firewall
- segregate networks
- Oauth2
- Allow / Deny list
- Protocol Conversion
- Circuit break
- Logging (async)
- Cache
- pagination (prev,next,last,first) (?page=1&size=100)
- Filtering (?xxx=gt:10,lt:20&yyy=match:asd&zzz=eq:algo)
- Ordering (?sort=xxx:asc,yyy:desc)
- payload compression
- conection pool
- code on demand
- stateless
- Using verbs
- Versioning
- monitoring
