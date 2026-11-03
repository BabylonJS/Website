# CodeQL fork pull request migration

## Status

| Milestone | Status | Evidence required before advancing |
| --- | --- | --- |
| Workflow prepared | **Prepared locally** | `.github/workflows/codeql.yml` passes independent YAML and actionlint validation. |
| Fork PR successfully scanned | **Not verified** | An authorized benign fork PR must produce all three successful CodeQL checks against the pull request merge commit. |
| Merge gate verified | **Not verified** | A repository owner must add the observed checks to branch protection or a ruleset, then prove a failing CodeQL check blocks merge and a successful rerun satisfies the gate. |

No repository setting was changed, no workflow was run or approved, no fork or
pull request was created, and no merge was performed as part of this
preparation.

## Repository findings

Read-only inspection on 2026-11-03 found:

- The repository is public and the default branch is `master`.
- `master` is the only protected branch and the only maintained branch that
  currently needs push and pull request scanning. No release branch or merge
  queue is configured. The workflow includes `merge_group` proactively so a
  future queue does not bypass scanning.
- Managed CodeQL default setup is enabled for C# and
  JavaScript/TypeScript, with the default query suite, remote threat model,
  weekly schedule, and standard GitHub-hosted runner.
- The latest managed analyses covered `master` only. Recent fork PR merge
  commits had the Azure Pipelines checks but no CodeQL check, corroborating the
  documented default-setup exclusion for fork pull requests.
- The repository has one C# source file,
  `static/Scenes/BoxMonger/ImageProxy.ashx.cs`, and no checked-in `.csproj`,
  `.sln`, `.slnx`, `nuget.config`, `packages.config`, `global.json`,
  `project.assets.json`, `Directory.Build.props`, `Directory.Build.targets`, or
  `.cshtml` files.
- GitHub's language inventory reports JavaScript (46,460,386 bytes),
  TypeScript (781,486 bytes), C# (1,349 bytes), ASP.NET (96 bytes), plus HTML,
  CSS, Nunjucks, Roff, and HLSL. Existing managed analyses contain
  `javascript-typescript` and `csharp`; they do not contain `actions`.
- The repository had no checked-in GitHub Actions workflow or local action.
  This migration adds a workflow, so GitHub Actions workflow analysis is
  included.
- Branch protection currently requires only `Website - YAML`, requires the
  branch to be up to date, one approving review, and conversation resolution.
  Existing managed CodeQL checks are not required, so there is no CodeQL
  required-check name to replace.
- The active repository ruleset only prevents deletion/non-fast-forward changes
  and requests Copilot review on the default branch. It does not configure a
  code scanning gate.
- GitHub Actions permits all actions. SHA pinning is not required by repository
  policy. The default workflow token is write-capable and can approve pull
  request reviews, but this workflow overrides that broad default at the job
  level with only `contents: read` and `security-events: write`.
- Outside-collaborator approval is `first_time_contributors`. Keep this
  requirement. Approving a pending fork run can release every workflow attached
  to that commit, not only CodeQL, so review the complete pending workflow list
  before approval.
- Dependabot pull requests use branches in `BabylonJS/Website`, not forks.
  They should run this workflow without the outside-contributor approval path.

Any setting not listed above should be treated as unknown until a repository
owner verifies it in the current GitHub UI.

## Prepared workflow safety properties

The workflow uses the normal `pull_request` event. It never uses
`pull_request_target`, never overrides the checkout ref, and therefore scans the
GitHub-generated pull request merge commit rather than running in a privileged
base-repository context.

The JavaScript/TypeScript and GitHub Actions jobs perform static extraction from
a normal checkout. The C# job uses a non-cone sparse checkout containing only
`**/*.cs`, followed by a fail-closed boundary check. Fork-controlled project and
dependency metadata, binaries, Razor views, and build scripts are not present
when CodeQL starts. This is necessary because GitHub documents that C#
`build-mode: none` normally restores dependencies and generates source files.
The current C# extractor exposes no supported option that disables those
operations. Source-only checkout preserves direct static coverage of the
repository's existing `.cs` file without making submitted project metadata
available to the extractor.

The workflow does not install dependencies, run autobuild, invoke MSBuild or
`dotnet`, run repository scripts, run tests, use a PAT, request an OIDC token,
use secrets, use an internal runner, or persist checkout credentials.
Dependency caching is explicitly disabled. Query configuration is inline in the
trusted default-branch workflow and uses GitHub's built-in
`security-extended` suite; it does not load fork-controlled configuration,
custom query packs, model packs, or model extensions.

The expected check names are:

- `CodeQL / JavaScript-TypeScript`
- `CodeQL / GitHub-Actions`
- `CodeQL / CSharp-source-only`

Confirm these exact names from a real run before using them in protection
rules. GitHub UI naming can change, and a required check must match the emitted
check name exactly.

## Action provenance

Both actions are official GitHub-owned repositories and are pinned to immutable
full commit SHAs:

