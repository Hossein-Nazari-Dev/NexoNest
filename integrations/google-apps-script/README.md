# NexoNest newsletter backend

1. Create a Google Sheet.
2. Open Extensions, then Apps Script.
3. Replace Code.gs with the Code.gs from this folder.
4. Run setupSheet once and approve its permissions.
5. Choose Deploy, New deployment, Web app.
6. Set Execute as to Me and Who has access to Anyone.
7. Deploy and copy the URL ending in /exec.
8. Put that URL in the newsletter-endpoint meta tag in newsletter.html.
9. Submit a test using an email address you control and click the confirmation link.

Use the /exec URL, not the /dev testing URL. After changing Code.gs, create a
new version and update the existing deployment.

If a subscription was submitted before setupSheet was run, paste the latest
Code.gs and run setupSheet. It detects subscriber data in row 1, inserts the
header above it, and preserves the existing row.
