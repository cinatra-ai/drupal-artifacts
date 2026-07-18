import type { SemanticArtifactManifest } from "@cinatra-ai/sdk-extensions";

// `@cinatra-ai/drupal-artifacts` — the Drupal work-product PACK (epic
// cinatra#1448, built for #1465). It CLAIMS the external-pointer object type
// under the `@cinatra-ai/drupal` namespace on the merged objects substrate
// (mutability #1449/#1770, connectorRef external-pointer lifecycle #1451/#1771,
// plural naming #1453/#1769):
//
//   - drupal:node [external] — a connector-owned POINTER to a Drupal node whose
//     canonical content lives in Drupal, NOT a cinatra-authored blob. Its
//     delivery form is `representation.form = "connectorRef"`; the pointer row
//     stores BARE identity only (url + connector/node ids + light title/excerpt
//     + reference state), and heavy fields (the rendered node body) are read on
//     demand through the connector facade — never persisted into the row.
//     Reference states move linked -> stale -> dangling by connector
//     sync/verification ONLY (an upstream delete flags `dangling`, never
//     silently tombstones the row). `external` mutability forces `pinnable:false`
//     — you pin the immutable SNAPSHOT record (a NEW, independent record-class
//     artifact captured through the facade), never the live pointer. There is
//     NO matcher: an external pointer is materialized by connector sync, never
//     classified from an uploaded file.
//
// Later design notes (NOT claimed here): drupal media / taxonomy types.
//
// The claim (kind, per-claim dispositions incl. the `external` mutability class,
// and the inline row JSON Schema it carries as its schema-source) is the
// manifest of record in `package.json` `cinatra.artifact.objectTypes`; the
// object-registry bridge reads it there. The `@cinatra-ai/drupal:node` TYPE is
// registered cross-namespace by its owning host/connector registrar (exactly one
// runtime registrar per type — the pack's inline JSON Schema is activation
// evidence, not a second registrar); the `drupal-mcp-connector` provides the
// concrete `ConnectorRefFacade` (probe + on-demand content resolution) and
// writes/keeps the pointer rows in sync, keyed to (instance, node) via
// `connectorRef.connectorId` + `connectorRef.externalId`.
//
// This typed export mirrors only the DESCRIPTOR half (representation forms) —
// the SDK `SemanticArtifactManifest` contract the bridge type-checks the
// descriptor against; the `objectTypes` claim block is validated host-side by
// the objects manifest schema.
//
// A Drupal node's on-demand resolved content is its rendered body: text/html.
export const drupalArtifactsManifest: SemanticArtifactManifest = {
  accepts: {
    connectorRef: {
      resolvedMimeTypes: ["text/html"],
    },
  },
};
