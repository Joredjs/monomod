# TODO

[X] Invert dependency gateway->module
[X] Dynamic Routing - gateway
[X] Service Discovery - gateway
[X] Authentication - gateway
[X] Authorization - gateway (route privacy vs token role)
[X] Roles - gateway (route privacy)
[X] Encryption
[X] Error Handling - main domain (Result - Error)
[X] Move nx library from libs/core/main to libs/core
[X] Move nx library from libs/core/gateway to libs/gateway
[X] Quitar de core/main lo que pueda depender de la creación de modulos
[X] When the function is not configured at port, response error
[ ] Remove all the express dependencies from the servers
[ ] Verify where should be the headers info
[ ] Update NX version (19.*)
[ ] Implement the unit tests (jest)
[ ] Implement rate limit  https://kinsta.com/knowledgebase/api-rate-limit/
[ ] Implement Docker
[ ] Translate everything to English
[ ] Abstract the transport layer (http,gRPC,etc)
[ ] Implement asynchronous requests
[ ] Document Error Normalization: How errors from different modules are normalized into a consistent format. Error Logging: How and where errors are logged. Error Responses: How error responses are formatted and returned to clients.
[ ] Put explicit the gateway steps (authorization, Param validations , ...)
[ ] Generate scripts to add new modules and register them in the gateway
[ ] Make this project installable not only forkeable
[ ] Release the first version
[ ] Improve the dependency in the modules from TDomainGroup and the headers prefix from domain/keys/headers.ts
- pagination (prev,next,last,first) (?page=1&size=100)
- Filtering (?xxx=gt:10,lt:20&yyy=match:asd&zzz=eq:algo)
- Ordering (?sort=xxx:asc,yyy:desc)
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
- payload compression
- conection pool
- code on demand
- stateless
- Versioning
- monitoring
