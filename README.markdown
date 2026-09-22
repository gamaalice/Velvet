# Velvet

Velvet is a personal reading management application designed to help readers organize their books and keep track of their reading journey in one place.

The project was developed as a complete web application, with authentication, user-based data isolation, PostgreSQL persistence, book management, reading status organization, ratings, reviews, and a responsive interface.

Velvet's purpose is to provide a simple and organized space where readers can manage their personal library, track books they want to read, books currently being read, and books they have already finished.

## Try Velvet

Want to organize your own reading library? [Access the web version](https://velvet-eight-chi.vercel.app/sign-in) and create your account to start tracking your books.

## Project Context

Velvet was created around a simple idea: making it easier to organize personal reading.

Books that a person wants to read, is currently reading, or has already finished can easily become scattered across notes, applications, or memory. This makes it harder to maintain a clear overview of a personal library and reading progress.

The idea behind Velvet was to turn this into a dedicated reading experience.

The application organizes books into three main reading categories:

- Read
- Want to Read
- Reading

Each book can have its own information, including title, author, year, genre, reading status, rating, review, and reading completion date.

The application also separates data by authenticated user, ensuring that each account has its own personal library.

## Features

Velvet includes:

- user sign-up and login;
- authenticated user sessions;
- user-based data isolation;
- book creation and editing;
- book deletion;
- reading status management;
- organization by reading status;
- title and author information;
- publication year;
- custom genres;
- optional rating from 0 to 5 stars;
- personal reviews for completed books;
- reading completion information;
- dedicated details page for completed books;
- responsive interface for desktop and mobile;
- PostgreSQL data persistence;
- protected application routes.

## Reading Organization

Velvet organizes the personal library into three reading states:

### Read

Books that have already been completed.

Completed books can have additional information such as:

- rating;
- personal review;
- reading completion date.

### Reading

Books that are currently being read.

### Want to Read

Books saved for future reading.

This structure allows the library to work as both a book collection and a simple reading tracker.

## Technologies Used

- Next.js
- React
- TypeScript
- PostgreSQL
- Prisma
- Better Auth
- Lucide React
- Vercel

## Authentication and Data Security

Velvet uses Better Auth for authentication and session management.

Book data is associated with the authenticated user's account.

The application uses the user's authenticated identity when retrieving, creating, updating, and deleting books. This prevents one user from accessing another user's library.

The database structure associates each book with its owner:

```text
User
 └─ Books
     ├─ Read
     ├─ Reading
     └─ Want to Read
```

This was an important architectural decision because Velvet was designed as a multi-user application rather than a shared public library.

## Database

Velvet uses PostgreSQL as its relational database.

Prisma is used as the ORM responsible for communication between the application and the database.

The main entities include:

```text
User
Session
Account
Verification
Book
Genre
```

Books are associated with users, while genres are handled through the application's relational structure.

## Book Management

The book form was designed to keep information optional rather than forcing users to complete every field.

A book can contain:

- title;
- author;
- publication year;
- genre;
- reading status.

When the status is set to `Read`, additional optional fields become available:

- rating from 0 to 5;
- personal review;
- reading completion date.

This allows users to record as much or as little information as they want.

## Screenshots

Screenshots of the application:

## Repository Structure

The repository contains the complete Velvet application source code.

```text
Velvet/
├─ app/
│  ├─ api/
│  │  └─ books/
│  ├─ books/
│  │  └─ [id]/
│  ├─ sign-in/
│  ├─ sign-up/
│  ├─ globals.css
│  ├─ layout.tsx
│  └─ page.tsx
├─ components/
├─ generated/
├─ lib/
│  ├─ auth.ts
│  ├─ books.ts
│  └─ prisma.ts
├─ prisma/
├─ public/
├─ .env.example
├─ package.json
└─ README.md
```

Sensitive environment variables and local configuration are not included in the repository.

## Technical Decisions

Next.js ended up being the natural choice to build the whole application on, since it let me handle both the frontend and the API routes without having to maintain two separate projects. TypeScript was non-negotiable for me here — with a data model that has users, books, genres, and reading statuses all connected, catching type mistakes before runtime saved a lot of debugging time.

For the database, I went with PostgreSQL paired with Prisma. Prisma's schema made it a lot easier to reason about the relationships between users and their books, and migrations became straightforward instead of something I had to fight with.

Authentication was handled through Better Auth, and every book operation — create, read, update, delete — is tied to the authenticated user's ID. This was the core of making Velvet actually feel like a multi-user app instead of a shared list that anyone could see or edit.

On the interface side, I made a conscious call to keep most book fields optional. Not everyone wants to fill in a rating or write a review right away, so the form only asks for more detail once a book is marked as "Read." I also split the completed-book experience into its own details page, since finished books carry more information (rating, review, completion date) than books still in progress.

Finally, the whole thing was built to be responsive from the start and deployed on Vercel, mostly because it fit naturally with the Next.js setup and made shipping updates simple.

## User Accounts and Data Isolation

Velvet is a multi-user application where each person has their own account and personal book library.

After signing up and logging in, users can manage their own books independently from other accounts.

Each book is associated with the account that created it, and all book operations use the authenticated user's ID.

Conceptually, the application works like this:

```text
Alice's account
 └─ Personal library
     ├─ Book A
     ├─ Book B
     └─ Book C

Another user's account
 └─ Personal library
     ├─ Book D
     └─ Book E
```

## Responsive Interface

Velvet was designed to work across different screen sizes.

The interface adapts the reading library, book management forms, authentication screens, and book details pages for desktop and mobile environments.

The visual design was developed specifically for the application, using a soft editorial aesthetic centered around the reading experience.

## Challenges Faced

During development, some of the main challenges were:

- structuring the application as a real multi-user system;
- implementing authentication and sessions;
- ensuring that book data remains isolated between accounts;
- integrating Next.js with PostgreSQL and Prisma;
- organizing the database relationships between users, books, and genres;
- creating different behaviors depending on the book's reading status;
- implementing the completed-book details experience;
- keeping optional information truly optional;
- building a responsive interface;
- maintaining consistency across the application's different screens.

## Contact

To see other projects, experience, and professional information, visit my profiles:

LinkedIn: [Alice Gama](https://www.linkedin.com/in/alice-gama-75913022a/)

Portfolio: [Portfolio Website](https://dev-portfolio-two-lovat-95.vercel.app/)

GitHub: [gamaalice](https://github.com/gamaalice)

Web: [Velvet](https://velvet-eight-chi.vercel.app/sign-in)
