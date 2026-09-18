# Velvet

Velvet is a personal reading management application designed to help readers organize their books and keep track of their reading journey in one place.

The project was developed as a complete web application, with authentication, user-based data isolation, PostgreSQL persistence, book management, reading status organization, ratings, reviews, and a responsive interface.

Velvet’s purpose is to provide a simple and organized space where readers can manage their personal library, track books they want to read, books currently being read, and books they have already finished.

## Main Links

Web application:

[access web version](YOUR_VERCEL_URL)

GitHub repository:

[Velvet](https://github.com/gamaalice/Velvet)

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

### Landing Page






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

Some important technical decisions in Velvet include:

- using Next.js as the main application framework;
- using TypeScript for type safety;
- using PostgreSQL for relational data persistence;
- using Prisma as the database ORM;
- using Better Auth for authentication and session management;
- associating books with authenticated users;
- protecting book operations through the authenticated user's ID;
- using relational models for books and genres;
- keeping optional book information optional in the user interface;
- separating completed-book details from books that are still being read or waiting to be read;
- building a responsive interface for desktop and mobile;
- deploying the application through Vercel.

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

## Local Execution

To run Velvet locally, clone the repository and install the dependencies:

```bash
git clone https://github.com/gamaalice/Velvet.git
cd Velvet
pnpm install
```

Create a `.env` file with the required environment variables:

```env
DATABASE_URL="your-postgresql-connection-string"
BETTER_AUTH_URL="http://localhost:3000"
```

Run the database migrations:

```bash
pnpm prisma migrate dev
```

Start the development server:

```bash
pnpm dev
```

The application will be available at:

```text
http://localhost:3000
```

## Contact

To see other projects, experience, and professional information, visit my profiles:

LinkedIn: [Alice Gama](https://www.linkedin.com/in/alice-gama-75913022a/)

Portfolio: [Portfolio Website](https://dev-portfolio-two-lovat-95.vercel.app/)

GitHub: [gamaalice](https://github.com/gamaalice)