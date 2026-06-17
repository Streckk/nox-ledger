import type { Variables } from "graphql-request";
import { gqlClient } from "./graphql-client";

/**
 * Fetcher que usan los hooks generados por codegen (typescript-react-query).
 * Reutiliza el GraphQLClient (graphql-request) → envía las cookies httpOnly.
 *
 * El documento llega como `TypedDocumentString` (tiene `toString()`); lo
 * convertimos a string para graphql-request.
 */
export function fetcher<TData, TVariables extends Variables>(
  query: string | { toString(): string },
  variables?: TVariables,
  headers?: HeadersInit,
) {
  return (): Promise<TData> =>
    gqlClient.request<TData>(query.toString(), variables, headers);
}
