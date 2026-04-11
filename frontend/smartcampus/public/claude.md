# Claude Code Prompt – Module 4: Notifications + Role Management + OAuth Integration

## Project Context

This is part of a 4-member university group project for IT3030 (Programming Applications and Frameworks) at SLIIT. The full project is called **Smart Campus Operations Hub** — a web platform for managing facility bookings and maintenance/incident ticketing at a university.

**My module (Member 4)** covers:
- Notifications system
- Role management
- OAuth 2.0 (Google Sign-In) integration

**Tech stack:**
- Backend: Java 17+, Spring Boot 3.x, Spring Web, Spring Data JPA, Spring Security, MySQL, Maven
- Frontend: React (with Axios, React Router)
- The other 3 members handle: Facilities catalogue (Module A), Booking management (Module B), Incident ticketing (Module C)

**Important:** My code must integrate cleanly with the other members' modules. They will have their own entities (Resource, Booking, Ticket, Comment) that my notification system will reference.

---

## BACKEND IMPLEMENTATION

### 1. Project Structure (within existing Spring Boot project)

Place all my module code under these packages:
```
src/main/java/com/smartcampus/
├── config/
│   ├── SecurityConfig.java
│   ├── OAuth2LoginSuccessHandler.java
│   └── CorsConfig.java
├── model/
│   ├── User.java
│   ├── Role.java (enum)
│   └── Notification.java
├── repository/
│   ├── UserRepository.java
│   └── NotificationRepository.java
├── service/
│   ├── UserService.java
│   ├── NotificationService.java
│   └── CustomOAuth2UserService.java
├── controller/
│   ├── AuthController.java
│   ├── UserController.java
│   └── NotificationController.java
├── dto/
│   ├── UserDTO.java
│   ├── NotificationDTO.java
│   ├── RoleUpdateRequest.java
│   └── AuthResponse.java
├── exception/
│   ├── GlobalExceptionHandler.java (shared, or add to existing)
│   ├── ResourceNotFoundException.java
│   └── UnauthorizedException.java
└── util/
    └── JwtUtil.java
```

### 2. Entities

#### User.java
```
Fields:
- id (Long, auto-generated)
- email (String, unique, not null)
- name (String, not null)
- profilePicture (String, nullable — from Google)
- role (Enum: USER, ADMIN, TECHNICIAN)
- provider (String — "google")
- providerId (String — Google's sub ID)
- createdAt (LocalDateTime)
- updatedAt (LocalDateTime)

Default role on first Google sign-in: USER
Use @Enumerated(EnumType.STRING) for role
Use @PrePersist and @PreUpdate for timestamps
```

#### Role.java (Enum)
```
Values: USER, ADMIN, TECHNICIAN
```

#### Notification.java
```
Fields:
- id (Long, auto-generated)
- recipientId (Long, foreign key to User) — use @ManyToOne
- type (Enum: BOOKING_APPROVED, BOOKING_REJECTED, TICKET_STATUS_CHANGED, TICKET_ASSIGNED, NEW_COMMENT, ROLE_CHANGED)
- title (String, not null)
- message (String, not null, max 500 chars)
- referenceId (Long, nullable — the ID of the booking/ticket that triggered it)
- referenceType (String, nullable — "BOOKING" or "TICKET")
- isRead (boolean, default false)
- createdAt (LocalDateTime)
```

### 3. Repositories

#### UserRepository.java
```
- findByEmail(String email) → Optional<User>
- findByProviderId(String providerId) → Optional<User>
- findByRole(Role role) → List<User>
- existsByEmail(String email) → boolean
```

#### NotificationRepository.java
```
- findByRecipientIdOrderByCreatedAtDesc(Long recipientId) → List<Notification>
- findByRecipientIdAndIsReadFalseOrderByCreatedAtDesc(Long recipientId) → List<Notification>
- countByRecipientIdAndIsReadFalse(Long recipientId) → Long
- deleteByRecipientId(Long recipientId) → void
```

### 4. Services

#### CustomOAuth2UserService.java
```
- Extends DefaultOAuth2UserService
- Override loadUser(): after loading from Google, check if user exists in DB by email
  - If new user → create User with role USER, save to DB
  - If existing user → update name/picture if changed
- Return a custom OAuth2User that includes the user's role and DB id as attributes
```

#### UserService.java
```
- getCurrentUser(Authentication auth) → UserDTO
- getUserById(Long id) → UserDTO
- getAllUsers() → List<UserDTO> (ADMIN only)
- updateUserRole(Long userId, RoleUpdateRequest request) → UserDTO (ADMIN only)
  - After role change, create a ROLE_CHANGED notification for that user
- getUsersByRole(Role role) → List<UserDTO>
- deleteUser(Long id) → void (ADMIN only)
```

