# Expense Management System Backend

A comprehensive NestJS-based backend system for managing company expenses with approval workflows, OCR receipt scanning, and multi-currency support.

## Features

- 🔐 **Authentication & Authorization**: JWT-based authentication with role-based access control
- 👥 **User Management**: Complete user management with roles (employee, manager, admin)
- 🏢 **Company Management**: Multi-company support with custom settings
- 💰 **Expense Management**: Create, track, and manage expenses with receipts
- ✅ **Approval Workflows**: Configurable approval rules based on amount, category, and department
- 📸 **OCR Receipt Scanning**: Extract data from receipt images using Google Vision API
- 💱 **Multi-Currency Support**: Automatic currency conversion with real-time exchange rates
- 📊 **Analytics Dashboard**: Comprehensive expense analytics and reporting
- 📧 **Email Notifications**: Automated notifications for expense submissions and approvals

## Technology Stack

- **Framework**: NestJS
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **API Documentation**: Swagger/OpenAPI
- **Validation**: class-validator, class-transformer
- **File Upload**: Multer
- **Email**: Nodemailer
- **OCR**: Google Cloud Vision API
- **External APIs**: RestCountries API, ExchangeRate API

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (v5 or higher)
- Google Cloud Vision API credentials (for OCR features)

## Installation

1. Clone the repository and navigate to the project directory

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update the values in `.env` with your configuration

4. Set up Google Cloud Vision API:
   - Create a service account in Google Cloud Console
   - Download the credentials JSON file
   - Place it in the project root and update `GOOGLE_APPLICATION_CREDENTIALS` in `.env`

## Running the Application

### Development Mode
```bash
npm run start:dev
```

### Production Mode
```bash
npm run build
npm run start:prod
```

The API will be available at `http://localhost:3000/api`

## API Documentation

Once the application is running, access the Swagger documentation at:
```
http://localhost:3000/api/docs
```

## Project Structure

```
src/
├── auth/                  # Authentication & authorization
├── users/                 # User management
├── companies/            # Company management
├── expenses/             # Expense management
├── approval-rules/       # Approval workflow rules
├── approvals/            # Expense approval logic
├── ocr/                  # OCR receipt scanning
├── currency/             # Currency conversion
├── notifications/        # Email notifications
├── dashboard/            # Analytics & reporting
└── common/               # Shared utilities
```

## Key Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Expenses
- `GET /api/expenses` - List all expenses
- `POST /api/expenses` - Create new expense
- `GET /api/expenses/:id` - Get expense details
- `PATCH /api/expenses/:id` - Update expense
- `POST /api/expenses/:id/submit` - Submit expense for approval
- `DELETE /api/expenses/:id` - Delete expense

### Approvals
- `POST /api/approvals/:expenseId/approve` - Approve expense
- `POST /api/approvals/:expenseId/reject` - Reject expense
- `GET /api/approvals/pending` - Get pending approvals

### Dashboard
- `GET /api/dashboard/company-stats` - Company-wide statistics
- `GET /api/dashboard/user-stats` - User statistics
- `GET /api/dashboard/expenses-by-category` - Expenses by category
- `GET /api/dashboard/monthly-trend` - Monthly expense trends

## Default User Roles

- **employee**: Can create and submit expenses
- **manager**: Can approve/reject expenses, view team reports
- **admin**: Full access to all features and settings

## Development

### Adding New Features
1. Generate a new module: `nest generate module feature-name`
2. Generate controller: `nest generate controller feature-name`
3. Generate service: `nest generate service feature-name`

### Database Migrations
This project uses MongoDB, which is schema-less. Schema changes are handled through Mongoose models.

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request

## License

MIT

## Support

For issues and questions, please create an issue in the repository.
