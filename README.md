# Medicine Management System

This is a backend API for a Medicine Management System that allows you to manage medical stores, medicines, and prescriptions.

## Tech Stack

-   **Backend:** Node.js, Express.js, TypeScript
-   **Database:** PostgreSQL
-   **ORM:** Prisma
-   **Database Hosting:** Supabase

## Prerequisites

Before you begin, ensure you have the following installed:

-   [Node.js](https://nodejs.org/) (v14 or higher)
-   [npm](https://www.npmjs.com/) (v6 or higher)
-   [PostgreSQL](https://www.postgresql.org/)

## Getting Started

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/medicine-management-system.git
    cd medicine-management-system
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set up the environment variables:**

    Create a `.env` file in the `server` directory and add your PostgreSQL database URL:

    ```env
    DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
    ```

4.  **Set up the database:**

    Run the following commands to generate the Prisma client and push the database schema:

    ```bash
    npx prisma generate
    npx prisma db push
    ```

5.  **Run the application:**

    -   To start the server:
        ```bash
        npm run dev
        ```
    -   To start the client:
        ```bash
        npm start
        ```
    -   To view the database with Prisma Studio:
        ```bash
        npx prisma studio
        ```

## Data Models

### Store

Represents a medical store.

| Field     | Type      | Description               |
| :-------- | :-------- | :------------------------ |
| `id`      | `Int`     | Unique identifier         |
| `name`    | `String`  | Name of the store         |
| `medicines`| `Medicine[]`| List of medicines in the store |
| `billings`| `Billing[]` | List of billings from the store |

### Medicine

Represents a medicine in a store.

| Field        | Type      | Description                  |
| :----------- | :-------- | :--------------------------- |
| `id`         | `Int`     | Unique identifier            |
| `name`       | `String`  | Name of the medicine         |
| `storeId`    | `Int`     | ID of the store it belongs to|
| `expirydate` | `DateTime`| Expiry date of the medicine  |
| `stock`      | `Int`     | Available stock              |
| `billings`   | `Billing[]`| List of billings for the medicine |

### Billing

Represents a billing record for a medicine.

| Field        | Type     | Description                  |
| :----------- | :------- | :--------------------------- |
| `id`         | `Int`    | Unique identifier            |
| `medicineId` | `Int`    | ID of the medicine being billed |
| `storeId`    | `Int`    | ID of the store              |
| `frequency`  | `String` | Dosage frequency (e.g., "1-0-1") |
| `name`       | `String` | Name of the patient          |
| `number`     | `String` | Contact number of the patient|

## API Endpoints

### Stores

-   `GET /api/stores`: Get all stores
-   `POST /api/stores`: Create a new store
-   `PUT /api/stores/:id`: Update a store
-   `DELETE /api/stores/:id`: Delete a store

### Medicines

-   `GET /api/medicines`: Get all medicines
-   `POST /api/medicines`: Create a new medicine
-   `PUT /api/medicines/:id`: Update a medicine
-   `DELETE /api/medicines/:id`: Delete a medicine

### Billings

-   `GET /api/billings`: Get all billings
-   `POST /api/billings`: Create a new billing
-   `PUT /api/billings/:id`: Update a billing
-   `DELETE /api/billings/:id`: Delete a billing

## Usage Examples

### Create a Store

```http
POST /api/stores
Content-Type: application/json

{
  "name": "My Medical Store"
}
```

### Add a Medicine

```http
POST /api/medicines
Content-Type: application/json

{
  "name": "Aspirin",
  "storeId": 1,
  "expirydate": "2026-01-01T00:00:00.000Z",
  "stock": 200
}
```

### Create a Billing

```http
POST /api/billings
Content-Type: application/json

{
  "medicineId": 1,
  "storeId": 1,
  "frequency": "1-1-1",
  "name": "Jane Doe",
  "number": "0987654321"
}
```

## Features

-   **Automatic Stock Management:** Automatically updates medicine stock levels when a new billing is created.
-   **Data Validation:** Ensures that the data sent to the API is valid.
-   **CORS Enabled:** Allows cross-origin requests from any domain.
-   **Transactional Safety:** Ensures that database operations are performed safely and consistently.