#### NotificationService.java
```
- createNotification(Long recipientId, NotificationType type, String title, String message, Long referenceId, String referenceType) → NotificationDTO
  - This is the method OTHER modules will call to send notifications
- getNotificationsForUser(Long userId) → List<NotificationDTO>
- getUnreadNotifications(Long userId) → List<NotificationDTO>
- getUnreadCount(Long userId) → Long
- markAsRead(Long notificationId, Long userId) → NotificationDTO
  - Verify the notification belongs to this user before marking
- markAllAsRead(Long userId) → void
- deleteNotification(Long notificationId, Long userId) → void
- clearAllNotifications(Long userId) → void

Convenience methods for other modules to call:
- notifyBookingApproved(Long userId, Long bookingId, String resourceName)
- notifyBookingRejected(Long userId, Long bookingId, String resourceName, String reason)
- notifyTicketStatusChanged(Long userId, Long ticketId, String newStatus)
- notifyTicketAssigned(Long technicianId, Long ticketId, String ticketTitle)
- notifyNewComment(Long userId, Long ticketId, String commenterName)
```

### 5. Controllers (REST API Endpoints)

#### AuthController.java — prefix: /api/auth
```
GET  /api/auth/me              → Get current logged-in user info (returns UserDTO + role)
GET  /api/auth/login/success    → OAuth2 login success redirect handler (returns JWT token)
GET  /api/auth/login/failure    → OAuth2 login failure handler
POST /api/auth/logout           → Logout (invalidate session/token)
```

#### UserController.java — prefix: /api/users (ADMIN access for most)
```
GET    /api/users                → Get all users (ADMIN only)
GET    /api/users/{id}           → Get user by ID (ADMIN only)
PUT    /api/users/{id}/role      → Update user role (ADMIN only) — body: { "role": "TECHNICIAN" }
DELETE /api/users/{id}           → Delete user (ADMIN only)
GET    /api/users/role/{role}    → Get users by role (ADMIN only — useful to list technicians)
```

#### NotificationController.java — prefix: /api/notifications
```
GET    /api/notifications              → Get all notifications for current user
GET    /api/notifications/unread       → Get unread notifications for current user
GET    /api/notifications/unread/count → Get unread count for current user
PATCH  /api/notifications/{id}/read    → Mark a single notification as read
PATCH  /api/notifications/read-all     → Mark all notifications as read
DELETE /api/notifications/{id}         → Delete a single notification
DELETE /api/notifications/clear        → Clear all notifications for current user
```

**HTTP status codes to use:**
- 200 OK — successful GET, PATCH
- 201 Created — not commonly needed here but use if creating notification manually
- 204 No Content — successful DELETE
- 400 Bad Request — validation errors
- 401 Unauthorized — not logged in
- 403 Forbidden — wrong role
- 404 Not Found — notification/user not found

### 6. Security Configuration (SecurityConfig.java)

```
Configure Spring Security with:
- OAuth2 login with Google provider
- Custom OAuth2UserService for user registration/login
- Success handler that generates a JWT and redirects to frontend with token
- Session policy: STATELESS (use JWT for API auth)
- JWT filter that reads token from Authorization header on each request
- CORS configuration allowing frontend origin (http://localhost:5173 or 3000)
- Endpoint security rules:
  - /api/auth/** → permitAll
  - /api/users/** → ADMIN role required (except /api/auth/me)
  - /api/notifications/** → authenticated (any role)
  - /oauth2/** → permitAll
  - Everything else → authenticated
- CSRF disabled (REST API with JWT)
```

#### JwtUtil.java
```
- generateToken(User user) → String
  - Include claims: userId, email, role, name
  - Expiry: 24 hours
  - Sign with HS256 using a secret key from application.properties
- validateToken(String token) → boolean
- extractUserId(String token) → Long
- extractEmail(String token) → String
- extractRole(String token) → String
```

#### OAuth2LoginSuccessHandler.java
```
- On successful Google login:
  - Get or create user from DB (via CustomOAuth2UserService)
  - Generate JWT token
  - Redirect to frontend URL with token as query param:
    http://localhost:5173/oauth2/redirect?token=xxx
```

### 7. application.properties (entries needed for my module)

