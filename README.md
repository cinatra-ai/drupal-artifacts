# Drupal Artifacts

The Drupal artifacts pack for Cinatra. It makes a Drupal node an addressable artifact in the library as an **external pointer** — the canonical node stays in Drupal, and the library row holds only a deeplink plus lightweight identity (node id, title, excerpt, and a health state). The heavy fields (the rendered node body) are read on demand through the Drupal connector, never copied into the row.

Install this pack via the Cinatra marketplace. Once installed (with the Drupal MCP connector), pointer rows are materialized and kept in sync by the connector: a node reached through the connector links as `linked`; when it changes upstream it becomes `stale`; when it is deleted upstream it becomes `dangling` (the row persists so history and any captured snapshots survive, and a later re-sync can re-link it). Because the pointer references live third-party content, it is **not pinnable** and is never context-selectable — capture a **snapshot** instead, which materializes the node's resolved content into a new, independent record artifact you can pin and attach. For local development, run `node extension-kind-gate.mjs --package-root .` at the repo root and confirm zero errors before submitting to the marketplace.

## Works with

- Drupal MCP connector (`@cinatra-ai/drupal-mcp-connector`) — registers the node type, provides the content facade, and syncs pointer state
- Drupal Content Editor agent

## Capabilities

- Keep a Drupal node as an addressable, deeplinked artifact in the library without copying its content out of Drupal
- Read the node's current body on demand through the connector rather than a stale local copy
- See at a glance whether a referenced node is in sync (`linked`), has drifted (`stale`), or was removed upstream (`dangling`)
- Capture a snapshot of a node's resolved content as a new, independent record artifact — pinnable and durable even after the pointer is deleted
- Attach a Drupal node pointer as reference context when briefing an agent
