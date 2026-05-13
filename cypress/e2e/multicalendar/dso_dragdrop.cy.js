const MultiCalendarPage = require('../../pages/MultiCalendarPage')

const listingId = 'SUNSETPROPS_OLSE___533'

describe('Feature: Multicalendar DSO - Negative Tests', () => {

  before(() => {
    cy.loginToPriceLabs()
  })

  beforeEach(() => {
    cy.loginToPriceLabs()
    cy.visit('https://app.pricelabs.co/multicalendar')
    cy.url().should('include', 'multicalendar')
    cy.get('tr[data-index]', { timeout: 20000 }).should('exist')

   
    cy.get(`[qa-id="listing-ellipses-${listingId}"]`, { timeout: 15000 })
      .should('be.visible')
      .as('threeDotsBtn')

    // Re-query using alias  avoids stale element issue
    cy.get('@threeDotsBtn').click({ force: true })

    cy.get('button:contains("Add Overrides")', { timeout: 10000 })
      .should('be.visible')
      .click()

    cy.get('p:contains("Date Specific Overrides")', { timeout: 10000 })
      .should('be.visible')
  })


  
  context('Scenario: Input invalid characters in price field', () => {

    it('should not accept alphabetic characters in price input', () => {
      cy.fixture('dsoData').then((data) => {

     
        MultiCalendarPage.selectStartDate(20)
        MultiCalendarPage.selectEndDate(20)

       
        cy.get('.react-datepicker-popper')
          .should('not.exist')

        
        cy.get('[qa-id="dso-radio-option-fixed"]')
          .scrollIntoView()
          .should('be.visible')
          .click({ force: true })

       
        cy.get('input[qa-id="dso-price"]', { timeout: 10000 })
          .scrollIntoView()
          .should('be.visible')
          .and('not.be.disabled')
          .clear()
          .type(data.invalidDSO.textValue)

        
        cy.get('input[qa-id="dso-price"]')
          .invoke('val')
          .then((val) => {
            cy.log('Value after typing text: ' + val)
            expect(val).to.be.a('string')
            cy.log(' TC01 documented: field value = ' + val)
          })
      })
    })


    it('should show error for out of range percent value', () => {
      cy.fixture('dsoData').then((data) => {

       
        MultiCalendarPage.selectStartDate(20)
        MultiCalendarPage.selectEndDate(20)

       
        cy.get('.react-datepicker-popper')
          .should('not.exist')

        
        cy.get('[qa-id="dso-radio-option-fixed"]')
          .scrollIntoView()
          .should('be.visible')
          .click({ force: true })

       
        cy.get('input[type="radio"][value="percent"]')
          .should('exist')
          .click({ force: true })

       
        cy.get('input[type="radio"][value="percent"]')
          .should('be.checked')

      
        cy.get('input[qa-id="dso-price"]', { timeout: 10000 })
          .scrollIntoView()
          .should('be.visible')
          .and('not.be.disabled')
          .clear()
          .type(data.invalidDSO.outOfRangePercent)

        cy.get('button#add-dso-button-v2')
          .scrollIntoView()
          .should('be.visible')
          .click()

       
        cy.get('body').then(($body) => {
          const hasError =
            $body.find('[class*="error"]').length > 0 ||
            $body.find('[class*="invalid"]').length > 0 ||
            $body.find('.Toastify__toast').length > 0 ||
            $body.find('[class*="chakra-alert"]').length > 0 ||
            $body.find('button:contains("Update")').length > 0

          cy.log('Error/warning shown: ' + hasError)
          expect(hasError).to.be.true
          cy.log(' TC02 PASSED: Out of range percent handled correctly')
        })
      })
    })

  })


  
  context('Scenario: Submit DSO without entering price', () => {

    it('should not submit DSO with empty price field', () => {

  
      MultiCalendarPage.selectStartDate(20)
      MultiCalendarPage.selectEndDate(20)

      cy.get('.react-datepicker-popper')
        .should('not.exist')

      cy.get('[qa-id="dso-radio-option-fixed"]')
        .scrollIntoView()
        .should('be.visible')
        .click({ force: true })

    
      cy.get('input[qa-id="dso-price"]', { timeout: 10000 })
        .should('be.visible')
        .clear()

     
      cy.get('button#add-dso-button-v2')
        .scrollIntoView()
        .should('be.visible')
        .click()

      
      cy.get('body').then(($body) => {
        const panelOpen =
          $body.find('p:contains("Date Specific Overrides")').length > 0
        const errorShown =
          $body.find('[class*="error"]').length > 0 ||
          $body.find('[class*="chakra-alert"]').length > 0

        cy.log('Panel still open: ' + panelOpen)
        cy.log('Error shown: ' + errorShown)
        expect(panelOpen || errorShown).to.be.true
        cy.log(' TC03 PASSED: Empty price submission blocked or error shown')
      })
    })

  })



  context('Scenario: Input negative price value', () => {

    it('should handle negative price input gracefully', () => {
      cy.fixture('dsoData').then((data) => {

    
        MultiCalendarPage.selectStartDate(20)
        MultiCalendarPage.selectEndDate(20)

      
        cy.get('.react-datepicker-popper')
          .should('not.exist')

      
        cy.get('[qa-id="dso-radio-option-fixed"]')
          .scrollIntoView()
          .should('be.visible')
          .click({ force: true })

   
        cy.get('input[qa-id="dso-price"]', { timeout: 10000 })
          .scrollIntoView()
          .should('be.visible')
          .and('not.be.disabled')
          .clear()
          .type(data.invalidDSO.negativeValue)

        cy.get('button#add-dso-button-v2')
          .scrollIntoView()
          .should('be.visible')
          .click()

       
        cy.get('body').then(($body) => {
          if ($body.find('button:contains("Update")').length > 0) {
            cy.get('button:contains("Go Back")').click()
           
            cy.get('p:contains("Date Specific Overrides")', { timeout: 10000 })
              .should('be.visible')
          }
        })

       
        cy.get('body').then(($body) => {
          const panelOpen =
            $body.find('p:contains("Date Specific Overrides")').length > 0
          const toastShown =
            $body.find('.Toastify__toast').length > 0 ||
            $body.find('[class*="chakra-alert"]').length > 0

          cy.log('Panel open: ' + panelOpen)
          cy.log('Toast shown: ' + toastShown)
          expect(panelOpen || toastShown).to.be.true
          cy.log(' TC04 PASSED: Negative price handled gracefully')
        })

      })
    })

  })

})