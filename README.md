# OrangeHRM E2E Test Suite

This repository contains End-to-End (E2E) test cases for the OrangeHRM web application. The tests are written using [Cypress](https://www.cypress.io/) to ensure the application's core functionalities work as expected, including login, personal details management, and interactions on the Buzz page.

---

## Table of Contents

- [Setup Instructions](#setup-instructions)
- [How to Run Tests](#how-to-run-tests)
- [Test Cases Covered](#test-cases-covered)
- [Assumptions Made](#assumptions-made)

---

## Setup Instructions

### Prerequisites

1. Ensure you have [Node.js](https://nodejs.org/) (version 16 or later) installed on your machine.
2. Install [npm](https://www.npmjs.com/) (usually included with Node.js).

### Installation

1. Clone this repository:

   ```bash
   git clone https://github.com/your-repo/orangehrm-tests.git
   cd orangehrm-tests

   ```
2. Install the dependencies:

   ```bash
   npm install

   ```
3. How to Run Tests
   *Run All Tests*
   Execute the following command to run all tests in headless mode:

   ```bash
   npx cypress run
   ```

   Open Cypress Test Runner
   To debug or visually inspect test execution:

   ```bash
    npx cypress open
   ```

This will launch the Cypress Test Runner.

Select the test file to run from the displayed list.

## Test Cases Covered

1. Login Tests
   Positive Scenario: Verify successful login with valid credentials.
   Negative Scenario: Verify error message when invalid credentials are provided.
2. Personal Details Tests
   Edit and Save Personal Details: Verify editing and saving personal information.
   Mandatory Fields Validation: Verify error messages when required fields are empty.
3. Buzz Page Tests
   Feed Validation: Verify that the Buzz feed displays data from the backend correctly.
   Interactions: Test liking, commenting, and sharing posts using mocked API responses.
   Empty State: Verify appropriate messaging when no posts are available.
   Error Handling: Test how the UI handles backend failures.
4. Performance Test
   Validate that the Buzz feed API response is received within acceptable limits (under 2 seconds).

## Assumptions Made

1. Environment URL: The application is available at the URL: `https://opensource-demo.orangehrmlive.com/web/index.php`. Update the baseUrl constant if the environment changes.
2. User Credentials: The test suite assumes the default admin credentials:
   Username: `Admin`
   Password: `admin123`
3. Mock Data Usage: Mocked responses are used to validate specific UI updates (e.g., Like, Comment, Share counts). Mocked responses mimic real API data structure for consistency.
4. UI Identifiers: The test suite relies on CSS selectors available in the current version of OrangeHRM. Changes in the UI structure or CSS classes may require test updates.
5. Error Messages: Assumes the default error messages displayed by the application. These messages might differ in other configurations or locales.

### Additional Notes

* The tests are designed to be run in isolation for repeatability and reliability.
  Some tests simulate API behavior using cy.intercept().
* This ensures predictable results without relying on live backend data.
* For live backend testing, replace mocks with real API calls and remove intercepts.
  Contribution

License

This project is licensed under the MIT License. See the LICENSE file for details.
