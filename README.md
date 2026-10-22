# Application Autofill

Job applications ask the same ten things every time. Your name, your email, your LinkedIn, are
you authorized to work, do you need sponsorship. This userscript fills all of that on
Greenhouse, Lever, and Ashby forms so you can skip the typing, check the result, and hit Submit.

It fills. You submit. The script never clicks the final button for you, and it never touches
LinkedIn or scrapes anything. It only works on the application page you opened yourself.

## Why it runs in your browser

You apply from your own machine, signed in to your own accounts. So this lives in your browser
as a userscript, not on a server. Your data stays local to you.

## Setup (about 3 minutes, once)

1. Install the Tampermonkey extension (Chrome, Edge, or Firefox).
2. Open Tampermonkey, go to the dashboard, and click the plus to create a new script.
3. Paste in the contents of `autofill.user.example.js` and save.
4. Edit the `PROFILE` block at the top with your real details. Add your phone, and set
   `work_authorization` and `require_sponsorship` to match your actual situation.

## How you use it

1. Open a Greenhouse, Lever, or Ashby application.
2. Click the floating "Autofill application" button in the bottom-right corner.
3. Everything it filled turns green. Read through it, fix anything it got wrong or skipped, then
   click the site's own Submit button.

## What it fills

The fields that repeat on almost every application: name, email, phone, location, your
LinkedIn, GitHub, and portfolio links, your current company and title, and the usual screening
questions about work authorization, sponsorship, and years of experience. It matches on the
field label, so anything custom or oddly worded is left for you to answer.

## What it will not do

- It will not submit. That stays your call, every time.
- It will not attach your resume. Browsers block scripts from uploading files, for good
  security reasons, so you attach that yourself.
- It will not handle every field. On a custom or multi-step form it fills what it recognizes and
  leaves the rest. On a new step, click the button again.

Treat it as a fast first pass, not a final answer. Always read before you send.

## Keep your data yours

Your real details live only in your copy of the script, inside your browser. The version in this
repo ships with placeholders on purpose. Do not paste your real name, email, or links into any
copy you share.

## License

MIT.
