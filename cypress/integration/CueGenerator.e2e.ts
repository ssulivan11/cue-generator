import path = require('path');

describe('The Home Page', () => {
  Cypress.on('uncaught:exception', () => false);
  const downloadsFolder = Cypress.config('downloadsFolder');

  it('successfully loads', () => {
    cy.visit('/');
  });

  it('should populate on demo button', () => {
    cy.get('[data-testid="demo-button"]').click();

    cy.get('[data-testid="artist-input"]').should('have.value', 'Pink Floyd');
    cy.get('[data-testid="album-input"]').should(
      'have.value',
      'The Dark Side of the Moon'
    );
    cy.get('[data-testid="filename-input"]').should(
      'have.value',
      'The Dark Side of the Moon Full Album 1973'
    );
  });

  it('download custom named cue file and verify', () => {
    cy.get('[data-testid="download-button"]').click();
    cy.readFile(
      path.join(
        downloadsFolder,
        'The Dark Side of the Moon Full Album 1973.cue'
      )
    ).should('exist');
    cy.task('deleteFolder', downloadsFolder);
  });

  it('download auto file named cue file and verify', () => {
    cy.get('[data-testid="auto-file-name-checkbox"]').check();
    cy.get('[data-testid="download-button"]').click();
    cy.readFile(
      path.join(downloadsFolder, 'Pink Floyd - The Dark Side of the Moon.cue')
    ).should('exist');
    cy.task('deleteFolder', downloadsFolder);
  });
});
