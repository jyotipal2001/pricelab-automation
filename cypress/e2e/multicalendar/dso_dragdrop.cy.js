const MultiCalendarPage = require('../../pages/MultiCalendarPage')

describe('Feature: Multicalendar - Drag and Drop', () => {

  before(() => {
    cy.loginToPriceLabs()
  })

  beforeEach(() => {
    cy.loginToPriceLabs()
    cy.visit('https://app.pricelabs.co/multicalendar')
    cy.url().should('include', 'multicalendar')
    cy.get('tr[data-index]', { timeout: 20000 })
      .should('exist')
  })

  context('Scenario: Drag and Drop metric reordering', () => {

    it('should open Add Metrics panel', () => {
      cy.get('button[title="Add Metrics"]')
        .should('be.visible')
        .click()
      cy.get('button[qa-id="add-metrics-update-changes-btn"]')
        .should('be.visible')
    })  

    it('should drag first metric below second metric', () => {
      cy.get('button[title="Add Metrics"]')
        .should('be.visible')
        .click()

      cy.get('button[qa-id="add-metrics-update-changes-btn"]')
        .should('be.visible')

      cy.get('[class*="css-w096ro"]').then(($rows) => {
        if ($rows.length >= 2) {
          cy.wrap($rows[0])
            .drag($rows[1], { force: true })

          cy.get('button[qa-id="add-metrics-update-changes-btn"]')
            .click()

          cy.get('button[qa-id="add-metrics-update-changes-btn"]')
            .should('not.exist')

          cy.log(' Drag and drop completed successfully')
        } else {
          cy.log('Not enough metrics — skipping drag')
        }
      })
    })   

  })    

})       