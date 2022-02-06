describe('Tracklist Duration route', () => {
  Cypress.on('uncaught:exception', () => false);

  it('successfully loads', () => {
    cy.visit('/');
    cy.get('[data-testid="tracklist-duration-link"]').click();
  });

  it('should click demo button and copy properly', () => {
    cy.get('[data-testid="demo-button"]').click();

    cy.get('[data-testid="copy-button"]')
      .click()
      .then(() => {
        cy.window().then((win) => {
          win.navigator.clipboard.readText().then((copiedText) => {
            const textArea = cy.get(
              '[data-testid="track-name-and-times-output"]'
            );
            expect(copiedText).contains(textArea);
          });
        });
      });
  });
});
