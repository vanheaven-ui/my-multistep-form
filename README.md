# Multi-Step Form with Dashboard & File Uploads

[Live Demo](https://my-multistep-form.vercel.app)

A professional, fully responsive **multi-step form app** built with **Next.js, React, TypeScript, Tailwind CSS, and Recharts**. Perfect as a client-ready template.

![landing](image.png)
---

## Highlights

- **Multi-Step Form**
  - Collects personal and contact info
  - Multiple file uploads to **AWS S3**
  - Validation with **React Hook Form** + **Zod**
  - Review & submit step for better UX

- **Dashboard**
  - **Bar Chart**: Attachments per user
  - **Pie Chart**: Submissions per email domain
  - Stats: Total submissions, attachments, unique email domains
  - CSV export of submissions
  - Fully responsive and mobile-friendly

- **Tech & Best Practices**
  - TypeScript with strict typing
  - Reusable components (StatCard, ChartCard)
  - Clean code with ESLint + Prettier
  - Tested with Vitest + React Testing Library
  - Ready for production deployment

---

## Tech Stack

- **Frontend:** React 19, Next.js 16, Tailwind CSS 4, Recharts, react-icons  
- **Backend:** Next.js API Routes, Prisma, PostgreSQL  
- **Cloud:** AWS S3 for file storage  
- **Dev Tools:** TypeScript, ESLint, Prettier, Husky, Vitest  

---

## Installation

```bash
git clone https://github.com/yourusername/my-multistep-form.git
cd my-multistep-form
pnpm install
```
Access at http://localhost:3000

### Environment Variables

To configure the application, create a file named `.env` in the root directory and add the following variables:

```bash
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"
AWS_ACCESS_KEY_ID="your_aws_access_key"
AWS_SECRET_ACCESS_KEY="your_aws_secret_key"
AWS_REGION="your_aws_region"
S3_BUCKET_NAME="your_bucket_name"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```
Make sure AWS credentials have proper permissions for S3 uploads. <br />
**Note**:- _For production, remember to replace the placeholder values with your actual credentials._

## Running the Project

To get the application running:

1.  **Start the development server:**
    ```bash
    pnpm dev
    ```
    The application will be accessible at **http://localhost:3000**.

2.  **Build and start for production:**
    First, build the project:
    ```bash
    pnpm build
    ```
    Then, start the production server:
    ```bash
    pnpm start
    ```
    The production application will be accessible at **http://localhost:3000**.

## Testing

To ensure the project is stable and error-free, use the following commands:

* **Run unit and integration tests:**
    ```bash
    pnpm test
    ```

* **Run with coverage report:** This generates a report (usually in an `coverage/` folder) showing which parts of your code are covered by tests.
    ```bash
    pnpm test:coverage
    ```

* **Run TypeScript type checking:** This verifies that all types are correctly used throughout the project without running any code.
    ```bash
    pnpm typecheck
    ```

## Future Enhancements

I plan to implement the following features in upcoming versions:

* **Role-based access control** for the administrative dashboard.
* Support for **more chart types and advanced filtering options** in data visualization.
* **Email notifications** triggered automatically upon successful form submission.
* **Drag-and-drop file upload support** for a better user experience.
* **Mobile-friendly dashboard optimizations** for better accessibility on smaller devices.

## License

This project is licensed under the **[MIT License](/LICENCE.md)**.

Copyright (c) 2025, Mworekwa Ezekiel
