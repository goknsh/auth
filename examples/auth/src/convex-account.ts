import { Auth, Password, Schema as AuthSchema, Sessions } from "@yielded/auth";
import {
  ActionContext,
  DocumentFunctions,
  DocumentStore,
  Transaction,
  Subject,
  identityPartitions,
  PasswordPersistence,
  ProofPersistence,
  makePasswordRegistration,
  makeSessions,
} from "@yielded/auth-persistence-convex";
import { Effect, Layer, Schema } from "effect";

export const Claims = Schema.Struct({ displayName: Schema.String });

export const accounts = Auth.make("convex/accounts", {
  claims: Claims,
  defaultStrategy: "password",
  strategies: {
    password: Password.make({ registration: Claims, reset: { secret: { _tag: "Token" } } }),
  },
});

const password = accounts.strategies.password;

export const registration = makePasswordRegistration(
  password.RegistrationAuthority,
  password.persistence.moduleId,
);

export const requirement = Sessions.AuthenticationRequirement.make({
  alternatives: [
    {
      factors: ["knowledge"],
      minimumCredentials: 1,
      userVerified: false,
      phishingResistant: false,
    },
  ],
  maximumAgeMillis: 300_000,
});

export const recoveryRequirement = Sessions.AuthenticationRequirement.make({
  ...requirement,
  alternatives: [
    {
      factors: ["possession"],
      minimumCredentials: 1,
      userVerified: false,
      phishingResistant: false,
    },
  ],
});

const ProvisioningLive = Layer.succeed(registration.Provisioning, {
  create: Effect.fn("Accounts.create")(function* ({ registration }) {
    const tx = yield* Transaction;
    const subjectId = AuthSchema.SubjectId.make(yield* tx.id);

    yield* tx.put(Claims, "accounts/profile", subjectId, registration);
    yield* tx.put(Subject, identityPartitions.subjects, subjectId, {
      subjectId,
      active: true,
      securityRevision: Sessions.SecurityRevision.make(yield* tx.id),
      requirement,
      // This application's change/reset policies independently verify the corresponding factor.
      actionRequirement: {
        ...requirement,
        alternatives: [...requirement.alternatives, ...recoveryRequirement.alternatives],
      },
    });

    return subjectId;
  }),
});

const ClaimsLive = Layer.effect(
  password.SessionClaims,
  Effect.gen(function* () {
    const store = yield* DocumentStore;

    return {
      resolve: Effect.fn("Accounts.claims")(function* ({ subjectId }) {
        return yield* store
          .transaction(
            Effect.gen(function* () {
              const tx = yield* Transaction;
              const profile = yield* tx.get(Claims, "accounts/profile", subjectId);

              if (profile === undefined) return yield* Password.PasswordUnavailable.make({});

              return profile;
            }),
          )
          .pipe(Effect.mapError(() => Password.PasswordUnavailable.make({})));
      }),
    };
  }),
);

/** Build per action. The caller provides hashing, delivery, hooks and application action policy. */
export const makeAccountPersistence = (
  ctx: ActionContext["Service"],
  functions: DocumentFunctions["Service"],
) => {
  const documents = DocumentStore.layer(accounts.namespace).pipe(
    Layer.provide([Layer.succeed(ActionContext, ctx), Layer.succeed(DocumentFunctions, functions)]),
  );

  return Layer.mergeAll(
    PasswordPersistence.layer,
    ProofPersistence.layer,
    makeSessions(Claims, accounts.sessions),
    registration.layer.pipe(Layer.provide(ProvisioningLive)),
    ClaimsLive,
  ).pipe(Layer.provideMerge(documents));
};

export const sessionPolicy = Sessions.stateful().policy(accounts.sessions.moduleId);
