// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })



Cypress.Commands.add('loginToPriceLabs', () => {
  cy.session('priceLabsSession', () => {
    cy.visit('https://pricelabs.co/signin')
 
    cy.get('input[placeholder="Email Address"]')
      .should('be.visible')
      .type('qa.pricelabs@gmail.com')
 
    cy.get('input[placeholder="Password"]')
      .should('be.visible')
      .type('qg33N$yxJP')
 
    cy.get('input[value="Sign in"]').click()
 
    cy.url({ timeout: 20000 })
      .should('include', 'app.pricelabs.co')
 
  
    cy.get('tr[data-index], nav, [class*="sidebar"]', { timeout: 15000 })
      .should('exist')
 
  }, {
    cacheAcrossSpecs: true
  })
})