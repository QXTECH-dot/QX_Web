# QX Net Admin System

## Overview

A comprehensive admin dashboard system for managing the QX Net platform. This system provides administrators with powerful tools to manage companies, users, analytics, and system settings.

## Features

### 1. Admin Authentication System
- **Login Page**: `/admin/login`
- **Demo Credentials**:
  - Username: `admin`
  - Password: `admin123`
- **Role-based Access**: Super Admin and Admin roles
- **Session Management**: Local storage-based authentication (temporary implementation)

### 2. Dashboard (`/admin`)
- **Key Metrics**: Company count, user statistics, growth rates
- **Quick Actions**: Add company, search users, generate reports
- **Recent Activity**: Latest system events
- **System Status**: Health monitoring for database, API, email, and storage

### 3. Company Management (`/admin/companies`)
- **Company List**: Paginated view with search and filtering
- **Search & Filter**: By name, ABN, industry, state, status
- **Bulk Operations**: Select multiple companies for batch actions
- **Company Details**: View, edit, delete company information
- **Status Management**: Active, pending, inactive states

### 4. Company Creation (`/admin/companies/create`)
- **Comprehensive Form**: All company fields including:
  - Basic Information (Name, ABN, ACN, Trading Name)
  - Industry Classification
  - Contact Information
  - Address Details
  - Company Details (Founded year, employee count, revenue)
  - Services Management
  - Logo Upload
- **Validation**: Form validation with error handling
- **Dynamic Services**: Add/remove multiple services

### 5. Company Offices Management (`/admin/companies/offices`)
- **Office List**: All company office locations
- **Office Types**: Head Office, Branch Office, Regional Office, etc.
- **Address Management**: Complete address information
- **Contact Details**: Phone, email, business hours
- **Status Control**: Active/inactive offices

### 6. User Management (`/admin/users`)
- **User List**: All registered users with details
- **User-Company Bindings**: Manage user-company relationships
- **Role Management**: Company Admin, User roles
- **Status Control**: Active, pending, inactive users
- **Company Associations**: View and manage user-company links

### 7. Analytics Dashboard (`/admin/analytics`)
- **Growth Trends**: Monthly company and user growth charts
- **Geographic Distribution**: Companies by state
- **Industry Analysis**: Companies by industry breakdown
- **Performance Metrics**: Session duration, bounce rate, conversion rate
- **Time Range Selection**: 7 days, 30 days, 90 days, 1 year
- **Export Functionality**: Generate and download reports

### 8. System Settings (`/admin/settings`)
- **General Settings**: Site configuration, timezone, maintenance mode
- **Industry Management**: Add, edit, delete industry categories
- **Approval Process**: Configure approval workflows
- **Email Templates**: Manage automated email templates
- **Security Settings**: Password policies, 2FA, session management
- **API Settings**: Rate limiting, API keys management

## Technical Implementation

### Frontend Framework
- **Next.js 15.2.4**: React-based framework
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library

### UI Components
- **Custom Components**: Built with shadcn/ui pattern
- **Responsive Design**: Mobile-first approach
- **Accessibility**: ARIA labels and keyboard navigation
- **Form Validation**: Client-side validation with error handling

### Layout Structure
- **AdminLayout**: Sidebar navigation with collapsible menu
- **Nested Routing**: Organized admin routes
- **Breadcrumb Navigation**: Clear page hierarchy
- **Modal System**: For create/edit operations

### Data Management
- **Mock Data**: Currently uses static data for demonstration
- **State Management**: React hooks for local state
- **Form Handling**: Controlled components with validation
- **Search & Filter**: Client-side filtering implementation

## File Structure

```
src/
├── app/admin/
│   ├── login/page.tsx          # Admin login page
│   ├── page.tsx                # Main dashboard
│   ├── companies/
│   │   ├── page.tsx            # Company list
│   │   ├── create/page.tsx     # Create company
│   │   └── offices/page.tsx    # Office management
│   ├── users/page.tsx          # User management
│   ├── analytics/page.tsx      # Analytics dashboard
│   └── settings/page.tsx       # System settings
├── components/
│   ├── admin/
│   │   └── AdminLayout.tsx     # Admin layout component
│   └── ui/                     # Reusable UI components
└── lib/                        # Utility functions
```

## Getting Started

### 1. Access Admin Panel
1. Navigate to `/admin/login`
2. Enter demo credentials:
   - Username: `admin`
   - Password: `admin123`
3. Click "Sign In"

### 2. Dashboard Overview
- View key metrics and system status
- Use quick actions for common tasks
- Monitor recent activity

### 3. Manage Companies
- Go to "Company Management" → "All Companies"
- Search, filter, and manage companies
- Add new companies using the "Add Company" button
- Edit company details by clicking the edit icon

### 4. Manage Users
- Navigate to "User Management"
- View all users and their company associations
- Manage user-company bindings
- Control user status and permissions

### 5. View Analytics
- Access "Analytics" for comprehensive insights
- Select different time ranges
- Export reports as needed

### 6. Configure System
- Use "System Settings" for platform configuration
- Manage industries, approval processes, and security settings
- Configure email templates and API settings

## Future Enhancements

### Backend Integration
- Replace mock data with real API calls
- Implement proper authentication with JWT tokens
- Add database connectivity for data persistence

### Advanced Features
- Real-time notifications
- Advanced analytics with charts
- Audit logging for admin actions
- File upload and management
- Email notification system

### Security Improvements
- Multi-factor authentication
- Role-based permissions
- API rate limiting
- Session timeout management

## Notes

- This is a frontend-only implementation with mock data
- All forms include validation but don't persist data
- Authentication is temporary using localStorage
- Ready for backend integration when APIs are available
- All text is in English as requested
- Responsive design works on all device sizes

## Support

For technical support or questions about the admin system, please contact the development team. 