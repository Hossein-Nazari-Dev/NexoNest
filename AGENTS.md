# Development instructions

Act as a critical technical and architecture partner. Challenge weak assumptions,
state missing facts, and prefer simple solutions with clear trade-offs. Keep code,
comments and documentation in clear English. Preserve existing unrelated changes.

## Read first

Read `PROJECT_GUIDE.md` before changing this repository. It is the canonical
handoff document for developers and LLMs. Verify its claims against current code.

## Documentation is part of the change

- Every change to behavior, content, architecture, configuration, dependencies,
  assets, integrations, or operational procedures must update the affected parts
  of `PROJECT_GUIDE.md` in the same change.
- Explain the resulting behavior, ownership, contracts, failure cases, and the
  reason for a decision. Label inferred reasons; never invent historical intent.
- Update `reviewed` after checking the affected sections. Keep historical tests
  and live deployment claims separate from current verification.
- Run `node scripts/update-project-guide.cjs --write` to refresh the generated
  inventory, project map and source fingerprint after updating the prose.
- Run `node scripts/update-project-guide.cjs --check` before declaring the work
  complete. A passing check proves inventory freshness, not prose correctness.
- Keep this guide self-contained, valid in Obsidian without plugins, and usable
  outside the vault. Preserve headings and relative links where possible.
- Do not put credentials, subscriber records, license tokens or private keys in
  documentation. Document configuration names and locations instead.

## Operational boundaries

Documentation work does not authorize deployment, campaign execution, email
delivery, license administration, or exporting recipient data. Real sends require
explicit authorization for that action and scope. Test newsletter/license flows
with mocks unless live tests are expressly authorized.

The current project pages use `js/project-page.js`; the old JSON renderer is not
their source of truth. Preserve page URLs, project IDs and serialized contracts
unless an explicit migration is part of the task.
