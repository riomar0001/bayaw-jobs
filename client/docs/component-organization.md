# Component Organization Guide

This document defines the conventions for structuring and naming components in this project. Follow these rules when adding new components or refactoring existing ones.

---

## Core Principle

Components are organized **by feature domain**, mirroring the page structure in `app/`. Each feature folder contains only the components used by that section of the app.

```
components/
├── <feature>/          ← mirrors a section of the app
│   ├── <page-scope>/   ← mirrors a specific page within that section
│   │   ├── forms/      ← form components live here
│   │   └── *.tsx       ← display/UI components
│   └── *.tsx           ← shared within the feature
├── shared/             ← cross-feature layout components
└── ui/                 ← shadcn primitives only
```

---

## Folder → Page Mapping

| `components/` folder            | Maps to `app/` routes                                       |
| ------------------------------- | ----------------------------------------------------------- |
| `applicants/applications/`      | `(applicant)/applications/page.tsx`                         |
| `applicants/onboarding/`        | `(applicant)/onboarding/page.tsx`                           |
| `applicants/profile/`           | `(applicant)/profile/page.tsx`                              |
| `applicants/settings/`          | `(applicant)/settings/**/page.tsx`                          |
| `company/`                      | `(applicant)/companies/[id]/page.tsx` (public company view) |
| `company/dashboard/dashboard/`  | `company/(dashboard)/page.tsx`                              |
| `company/dashboard/applicants/` | `company/(dashboard)/applicants/**/page.tsx`                |
| `company/dashboard/jobs/`       | `company/(dashboard)/jobs/**/page.tsx`                      |
| `company/dashboard/business/`   | `company/(dashboard)/business/page.tsx`                     |
| `company/dashboard/settings/`   | `company/(dashboard)/settings/**/page.tsx`                  |
| `company/dashboard/layout/`     | `company/(dashboard)/layout.tsx`                            |
| `home/`                         | `(landing)/page.tsx`                                        |
| `job/`                          | `(applicant)/jobs/[id]/page.tsx`                            |
| `jobs/`                         | `(applicant)/jobs/page.tsx`                                 |
| `shared/`                       | Layouts, navbar, footer — used across multiple sections     |
| `ui/`                           | shadcn/ui primitives — never page-specific logic            |

---

## The `forms/` Rule

> **Any component that collects user input belongs in a `forms/` subfolder.**

A component is a form if it:

- Contains a `<form>` element, OR
- Uses `react-hook-form` (`useForm`, `FormField`, etc.), OR
- Its primary job is submitting data to the server

**Place it at:** `components/<feature>/<page-scope>/forms/<name>-form.tsx`

### Current project — where forms belong

```
components/
├── applicants/
│   ├── onboarding/
│   │   ├── forms/
│   │   │   ├── education-form.tsx        ← was: education-form.tsx
│   │   │   ├── experience-form.tsx       ← was: experience-form.tsx
│   │   │   ├── languages-form.tsx        ← was: languages-form.tsx
│   │   │   ├── personal-info-form.tsx    ← was: personal-info-step.tsx *
│   │   │   └── skills-form.tsx           ← was: skills-form.tsx
│   │   ├── progress-stepper.tsx
│   │   └── resume-upload.tsx
│   └── settings/
│       ├── forms/
│       │   ├── information-form.tsx      ← was: information-form.tsx
│       │   └── password-form.tsx         ← was: password-form.tsx
│       └── login-history-table.tsx
├── company/
│   └── dashboard/
│       ├── business/
│       │   ├── forms/
│       │   │   └── business-profile-form.tsx  ← was: business-profile-form.tsx
│       │   └── location-manager.tsx
│       ├── jobs/
│       │   ├── forms/
│       │   │   └── job-form.tsx          ← was: job-form.tsx
│       │   ├── columns.tsx
│       │   ├── data-table.tsx
│       │   ├── job-applicants-table.tsx
│       │   ├── job-status-badge.tsx
│       │   └── jobs-table.tsx
│       └── settings/
│           ├── forms/
│           │   ├── password-form.tsx     ← was: password-form.tsx
│           │   └── profile-form.tsx      ← was: profile-form.tsx
│           ├── admins/
│           │   ├── admin-config.ts
│           │   ├── admins-table.tsx
│           │   ├── edit-member-dialog.tsx
│           │   ├── invite-dialog.tsx
│           │   └── remove-dialog.tsx
│           ├── login-history.tsx
│           └── manage-admins.tsx
```

> `*` `personal-info-step.tsx` should be renamed `personal-info-form.tsx` since it is a form, not a step indicator.

---

## Naming Conventions