```properties
# Google OAuth2
spring.security.oauth2.client.registration.google.client-id=${GOOGLE_CLIENT_ID}
spring.security.oauth2.client.registration.google.client-secret=${GOOGLE_CLIENT_SECRET}
spring.security.oauth2.client.registration.google.scope=openid,profile,email
spring.security.oauth2.client.registration.google.redirect-uri={baseUrl}/oauth2/callback/google

# JWT
app.jwt.secret=your-256-bit-secret-key-here-change-in-production
app.jwt.expiration=86400000

# MySQL
spring.datasource.url=jdbc:mysql://localhost:3306/smart_campus
spring.datasource.username=root
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect
```

### 8. Maven Dependencies (pom.xml additions for my module)

```xml
spring-boot-starter-oauth2-client
spring-boot-starter-security
jjwt-api (io.jsonwebtoken, version 0.11.5)
jjwt-impl (runtime)
jjwt-jackson (runtime)
spring-boot-starter-validation
```

### 9. Error Handling

Add to or create GlobalExceptionHandler with @RestControllerAdvice:
- Handle ResourceNotFoundException → 404
- Handle UnauthorizedException → 401
- Handle AccessDeniedException → 403
- Handle MethodArgumentNotValidException → 400 with field-level errors
- Handle generic Exception → 500

Return consistent error response JSON:
```json
{
  "timestamp": "2026-04-10T10:00:00",
  "status": 404,
  "error": "Not Found",
  "message": "Notification not found with id: 5",
  "path": "/api/notifications/5"
}
```

---

## FRONTEND IMPLEMENTATION

### 10. React Project Structure (within existing React app)

```
src/
├── components/
│   ├── auth/
│   │   ├── LoginPage.jsx
│   │   ├── OAuth2RedirectHandler.jsx
│   │   └── ProtectedRoute.jsx
│   ├── notifications/
│   │   ├── NotificationBell.jsx
│   │   ├── NotificationDropdown.jsx
│   │   └── NotificationList.jsx
│   ├── users/
│   │   ├── UserManagement.jsx
│   │   └── RoleChangeModal.jsx
│   └── common/
│       └── Navbar.jsx (add notification bell + user menu to shared navbar)
├── context/
│   └── AuthContext.jsx
├── services/
│   ├── authService.js
│   ├── notificationService.js
│   └── userService.js
├── hooks/
│   └── useNotifications.js
└── utils/
    └── axiosInstance.js
```

### 11. Auth Context (AuthContext.jsx)

```
Provide:
- user (object with id, name, email, role, profilePicture)
- isAuthenticated (boolean)
- isAdmin (boolean)
- isTechnician (boolean)
- loading (boolean — true while checking token on app load)
- login() — redirect to backend Google OAuth URL
- logout() — clear token, redirect to login
- token — stored in localStorage

On app mount:
- Check if JWT token exists in localStorage
- If yes, call GET /api/auth/me to validate and get user info
- If token is invalid/expired, clear it and set isAuthenticated = false
```

### 12. Axios Instance (axiosInstance.js)

```
- Create axios instance with baseURL: http://localhost:8080
- Add request interceptor: attach JWT token from localStorage as Authorization: Bearer <token>
- Add response interceptor: if 401 received, clear token and redirect to login
```

### 13. Services

#### authService.js
```
- getGoogleLoginUrl() → returns backend OAuth2 authorization URL
- getCurrentUser() → GET /api/auth/me
- logout() → POST /api/auth/logout
```

#### notificationService.js
```
- getNotifications() → GET /api/notifications
- getUnreadNotifications() → GET /api/notifications/unread
- getUnreadCount() → GET /api/notifications/unread/count
- markAsRead(id) → PATCH /api/notifications/{id}/read
- markAllAsRead() → PATCH /api/notifications/read-all
- deleteNotification(id) → DELETE /api/notifications/{id}
- clearAll() → DELETE /api/notifications/clear
```

#### userService.js
```
- getAllUsers() → GET /api/users
- getUserById(id) → GET /api/users/{id}
- updateUserRole(id, role) → PUT /api/users/{id}/role
- deleteUser(id) → DELETE /api/users/{id}
- getUsersByRole(role) → GET /api/users/role/{role}
```

### 14. Components

#### LoginPage.jsx
```
- Simple centered page with app name/logo
- "Sign in with Google" button that redirects to backend OAuth URL:
  http://localhost:8080/oauth2/authorization/google
- Clean, professional design
```

#### OAuth2RedirectHandler.jsx
```
- Route: /oauth2/redirect
- On mount, extract "token" from URL query params
- Save token to localStorage
- Call GET /api/auth/me to get user info
- Update AuthContext
- Redirect to home/dashboard page
- Show loading spinner while processing
```

#### ProtectedRoute.jsx
```
- Wrapper component for routes that require authentication
- If not authenticated, redirect to login page
- Optional prop: requiredRole — if set, check user role and show 403 if unauthorized
- Show loading spinner while auth state is being determined
```

