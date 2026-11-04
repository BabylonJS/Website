# CodeQL fork pull request migration

## Status

| Milestone | Status | Evidence required before advancing |
| --- | --- | --- |
| Workflow prepared | **Prepared locally** | `.github/workflows/codeql.yml` passes independent YAML and actionlint validation. |
| Advanced baseline scanned | **Not verified** | An owner-dispatched `master` run must upload both analyses after the managed-to-advanced cutover. |
| Fork PR successfully scanned | **Not verified** | An authorized benign fork PR must produce both successful CodeQL checks against the pull request merge commit. |
| Scan-execution gate verified | **Not verified** | A pending or missing required CodeQL analysis must block the benign fork PR; a completed clean analysis must satisfy only the execution portion of the gate. |
| Alert-threshold gate verified | **Not verified** | Requires a separately authorized PR that already contains a genuine CodeQL finding at the owner-approved threshold. No code change may be introduced to manufacture a finding. |
| Merge-queue gate verified | **Not applicable / not verified** | No merge queue exists. If one is enabled later, its generated merge group must be scanned and gated separately. |

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
- Managed CodeQL default setup is enabled for C# and JavaScript/TypeScript,
  with the default query suite, remote threat model,
  weekly schedule, and standard GitHub-hosted runner.
- The latest managed analyses covered `master` only. Recent fork PR merge
  commits had the Azure Pipelines checks but no CodeQL check, corroborating the
  documented default-setup exclusion for fork pull requests.
- GitHub's language inventory reports JavaScript (46,460,386 bytes),
  TypeScript (781,486 bytes), C# (1,349 bytes), ASP.NET (96 bytes), plus HTML,
  CSS, Nunjucks, Roff, and HLSL. Existing managed analyses contain
  `javascript-typescript` and `csharp`; they do not contain `actions`.
- The user explicitly confirmed that Website has no C# code that should be in
  CodeQL scope. The prepared advanced workflow therefore intentionally excludes
  C# despite the API inventory and prior managed C# analysis. This is a
  deliberate owner-directed coverage change, not an accidental loss.
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
- Organization-level Actions policy could not be read: the API returned HTTP
  403 because the current account lacks organization Actions-policy
  administration permission. Repository settings do not prove that no
  organization or enterprise restriction applies.
- Outside-collaborator approval is `first_time_contributors`. Keep this
  requirement. Approving a pending fork run can release every workflow attached
  to that commit, not only CodeQL. Returning contributors can modify workflow
  files without this first-time approval prompt, so any stronger approval
  policy is a separate owner decision and requires explicit authorization.
- Dependabot pull requests use branches in `BabylonJS/Website`, not forks.
  They should run without the outside-contributor approval path, but GitHub
  still gives Dependabot-triggered `pull_request` workflows a read-only
  `GITHUB_TOKEN` and no Actions secrets. The CodeQL pull-request upload behavior
  must be verified; do not broaden permissions or add secrets if it fails.
- No repository-local model extensions were found under
  `.github/codeql/extensions`, and the repository property API returned no
  custom properties. The REST default-setup response does not expose every
  model pack selected in the UI, so trusted model-pack coverage remains unknown
  until an owner performs the UI inventory below.

Event-specific coverage and exceptions are:

| Source | Managed default setup now | Prepared advanced workflow |
| --- | --- | --- |
| Same-repository PR | Scanned against `master` | Scanned with the normal `pull_request` merge ref |
| Public fork PR | Excluded by managed default setup | Included; first-time contributors require the configured approval, while returning contributors may not |
| Dependabot PR | Same-repository PR, but Dependabot workflow token restrictions still apply | Included without the public-fork prompt; read-only token/no Actions secrets still apply |
| Push to `master` | Scanned | Scanned |
| Weekly schedule | Scanned when managed scheduling conditions are met | Explicit Tuesday schedule |
| Merge queue group | No queue exists; not verified | `merge_group` is configured, but group scanning and gating remain unverified |

Any setting not listed above should be treated as unknown until a repository
owner verifies it in the current GitHub UI.

## Prepared workflow safety properties

The workflow uses the normal `pull_request` event. It never uses
`pull_request_target`, never overrides the checkout ref, and therefore scans the
GitHub-generated pull request merge commit rather than running in a privileged
base-repository context.

