import type { SemanticArtifactManifest } from "@cinatra-ai/sdk-extensions";

// `@cinatra-ai/drupal-artifacts` — the Drupal work-product PACK (epic
// cinatra#1448, built for #1465). It DECLARES the external-pointer object type
// in its own `@cinatra-ai/drupal-artifacts` namespace on the merged objects
// substrate (mutability #1449/#1770, connectorRef external-pointer lifecycle
// #1451/#1771, plural naming #1453/#1769):
//
//   - node-pointer [external] — a connector-owned POINTER to a Drupal node whose
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
// The pack ships no renderer. The approved design (Artifact review §XI.7,
// Lifecycle cards §XIII.8) draws the pointer through one page renderer,
// `@cinatra-ai/website-artifacts:page-diff`; this pack writes no renderer of
// its own (cinatra#4311, cinatra#4366).
//
// The claim (kind, per-claim dispositions incl. the `external` mutability class,
// and the inline row JSON Schema it carries as its schema-source) is the
// manifest of record in `package.json` `cinatra.artifact.objectTypes`; the
// object-registry bridge reads it there. The type id is in this package's own
// namespace, so the bridge registers the TYPE from this claim under this
// package, with the inline JSON Schema as its row validator. The connector side
// (the concrete `ConnectorRefFacade`: probe + on-demand content resolution, and
// the pointer-row sync) is a companion slice outside this pack. The row schema
// requires `connectorRef.connectorId` and `connectorRef.externalId`, but this
// claim declares no identity key over them, so how a re-sync finds the same
// pointer row is not settled here.
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
