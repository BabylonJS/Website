# Website Deployment

The website deployment pipeline lives in `azure-pipelines.yml`. It replaces the classic Azure DevOps build definition named `Website deployment`.

## Pipeline Flow

On pull requests targeting `master`, the pipeline only validates the compiled demo path:

1. Use Node.js 22.
2. Install dependencies with `npm ci`.
3. Install Playwright Chromium.
4. Build the Eleventy site, compiled demos, and pure compiled demos with `npm run build`.
5. Run `npm run demos:ci` to lint, format-check, typecheck, and render-check compiled demos.
6. Run `npm run demos:pure:ci` to lint, format-check, typecheck, build, and render-check pure compiled demos.

The pull request stage does not load deployment secrets, create a deploy package, upload files, or purge the CDN.

On `master`, the pipeline deploys the website:

1. Use Node.js 22.
2. Install dependencies with `npm ci`.
3. Build the Eleventy site, compiled demos, and pure compiled demos with `npm run build`.
4. Create a deploy zip with `npm run deploy:package`.
5. Upload the deploy zip to the existing deployment service.
6. Purge the CDN endpoint after a successful upload.

The deployment stage keeps using the `BabylonJS-Deployment` variable group. The deployment service values are intentionally still provided by Azure DevOps secrets, not by files in this repository.

## Smart Deploy Package

`scripts/deploy/create-deploy-package.mjs` creates the zip uploaded by the pipeline. It skips unchanged passthrough assets copied from:

- `static/`
- `src/assets/`
- `src/content/**/assets/`

Generated files, HTML pages, compiled demo output, and pure compiled demo output are still included. If a passthrough asset changed in the current commit range, only that changed output file is included instead of re-uploading the entire static tree.

The script writes a JSON manifest next to the zip with the included and skipped file lists. In Azure DevOps this manifest is published as the `website-deploy-package` artifact for debugging.

By default the script compares `HEAD` with `HEAD^1`, which matches the normal merge-commit shape on `master`. Override with `--base <ref>` or `DEPLOY_BASE_REF` when testing locally.

```sh
npm run deploy:package -- --base HEAD~1 --out deploy.zip
```

Asset inclusion can be controlled with `--include-assets`:

- `changed`: include only passthrough assets changed since the base ref.
- `all`: include every passthrough asset.
- `none`: skip every passthrough asset.

The upload endpoint accepts zip uploads but does not expose deletion semantics. If a passthrough asset is deleted, the manifest reports it as `unsupportedDeletedAssetFiles` so the pipeline log makes the limitation visible.
