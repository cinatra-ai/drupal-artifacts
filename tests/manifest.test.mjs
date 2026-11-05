// The manifest of record of @cinatra-ai/drupal-artifacts: the one object type
// this pack declares, the Drupal node pointer. It imports only node: modules.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const root = new URL("../", import.meta.url);
const read = (path) => readFileSync(new URL(path, root), "utf8");
const pkg = JSON.parse(read("package.json"));
const POINTER = "@cinatra-ai/drupal-artifacts:node-pointer";
const RETIRED = "@cinatra-ai/drupal:node";
// The retired id as a whole id: a longer id that starts with it, such as
// `@cinatra-ai/drupal:node-pointer`, is another id and does not count.
const RETIRED_ID = /@cinatra-ai\/drupal:node(?![A-Za-z0-9_-])/;

test("declares exactly one object type, the Drupal node pointer in this pack's own namespace", () => {
  const claims = pkg.cinatra.artifact.objectTypes;
  assert.equal(claims.length, 1);
  assert.equal(claims[0].type, POINTER);
  assert.equal(claims[0].type.slice(0, claims[0].type.lastIndexOf(":")), pkg.name);
});

test("names the retired pointer id nowhere in the manifest, the typed mirror or the README", () => {
  for (const path of ["package.json", "src/index.ts", "README.md"]) {
    assert.equal(RETIRED_ID.test(read(path)), false, `${path} names ${RETIRED}`);
  }
});

test("the claim stays a dedicated, never-pinnable external pointer", () => {
  const [claim] = pkg.cinatra.artifact.objectTypes;
  assert.equal(claim.claim, "dedicated");
  assert.deepEqual(claim.dispositions, {
    projection: "artifact-safe",
    pinnable: false,
    snapshotPolicy: "none",
    sensitivity: "normal",
    mutability: "external",
  });
});

test("the claim carries the pointer row schema", () => {
  const { schema } = pkg.cinatra.artifact.objectTypes[0];
  assert.equal(schema.type, "object");
  assert.deepEqual(schema.required, ["artifactType", "originKind", "mime", "connectorRef"]);
  assert.deepEqual(schema.properties.artifactType, { const: "connector-ref" });
  assert.deepEqual(schema.properties.originKind, { const: "external_link" });
  const ref = schema.properties.connectorRef;
  assert.equal(ref.type, "object");
  assert.deepEqual(ref.required, ["url", "connectorId", "externalId", "state"]);
  assert.equal(ref.additionalProperties, false);
  assert.deepEqual(ref.properties.state, { enum: ["linked", "stale", "dangling"] });
});

test("ships no renderer, depends on no extension and accepts only the text/html pointer form", () => {
  assert.equal(pkg.cinatra.kind, "artifact");
  assert.equal(pkg.cinatra.artifact.ui, undefined);
  assert.deepEqual(pkg.cinatra.dependencies, []);
  assert.deepEqual(pkg.cinatra.artifact.accepts, { connectorRef: { resolvedMimeTypes: ["text/html"] } });
  assert.match(read("src/index.ts"), /connectorRef: \{\s*resolvedMimeTypes: \["text\/html"\],\s*\}/);
});