| Action | Release | Commit |
| --- | --- | --- |
| `actions/checkout` | `v7.0.1` | `3d3c42e5aac5ba805825da76410c181273ba90b1` |
| `github/codeql-action` | `v4.39.2` | `1fc58d04a4d4374f921bdac573c3811c240f9c26` |

The release tags resolved to those commits through the GitHub API, and both
commits have valid GitHub-verified signatures. The reviewed
`actions/checkout` metadata defaults to the event ref/SHA and supports
`persist-credentials: false`; the prepared workflow does not set `ref`,
submodules, LFS, a custom token, an SSH key, or the unsafe fork-checkout option.
The reviewed CodeQL init metadata supports one language per matrix job,
`build-mode: none`, inline trusted configuration, and disabled dependency
caching.

The `github/codeql-action` release is marked immutable by GitHub. The
`actions/checkout` release record is not marked immutable, which makes the full
commit SHA pin essential; the workflow does not trust the movable tag.

Before merging a future update to either pin, repeat the release/tag resolution
and metadata review. Do not replace the SHAs with floating major tags.

## Local validation evidence

Validation was intentionally limited to workflow structure and source
isolation. No repository dependency install, build, test, application script,
CodeQL extraction, workflow run, or SARIF upload was executed.

- `actionlint` 1.7.12: passed with no findings.
- `actionlint` archive SHA-256:
  `aba9ced2dee8d27fecca3dc7feb1a7f9a52caefa1eb46f3271ea66b6e0e6953f`,
  matched the release checksum published by `rhysd/actionlint`.
- PyYAML 6.0.3 parser: workflow syntax passed.
- `git diff --check`: passed.
- A disposable Git sparse-checkout simulation using the workflow pattern
  `**/*.cs` produced exactly
  `static/Scenes/BoxMonger/ImageProxy.ashx.cs`, one C# source file, and zero
  disallowed project/dependency metadata files.
- The action release refs resolved to the exact pinned SHAs, and both commits
  reported valid GitHub-verified signatures.

This proves only that the workflow is prepared and structurally valid. It does
not prove that GitHub accepts advanced uploads, that a fork PR receives the
checks, that the C# extractor performs no unexpected network activity, or that
the checks block a merge. Those require the owner-run steps below.

## Owner migration procedure

These are manual owner actions. Perform them in one attended change window so
managed coverage is not left disabled without its replacement.

1. Review the prepared workflow and this runbook until the change is ready to
   merge. Do not merge it and do not change branch protection yet. Keep the
   merge page open so the replacement can be deployed immediately after the
   setting transition.
2. Open **BabylonJS/Website → Settings → Advanced Security** in a second tab. In the
   **CodeQL analysis** row, open the `…` menu, select **Switch to advanced**,
   then select **Disable CodeQL** in the confirmation dialog. Consequence:
   managed default scanning stops and advanced uploads become accepted.
3. Immediately merge the already-reviewed workflow change. The resulting push
   to `master` starts the replacement workflow. Do not merge any unrelated
   change in this transition window. Expected proof: one successful run with
   all three checks, analyses for `refs/heads/master`, and categories
   `/language:javascript-typescript`, `/language:actions`, and
   `/language:csharp`.
4. Open **Security → Code scanning → Tool status**. Confirm the advanced
   configuration is healthy, all three languages report the expected `master`
   commit SHA, the query suite includes `security-extended`, and the C# log
   shows source-only extraction with no dependency restore, project query,
   generator, MSBuild, or `dotnet` activity.
5. If any initial advanced job fails, leave branch protection unchanged and use
   the recovery procedure below. Do not require a check that has never
   completed successfully.
6. Create an authorized benign test branch in a personal fork, change a comment
   or Markdown file, and open a PR to `BabylonJS/Website:master`. Do not place
   secrets or sensitive test data in the fork. If GitHub requests approval,
   inspect **every** pending workflow for the commit before approving; approval
   may release non-CodeQL workflows too. Keep the existing
   `first_time_contributors` approval policy.
7. In the fork PR, record:
   - `github.event_name` is `pull_request`.
   - The checkout commit equals the GitHub-generated PR merge commit, not the
     fork head SHA. Compare the workflow's checkout/analyze SHA with
     `refs/pull/<PR>/merge`.
   - No secret, PAT, OIDC, environment, internal runner, or writable checkout
     credential is available.
   - All three expected CodeQL checks succeed.
   - Code scanning analyses exist for the PR merge ref and the same merge SHA
     for JavaScript/TypeScript, GitHub Actions, and C#.
   - The C# file list contains only `.cs` source and its log contains no restore,
     project query, source generator, MSBuild, or `dotnet` invocation.
