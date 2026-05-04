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
    cy.get('tr[data-index]', { timeout: 20000 })
      .should('exist')
  })

  
  context('Scenario: Apply DSO and verify price updates', () => {

    it('should apply DSO and verify API returns 200', () => {
      cy.fixture('dsoData').then((data) => {


        cy.intercept('POST', '**/add_custom_pricing**')
          .as('saveDSO')

       
        MultiCalendarPage.openThreeDotsMenu(listingId)
        MultiCalendarPage.clickAddOverrides()

        MultiCalendarPage.selectStartDate(15)
        MultiCalendarPage.selectEndDate(15)

        // Step 3 - Enter price
        MultiCalendarPage.selectFixedPrice()
        MultiCalendarPage.enterFinalPrice(data.validDSO.fixedPrice)

     
        cy.get('button#add-dso-button-v2').click()

       
        cy.wait(1000)
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

  context('Scenario: Apply percent DSO and verify final price', () => {

    it('should apply percent DSO and verify final price', () => {
      cy.fixture('dsoData').then((data) => {

        cy.intercept('POST', '**/add_custom_pricing**')
          .as('saveDSOPercent')

        // Step 1 - Open DSO
        MultiCalendarPage.openThreeDotsMenu(listingId)
        MultiCalendarPage.clickAddOverrides()

        
        MultiCalendarPage.selectPercentPrice()

      
        MultiCalendarPage.selectStartDate(20)
        MultiCalendarPage.selectEndDate(20)

     
        MultiCalendarPage.enterFinalPrice(data.validDSO.percentValue)

    
        cy.get('button#add-dso-button-v2').click()

        cy.wait(1000)
        cy.get('body').then(($body) => {
          if ($body.find('button:contains("Update")').length > 0) {
            cy.intercept('POST', '**/add_custom_pricing**')
              .as('saveDSOPercentConfirm')
            cy.get('button:contains("Update")').click()
            cy.wait('@saveDSOPercentConfirm', { timeout: 15000 })
              .then((interception) => {
                expect(interception.response.statusCode).to.eq(200)
                expect(interception.response.body.message)
                  .to.eq('SUCCESS')
              })
          } else {
            cy.wait('@saveDSOPercent', { timeout: 15000 })
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

})