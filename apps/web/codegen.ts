import type { CodegenConfig } from "@graphql-codegen/cli";

/**
 * Lee el SDL versionado del backend (Opción A: archivo) y genera tipos + HOOKS
 * de TanStack Query (useMeQuery, useLoginMutation, ...) que ejecutan vía el
 * fetcher de graphql-request (con cookies httpOnly).
 */
const config: CodegenConfig = {
  schema: "../api/src/schema.gql",
  documents: ["src/**/*.graphql"],
  ignoreNoDocuments: true,
  generates: {
    "./src/gql/index.ts": {
      // typescript-operations (standalone) ya emite sus helpers y los input types;
      // omitimos el plugin "typescript" para no duplicar los input types.
      plugins: ["typescript-operations", "typescript-react-query"],
      config: {
        reactQueryVersion: 5,
        fetcher: {
          func: "@/lib/graphql-fetcher#fetcher",
          isReactHook: false,
        },
        exposeQueryKeys: true,
        exposeFetcher: true,
        scalars: { DateTime: "string" },
      },
    },
  },
};

export default config;
