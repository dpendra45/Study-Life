# Exam Result Declaration Web Application

This is a simple web-based exam result declaration system that allows students to check their results and administrators to enter new results.

## Features

- **Student Portal**: Students can enter their roll number to view their exam results
- **Result Display**: Shows student information, subject-wise marks, total, percentage, and grade
- **Admin Panel**: Administrators can log in to enter new student results
- **Responsive Design**: Works well on both desktop and mobile devices
- **Input Validation**: Ensures data integrity and prevents errors

## How to Use

### For Students:
1. Open the `exam_result.html` file in a web browser
2. Enter your roll number in the search field
3. Click "Search Result" to view your exam results
4. Results will display your personal information, subject marks, and overall performance

### For Administrators:
1. Enter admin credentials (username: `admin`, password: `password`)
2. Click "Login as Admin"
3. Fill in the student information and marks for each subject
4. Click "Save Result" to add the new record

### Preloaded Sample Data:
- Roll Number: 101, Name: John Doe
- Roll Number: 102, Name: Jane Smith

## Technical Details

- Pure HTML, CSS, and JavaScript (no external dependencies)
- Client-side storage using JavaScript arrays (for demonstration purposes)
- Responsive design using CSS Grid and Flexbox
- Form validation for both student and admin sections

## Security Note

This is a frontend-only implementation for demonstration purposes. In a production environment, you would need:
- Server-side authentication
- Database integration
- Proper security measures
- HTTPS encryption
- Input sanitization

## Grade Calculation

The system calculates grades based on percentage:
- A+: 90% and above
- A: 80-89%
- B: 70-79%
- C: 60-69%
- D: 50-59%
- F: Below 50%

## File Structure

- `exam_result.html`: Main application file containing all HTML, CSS, and JavaScript

To run the application, simply open `exam_result.html` in any modern web browser.