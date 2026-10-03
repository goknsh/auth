---
"@yielded/auth-persistence-convex": minor
"@yielded/auth": patch
---

Add Convex persistence for password registration, sign-in, proof-backed recovery, sessions, and OAuth grants. Define session issuance time as authority time sampled during preparation while retaining fresh expiry checks at the conditional commit.
