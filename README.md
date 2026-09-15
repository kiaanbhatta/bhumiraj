# Bhumiraj Launchpad

Bhumiraj Computer Institute — Full-Stack Dynamic Website

Build a modern, professional, fully responsive, full-stack and completely dynamic website for Bhumiraj Computer Institute.

The website should feel like a real, established computer training institute, not like a generic AI-generated template. The design should be professional, clean, modern, trustworthy, interactive and slightly gamified because the website will also contain an advanced typing-test experience.

1. TECH STACK

Use a production-ready architecture:

React + TypeScript

Modern component-based UI

Tailwind CSS

Supabase for backend

PostgreSQL database

Supabase Authentication

Supabase Storage for images/files

Secure Row Level Security (RLS)

Admin role system

Student/user role system where required

Do NOT create a fake frontend-only dashboard.

The database, authentication, storage and admin functionality must actually work.

2. VERY IMPORTANT — FULLY DYNAMIC WEBSITE

The entire website must be database-driven wherever content can change.

The admin must NOT need to edit source code to update website content.

For example:

If the admin adds a new course from the dashboard:

Admin Dashboard → Add Course → Save → Database → Public Courses page automatically updates

The same principle must work for:

Courses

Gallery

Passed Students

News

Notices

Events

Teachers

Testimonials

Facilities

Homepage content

Contact information

Institute information

Typing-test content

Student records

Other manageable content

Use proper loading states, empty states, validation and error handling.

3. LOGIN SHOULD BE OPTIONAL

Do NOT force visitors to create an account.

The public website must be usable without login.

Visitors should be able to:

Browse the website

View courses

View gallery

Read news

View passed students

Contact the institute

Submit admission/application forms

Use the typing test

View public leaderboards if enabled

without creating an account.

Authentication should only be required for features that genuinely need an account, such as:

Saving personal typing records

XP and levels

Achievements

Personal dashboard

Enrolled-course information

Student-specific information

Provide a clear:

Login / Sign Up

option in the navbar, but do not make authentication mandatory for normal website browsing.

4. PUBLIC WEBSITE PAGES

Create these pages:

Home

Create a premium institute homepage containing:

Hero section

Institute introduction

Popular courses

Why Choose Us

Facilities

Featured gallery images

Passed students

Latest news

Upcoming events

Testimonials

Typing-test promotion section

Call-to-action sections

Contact section

Footer

The homepage should dynamically load content from the database where appropriate.

5. ABOUT PAGE

Include:

About Bhumiraj Computer Institute

Mission

Vision

Objectives

Institute achievements

Training approach

Facilities

Why students choose us

Allow admin to edit this content from the dashboard.

6. COURSES SYSTEM

Create a complete dynamic course management system.

Each course can contain:

Course name

Short description

Detailed description

Course image

Duration

Fee

Category

Syllabus

Requirements

Popular/featured status

Active/inactive status

Course order

Public users can:

Browse courses

Search courses

Filter courses

Open course details

Apply for a course

Admin can:

Add course

Edit course

Delete course

Upload/change course image

Change fee

Change duration

Edit syllabus

Feature/unfeature course

Enable/disable course

Do not hardcode courses into the frontend.

7. PHOTO GALLERY

Create a beautiful dynamic gallery.

Features:

Photo grid

Categories

Image lightbox

Full-screen image viewing

Smooth animations

Responsive layout

Lazy loading

Admin can:

Upload photos

Delete photos

Replace photos

Edit captions

Create categories

Delete categories

Mark featured photos

Store uploaded images using Supabase Storage.

8. VIDEO GALLERY

Create an optional video gallery.

Allow admin to:

Add video

Add title

Add description

Add thumbnail

Add YouTube/video URL

Edit video

Delete video

Display videos professionally on the public website.

9. PASSED STUDENTS GALLERY

Create a dedicated:

"Our Successful / Passed Students"

section.

Each student can contain:

Student name

Photo

Course

Completion year

Achievement

Short testimonial

Optional result/grade

Admin can:

Add student

Edit student

Delete student

Upload/change photo

Feature students

Add search/filter options if appropriate.

10. NEWS & NOTICES

Create a dynamic news and notice system.

Each news item should support:

Title