8. Add a benign, recognizable insecure pattern on the authorized fork test
   branch that is covered by a built-in query, or use a security-team-approved
   CodeQL test fixture. Do not use the existing
   `js/polynomial-redos` supporting-location warning as the gate test: it is a
   soft warning and must remain separate from vulnerability gating. Confirm the
   PR scan reports a new alert before merge, then remove the fixture and confirm
   the rerun clears it.
9. Open **Settings → Branches → Branch protection rule for `master`**. Preserve
   `Website - YAML`, strict/up-to-date status checks, one approval, and
   conversation resolution. Add the three exact CodeQL check names observed in
   step 7. There is no old required CodeQL context to remove. Save the rule.
10. Separately consider a repository ruleset rule that requires CodeQL code
    scanning results. Only enable it after the fork test has produced stable
    results. If the UI asks for a severity threshold, that is an owner policy
    decision; do not infer or lower a threshold. A required status check proves
    scan execution. A code scanning results rule enforces the selected alert
    policy. These are separate controls and should be tested separately.
11. Verify the merge gate with the authorized fork PR:
    - While one CodeQL check is failing or pending, GitHub must report the PR as
      not mergeable.
    - After the safe fixture is removed and all three checks pass, the CodeQL
      portion of the merge gate must be satisfied.
    - Do not merge the test PR unless it independently contains a desired
      repository change.
12. Merge queue is currently absent. If it is enabled later, confirm
    `merge_group` runs all three checks on the queue-generated commit and add
    those exact checks to the queue ruleset. The trigger is already prepared,
    but queue enforcement is not verified.
13. Dependabot is not a fork in this repository. Confirm a Dependabot PR gets
    the same three checks without weakening contributor approvals or adding a
    special bypass. If GitHub treats an automated update differently in a
    future policy, document the exception explicitly rather than disabling the
    gate.

## Recovery

If advanced setup cannot produce all three successful analyses:

1. Do not add or keep new required CodeQL checks.
2. Capture the failed run URL, job logs, checked-out SHA, analysis category, and
   Tool status diagnostics.
3. Re-enable managed setup at **Settings → Advanced Security → CodeQL
   analysis → Set up → Default** with the previously observed configuration:
   C# plus JavaScript/TypeScript, default query suite, remote threat model,
   weekly schedule, standard runner.
4. Confirm a managed `master` scan succeeds for both previous languages.
5. Keep the advanced workflow disabled or revert it before retrying; default
   and advanced CodeQL upload configurations are incompatible for this
   transition.

Do not broaden workflow permissions, switch to `pull_request_target`, expose
secrets, use a self-hosted/internal runner, enable credential persistence, or
approve unrelated contributor workflows to make a scan pass.

## References

- [About code scanning setup types](https://docs.github.com/en/code-security/concepts/code-scanning/setup-types)
- [Configure advanced CodeQL setup](https://docs.github.com/en/code-security/how-tos/find-and-fix-code-vulnerabilities/configure-code-scanning/configuring-advanced-setup-for-code-scanning)
- [CodeQL workflow configuration options](https://docs.github.com/en/code-security/reference/code-scanning/workflow-configuration-options)
- [CodeQL build options for compiled languages](https://docs.github.com/en/code-security/reference/code-scanning/codeql/build-options-for-compiled-languages)
- [`actions/checkout` v7.0.1](https://github.com/actions/checkout/releases/tag/v7.0.1)
- [`github/codeql-action` v4.39.2](https://github.com/github/codeql-action/releases/tag/v4.39.2)
- [C# extractor option definitions](https://github.com/github/codeql/blob/main/csharp/codeql-extractor.yml)
- [C# standalone extractor](https://github.com/github/codeql/blob/main/csharp/extractor/Semmle.Extraction.CSharp.Standalone/Extractor.cs)
- [Repository language inventory API](https://api.github.com/repos/BabylonJS/Website/languages)
- [Managed CodeQL configuration API](https://api.github.com/repos/BabylonJS/Website/code-scanning/default-setup)
- [Code scanning analyses API](https://api.github.com/repos/BabylonJS/Website/code-scanning/analyses)
- [`master` branch protection API](https://api.github.com/repos/BabylonJS/Website/branches/master/protection)
- [Repository rulesets API](https://api.github.com/repos/BabylonJS/Website/rulesets)
- [Actions policy API](https://api.github.com/repos/BabylonJS/Website/actions/permissions)
- [Workflow token policy API](https://api.github.com/repos/BabylonJS/Website/actions/permissions/workflow)
- [Fork contributor approval policy API](https://api.github.com/repos/BabylonJS/Website/actions/permissions/fork-pr-contributor-approval)
- [Latest observed managed CodeQL run](https://github.com/BabylonJS/Website/actions/runs/41615402194)
- [Recent fork PR without CodeQL checks: #789](https://github.com/BabylonJS/Website/pull/789)
- [Recent fork PR without CodeQL checks: #776](https://github.com/BabylonJS/Website/pull/776)
- [Recent fork PR without CodeQL checks: #768](https://github.com/BabylonJS/Website/pull/768)
