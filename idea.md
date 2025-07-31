🌼 School Library — Gentle Book Discovery (no RPG, no grading)
A calm, kid-first digital library that helps children stumble onto stories they’ll love. Teachers can see completions and read reflections. That’s it.

Design Principles
Joy over metrics: Fewer numbers, more feelings.

Low friction: Type your name → find a book → read.

Quiet visibility for teachers: “Who finished what” + “What they wrote.”

No comparisons: No leaderboards, badges, or public ratings.

Kind language: Microcopy that nudges, not judges.

🧭 Student Experience
1) Simple Entry

Field: “What’s your name?” (shows “Hi, Aanya!” next)

No passwords, no email.

2) Explore (Home)

Big cover grid with short, child-friendly blurbs.

Mood chips: Funny • Adventure • Magical • Thinky • True Stories • Short Reads

Helpful filters: Books • Comics • Audiobooks | New • Popular • A–Z • Under 100 pages

Search that forgives typos.

Optional “Surprise me” button.

3) Book Page

Cover, title, author, 2–3 sentence summary (“If you like ___, try this”).

“Open to read” (Google Drive link, one click).

“Save for later” (adds to Favourites).

4) Finish Flow
When a student clicks “I finished this”, show a tiny, ungraded reflection (pick 1–2 prompts):

One line I loved… (20–40 words)

This story made me feel… because… (40–70 words)

If I could tell the main character one thing… (30–60 words)

5) My Shelf

Favourites, Reading, Finished.

Private to the student (and teachers can view for support).

Microcopy (kid-friendly)

Empty state (Discover): “What are you in the mood for—funny, fast, or magical?”

Finish modal: “Lovely. Want to jot a tiny note about what you felt?”

Save: “Added to your shelf. Come back anytime.”

👩‍🏫 Teacher Experience (quiet & simple)
Dashboard

Completions list (filter by class/book/date).

For each student: Finished? Y/N, last opened, reflection text (in one click).

No scores, no grades. Just a “Seen” tick and optional private note to self.

Books

Add/edit books: cover, title, author, short summary, tags, Drive link.

Choose 0–3 reflection prompts per book (from preset list or custom).

Toggle: “Show student reflections to classmates?” (Default: Off)

Students

View per-student shelf: favourites, finished, reflections.

Optional nudge: “Would you like a short story suggestion?” (one-click send prewritten friendly message).

Exports (optional)

CSV of completions + reflections (for records).

No marks. No points.

✨ Design Language (so it feels gentle from first click)
Mood: calm, cosy, student-first.
Typography:

Headings: a friendly geometric sans (e.g., Nunito).

Body: highly readable humanist sans (e.g., Inter).

Dyslexia-friendly toggle → swap body to OpenDyslexic (or similar).

Colour palette:

Background: Warm off-white (#FCFAF7).

Primary UI: Deep teal (#1F6F78) for actions.

Accents: Soft mango (#FFC266) and mist blue (#E6F0F2).

Text: Charcoal (#2B2B2B).

Focus states: High-contrast outline (#0B63A3), visible at 3px.

Spacing & layout:

8px grid, generous white space.

Cards with 12–16px padding, 16px radius, subtle shadow (not flashy).

Max content width ~1120px; comfortable for eyes.

Motion:

Micro-transitions only (150–200ms).

Book cards gently scale to 1.02 on hover.

Confetti on “Finished” is tiny, slow, and fades quickly.

Accessibility:

All interactive elements ≥ 44×44px.

Labels always visible; placeholders are not labels.

Keyboard-first: tab order logical, skip-links, aria-live on toasts.

WCAG contrast AA minimum.

🧱 Information Architecture (routes & top-level nav)
Students

/ — Landing

/enter — Name entry (and optional Class)

/discover — Grid of books + filters

/book/:id — Book details

/read/:id — External (Google Drive) open

/finish/:id — Tiny reflection prompts

/myshelf — Favourites • Reading • Finished

Teachers

/t/login — Minimal passcode login

/t/books — Library management (list + add/edit)

/t/completions — Who finished what (filters)

/t/students/:studentId — Student shelf & reflections

🧭 Student Journey (happy path + edge cases)
1) Landing → Entry
Screen: soft headline “Find a story that feels like you.”
CTA: Start Reading → /enter

/enter

Fields: Name (required), Class/Section (optional dropdown if school wants it).

Button: Continue

On submit → create a light session: { sessionId, name, class } in localStorage; server stores { sessionId → studentId }.

Edge cases

Duplicate names? If same class & name exist, system adds a quiet numeric suffix internally (not shown to student).

Very long names? Truncate visually after 22 chars with full tooltip.

2) Discover (browse & search)
Route: /discover
Layout:

Left: Mood chips (Funny, Adventure, Magical, Thinky, True Stories, Short Reads).

Top: Search bar with forgiving typos (fuzzy match).

Sort: New • Popular • A–Z • Under 100 pages (toggle).

Main: Cover grid (3–6 per row, responsive).

Book card (component: <BookCard/>)

Cover image (lazy-loaded), title, author, 1-line mood tag.

Hover: slight lift; button Open and Save appear.

Click anywhere → /book/:id.

Empty & error states

No results: “Hmm, nothing matches… Want a Surprise me?”

Slow network: skeleton loaders in grid.

3) Book Details
Route: /book/:id
Content:

Large cover • Title • Author • 2–3 sentence friendly summary

“If you liked ___, try this.” (related recs)

Action buttons: Open to read → /read/:id (opens Google Drive link in a new tab), Save for later

Event tracking (gentle):

OPENED_BOOK when “Open to read” is clicked (timestamp).

Stored as “last opened” for teacher visibility.

Edge cases

Drive link broken → friendly toast: “Looks like the link is having a bad day. We’ve let your teacher know.” (Log an error event for teachers.)

4) Reading (external)
Route: /read/:id → actually opens Drive URL in new tab; current tab shows a soft reminder:

“Your book opened in a new tab. When you’re done, come back and press I finished this.”

Buttons: I finished this → /finish/:id and Back to book.

We don’t time or track pages. Trust matters.

5) Finish & Reflection (tiny, ungraded)
Route: /finish/:id
UI:

Title: “A tiny note before you go?”

Show 1–2 prompts set for the book (or pick from defaults):

Prompt types

One line I loved… (20–40 words)

This story made me feel… because… (40–70 words)

If I could tell the main character one thing… (30–60 words)

Controls

Word counters with gentle range guidance.

“Skip for now” (allowed, but we nudge kindly: “Your thoughts help your teacher understand you better.”)

On submit →
POST /api/completions with:

json
Copy
Edit
{
  "studentId": "...",
  "bookId": "...",
  "finishedAt": "ISO-8601",
  "responses": [
    {"promptId":"feelings","text":"...","wordCount":63}
  ],
  "source": "finish-screen"
}
Success state: tiny confetti + message: “Lovely. Your note is saved.”
CTA: Back to Discover • Go to My Shelf

6) My Shelf
Route: /myshelf
Tabs: Favourites • Reading • Finished

Finished cards show the date and a “View my note”.

Privacy

Shelf is private to the student (teachers can view in dashboard; peers cannot).

🧩 Teacher Journey (calm & minimal)
0) Login
Route: /t/login

Passcode + email (or just passcode for school intranet).

Teachers and librarians share the same minimalist UI with role-based permissions.

1) Completions (home)
Route: /t/completions
Filters: Class • Book • Date range
Table columns:

Student • Book • Finished At • Preview (first 100 chars) • View • Seen ✅

View modal

Full student responses, time finished, last opened.

“Mark as Seen” toggle (only for teacher’s own tracking).

No grading. No scores. Just reading their thoughts.

Export

Optional CSV: Student, Book, Date, Responses (sanitised text). Useful for record-keeping.

2) Books (manage library)
Route: /t/books
Actions: Add • Edit • Archive
Fields: cover upload/URL, title, author, summary (2–3 sentences), tags, Drive link.
Reflection prompts: choose 0–3 from preset or add a custom prompt (word range optional).
Validation: Drive link checker runs async (non-blocking); warns on failure.

3) Student view
Route: /t/students/:studentId
Shows Favourites, Reading, Finished, and all reflections.
Optional private note to self per student (never shown to the child).