These properties apply only to the reviewed, unmodified workflow. A
`pull_request` run evaluates the workflow and inline CodeQL configuration from
the pull request merge revision, so a contributor can change them in the PR.
Do not treat a run from a PR that modifies this workflow or CodeQL
configuration as validation evidence; review the complete diff and require the
expected checks to remain present. Returning contributors may not receive the
first-time-contributor approval prompt.

The JavaScript/TypeScript and GitHub Actions jobs perform static extraction from
one normal checkout. C# is not initialized or analyzed, by explicit user
direction.

The workflow does not run autobuild, run repository scripts, run tests, use a
PAT, request an OIDC token, use secrets, use an internal runner, or persist
checkout credentials.
Dependency caching is explicitly disabled. Query configuration is inline in the
reviewed workflow and uses GitHub's built-in `security-extended` suite. As
reviewed, it does not reference external custom configuration, query packs,
model packs, or model extensions; a PR that changes these properties requires
separate review and is not evidence that this prepared workflow is safe.

The expected check names are:

- `CodeQL / JavaScript-TypeScript`
- `CodeQL / GitHub-Actions`

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
`build-mode: none`, inline configuration, and disabled dependency
caching.

The `github/codeql-action` release is marked immutable by GitHub. The
`actions/checkout` release record is not marked immutable, which makes the full
commit SHA pin essential; the workflow does not trust the movable tag.

Before merging a future update to either pin, repeat the release/tag resolution
and metadata review. Do not replace the SHAs with floating major tags.

## Local validation evidence

Validation was intentionally limited to workflow structure and policy. No
repository dependency install, build, test, application script, CodeQL
extraction, workflow run, or SARIF upload was executed.

- `actionlint` 1.7.12: passed with no findings.
- `actionlint` archive SHA-256:
  `aba9ced2dee8d27fecca3dc7feb1a7f9a52caefa1eb46f3271ea66b6e0e6953f`,
  matched the release checksum published by `rhysd/actionlint`.
- PyYAML 6.0.3 parser: workflow syntax passed.
- `git diff --check`: passed.
- The action release refs resolved to the exact pinned SHAs, and both commits
  reported valid GitHub-verified signatures.

Local validation does not prove that GitHub accepts advanced uploads, that a
fork PR receives the checks, that Dependabot uploads succeed with its read-only
token, or that any gate blocks a merge. Those require the owner-run steps below.

## Owner migration procedure

Every action below targets **BabylonJS/Website**. Do not apply these steps to an
organization or another repository.

1. **Inventory trusted managed coverage before cutover.**
   **Permission:** Repository admin or security manager who can view CodeQL
   configuration.
   **Action:** Open **Settings → Security and quality → Code scanning → CodeQL
   analysis → … → View CodeQL configuration → Edit**. Record languages,
   query suite, threat model, runner, schedule, private-registry use, custom
   configuration, and every model pack/extension shown. Also inspect
   `.github/codeql/extensions`.
   **Consequence:** Read-only inventory; no setting is changed.
   **Expected evidence:** A saved inventory matching the current C# and
   JavaScript/TypeScript managed setup, default suite, remote threat model,
   standard runner, weekly schedule, plus an explicit list of model packs
   (including “none”). Record the explicit decision that advanced setup will
   retain JavaScript/TypeScript, add Actions, and omit C#.
   **Recovery/stop:** If any model pack, private registry, custom configuration,
   or trusted extension is unknown or not represented by the prepared advanced
   workflow, stop. Preserve managed setup until that coverage is reviewed and
   explicitly migrated.
2. **Merge the prepared files while managed setup remains active.**
   **Permission:** Repository write access plus the existing review and
   `Website - YAML` requirements.
   **Action:** Merge only `.github/workflows/codeql.yml` and this runbook after
   review.
   **Consequence:** The workflow becomes available on `master`; its push run may
   be rejected or superseded while default setup is still enabled. Managed
   coverage remains active during review and merge.
   **Expected evidence:** Both files exist on `master`, and **Actions → CodeQL**
   displays **Run workflow** because `workflow_dispatch` is configured.
   **Recovery:** Revert the workflow commit if the content on `master` differs
   from the reviewed version. Do not disable managed setup.
3. **Perform the managed-to-advanced switch.**
   **Permission:** Repository admin.
   **Action:** Open **Settings → Security and quality → Code scanning**. In
   **CodeQL analysis**, open `…`, choose **Switch to advanced**, then choose
   **Disable CodeQL**.
   **Consequence:** Managed default scanning stops and advanced CodeQL uploads
   become eligible.
   **Expected evidence:** The CodeQL row no longer shows default setup as
   active, while the reviewed workflow remains on `master`.
   **Recovery:** If the advanced baseline in step 4 cannot be started
   immediately, re-enable the recorded default configuration and stop.
