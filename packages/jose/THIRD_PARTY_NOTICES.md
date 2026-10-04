# Third-party notices

Selected public contract tests and the P-256 fixture in `test/` are adapted from
[panva/jose](https://github.com/panva/jose/tree/505a55b8f73536082367b2614cb77e927ba96ec1),
v6.2.12, commit `505a55b8f73536082367b2614cb77e927ba96ec1` (Filip Skokan).
The source cases are `test/jws/compact.verify.test.ts`, `test/jws/crit.test.ts`,
`test/jwt/verify.test.ts`, `test/jwks/local.test.ts`, `test/jwks/remote.test.ts`,
and `test/jwe/compact.encrypt.test.ts`. They inform `test/protocols.test.ts`,
`test/claims.test.ts`, `test/jwks.test.ts`, and `test/fixtures.ts`; only selected
behavior is adapted to Effect, with independent interoperation against that release.
The source implementation informs claim validation, protected-header policy, and
key selection in `src/Jwt.ts`, `src/Jws.ts`, `src/Jwk.ts`, `src/Jwks.ts`, and
`src/Jwe.ts`; these implementations are written for Effect services and Schema.
No panva/jose runtime implementation is bundled or required.

The wire formats follow RFC 7515, RFC 7516, RFC 7517, RFC 7518, RFC 7519,
and RFC 8037; policy follows RFC 8725. No RFC code or example vectors are copied.
Cryptographic primitives are supplied by `@yielded/crypto`, which ships its own notices.

## panva/jose — MIT

The MIT License (MIT)

Copyright (c) 2018 Filip Skokan

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