#### NotificationBell.jsx
```
- Bell icon in the navbar
- Show badge with unread count (red circle with number)
- On click, toggle NotificationDropdown
- Poll for unread count every 30 seconds (use setInterval in useEffect)
```

#### NotificationDropdown.jsx
```
- Dropdown panel that appears below the bell icon
- Header: "Notifications" + "Mark all read" button
- List of recent notifications (max 10, show newest first)
- Each notification shows:
  - Icon based on type (booking approved = green check, rejected = red x, ticket = wrench, comment = chat bubble)
  - Title (bold if unread)
  - Message (truncated to 2 lines)
  - Time ago (e.g., "2 hours ago")
  - Click to mark as read + navigate to related booking/ticket
- Footer: "View all notifications" link → /notifications page
- "Clear all" option
```

#### NotificationList.jsx (full page)
```
- Route: /notifications
- Full list of all notifications with pagination or infinite scroll
- Filter tabs: All | Unread
- Each notification card shows full message
- Ability to delete individual notifications
- "Mark all as read" and "Clear all" buttons
```

#### UserManagement.jsx (Admin only)
```
- Route: /admin/users
- Table/list of all registered users
- Columns: Name, Email, Role, Joined Date, Actions
- Search/filter by name or email
- Role badge (color-coded: USER=blue, ADMIN=red, TECHNICIAN=orange)
- Action buttons: Change Role, Delete User
- Click "Change Role" opens RoleChangeModal
```

#### RoleChangeModal.jsx
```
- Modal dialog showing user's current role
- Dropdown to select new role (USER, ADMIN, TECHNICIAN)
- Confirm and Cancel buttons
- On confirm, call PUT /api/users/{id}/role
- Show success/error toast
- Prevent admin from changing their own role (safety)
```

#### Navbar.jsx updates
```
Add to the shared navbar:
- NotificationBell component (for all authenticated users)
- User avatar/name dropdown with:
  - Profile info (name, email, role)
  - Link to /admin/users (visible only for ADMIN)
  - Logout button
```

### 15. Routing

```
Add these routes (within existing React Router setup):
/login              → LoginPage (public)
/oauth2/redirect    → OAuth2RedirectHandler (public)
/notifications      → NotificationList (authenticated)
/admin/users        → UserManagement (ADMIN only)

Wrap authenticated routes with ProtectedRoute
Wrap admin routes with ProtectedRoute requiredRole="ADMIN"
```

### 16. Notification Polling (useNotifications hook)

```
Custom hook that:
- Fetches unread count on mount
- Sets up polling interval (every 30 seconds)
- Provides: unreadCount, notifications, loading, refresh()
- Cleans up interval on unmount
- Only runs when user is authenticated
```

---

## INTEGRATION POINTS WITH OTHER MODULES

### How other members' modules send notifications:

Other members should inject NotificationService and call the convenience methods. Provide these integration instructions to teammates:

```java
// In BookingService.java (Member 2's code):
@Autowired
private NotificationService notificationService;

// When approving a booking:
notificationService.notifyBookingApproved(booking.getUserId(), booking.getId(), resource.getName());

// When rejecting a booking:
notificationService.notifyBookingRejected(booking.getUserId(), booking.getId(), resource.getName(), reason);

// In TicketService.java (Member 3's code):
// When ticket status changes:
notificationService.notifyTicketStatusChanged(ticket.getUserId(), ticket.getId(), newStatus.name());

// When assigning technician:
notificationService.notifyTicketAssigned(technicianId, ticket.getId(), ticket.getTitle());

// When new comment added:
notificationService.notifyNewComment(ticket.getUserId(), ticket.getId(), commenter.getName());
```

---

## CODE QUALITY REQUIREMENTS

- Use @Valid and validation annotations on all DTOs
- Use proper logging with SLF4J (@Slf4j from Lombok)
- Write meaningful Javadoc comments on service methods
- Use DTOs for all API responses — never expose entities directly
- Handle all edge cases (null checks, empty results, unauthorized access)
- Use constructor injection (not @Autowired on fields) — Spring best practice
- Use ResponseEntity for all controller return types
- Frontend: use proper loading states, error handling, and empty states in all components
- Frontend: clean up intervals/subscriptions in useEffect cleanup functions

---

## TESTING

- Write at least basic unit tests for NotificationService and UserService using JUnit 5 + Mockito
- Create a Postman collection with all endpoints organized in folders:
  - Auth endpoints
  - Notification endpoints
  - User/Role management endpoints
- Include example request bodies and expected responses in Postman

## major note that don't edit on others module