4. **Dispatch the deterministic advanced baseline.**
   **Permission:** Repository write access.
   **Action:** Open **Actions → CodeQL → Run workflow**, select branch `master`,
   then choose **Run workflow**.
   **Consequence:** Starts the reviewed advanced workflow without another
   repository change.
   **Expected evidence:** Both jobs succeed for the same `master` SHA and
   upload categories `/language:javascript-typescript` and `/language:actions`.
   In **Security and quality → Code scanning → Tool status**, both are healthy and use
   `security-extended`; no C# advanced analysis is expected.
   **Recovery:** If either job fails, do not add gates. Re-enable the recorded
   default configuration, disable or revert the advanced workflow, capture
   logs, and stop.
5. **Open only a benign fork PR.**
   **Permission:** A repository owner authorizes a contributor to create a
   personal-fork PR; no workflow approval is implied.
   **Action:** Change only harmless documentation or a comment and open a PR to
   `BabylonJS/Website:master`. Do not add a vulnerability pattern, payload,
   dependency, workflow modification, executable, or project metadata.
   **Consequence:** Creates the pending proof vehicle without intentionally
   adding a finding.
   **Expected evidence:** The PR head repository is the personal fork and the
   base is `BabylonJS/Website:master`.
   **Recovery:** Close the PR without merging if its diff is not strictly
   benign.
6. **Approve a pending fork workflow only after reviewing all changes.**
   **Permission:** Maintainer with repository write access.
   **Action:** In the PR, open **Files changed** and inspect the complete diff,
   especially `.github/workflows/`. Then open **Awaiting approval** and choose
   **Approve workflows to run**. Approval may release every pending workflow
   for that commit, not only CodeQL.
   **Consequence:** Consumes approval for that commit's pending workflows.
   **Expected evidence:** Both CodeQL jobs start. Keep
   `first_time_contributors`; changing to stronger approval for returning
   contributors is a separate security-policy action requiring explicit owner
   authorization.
   **Recovery:** If any unexpected workflow is pending, do not approve. Close
   the PR or request a clean commit.
7. **Verify the fork merge-ref scan.**
   **Permission:** Repository read access; security/tool-status access for full
   analysis inspection.
   **Action:** Compare the workflow checkout/analyze SHA with
   `refs/pull/<PR>/merge` and the fork head SHA. Inspect both job logs and
   Code scanning Tool status.
   **Consequence:** Read-only verification.
   **Expected evidence:** Event `pull_request`; checkout and all analyses use
   the GitHub-generated merge SHA; no PAT, Actions secret, OIDC token,
   environment, internal runner, or persisted checkout credential is used;
   both checks succeed. Code scanning annotations may appear only when every
   alert location is inside the PR diff, so absence of an inline annotation is
   not proof of no findings.
   **Recovery:** If any SHA differs, any unsafe capability appears, or any
   analysis is missing, do not configure gates. Close the PR and revert to
   managed setup if the workflow cannot be corrected safely.
8. **Require the two observed workflow checks.**
   **Permission:** Repository admin.
   **Action:** Open **Settings → Branches → Branch protection rule for
   `master`**. Preserve `Website - YAML`, strict/up-to-date checks, one approval,
   and conversation resolution. Add the exact two CodeQL check names observed
   in step 7. There is no existing required CodeQL check to remove.
   **Consequence:** Missing, pending, or failed CodeQL jobs block the PR. This
   proves scan execution only; it does not prove alert-threshold enforcement.
   **Expected evidence:** While a rerun is pending, the benign PR is blocked;
   after both clean jobs succeed, those required checks are satisfied.
   **Recovery:** Remove only the new CodeQL check contexts if they deadlock.
   Preserve `Website - YAML` and all existing protections.
