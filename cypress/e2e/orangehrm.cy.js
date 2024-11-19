import { fixtures } from "../fixtures/fixtures";

describe('OrangeHRM E2E Tests', () => {
  const baseUrl = 'https://opensource-demo.orangehrmlive.com/web/index.php';

  beforeEach(() => {
    cy.visit(`${baseUrl}/auth/login`);
    cy.get('input[name="username"]').type('Admin');
    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();
  });

  it('should log in and navigate to the dashboard', () => {
    cy.url().should('include', '/dashboard/index');
    cy.get('.oxd-topbar-header-breadcrumb').should('contain', 'Dashboard');
  });

  it('should edit and save personal details on "My Info" page', () => {

    cy.get('span.oxd-main-menu-item--name').contains('My Info').click();

    // Edit personal details
    cy.get('input[name="firstName"]').clear().type('John');
    cy.get('input[name="middleName"]').clear().type('Michael');
    cy.get('input[name="lastName"]').clear().type('Doe');

    // Handle Date of Birth (first calendar picker)
    cy.get('input[placeholder="yyyy-dd-mm"]')
        .eq(0) // Select the first date picker (Date of Birth)
        .click(); // Open the Date of Birth picker
    cy.get('.oxd-calendar-date')
        .contains('15') // Select the 15th as an example
        .click();

    // Handle License Expiry Date (second calendar picker)
    cy.get('input[placeholder="yyyy-dd-mm"]')
        .eq(1) // Select the second date picker (License Expiry Date)
        .click(); // Open the License Expiry Date picker
    cy.get('.oxd-calendar-date')
        .contains('13') // Select the 13th as an example
        .click();

    // Set Nationality
    cy.get('div.oxd-select-text-input').eq(0).click(); // Click on the dropdown
    cy.get('.oxd-select-dropdown').contains('American').click(); // Select "American"

    // Set Marital Status
    cy.get('div.oxd-select-text-input').eq(1).click(); // Click on the dropdown
    cy.get('.oxd-select-dropdown').contains('Married').click(); // Select "Married"

    // Save changes
    cy.get('button.oxd-button--secondary').contains('Save').click();

    // Verify that the data was saved
    cy.get('input[name="firstName"]').should('have.value', 'John');
    cy.get('input[name="middleName"]').should('have.value', 'Michael');
    cy.get('input[name="lastName"]').should('have.value', 'Doe');
    cy.get('input[placeholder="yyyy-dd-mm"]')
        .eq(0) // Verify the Date of Birth
        .should('contain.value', '15'); 
    cy.get('input[placeholder="yyyy-dd-mm"]')
        .eq(1) // Verify the License Expiry Date
        .should('contain.value', '13'); 
        cy.get('div.oxd-select-text-input')
        .eq(0) // Verify Nationality
        .should('contain.text', 'American');
    cy.get('div.oxd-select-text-input')
        .eq(1) // Verify Marital Status
        .should('contain.text', 'Married');
    });

  it('should validate the post and interactions with mock data', () => {
    cy.visit(`${baseUrl}/buzz/viewBuzz`);
      // Mocking the posts API
    cy.intercept('GET', '/web/index.php/api/v2/buzz/feed?*', (req) => {
        req.reply((res) => {
          // Modify the response with unique post IDs
          res.body = fixtures.mockPostData;
          return res;
        });
      }).as('getPosts');

    cy.wait('@getPosts').then((interception) => {
      // Validate the intercepted request
      expect(interception.response.statusCode).to.eq(200);
      expect(interception.response.body.data).to.have.length.greaterThan(0);
      expect(interception.response.body.data[0].id).to.eq(18);
    });

    // Validate the first post's details in the UI
    cy.get('.orangehrm-buzz-post-emp-name', { timeout: 8000 }) // Extended timeout
      .should('contain', 'John Michael Doe');
    cy.get('.orangehrm-buzz-post-body-text').should('contain', 'Some random text.');
    // Likes
    cy.get(
      '.orangehrm-buzz-stats-active:contains("Like")'
    ).should('contain', '1 Like'); // Initial + 2 new likes

    // Comments
    cy.get(
      '.orangehrm-buzz-stats-active:contains("Comment")'
    ).should('contain', '0 Comments'); // 2 new comments      
  });


  it('should validate the post, likes, comments, and shares on the Buzz feed', () => {
    cy.visit(`${baseUrl}/buzz/viewBuzz`, {timeout : 8000});
    // Mock the Buzz feed API response
    cy.intercept('GET', '/web/index.php/api/v2/buzz/feed?*', (req) => {
      req.reply((res) => {
        res.body = fixtures.mockBuzzFeed;
        return res;
      });
    }).as('getPosts');

    // Mock the "like" API response
    cy.intercept('POST', '/web/index.php/api/v2/buzz/shares/10/likes', fixtures.mockLike).as(
      'postLike'
    );
    // Mock the "comment" API response
    cy.intercept('POST', '/web/index.php/api/v2/buzz/shares/10/comments', fixtures.mockComment).as(
      'postComment'
    );

    // Mock the "share" API response
    cy.intercept('POST', '/web/index.php/api/v2/buzz/shares', fixtures.mockShare).as('postShare');


    // Wait for the initial mock response
    cy.wait('@getPosts').then((interception) => {
      expect(interception.response.statusCode).to.eq(200);
    });

    // Validate initial post details
    cy.get('.orangehrm-buzz-post-emp-name', { timeout: 8000 }).should(
      'contain',
      'John Michael Doe'
    );
    cy.get('.orangehrm-buzz-post-body-text').should('contain', 'Some random text.');

    // Validate updated stats in the UI
    // Likes
    cy.get(
      '.orangehrm-buzz-stats-active:contains("Like")'
    ).should('contain', '2 Like'); // Initial + 2 new likes

    // Comments
    cy.get(
      '.orangehrm-buzz-stats-active:contains("Comment")'
    ).should('contain', '3 Comments'); // 2 new comments

    // Shares
    cy.get(
      '.orangehrm-buzz-stats-active:contains("Share")'
    ).should('contain', '4 Shares'); // 1 new share
    });

  it('should not allow duplicate likes and display appropriate error message', () => {

    cy.visit(`${baseUrl}/buzz/viewBuzz`);
    // Mock the Buzz feed API response
    cy.intercept('GET', '/web/index.php/api/v2/buzz/feed?*', (req) => {
        req.reply((res) => {
          res.body = fixtures.mockBuzzFeed;
          return res;
        });
    }).as('getPosts');

    // Mock the "like" API response
    cy.intercept('POST', '/web/index.php/api/v2/buzz/shares/10/likes', fixtures.mockLike).as(
        'postDuplicateLike'
    );

    // Wait for the initial mock response
    cy.wait('@getPosts').then((interception) => {
        expect(interception.response.statusCode).to.eq(200);
    });

    // Validate initial post details
    cy.get('.orangehrm-buzz-post-emp-name', { timeout: 8000 }).should(
        'contain',
        'John Michael Doe'
    );

    // Perform 1 like
    cy.request({
        method: 'POST', 
        url: `${baseUrl}/api/v2/buzz/shares/10/likes`, 
        failOnStatusCode: false}).then((resp) => {
        expect(resp.status).to.eq(400)
        expect(resp.body.error.message).to.eq('Already liked');
      });
    });

  describe('Performance Tests', () => {
    it('should load the Buzz feed within acceptable time', () => {
      // Intercept the Buzz feed API call with a wildcard for query parameters
      cy.intercept('GET', '/web/index.php/api/v2/buzz/feed*').as('getPosts');

      // Visit the Buzz page
      cy.visit(`${baseUrl}/buzz/viewBuzz`);

      // Wait for the intercepted request with an increased timeout
      cy.wait('@getPosts', { timeout: 10000 }).then((interception) => {
      // Check if the response was successful
      expect(interception.response.statusCode).to.eq(200);

      // Measure response duration from request initiation
      const duration = interception.response?.duration || 0;
      expect(duration).to.be.lessThan(2000); // Ensure duration < 2 seconds
      });
    });
  });

});