Cover image

Description/content

Category

Published date

Author

Featured status

Publish/unpublish status

Admin can:

Add news

Edit news

Delete news

Upload image

Publish/unpublish

Feature/unfeature

Create:

Latest News

News Details

Notices

Events

sections.

11. TEACHERS / STAFF

Create a dynamic staff section.

Each staff member can have:

Name

Photo

Position

Qualification

Experience

Short bio

Social links if required

Active/inactive status

Admin can add, edit and remove staff members.

12. FACILITIES

Create a dynamic facilities section.

Examples:

Computer Lab

Internet

Practical Training

Experienced Instructors

Modern Computers

Project-Based Learning

Certificate

Career Support

Admin should be able to add/edit/remove facilities.

13. TESTIMONIALS

Create dynamic student testimonials.

Each testimonial:

Student name

Photo

Course

Testimonial

Rating

Featured status

Admin can manage testimonials.

14. ONLINE ADMISSION

Create a professional online admission form.

Fields should include:

Full Name

Date of Birth

Gender

Phone

WhatsApp

Email

Address

Course

Education

Message

Optional photo/document

When submitted:

Save the application securely to Supabase

Show a beautiful success message

Generate application/reference number

Make the application visible in the admin dashboard

Admin can:

View applications

Search applications

Filter by course/status

Approve

Reject

Mark as pending

View applicant details

Delete applications

15. CONTACT SYSTEM

Create:

Phone

WhatsApp

Email

Address

Google Map/location

Social media links

Contact form

Contact information must be editable from the admin dashboard.

16. ADVANCED TYPING TEST GAME

Make the typing test one of the major features of the website.

Create a polished and interactive typing-test system.

Modes

Include:

English Typing

Nepali Typing

Practice Mode

Challenge Mode

Time Modes

30 seconds

60 seconds

2 minutes

5 minutes

Difficulty

Beginner

Intermediate

Advanced

Live Statistics

During the test display:

WPM

Accuracy

Correct characters

Incorrect characters

Errors

Remaining time

Progress

After finishing:

Show a professional result screen with:

Final WPM

Accuracy

Correct characters

Wrong characters

Errors

Score

Performance message

Restart button

17. TYPING GAME GAMIFICATION

Add:

XP system

Levels

Daily streak

Achievements

Badges

Personal best

Typing history

Leaderboard

Daily challenge

Example badges:

First Test

Speed Beginner

Speed Master

95% Accuracy

100% Accuracy

7 Day Streak

50 Tests Completed

Make the gamification motivating but still professional.

18. TYPING LEADERBOARD

Create a leaderboard containing:

Rank

Student/display name

WPM

Accuracy

Score

Date

Allow filtering by:

Daily

Weekly

Monthly

All Time

Do not expose sensitive personal information.

19. OPTIONAL STUDENT ACCOUNT

If a visitor creates an account, provide a student dashboard containing:

Profile

Typing history

Best WPM

Best accuracy

XP

Level

Badges

Streak

Leaderboard position

Enrolled courses if applicable

But remember:

ACCOUNT LOGIN IS OPTIONAL FOR THE MAIN WEBSITE.

20. ADMIN AUTHENTICATION

Create a secure admin authentication system.

Only authorized admins should access:

/admin

Do not expose admin functionality to normal visitors.

Use Supabase Authentication and proper Row Level Security.

Admin dashboard should have:

Dashboard

Total students

Applications

Courses

Gallery images

News

Passed students

Typing tests

Recent activity

Management

Courses

Gallery

Videos

Passed Students

News

Notices

Events

Teachers

Facilities

Testimonials

Students

Applications

Typing content

Site settings

21. ADMIN CONTENT MANAGEMENT

The admin dashboard should feel like a real CMS.

Every management section should support:

Add

Edit

Delete

Search

Filter

Sort

Publish/unpublish

Upload images

Confirmation dialogs

Success notifications

Error notifications

Use reusable components so the dashboard remains clean and maintainable.

22. SITE SETTINGS

Create an admin-controlled Site Settings section.

Admin can change:

Institute name

Logo

Favicon

Phone

WhatsApp

Email

Address

Social links

Opening hours

Hero text

Hero image

Footer content

Map location