🧠 Component map (for devs)
scss
Copy
Edit
AppLayout
  ├─ TopNav (brand, My Shelf / Discover, Student name chip)
  ├─ Content
  └─ Toaster

Student
  ├─ EnterNameForm
  ├─ DiscoverPage
  │   ├─ MoodChips
  │   ├─ SearchBar (fuzzy)
  │   └─ BookGrid
  │       └─ BookCard
  ├─ BookDetails
  ├─ FinishForm (PromptField, WordCounter)
  └─ MyShelf (Tabs: Favourites / Reading / Finished)

Teacher
  ├─ TeacherLayout (left nav: Books / Completions / Students)
  ├─ CompletionsTable (Filters, RowActions, ViewModal)
  ├─ BooksManager (List, AddEditBookModal)
  └─ StudentProfile (Shelves, Reflections, TeacherNotes)
🔌 API sketch (REST; simple & readable)
Auth

POST /api/t/login → { token }

Bearer token for /t/* endpoints.

Books

GET /api/books?search=&moods=&format=&sort=

GET /api/books/:id

POST /api/t/books (coverUrl|upload, title, author, summary, tags[], driveUrl, prompts[])

PATCH /api/t/books/:id

DELETE /api/t/books/:id (soft delete)

Students & sessions

POST /api/session → { sessionId, studentId }

GET /api/students/:id/shelf → favourites, reading, finished

Completions

POST /api/completions (as above)

GET /api/t/completions?class=&bookId=&from=&to=

GET /api/t/completions/:id

PATCH /api/t/completions/:id { seen: true }

💾 Data model (minimal)
bash
Copy
Edit
Book { id, title, author, summary, tags[], driveUrl, coverUrl, prompts[] }
Prompt { id, label, minWords, maxWords }
Student { id, name, class, createdAt }
Completion { id, studentId, bookId, finishedAt, responses[], seen:false }
Response { promptId, text, wordCount }
TeacherNote { id, studentId, text, createdAt }
⚙️ Implementation notes (quick choices, low friction)
Frontend: React (or Next.js). Styling via Tailwind for speed + consistency.

Search: client fuzzy search (Fuse.js) for small libraries; move server-side later if scale grows.

Images: lazy load; aspect-ratio preserved; fallback cover for missing images.

State: lightweight store (Zustand/Context) + React Query for API.

Backend: Node/Express (or Next API routes).

DB: Postgres (Supabase) or Firebase (if you want built-in auth & storage).

Files: Store covers on object storage (S3/Supabase). Books remain on Google Drive (no re-hosting).

Perf: cache book list; CDN thumbnails; HTTP/2; prefetch on hover.

Resilience: graceful Drive failures; retries; error logs in /t/logs (optional).

Privacy: no public profiles, no student-to-student visibility.

🧪 Edge cases & how we stay kind
Student skips reflection: Save completion with responses: []. Teacher sees “Finished (no note)”.

Very short answers: Soft nudge: “Can you add one more sentence?” But allow submit.

Offline blip on submit: Queue completion in localStorage; background retry; toast “Saved when you’re back online.”

Multiple devices: Session is per device; if needed, allow “Find me” with name + class + teacher PIN (later).

🎯 Acceptance criteria (so devs & you can say ‘done’)
Student can enter name, browse, open, finish, and submit a reflection—under 60 seconds on a good connection.

Teachers can see who finished what and read reflections within 2 clicks from /t/completions.

No grades, badges, or public ratings anywhere.

All actions keyboard-accessible; focus outline visible; forms labelled.

Drive link failure does not block the rest of the site and gives a clear, kind message.

📄 Sample microcopy (drop-in)
Finish prompt title: “A tiny note before you go?”

Reflection hint: “Start with ‘I felt…’ or ‘This surprised me because…’”

Success toast: “Lovely. Your note is saved.”

Empty discover: “What are you in the mood for—funny, fast, or magical?”

Teacher view > row action: “View note” • “Mark seen”

Stacl - Svelte + Typsecript - completely static and local with no server. can be pushed easily to github pages to run. No auth or aything else recquired

