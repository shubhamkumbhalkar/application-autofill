# Application Autofill (review-first)

A browser userscript that fills **Greenhouse / Lever / Ashby** job-application forms from your
profile, so you review and hit **Submit** instead of typing everything. **It never submits for
you** — a human (you) always clicks the final button.

## Why a userscript (not part of the cron fleet)
You apply from the browser on your **local machine**, logged into your accounts. The cloud
dev-dsk is headless and isn't where you browse, so this has to run locally in your browser.

## Install (one time, ~3 minutes)
1. Install the **Tampermonkey** extension in your browser (Chrome/Edge/Firefox).
2. Tampermonkey → Dashboard → **+ (Create a new script)**.
3. Paste the contents of `autofill.user.example.js`, then **File → Save**.
4. Open the `PROFILE = { ... }` block at the top and fill in your real values (phone is blank —
   add it; adjust `require_sponsorship`/`work_authorization` to your real situation).

## Use
1. Go to a Greenhouse / Lever / Ashby application page.
2. Click the floating **🤖 Autofill application** button (bottom-right), or Tampermonkey menu →
   "Autofill this application."
3. Fields it filled get a **green outline**. **Review every field**, fix anything it missed or
   got wrong, then click the site's own Submit button.

## What it fills
Name, email, phone, location, LinkedIn/GitHub/portfolio, current company/title, and common
screening questions (work authorization, sponsorship, years of experience) where the field
label matches. Unknown or custom questions are left for you.

## Honest limitations
- **Best-effort on known ATS.** Greenhouse/Lever/Ashby use fairly predictable fields; it will
  miss custom or oddly-labeled questions. Always review before submitting.
- **Resume/file uploads are manual** — browsers don't let a script attach a file for security
  reasons. You attach the resume yourself.
- **Multi-step / JS-heavy forms:** click Autofill again after a new step renders.
- It does not touch LinkedIn (no scraping, no ToS risk) — only the ATS form you navigated to.

## Privacy
Your profile data lives only in the userscript in your local browser. Do not paste real
personal data into any shared/public copy of this file.