Website announcements

These changes should automatically appear throughout the website.

23. UI / UX DESIGN

The design should be:

Professional + Modern + Educational + Interactive

Avoid making it look like a generic AI template.

Use:

Beautiful typography

Professional color palette

Strong visual hierarchy

Modern cards

Clean spacing

Subtle gradients

Smooth animations

Hover effects

Scroll animations

Sticky navbar

Responsive mobile navigation

Beautiful footer

Toast notifications

Skeleton loaders

Empty states

Error states

Confirmation dialogs

Make it excellent on:

Mobile

Tablet

Laptop

Desktop

24. DARK MODE

Add optional dark mode.

The user's preference should be remembered.

Make sure both light and dark themes remain professional and readable.

25. SEARCH

Add global/search functionality where useful.

Users should be able to search:

Courses

News

Passed students

Gallery

Typing content where appropriate

Use filters and sorting where useful.

26. SEO

Implement basic production-ready SEO:

Proper page titles

Meta descriptions

Semantic HTML

Open Graph metadata

Proper headings

Clean URLs

Image alt text

Sitemap-ready structure

27. PERFORMANCE

Optimize the website for speed.

Use:

Lazy loading

Optimized images

Code splitting where appropriate

Efficient database queries

Pagination for large lists

Loading skeletons

Proper caching where appropriate

Do not load every gallery image or news article at once.

28. SECURITY

Security is important.

Implement:

Supabase Authentication

Row Level Security

Admin authorization

Secure storage rules

Input validation

Form validation

Protected admin routes

Protected student data

Safe file upload validation

Proper error handling

Never expose secret keys in frontend code.

Use environment variables correctly.

29. DATABASE

Create a properly structured relational database.

Use appropriate tables for things such as:

users/profiles

admins

courses

course_syllabus

gallery

gallery_categories

videos

passed_students

news

notices

events

teachers

facilities

testimonials

admissions

typing_tests

typing_results

typing_leaderboard

achievements

user_achievements

site_settings

Create appropriate relationships, indexes and RLS policies.

Do not put everything into one giant table.

30. IMPORTANT ADMIN EXPERIENCE

The admin panel should be easy enough for a non-programmer to use.

For example:

Add Photo

Admin clicks:

Gallery → Add Photo → Upload → Caption → Category → Save

The photo immediately becomes available on the public website.

Add Course

Courses → Add Course → Fill Details → Upload Image → Publish

The course immediately appears on the public Courses page.

Add News

News → Add News → Write Article → Upload Image → Publish

The article immediately appears in Latest News.

No code editing should be required.

31. SAMPLE CONTENT

Initially populate the website with realistic sample content for Bhumiraj Computer Institute so the website does not look empty during development.

Clearly structure the content so the admin can replace it later.

Do not invent claims such as government accreditation, partnerships, awards or certifications unless explicitly provided.

32. ERROR HANDLING

Every important action must have:

Loading state

Success state

Error state

Empty state

Form validation

User-friendly error messages

Do not show raw database errors to users.

33. FINAL QUALITY REQUIREMENT

Before considering the project complete, test the complete flow:

Public User

Home → Courses → Course Details → Gallery → Passed Students → News → Typing Test → Admission → Contact

Admin

Login → Dashboard → Add Course → Edit Course → Delete Course → Upload Gallery Image → Delete Image → Add News → Edit News → Delete News → Add Passed Student → Manage Applications → Manage Site Settings

Optional Student

Sign Up → Login → Dashboard → Typing Test → Save Result → XP → Achievement → Leaderboard

Make sure all of these flows actually work.

Do not create buttons that do nothing.

Do not create fake statistics that pretend to come from a backend.

Do not create fake admin functionality.

34. DESIGN DIRECTION

The overall website should communicate:

"A modern, trustworthy computer training institute that also provides useful digital tools for students."

The typing test should make the website more interactive and memorable, while the rest of the website should remain professional and suitable for parents, students and institute visitors.

Create a polished production-quality interface rather than a simple demo.

Start by building the database schema, authentication, storage structure and core application architecture, then build the public website and admin dashboard on top of it.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://bhumiraj.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/6d4d5611-0a3e-4adb-a930-c28cb599fc03).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
