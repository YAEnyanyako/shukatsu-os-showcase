# Public data boundary

## Origin

All example company identities, mail subjects, message bodies, source IDs, dates, roles and events in this repository are authored fiction. They were created for the public demonstration. They are not a redacted or renamed export of a private ledger.

Example addresses use reserved `example.com` subdomains. There are no applicant names, personal addresses, phone numbers, schools, employment histories, application outcomes, account links or production identifiers.

## Application behavior

- No network requests, tracking, external fonts, model calls or service logins.
- No ability to import personal records or submit forms to third parties.
- Data and decisions are stored only under this demo's browser-local storage key.
- Reset removes the demo state. If storage is unavailable, the app reports temporary mode.
- A Content Security Policy blocks connections and external form submissions.

## Release boundary

`release-files.json` is the explicit public-file allowlist. The packaging script checks the file set and scans text before creating an archive. It excludes all Git history and machine metadata. Symbolic links and files outside the allowlist cause a failure.

The scan checks local user paths, non-example email addresses, account-mail URLs and common credential patterns. It is a guard against accidental additions, not a proof that arbitrary future content is safe. Newly added public files still need a content review. The fictional opening-screen PNG was captured in a fresh browser context and visually reviewed; the scan pins its reviewed digest and rejects PNG metadata, trailing data and unreviewed replacements. It does not perform OCR or prove that an arbitrary image is free of private information.

## Extending this repository

Keep any real integration or evaluation data outside the public release. Use synthetic fixtures to reproduce issues. Inspect generated assets as well as source files. Re-run the public-file check before publishing a changed version.

Provider names (OpenWork, BizCampus, 外資就活, ONE CAREER) are used only to illustrate source categories. All associated experience reports and lessons are authored fiction; no actual review or post is reproduced. ES examples and interview material are fictional. Browser-entered drafts remain in local storage and are never included by the static-file packager. ICS files contain only fictional confirmed events.

The standalone demo contains no current selection-company names or applicant records. Authorized aggregate operating counts appear separately on the public profile, with the one-user September 27, 2026 snapshot clearly identified; they do not measure accuracy, time savings or hiring outcomes. The generated CV uses the literal fictional label “Demo Applicant”. Receipt/stage/review examples are independently authored fiction; private documents are never loaded by this static site. The public packager never reads browser storage.
