import { GraphQLClient } from "graphql-request";

const endpoint =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/graphql";

/**
 * Cliente GraphQL del frontend. `credentials: "include"` hace que el navegador
 * envíe y reciba las cookies httpOnly de autenticación del backend.
 *
 * Uso: `gqlClient.request(MiOperacion, variables)` — queda tipado automáticamente
 * gracias a los TypedDocumentNode generados por codegen en `@/gql`.
 */
export const gqlClient = new GraphQLClient(endpoint, {
  credentials: "include",
});
