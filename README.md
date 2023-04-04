# next-msal

An example repository to demonstrate how to integrate `azure-ac-b2c` using `msal-node` in `next.js`.
Since `next-auth` has a drawback that some use cases of `azure-ad-b2c` such as password reset are not supported,
this example aims to handle some `azure-ad-b2c`-only features but as familiar as possible for `next-auth` users.

> NOTE: this repository isn't a library! Customize it for your own use.

### Supported features (demonstrations)

- custom error handler
- server-side sessions
- client-side sessions
- silent token acquisition