9. **Create the CodeQL code-scanning results ruleset.**
   **Permission:** Repository admin or a custom role with edit-rules permission.
   **Action:** Open **Settings → Rulesets → Rulesets → New ruleset → New branch
   ruleset**. Target only `master`. Add no bypass actor or broad bypass. Under
   **Branch protections**, enable **Require code scanning results**. Under
   **Required tools and alert thresholds**, choose **Add tool → CodeQL**. Set
   **Alerts** and **Security alerts** to the separately owner-approved
   thresholds, then set enforcement to **Active** and save.
   **Consequence:** CodeQL analysis that is missing or in progress blocks merge,
   and a qualifying genuine alert blocks according to the selected thresholds.
   **Expected evidence:** The benign PR is blocked while analysis is pending and
   becomes eligible after the clean analysis completes. This still does not
   prove that a qualifying alert is blocked.
   **Recovery:** If the ruleset deadlocks clean PRs, change this new ruleset to
   **Disabled**, or remove only its CodeQL tool requirement.
   Do not add a bypass and do not weaken existing protections.
10. **Leave alert-threshold blocking unverified unless a genuine case exists.**
    **Permission:** Separate explicit owner authorization for an existing PR
    with a genuine CodeQL finding at or above the approved threshold.
    **Action:** Observe that existing genuine finding; do not alter code to
    manufacture a finding. Keep
    `js/polynomial-redos` supporting-location warnings separate from the
    vulnerability gate.
    **Consequence:** Read-only confirmation that the ruleset blocks a real
    qualifying alert.
    **Expected evidence:** The genuine qualifying alert blocks merge, and its
    legitimate remediation clears the rule.
    **Recovery/stop:** If no separately authorized genuine finding exists,
    record alert-threshold enforcement as **unverified**. A clean scan and
    pending-job block are not substitutes.
11. **Verify Dependabot without an exception.**
    **Permission:** Read access to a naturally occurring Dependabot PR; do not
    create or approve an update solely for this test.
    **Action:** Observe the next legitimate Dependabot PR.
    **Consequence:** The same two checks and code-scanning rules apply despite
    the same-repository branch. Dependabot's `GITHUB_TOKEN` remains read-only
    and Actions secrets remain unavailable. It is not subject to the public
    fork approval prompt.
    **Expected evidence:** Both analyses upload and satisfy the same gates
    with no bypass.
    **Recovery:** If upload fails, do not grant secrets, broaden token
    permissions, or add a Dependabot bypass. Capture the failure and use only a
    GitHub-supported CodeQL/Dependabot remedy.
12. **Verify a future merge queue as a separate group scan.**
    **Permission:** Separate explicit authorization to enable or test a merge
    queue; none exists today.
    **Action:** After a queue is configured for `master`, place an authorized
    benign PR in it. GitHub creates a temporary merge group containing the
    latest `master`, that PR, and any PRs ahead of it.
    **Consequence:** The `merge_group` `checks_requested` event runs both
    jobs against the group head. The branch/ruleset requirements for `master`
    wait for those group results.
    **Expected evidence:** All categories reference the merge-group head SHA,
    and missing/pending/failed group checks block queue progression.
    **Recovery:** Remove the PR from the queue or disable the queue test. Do not
    bypass the CodeQL rules. Queue enforcement remains unverified until this
    authorized test occurs.

## Recovery

If advanced setup cannot produce both successful analyses:

1. Do not add or keep new required CodeQL checks.
2. Capture the failed run URL, job logs, checked-out SHA, analysis category, and
   Tool status diagnostics.
3. Re-enable managed setup at **Settings → Security and quality → Code
   scanning → CodeQL analysis → Set up → Default** with
   JavaScript/TypeScript, the default query suite, remote threat model, weekly
   schedule, and standard runner. Keep C# excluded per the explicit user
   direction recorded above.
4. Confirm a managed `master` JavaScript/TypeScript scan succeeds.
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
- [`actions/checkout` v7.0.1](https://github.com/actions/checkout/releases/tag/v7.0.1)
- [`github/codeql-action` v4.39.2](https://github.com/github/codeql-action/releases/tag/v4.39.2)
- [Set code scanning merge protection](https://docs.github.com/en/code-security/how-tos/find-and-fix-code-vulnerabilities/manage-your-configuration/set-merge-protection)
- [Approve workflow runs from forks](https://docs.github.com/en/actions/how-tos/manage-workflow-runs/approve-runs-from-forks)
- [Dependabot on GitHub Actions](https://docs.github.com/en/code-security/reference/supply-chain-security/dependabot-on-actions)
- [Code scanning alerts in pull requests](https://docs.github.com/en/code-security/how-tos/manage-security-alerts/manage-code-scanning-alerts/triage-alerts-in-pull-requests)
- [Managing a merge queue](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/managing-a-merge-queue)
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
