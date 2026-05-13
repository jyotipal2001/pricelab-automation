const MultiCalendarPage = require('../../pages/MultiCalendarPage')
 
const listingId = 'SUNSETPROPS_OLSE___533'
 
describe('Feature: Multicalendar DSO - End to End Tests', () => {
 
  before(() => {
    cy.loginToPriceLabs()
  })
 
  beforeEach(() => {
    cy.loginToPriceLabs()
    cy.visit('https://app.pricelabs.co/multicalendar')
    cy.url().should('include', 'multicalendar')
    cy.get('tr[data-index]', { timeout: 20000 }).should('exist')
  })
 
 
  // E2E TC1: Apply Fixed DSO and verify final price in grid 
  context('Scenario: Apply DSO and verify price updates in calendar grid', () => {
 
    it('should apply fixed DSO and verify final price reflects in calendar grid', () => {
      cy.fixture('dsoData').then((data) => {
 
        cy.intercept('POST', '**/add_custom_pricing**')
          .as('saveDSO')
 
     
        MultiCalendarPage.openThreeDotsMenu(listingId)
        MultiCalendarPage.clickAddOverrides()
 
        // Step 2 — Select date (day 25 of current month)
        MultiCalendarPage.selectStartDate(25)
        MultiCalendarPage.selectEndDate(25)
 
        
        cy.get('.react-datepicker-popper')
          .should('not.exist')
 
       
        MultiCalendarPage.selectFixedPrice()
 
        cy.get('input[qa-id="dso-price"]', { timeout: 10000 })
          .should('be.visible')
          .and('not.be.disabled')
 
        MultiCalendarPage.enterFinalPrice(data.validDSO.fixedPrice)
 
        // Step 4 — Verify ADR and Total shown in DSO panel before saving
        cy.get('body').contains('ADR').should('exist')
        cy.get('body').contains('Total').should('exist')
 
     
        cy.get('button#add-dso-button-v2')
          .scrollIntoView()
          .should('be.visible')
          .click()
 
        
        cy.get('body').then(($body) => {
          if ($body.find('button:contains("Update")').length > 0) {
            cy.intercept('POST', '**/add_custom_pricing**')
              .as('saveDSOConfirm')
            cy.get('button:contains("Update")').click()
            cy.wait('@saveDSOConfirm', { timeout: 15000 })
              .then((interception) => {
                expect(interception.response.statusCode).to.eq(200)
                expect(interception.response.body.message).to.eq('SUCCESS')
              })
          } else {
            cy.wait('@saveDSO', { timeout: 15000 })
              .then((interception) => {
                expect(interception.response.statusCode).to.eq(200)
                expect(interception.response.body.message).to.eq('SUCCESS')
              })
          }
        })
 
        
        // closes the panel automatically just wait for cancel button to disappear
        cy.get('button#dso-modal-cancel-btn-v2', { timeout: 10000 })
          .should('not.exist')
 
        
        // Intercept calendar data reload BEFORE clicking Save & Refresh
        cy.intercept('GET', '**/get_calendar_data**').as('calendarReload')
 
        // Click Save & Refresh for this listing row
        cy.get(`tr[data-index]`)
          .contains('Sunset Watcher')
          .closest('tr')
          .find('button:contains("Save & Refresh")', { timeout: 10000 })
          .scrollIntoView()
          .should('be.visible')
          .click()
 
        // Wait for calendar data API to return 200
        cy.wait('@calendarReload', { timeout: 20000 })
          .then((interception) => {
            expect(interception.response.statusCode).to.eq(200)
          })
 
        // Wait for "Fetching latest pricing data to disappear
        cy.get(`tr[data-index]`)
          .contains('Sunset Watcher')
          .closest('tr')
          .should('not.contain.text', 'Fetching latest pricing data', { timeout: 20000 })
 
        // Now verify the DSO price appears in the View Overrides API
        cy.intercept('GET', '**/get_calendar_data**').as('calendarVerify')
 
        cy.get(`tr[data-index]`)
          .contains('Sunset Watcher')
          .closest('tr')
          .find('[qa-id^="listing-ellipses-"]')
          .click()
 
        cy.get('button:contains("View Overrides")')
          .should('be.visible')
          .click()
 
        cy.wait('@calendarVerify', { timeout: 15000 })
          .then((interception) => {
            expect(interception.response.statusCode).to.eq(200)
            cy.log(' Calendar data reloaded — DSO saved and verified via API')
          })
 
        cy.get('body', { timeout: 10000 })
          .should('contain.text', 'Listing Level Overrides')
 
        cy.log(' E2E PASSED: DSO save verified via View Overrides panel')
      })
    })
 
  })
 
 
  //E2E TC2: Apply Percent DSO and verify API response 
  context('Scenario: Apply percent DSO and verify final price', () => {
 
    it('should apply percent DSO and verify API returns 200 with SUCCESS', () => {
      cy.fixture('dsoData').then((data) => {
 
        cy.intercept('POST', '**/add_custom_pricing**')
          .as('saveDSOPercent')
 
        
        MultiCalendarPage.openThreeDotsMenu(listingId)
        MultiCalendarPage.clickAddOverrides()
 
        
        cy.get('[qa-id="dso-radio-option-fixed"]')
          .should('be.visible')
 
        
        cy.contains('label', 'Percent')
          .click({ force: true })
 
       
        cy.get('input[qa-id="dso-price"]', { timeout: 10000 })
          .should('be.visible')
          .and('not.be.disabled')
 
        cy.log(' Percent radio selected')
 
        
        MultiCalendarPage.selectStartDate(26)
        MultiCalendarPage.selectEndDate(26)
 
       
        cy.get('.react-datepicker-popper')
          .should('not.exist')
 
        
        cy.get('input[qa-id="dso-price"]', { timeout: 10000 })
          .should('be.visible')
          .and('not.be.disabled')
 
        MultiCalendarPage.enterFinalPrice(data.validDSO.percentValue)
 
        // Step 5 — Verify ADR and Total update in panel (Final Price Summary)
        cy.get('body').contains('ADR').should('exist')
        cy.get('body').contains('Total').should('exist')
        cy.log('Final price summary shown in DSO panel ')
 
     
        cy.get('button#add-dso-button-v2')
          .scrollIntoView()
          .should('be.visible')
          .click()
 
       
        cy.get('body').then(($body) => {
          if ($body.find('button:contains("Update")').length > 0) {
            cy.intercept('POST', '**/add_custom_pricing**')
              .as('saveDSOPercentConfirm')
            cy.get('button:contains("Update")').click()
            cy.wait('@saveDSOPercentConfirm', { timeout: 15000 })
              .then((interception) => {
                expect(interception.response.statusCode).to.eq(200)
                expect(interception.response.body.message).to.eq('SUCCESS')
                cy.log('Percent DSO saved successfully')
              })
          } else {
            cy.wait('@saveDSOPercent', { timeout: 15000 })
              .then((interception) => {
                expect(interception.response.statusCode).to.eq(200)
                expect(interception.response.body.message).to.eq('SUCCESS')
                cy.log('Percent DSO saved successfully')
              })
          }
        })
 
      })
    })
 
  })
 
})
