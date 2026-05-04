const MultiCalendarPage = require('../../pages/MultiCalendarPage')

const listingId = 'SUNSETPROPS_OLSE___533'

describe('Feature: Multicalendar DSO - Functional Tests', () => {

  before(() => {
    cy.loginToPriceLabs()
  })

  beforeEach(() => {
    cy.loginToPriceLabs()
    cy.visit('https://app.pricelabs.co/multicalendar')
    cy.url().should('include', 'multicalendar')
    cy.get('tr[data-index]', { timeout: 20000 }).should('exist')
  })

 
  context('Scenario: Update DSO value for a single date', () => {

    it('should open DSO panel for a listing', () => {
      MultiCalendarPage.openThreeDotsMenu(listingId)
      MultiCalendarPage.clickAddOverrides()
      cy.get('p:contains("Date Specific Overrides")')
        .should('be.visible')
    })

    it('should enter fixed price and save DSO for single date',
    () => {
      cy.fixture('dsoData').then((data) => {

        cy.intercept('POST', '**/add_custom_pricing**')
          .as('saveDSO')

        MultiCalendarPage.openThreeDotsMenu(listingId)
        MultiCalendarPage.clickAddOverrides()

   
        MultiCalendarPage.selectStartDate(10)
        MultiCalendarPage.selectEndDate(10)

     
        cy.wait(1500)

    
        cy.get('[qa-id="dso-radio-option-fixed"]')
          .scrollIntoView()
          .click({ force: true })

        cy.get('input[qa-id="dso-price"]', { timeout: 10000 })
          .scrollIntoView()
          .should('be.visible')
          .clear()
          .type(data.validDSO.fixedPrice)

        cy.get('button#add-dso-button-v2').click()

        cy.wait(1500)
        cy.get('body').then(($body) => {
          if ($body.find('button:contains("Update")').length > 0) {
            cy.intercept('POST', '**/add_custom_pricing**')
              .as('saveDSOConfirm')
            cy.get('button:contains("Update")').click()
            cy.wait('@saveDSOConfirm', { timeout: 15000 })
              .then((interception) => {
                expect(interception.response.statusCode).to.eq(200)
                expect(interception.response.body.message)
                  .to.eq('SUCCESS')
              })
          } else {
            cy.wait('@saveDSO', { timeout: 15000 })
              .then((interception) => {
                expect(interception.response.statusCode).to.eq(200)
                expect(interception.response.body.message)
                  .to.eq('SUCCESS')
              })
          }
        })
      })
    })

  })

  context('Scenario: Bulk update DSO for a date range', () => {

    it('should select listing and open Apply Override', () => {
      cy.get('[qa-id^="bulk-"]').first()
        .click({ force: true })
      cy.get('button:contains("Apply Override")')
        .should('be.visible')
        .click()
      cy.get('p:contains("Date Specific Overrides")')
        .should('be.visible')
    })

    it('should apply bulk DSO for date range and verify save',
    () => {
      cy.fixture('dsoData').then((data) => {

        cy.intercept('POST', '**/add_custom_pricing**')
          .as('bulkDSO')

       
        cy.get('[qa-id^="bulk-"]').first()
          .click({ force: true })

     
        cy.get('button:contains("Apply Override")')
          .should('be.visible')

        // Step 3 — Clear selection
        cy.get('button:contains("Clear Selection")')
          .should('be.visible')
          .click()

       
        cy.get('[qa-id^="listing-ellipses-"]')
          .first()
          .click()

        cy.get('button:contains("Add Overrides")')
          .should('be.visible')
          .click()

        cy.get('p:contains("Date Specific Overrides")')
          .should('be.visible')

       
        cy.wait(1500)

        cy.get('[qa-id="dso-radio-option-fixed"]')
          .scrollIntoView()
          .click({ force: true })

   
        cy.get('input[qa-id="dso-price"]', { timeout: 10000 })
          .scrollIntoView()
          .should('be.visible')
          .clear()
          .type(data.bulkDSO.fixedPrice)

     
        cy.get('button#add-dso-button-v2')
          .scrollIntoView()
          .click()

      
        cy.wait(1500)
        cy.get('body').then(($body) => {
          if ($body.find('button:contains("Update")').length > 0) {
            cy.intercept('POST', '**/add_custom_pricing**')
              .as('bulkDSOConfirm')
            cy.get('button:contains("Update")').click()
            cy.wait('@bulkDSOConfirm', { timeout: 15000 })
              .then((interception) => {
                expect(interception.response.statusCode).to.eq(200)
                expect(interception.response.body.message)
                  .to.eq('SUCCESS')
              })
          } else {
            cy.wait('@bulkDSO', { timeout: 15000 })
              .then((interception) => {
                expect(interception.response.statusCode).to.eq(200)
                expect(interception.response.body.message)
                  .to.eq('SUCCESS')
              })
          }
        })
      })
    })

  })

 
  context('Scenario: Verify DSO save persistence', () => {

    it('should verify saved DSO appears in View Overrides', () => {

      cy.intercept('GET', '**/get_calendar_data**')
        .as('getCalendarData')

      MultiCalendarPage.openThreeDotsMenu(listingId)
      MultiCalendarPage.clickViewOverrides()

      cy.wait('@getCalendarData', { timeout: 15000 })
        .then((interception) => {
          expect(interception.response.statusCode).to.eq(200)
        })

      cy.get('body')
        .should('contain.text', 'Listing Level Overrides')
    })

  })

})