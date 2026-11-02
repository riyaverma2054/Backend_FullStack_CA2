# Student Feedback Management API

A REST API built with Node.js, Express, MongoDB, and Mongoose.

## Setup

1. Install Node.js and start a local MongoDB instance, or provide a MongoDB connection URI.
2. Install dependencies:

   ```sh
   npm install
   ```

3. Copy `.env.example` to `.env` and set `MONGODB_URI` (and optionally `PORT`).
4. Start the API:

   ```sh
   npm start
   ```

## Endpoints

### Submit feedback

`POST /api/feedback`

```json
{
  "studentName": "Asha Kumar",
  "courseName": "Backend Development",
  "message": "The session was clear and useful.",
  "rating": 5
}
```

`reviewStatus` is created as `Pending`. A successful request returns `201 Created`.

### Retrieve feedback

`GET /api/feedback?page=1&limit=10`

Both query parameters are optional; they default to `page=1` and `limit=10`. The response contains `feedback`, `currentPage`, `totalRecords`, and `totalPages`.

### Update review status

`PATCH /api/feedback/:id`

```json
{
  "reviewStatus": "Reviewed"
}
```

Allowed statuses are `Pending` and `Reviewed`. The API returns `404 Not Found` when the ID is valid but no matching record exists.
