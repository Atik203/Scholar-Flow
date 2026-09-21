# SCHOLAR-FLOW — DEMO SPEECH (10 MINUTES, 4 MEMBERS)

How to use this file:

- Each member speaks for about 2.5 minutes.
- Text in [brackets] = demo action. Do it, then speak the next line.
- Speak slowly. Pause after every page. Do not rush.
- Short sentences are written on purpose. Read them as they are.

---

## MEMBER 1 — RESEARCH (0:00 – 2:30)

Good morning everyone. Thank you for coming.
My name is [Name].
Today we will show you ScholarFlow. It is an AI research platform.
We have four parts: Research, Team, Admin, and Payment.
I will start with Research.

[Open the Research Hub page]
This is the Research Hub. All research tools are in one place.
What you can see depends on your role.

[Open a paper, show PDF upload and processing]
First, PDF upload. We upload a research paper.
The system extracts the text from the PDF.
You can see the processing status here.
When it is done, the text is ready to read.

[Open the Text Editor]
Next, the Text Editor.
It has seven templates. So you can start very fast.
It saves your work automatically. You do not need to press save.
You can add images. They are stored in secure cloud storage.
You can export your paper to PDF or DOCX.
And two people can edit the same paper at the same time.
This is real-time collaboration. You can see the other person's cursor.

[Open Citations]
Next, Citations.
We support nine formats. For example APA, MLA, IEEE, and BibTeX.
You can save a citation while you write.
You can also see your export history.

[Open the Citation Graph]
This is the Citation Graph.
It is a visual map. It shows how papers cite each other.
This is a Pro feature.

[Open the Research Map]
And this is the Research Map.
It is a topic cloud. It is built from your tags.
You can filter by topic. This is also a Pro feature.

So Research gives you upload, writing, citations, and visual tools.
Now my teammate will show you the Team features.
Thank you.

---

## MEMBER 2 — TEAM (2:30 – 5:00)

Thank you, [Name].
Now I will show the Team features.
ScholarFlow is built for teams. So collaboration is very important.

[Open the Team page]
This is the Team page.
Here you can see all members.
You can see their real status — online or offline.
You can see when they were last active.

[Change a member's role]
As a team lead, I can change a member's role.
For example, from Viewer to Editor.
The change is saved right away.

[Remove a member]
I can also remove a member safely.

[Open Invitations]
Next, Invitations.
I can invite a new member and choose a role.
Viewer can only read.
Editor can edit.
Manager can manage the workspace.
I can resend or cancel an invitation.
The invited person can accept or decline.

[Open Activity]
This is the Activity log.
It is an audit trail. It shows who did what, and when.
You can filter by member or by date.
You can load more with pagination.

[Open Team Settings]
This is Team Settings.
Only the team lead can open this page.
Here we change the team and workspace configuration.

[Show the notification bell]
And when something happens — a new invite, a role change, a removal —
the user gets a notification.
It arrives in real time. No page refresh needed.

So the Team module covers members, invitations, activity, settings,
and real-time notifications.
Now my teammate will show the Admin panel.
Thank you.

---

## MEMBER 3 — ADMIN (5:00 – 7:30)

Thank you, [Name].
Now the Admin panel.
This is for platform administrators.
It has many tools. I will show the most important ones.

[Open Admin Overview]
This is the Admin Overview.
These are real system metrics: CPU, memory, storage, and database.
They refresh every ten seconds.
The colors show health. Green is good. Yellow is a warning. Red is a problem.

[Open Users]
Next, Users.
Admins can see all users here.
We can change a role. We can also disable an account.

[Open Plans]
This is Plans.
Admins manage the plan catalog here — price, name, and features.

[Open Reports]
This is Reports.
Admins can preview data and export it.
We can export CSV or JSON. This is very useful for analysis.

[Open Audit Log]
This is the Audit Log.
Every important action is recorded.
We can filter it and export it.

[Open Webhooks]
This is Webhooks.
We can add an endpoint. And we can see the delivery logs.

[Quickly show AI Models and API Keys]
We also manage AI models and API keys for AI providers.

[Quickly show Alerts and System Health]
We have system alerts and health monitoring.

[Quickly show System Settings]
And system settings for the whole platform.

Security is important here.
Every admin route checks the admin role.
And the admin panel is code-split, so it loads fast.

So the Admin panel gives full control, with safety.
Now my teammate will show Payment.
Thank you.

---

## MEMBER 4 — PAYMENT (7:30 – 10:00)

Thank you, [Name].
Finally, Payment.
We use Stripe for payments. Stripe is a global payment system.
Everything is secure.

[Open the Pricing page]
This is the pricing page.
We have Free, Pro, and Team plans. Monthly and yearly.
The prices come from our database.
So admins can change them at any time.

[Click Pro, show Stripe Checkout]
I click Pro.
Now we are on Stripe Checkout.
This page is hosted by Stripe.
So card data never touches our servers.
I will use a test card.
[Complete the payment]

[Open the Billing page]
After payment, we come back here.
This is the Billing page.
The user can see the plan, the status, the payment method, and the invoices.

[Open the Customer Portal]
There is also a Customer Portal. It is hosted by Stripe.
Here the user can update the card or download invoices.

[Show cancel flow]
The user can also cancel the subscription.
It is self-service. No email needed.

[Explain webhooks and sweeper]
One important thing:
Our server listens to Stripe webhooks.
Webhooks are the source of truth for subscription status.
We verify every webhook signature. And we handle each event only once.
Also, if a payment fails, a background job runs every hour.
After a grace period, it downgrades the account.
So our data is always correct.

So, in Payment: checkout, billing, portal, cancel, and safe background jobs.
That is the end of our demo.
Thank you for watching.
Do you have any questions?

---

## DELIVERY TIPS (for all members)

1. Speak slowly. One sentence, then a small pause.
2. Do not read fast. It is better to finish early than to rush.
3. Point at the screen when you say "this page" or "this button".
4. If you forget a line, just say the page name and move on.
5. Smile and look at the audience, not only at the screen.

## BEFORE THE DEMO — CHECKLIST

- [ ] Run `yarn dev` (starts frontend, backend, and socket server).
- [ ] Login as admin for the Admin part: admin@scholarflow.com / password123
- [ ] Login as teamlead for the Team part: teamlead@scholarflow.com / password123
- [ ] Have one PDF ready for the upload demo.
- [ ] Open two browsers for real-time collaboration (two different users).
- [ ] Use Stripe test card: 4242 4242 4242 4242, any future date, any CVC.
- [ ] Prepare one demo workspace with a few members and invitations.
- [ ] Prepare one demo subscription (Pro or Team) with a paid invoice.
- [ ] Zoom the browser to 110% so the audience can see clearly.
