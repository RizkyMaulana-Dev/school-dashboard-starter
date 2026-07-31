import type { RouteObject } from "react-router-dom";
import { ROUTE_PATHS } from "./route-paths";
import { ProtectedRoute } from "./protected-route";
import { DashboardLayout } from "@/layouts/DashboardLayout";

// Lazy imports for code splitting
import { lazy } from "react";

const DashboardHome = lazy(() => import("@/features/dashboard/components/DashboardHome"));
const UserList = lazy(() => import("@/features/user-management/components/UserList"));
const UserForm = lazy(() => import("@/features/user-management/components/UserForm"));
const ClassList = lazy(() => import("@/features/class-management/components/ClassList"));
const ClassForm = lazy(() => import("@/features/class-management/components/ClassForm"));
const StudentList = lazy(() => import("@/features/student-management/components/StudentList"));
const StudentForm = lazy(() => import("@/features/student-management/components/StudentForm"));
const TeacherList = lazy(() => import("@/features/teacher-management/components/TeacherList"));
const TeacherForm = lazy(() => import("@/features/teacher-management/components/TeacherForm"));
const AttendanceSessionList = lazy(() => import("@/features/attendance/components/SessionList"));
const AttendanceSessionForm = lazy(() => import("@/features/attendance/components/SessionForm"));
const AttendanceRecords = lazy(() => import("@/features/attendance/components/AttendanceTable"));
const BookList = lazy(() => import("@/features/library/components/BookList"));
const BookForm = lazy(() => import("@/features/library/components/BookForm"));
const BookLoanList = lazy(() => import("@/features/library/components/BookLoanList"));
const BookLoanForm = lazy(() => import("@/features/library/components/BookLoanForm"));
const ItemList = lazy(() => import("@/features/inventory/components/ItemList"));
const ItemForm = lazy(() => import("@/features/inventory/components/ItemForm"));
const ItemLoanList = lazy(() => import("@/features/inventory/components/itemLoanList"));
const ItemLoanForm = lazy(() => import("@/features/inventory/components/itemLoanForm"));

export const dashboardRoutes: RouteObject[] = [
  {
    path: ROUTE_PATHS.DASHBOARD,
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      // Dashboard Home
      {
        index: true,
        element: <DashboardHome />,
      },
      {
        path: "dashboard",
        element: <DashboardHome />,
      },

      // User Management
      {
        path: "users",
        element: (
          <ProtectedRoute requiredPermissions={["user.read"]}>
            <UserList />
          </ProtectedRoute>
        ),
      },
      {
        path: "users/create",
        element: (
          <ProtectedRoute requiredPermissions={["user.create"]}>
            <UserForm />
          </ProtectedRoute>
        ),
      },
      {
        path: "users/:id/edit",
        element: (
          <ProtectedRoute requiredPermissions={["user.update"]}>
            <UserForm />
          </ProtectedRoute>
        ),
      },
      // Class Management
      {
        path: "classes",
        element: (
          <ProtectedRoute requiredPermissions={["class.read"]}>
            <ClassList />
          </ProtectedRoute>
        ),
      },
      {
        path: "classes/create",
        element: (
          <ProtectedRoute requiredPermissions={["class.create"]}>
            <ClassForm />
          </ProtectedRoute>
        ),
      },
      {
        path: "classes/:id/edit",
        element: (
          <ProtectedRoute requiredPermissions={["class.update"]}>
            <ClassForm />
          </ProtectedRoute>
        ),
      },

      // Student Management
      {
        path: "students",
        element: (
          <ProtectedRoute requiredPermissions={["student.read"]}>
            <StudentList />
          </ProtectedRoute>
        ),
      },
      {
        path: "students/create",
        element: (
          <ProtectedRoute requiredPermissions={["student.create"]}>
            <StudentForm />
          </ProtectedRoute>
        ),
      },
      {
        path: "students/:id/edit",
        element: (
          <ProtectedRoute requiredPermissions={["student.update"]}>
            <StudentForm />
          </ProtectedRoute>
        ),
      },

      // Teacher Management
      {
        path: "teachers",
        element: (
          <ProtectedRoute requiredPermissions={["teacher.read"]}>
            <TeacherList />
          </ProtectedRoute>
        ),
      },
      {
        path: "teachers/create",
        element: (
          <ProtectedRoute requiredPermissions={["teacher.create"]}>
            <TeacherForm />
          </ProtectedRoute>
        ),
      },
      {
        path: "teachers/:id/edit",
        element: (
          <ProtectedRoute requiredPermissions={["teacher.update"]}>
            <TeacherForm />
          </ProtectedRoute>
        ),
      },

      // Attendance
      {
        path: "attendance/sessions",
        element: (
          <ProtectedRoute requiredPermissions={["attendance-session.read"]}>
            <AttendanceSessionList />
          </ProtectedRoute>
        ),
      },
      {
        path: "attendance/sessions/create",
        element: (
          <ProtectedRoute requiredPermissions={["attendance-session.create"]}>
            <AttendanceSessionForm />
          </ProtectedRoute>
        ),
      },
      {
        path: "attendance/sessions/:id",
        element: (
          <ProtectedRoute requiredPermissions={["attendance.read"]}>
            <AttendanceRecords />
          </ProtectedRoute>
        ),
      },

      // Library - Books
      {
        path: "library/books",
        element: (
          <ProtectedRoute requiredPermissions={["book.read"]}>
            <BookList />
          </ProtectedRoute>
        ),
      },
      {
        path: "library/books/create",
        element: (
          <ProtectedRoute requiredPermissions={["book.create"]}>
            <BookForm />
          </ProtectedRoute>
        ),
      },
      {
        path: "library/books/:id/edit",
        element: (
          <ProtectedRoute requiredPermissions={["book.update"]}>
            <BookForm />
          </ProtectedRoute>
        ),
      },

      // Library - Book Loans
      {
        path: "library/loans",
        element: (
          <ProtectedRoute requiredPermissions={["book-loan.read"]}>
            <BookLoanList />
          </ProtectedRoute>
        ),
      },
      {
        path: "library/loans/create",
        element: (
          <ProtectedRoute requiredPermissions={["book-loan.create"]}>
            <BookLoanForm />
          </ProtectedRoute>
        ),
      },

      // Inventory - Items
      {
        path: "inventory/items",
        element: (
          <ProtectedRoute requiredPermissions={["item.read"]}>
            <ItemList />
          </ProtectedRoute>
        ),
      },
      {
        path: "inventory/items/create",
        element: (
          <ProtectedRoute requiredPermissions={["item.create"]}>
            <ItemForm />
          </ProtectedRoute>
        ),
      },
      {
        path: "inventory/items/:id/edit",
        element: (
          <ProtectedRoute requiredPermissions={["item.update"]}>
            <ItemForm />
          </ProtectedRoute>
        ),
      },

      // Inventory - Item Loans
      {
        path: "inventory/loans",
        element: (
          <ProtectedRoute requiredPermissions={["item-loan.read"]}>
            <ItemLoanList />
          </ProtectedRoute>
        ),
      },
      {
        path: "inventory/loans/create",
        element: (
          <ProtectedRoute requiredPermissions={["item-loan.create"]}>
            <ItemLoanForm />
          </ProtectedRoute>
        ),
      },
    ],
  },
];
