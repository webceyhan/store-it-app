# Store It App

A modern file storage and sharing platform built with [Next.js](https://nextjs.org), [Appwrite](https://appwrite.io/), and [TypeScript](https://www.typescriptlang.org/). Store, manage, and share your files securely in the cloud.

---

## 🚀 Features

- **User Authentication**: Sign up and sign in with email OTP (One-Time Password) using Appwrite.
- **File Upload & Storage**: Upload files of any type and size, stored securely in Appwrite Storage.
- **File Management**: Rename, delete, and share files with other users.
- **Usage Analytics**: Visualize your storage usage with interactive charts.
- **Access Control**: Share files with specific users via email.
- **Responsive UI**: Built with [shadcn/ui](https://ui.shadcn.com/) and [Tailwind CSS](https://tailwindcss.com/).
- **Type Safety**: End-to-end type safety with TypeScript and Zod validation.
- **Appwrite Integration**: Uses Appwrite Databases, Storage, and Auth APIs.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 14 (App Router)](https://nextjs.org/)
- **Backend as a Service**: [Appwrite](https://appwrite.io/)
- **Database**: Appwrite Databases
- **Storage**: Appwrite Storage Buckets
- **Authentication**: Appwrite Auth (Email OTP)
- **UI**: [shadcn/ui](https://ui.shadcn.com/), [Tailwind CSS](https://tailwindcss.com/)
- **Charts**: [Recharts](https://recharts.org/)
- **Validation**: [Zod](https://zod.dev/)
- **Utilities**: Custom utility functions in `/lib/utils.ts`
- **Types**: Custom types in `/types`

---

## 🏁 Getting Started

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/store-it-app.git
   cd store-it-app
   ```

2. **Install dependencies:**

   ```bash
   npm install
   # or
   yarn
   ```

3. **Configure environment variables:**

   Create a `.env.local` file and add your Appwrite credentials:

   ```
   NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
   NEXT_PUBLIC_APPWRITE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_APPWRITE_BUCKET_ID=your-bucket-id
   NEXT_PUBLIC_APPWRITE_DATABASE_ID=your-database-id
   NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID=your-users-collection-id
   NEXT_PUBLIC_APPWRITE_FILES_COLLECTION_ID=your-files-collection-id
   ```

4. **Run the development server:**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open the app:**

   Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

- `/app` - Next.js app directory (routes, pages, layouts)
- `/components` - Reusable UI and feature components
- `/lib` - Appwrite clients, utility functions, and server actions
- `/types` - TypeScript types and interfaces
- `/public` - Static assets

---

## 🧩 Key Concepts

- **Appwrite Integration**: All file and user actions are handled via Appwrite's SDK and REST APIs.
- **Server Actions**: Business logic and data fetching are implemented as server actions in `/lib/actions`.
- **Validation**: Forms use Zod schemas for robust validation.
- **Session Management**: Auth sessions are managed with secure cookies.
- **File Sharing**: Files can be shared with other users by adding their email to the file's access list.

---

## 📊 Utilities & Custom Functions

- `constructFileUrl(fileId)` - Generates a public URL for a file in Appwrite Storage.
- `getUsageSummary(files)` - Aggregates file sizes for usage analytics.
- `calculatePercentage(value, total)` - Calculates storage usage percentage.
- `parseStringify(obj)` - Deep clones objects for safe serialization.
- `handleError(error, message)` - Centralized error handling utility.

---

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Appwrite Documentation](https://appwrite.io/docs)
- [shadcn/ui Docs](https://ui.shadcn.com/docs)
- [Recharts Docs](https://recharts.org/en-US/examples)
- [Zod Docs](https://zod.dev/)

---

## ☁️ Deployment

The easiest way to deploy your Next.js app is with [Vercel](https://vercel.com/).  
For Appwrite, you can use [Appwrite Cloud](https://cloud.appwrite.io/) or self-host your own instance.

See [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

## 📝 License

MIT

---

## 🙏 Credits

This project is based on the YouTube tutorial  
**Build and Deploy a Full Stack Google Drive Clone with Next.js 15**  
by [jsmastery.com](https://jsmastery.com)  
Watch the tutorial: [https://www.youtube.com/watch?v=lie0cr3wESQ](https://www.youtube.com/watch?v=lie0cr3wESQ)
