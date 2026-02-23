# Routes — bayaw-jobs-v2

> Route groups like `(auth)`, `(applicant)`, `(landing)`, and `(dashboard)` are layout groupings only and do not appear in the URL.

---

## 🌐 Landing (Public)

| Route      | Description         |
| ---------- | ------------------- |
| `/`        | Home / Landing page |
| `/about`   | About page          |
| `/contact` | Contact page        |
| `/privacy` | Privacy policy      |
| `/terms`   | Terms of service    |

---

## 🔐 Auth (General)

| Route              | Description     |
| ------------------ | --------------- |
| `/login`           | Login           |
| `/signup`          | Sign up         |
| `/forgot-password` | Forgot password |

---

## 👤 Applicant

| Route             | Description          |
| ----------------- | -------------------- |
| `/jobs`           | Browse jobs          |
| `/jobs/[id]`      | Job detail           |
| `/companies`      | Browse companies     |
| `/companies/[id]` | Company detail       |
| `/applications`   | My applications      |
| `/profile`        | Applicant profile    |
| `/onboarding`     | Applicant onboarding |

---

## 🏢 Company

### Auth

| Route                      | Description             |
| -------------------------- | ----------------------- |
| `/company/login`           | Company login           |
| `/company/signup`          | Company sign up         |
| `/company/forgot-password` | Company forgot password |

### Dashboard

| Route                        | Description         |
| ---------------------------- | ------------------- |
| `/company`                   | Dashboard home      |
| `/company/jobs`              | Manage jobs         |
| `/company/jobs/new`          | Post new job        |
| `/company/jobs/[id]`         | Job detail          |
| `/company/jobs/[id]/edit`    | Edit job            |
| `/company/applicants`        | View applicants     |
| `/company/applicants/[id]`   | Applicant detail    |
| `/company/business`          | Business profile    |
| `/company/settings/profile`  | Settings — Profile  |
| `/company/settings/security` | Settings — Security |