| Component type          | Suffix           | Example                  |
| ----------------------- | ---------------- | ------------------------ |
| Form                    | `-form.tsx`      | `job-form.tsx`           |
| Dialog                  | `-dialog.tsx`    | `edit-member-dialog.tsx` |
| Table                   | `-table.tsx`     | `applicants-table.tsx`   |
| Card                    | `-card.tsx`      | `stats-card.tsx`         |
| List                    | `-list.tsx`      | `recent-jobs-list.tsx`   |
| Data table columns      | `columns.tsx`    | `columns.tsx`            |
| Data table wrapper      | `data-table.tsx` | `data-table.tsx`         |
| Configuration/constants | `-config.ts`     | `admin-config.ts`        |

All files use **`kebab-case`** — no PascalCase filenames.

---

## Decision Flowchart

Use this when deciding where to put a new component:

```
Is it a shadcn primitive?
  └─ YES → components/ui/

Is it used across multiple unrelated features?
  └─ YES → components/shared/

Which section of the app uses it?
  ├─ Landing page          → components/home/
  ├─ Applicant job list    → components/jobs/
  ├─ Applicant job detail  → components/job/
  ├─ Company public view   → components/company/
  ├─ Applicant dashboard   → components/applicants/<page-scope>/
  └─ Company dashboard     → components/company/dashboard/<page-scope>/

Does the component collect user input (form/react-hook-form)?
  └─ YES → put it in the forms/ subfolder of its page-scope folder
```

---

## Full Reference Structure

The complete intended component tree:

```
components/
├── applicants/
│   ├── applications/
│   │   ├── application-card.tsx
│   │   ├── application-filters.tsx
│   │   └── application-stats.tsx
│   ├── onboarding/
│   │   ├── forms/
│   │   │   ├── education-form.tsx
│   │   │   ├── experience-form.tsx
│   │   │   ├── languages-form.tsx
│   │   │   ├── personal-info-form.tsx
│   │   │   └── skills-form.tsx
│   │   ├── progress-stepper.tsx
│   │   └── resume-upload.tsx
│   ├── profile/
│   │   ├── active-applications-card.tsx
│   │   ├── career-status-card.tsx
│   │   ├── edit-education-dialog.tsx
│   │   ├── edit-experience-dialog.tsx
│   │   ├── edit-languages-dialog.tsx
│   │   ├── edit-personal-info-dialog.tsx
│   │   ├── edit-resume-dialog.tsx
│   │   ├── edit-skills-dialog.tsx
│   │   ├── profile-header.tsx
│   │   └── profile-section-card.tsx
│   └── settings/
│       ├── forms/
│       │   ├── information-form.tsx
│       │   └── password-form.tsx
│       └── login-history-table.tsx
├── company/
│   ├── company-about.tsx
│   ├── company-header.tsx
│   ├── company-open-positions.tsx
│   ├── company-sidebar.tsx
│   └── dashboard/
│       ├── applicants/
│       │   ├── applicant-status-select.tsx
│       │   ├── applicants-table.tsx
│       │   ├── columns.tsx
│       │   └── data-table.tsx
│       ├── business/
│       │   ├── forms/
│       │   │   └── business-profile-form.tsx
│       │   └── location-manager.tsx
│       ├── dashboard/
│       │   ├── analytics-chart.tsx
│       │   ├── application-pipeline.tsx
│       │   ├── recent-applicants-list.tsx
│       │   ├── recent-jobs-list.tsx
│       │   └── stats-card.tsx
│       ├── jobs/
│       │   ├── forms/
│       │   │   └── job-form.tsx
│       │   ├── columns.tsx
│       │   ├── data-table.tsx
│       │   ├── job-applicants-table.tsx
│       │   ├── job-status-badge.tsx
│       │   └── jobs-table.tsx
│       ├── layout/
│       │   ├── app-sidebar.tsx
│       │   ├── nav-main.tsx
│       │   ├── nav-user.tsx
│       │   ├── navbar.tsx
│       │   └── page-header.tsx
│       └── settings/
│           ├── forms/
│           │   ├── password-form.tsx
│           │   └── profile-form.tsx
│           ├── admins/
│           │   ├── admin-config.ts
│           │   ├── admins-table.tsx
│           │   ├── edit-member-dialog.tsx
│           │   ├── invite-dialog.tsx
│           │   └── remove-dialog.tsx
│           ├── login-history.tsx
│           └── manage-admins.tsx
├── home/
│   ├── company-card.tsx
│   ├── job-card.tsx
│   └── search-bar.tsx
├── job/
│   ├── job-apply-card.tsx
│   ├── job-company-card.tsx
│   ├── job-description.tsx
│   ├── job-header.tsx
│   ├── job-overview-card.tsx
│   └── job-related.tsx
├── jobs/
│   └── job-filters.tsx
├── shared/
│   ├── auth-form-layout.tsx
│   ├── cta-banner.tsx
│   ├── footer.tsx
│   ├── hero-section.tsx
│   ├── navbar.tsx
│   ├── pagination.tsx
│   └── value-proposition.tsx
└── ui/
    └── ... (shadcn primitives)
```
