# Job Portal

This project is a job portal application built with React, Express, Prisma, Supabase, and PostgreSQL for both database and storage.

## Technologies Used

- **React**: Frontend library for building user interfaces.
- **Express**: Backend framework for building APIs.
- **Prisma**: ORM for interacting with the database.
- **Supabase**: Backend as a service providing database and storage solutions.
- **PostgreSQL**: Relational database management system.

## Getting Started

### Prerequisites

- Node.js
- npm or yarn
- Supabase account
- PostgreSQL

### Installation

1. Clone the repository:

    ```sh
    git clone https://github.com/your-username/job-portal.git
    cd job-portal
    ```

2. Install dependencies for both frontend and backend:

    ```sh
    npm install
    cd frontend
    npm install
    cd ..
    ```

3. Set up Supabase:
    - Create a new project in Supabase.
    - Get the API keys and URL from the Supabase dashboard.
    - Create a `.env` file in the root directory and add your Supabase credentials:
      ```env
      SUPABASE_URL=your-supabase-url
      SUPABASE_KEY=your-supabase-key
      ```

### Environment

Create a `.env` file in the root directory and add the following environment variables:

```env
# Environment
NODE_ENV=development

# Database
DATABASE_HOST=
DATABASE_USERNAME=
DATABASE_PASSWORD=
DATABASE_NAME=
DATABASE_PORT=

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# JWT Secret
JWT_SECRET_COMPANY=
JWT_SECRET_APPLICANT=

SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_PROFILE_COMPANY_LOGO=
SUPABASE_PROFILE_APPLICANT_PICTURE_BUCKET=
SUPABASE_PROFILE_APPLICANT_RESUME=

# Server Port
PORT=

# Connect to Supabase via connection pooling with Supavisor.
DATABASE_URL=

# Direct connection to the database. Used for migrations.
DIRECT_URL=

# Supabase Storage
ACCESS_KEY_ID=
SECRET_ACCESS_KEY=
```

### Scripts

- **Production**:
  ```sh
  npm run prod
  ```
- **Development Server**:
  ```sh
  npm run dev-server
  ```
- **Development Client**:
  ```sh
  npm run dev-client
  ```
- **Development**:
  ```sh
  npm run dev
  ```
- **Build**:
  ```sh
  npm run build
  ```

### Running the Application

1. For development:

    ```sh
    npm run dev
    ```

2. For production:
    ```sh
    npm run build
    npm run prod
    ```

## License

This project is licensed under the MIT License.

## Acknowledgements

- [React](https://reactjs.org/)
- [Express](https://expressjs.com/)
- [Prisma](https://www.prisma.io/)
- [Supabase](https://supabase.io/)
- [PostgreSQL](https://www.postgresql.org/)

## Authors

- @riomar0001 - Mario Jr Inguito
- @mismaresenka - Albert Pueso 
- @ranielART - Raniel Art Montebon 
- @TeaGainz - Sgt.Oddball 
- @ykylejan - John Kyle Dellatan
