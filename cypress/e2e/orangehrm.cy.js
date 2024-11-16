describe('OrangeHRM E2E Tests', () => {
    const baseUrl = 'https://opensource-demo.orangehrmlive.com/web/index.php';

    beforeEach(() => {
        cy.visit(`${baseUrl}/auth/login`);
        cy.get('input[name="username"]').type('Admin');
        cy.get('input[name="password"]').type('admin123');
        cy.get('button[type="submit"]').click();
    });

    // Case 1 - Login Test
    it('should log in and navigate to the dashboard', () => {
        cy.url().should('include', '/dashboard/index');
        cy.get('.oxd-topbar-header-breadcrumb').should('contain', 'Dashboard');
    });

    // Case 2 - Edit Personal Details
    it('should edit and save personal details on "My Info" page', () => {

        // Step 2: Navigate to "My Info" page
        cy.get('span.oxd-main-menu-item--name').contains('My Info').click();

        // Edit personal details
        cy.get('input[name="firstName"]').clear().type('John');
        cy.get('input[name="middleName"]').clear().type('Michael');
        cy.get('input[name="lastName"]').clear().type('Doe');
        //cy.get('input[name="licenseExpiryDate"]').clear().type('2023-12-13');
        //cy.get('div[role="button"]').contains('Nationality').click();
        //cy.get('.oxd-select-dropdown').contains('American').click();

        // Save changes
        cy.get('button.oxd-button--secondary').contains('Save').click();

        // Verify that the data was saved
        cy.get('input[name="firstName"]').should('have.value', 'John');
        cy.get('input[name="middleName"]').should('have.value', 'Michael');
        cy.get('input[name="lastName"]').should('have.value', 'Doe');
        //cy.get('input[name="licenseExpiryDate"]').should('have.value', '2023-12-13');
        });

    
});
