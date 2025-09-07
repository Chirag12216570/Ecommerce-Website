# Implementation.md

## Approach
This project enhances the Node.js e-commerce backend to deliver robust analytics for product trends and visitor tracking, as required for the AcademyMint Software Developer Internship assignment. The solution is built using Express.js, Prisma ORM, and MySQL. All analytics endpoints support bucket-based filtering (day/week/month) and flexible date ranges, with results formatted in UTC for consistency and industry best practices.

### Key Design Principles
- **Scalability:** Schema and endpoints are designed for efficient aggregation and future extensibility.
- **Reliability:** All date logic uses UTC to avoid timezone bugs and ensure consistent analytics.
- **Maintainability:** Code is modular, well-commented, and includes debug logging for easy troubleshooting.

## Schema Changes
- **ProductTrend Table:**
  - Tracks product views and sales per product per day/week/month.
  - Fields: `id`, `productId`, `date`, `views`, `sales`.
  - Relation: Linked to `Product`.
- **VisitorLog Table:**
  - Tracks each visitor action (e.g., product view) with timestamp, user, and product reference.
  - Fields: `id`, `userId`, `productId`, `action`, `visitedAt`.
  - Relation: Linked to `User` and `Product`.
- **Migrations:** All schema changes are managed via Prisma migrations and are synced with MySQL.

## API Details

### 1. `/dashboard/products`
- **Purpose:** Returns product analytics bucketed by day/week/month, with flexible date range support.
- **Query Parameters:**
  - `startDate` (optional, YYYY-MM-DD)
  - `endDate` (optional, YYYY-MM-DD)
  - `bucket` (optional, day/week/month)
- **Response Example:**
```
[
  {
    "startDate": "2025-09-06T00:00:00.000Z",
    "endDate": "2025-09-06T00:00:00.000Z",
    "views": 1,
    "sales": 1
  }
]
```
- **Logic:** Aggregates `ProductTrend` records by bucket, using UTC for all calculations.

### 2. `/dashboard/visitors`
- **Purpose:** Returns visitor analytics bucketed by day/week/month, with flexible date range support.
- **Query Parameters:**
  - `startDate` (optional, YYYY-MM-DD)
  - `endDate` (optional, YYYY-MM-DD)
  - `bucket` (optional, day/week/month)
- **Response Example:**
```
[
  {
    "startDate": "2025-09-07T00:00:00.000Z",
    "endDate": "2025-09-07T00:00:00.000Z",
    "visits": 4
  }
]
```
- **Logic:** Aggregates `VisitorLog` records by bucket, using UTC for all calculations.

## Optional Features Attempted
- **UTC Bucket Logic:** Ensures analytics are timezone-agnostic and reliable for global use.
- **Flexible Buckets:** Supports day, week, and month aggregation for both endpoints.
- **Debug Logging:** Console logs for query ranges, found records, and bucket calculations to aid validation and troubleshooting.
- **Prisma Studio Integration:** Enables easy inspection and manual validation of analytics data.
- **Demo/Test Endpoints:** `/api/test-visitor` and similar for manual data insertion and testing.

## How to Test
1. Use Postman to POST visitor logs to `/api/test-visitor` and product views/sales (if endpoint available).
2. Use GET requests to `/dashboard/products` and `/dashboard/visitors` with various date ranges and bucket types.
3. Check responses for correct bucket aggregation and date formatting.
4. Use Prisma Studio to inspect the `ProductTrend` and `VisitorLog` tables for matching records.

## Packaging & Submission
- All code changes are committed separately from the base repo setup for clarity.
- This file (Implementation.md) is included in the repository root.
- Zip the repository including all code and Implementation.md.
- Submit to joinus@academymint.com with the subject line: `Node JS Case Study Submission – [Your Name]`.

## Why This Implementation Is Industry-Ready
- **Best Practices:** Uses UTC, modular code, and clear separation of concerns.
- **Extensible:** Easily supports new analytics features or additional buckets.
- **Testable:** All features can be validated via API and database inspection.
- **Documented:** Every step and feature is described for reviewers and future maintainers.
