const MultiCalendarPage = require('../../pages/MultiCalendarPage')

const listingId = 'SUNSETPROPS_OLSE___533'
const listingName = '1103 WM - Sunset Watcher'

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


  
  context('Scenario: Search listing using search input', () => {

    it('should search for a listing and filter the data grid', () => {

      // COMPONENT 1: Search Input
      cy.get('input[placeholder="Search listings, IDs, cities, and tags"]')
        .should('be.visible')
        .clear()
        .type(listingName)

      
      cy.get('tr[data-index]', { timeout: 10000 })
        .should('exist')

      // COMPONENT 2: Data Grid — verify filtered result
      cy.get('tr[data-index]').first()
        .should('contain.text', 'Sunset')

      
      cy.get('input[placeholder="Search listings, IDs, cities, and tags"]')
        .clear()

      cy.get('tr[data-index]', { timeout: 10000 })
        .should('exist')
    })

  })


  // ─── COMPONENT: Tooltip 
  context('Scenario: Verify tooltip on price cell in calendar grid', () => {

    it('should display tooltip when hovering over a price cell', () => {

      
      cy.get('[qa-id^="price-tooltip--"]', { timeout: 15000 })
        .first()
        .scrollIntoView()
        .should('be.visible')
        .trigger('mouseover', { force: true })

      // Tooltip popover should appear with pricing breakdown
      cy.get('[role="tooltip"], [class*="chakra-popover"], [class*="popover-content"]', { timeout: 10000 })
        .should('exist')

      cy.log(' Tooltip verified on price cell in calendar grid')
    })

  })


  // ─── FUNCTIONAL TC1: Update DSO for single date ───────────────────
  context('Scenario: Update DSO value for a single date', () => {

    it('should open DSO panel for a listing', () => {
      // COMPONENT: Three dots menu → Modal open
      MultiCalendarPage.openThreeDotsMenu(listingId)
      MultiCalendarPage.clickAddOverrides()

      // COMPONENT 3: Modal panel title visible
      cy.get('p:contains("Date Specific Overrides")')
        .should('be.visible')
    })

    it('should enter fixed price and save DSO for single date', () => {
      cy.fixture('dsoData').then((data) => {

        cy.intercept('POST', '**/add_custom_pricing**')
          .as('saveDSO')

        MultiCalendarPage.openThreeDotsMenu(listingId)
        MultiCalendarPage.clickAddOverrides()

        // COMPONENT 5: DatePicker — select start and end date
        MultiCalendarPage.selectStartDate(20)
        MultiCalendarPage.selectEndDate(20)

        
        cy.get('.react-datepicker-popper')
          .should('not.exist')

        // Select Fixed price radio
        cy.get('[qa-id="dso-radio-option-fixed"]')
          .scrollIntoView()
          .should('be.visible')
          .click({ force: true })

        
        cy.get('input[qa-id="dso-price"]', { timeout: 10000 })
          .scrollIntoView()
          .should('be.visible')
          .and('not.be.disabled')
          .clear()
          .type(data.validDSO.fixedPrice)

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

      })
    })

  })


  
  context('Scenario: Bulk update DSO for a date range', () => {

    it('should select listing checkbox and open Apply Override', () => {

      
      cy.get('button[qa-id="qf-quick-filters-menu-button"]')
        .should('be.visible')
        .click()

      cy.get('div[qa-id="qf-pms-filters"]')
        .should('be.visible')
        .click()

      // Select VRM from PMS submenu
      cy.contains('VRM')
        .should('be.visible')
        .click()

      
      cy.get('tr[data-index]', { timeout: 15000 })
        .should('exist')

      
      cy.get('[qa-id^="bulk-"]').first()
        .click({ force: true })

      
      cy.get('button:contains("Apply Override")', { timeout: 10000 })
        .should('be.visible')
        .click()

      // COMPONENT: Modal
      cy.get('p:contains("Date Specific Overrides")', { timeout: 10000 })
        .should('be.visible')

      // Close DSO panel — use X button (cancel btn not always present in bulk mode)
      cy.get('body').then(($body) => {
        if ($body.find('button#dso-modal-cancel-btn-v2').length > 0) {
          cy.get('button#dso-modal-cancel-btn-v2').click()
        } else {
          cy.get('[aria-label="Close"], button:contains("Cancel")', { timeout: 5000 })
            .first()
            .click({ force: true })
        }
      })

      
      cy.visit('https://app.pricelabs.co/multicalendar')
      cy.get('tr[data-index]', { timeout: 15000 }).should('exist')
    })

    it('should apply bulk DSO for date range and verify save', () => {
      cy.fixture('dsoData').then((data) => {

        cy.intercept('POST', '**/add_custom_pricing**')
          .as('bulkDSO')

        
        MultiCalendarPage.openThreeDotsMenu(listingId)
        MultiCalendarPage.clickAddOverrides()

        
        cy.get('p:contains("Date Specific Overrides")')
          .should('be.visible')

        // COMPONENT: DatePicker — select range
        MultiCalendarPage.selectStartDate(22)
        MultiCalendarPage.selectEndDate(25)

      
        cy.get('.react-datepicker-popper')
          .should('not.exist')

       
        cy.get('[qa-id="dso-radio-option-fixed"]')
          .scrollIntoView()
          .should('be.visible')
          .click({ force: true })

        // Price input ready
        cy.get('input[qa-id="dso-price"]', { timeout: 10000 })
          .scrollIntoView()
          .should('be.visible')
          .and('not.be.disabled')
          .clear()
          .type(data.bulkDSO.fixedPrice)

        cy.get('button#add-dso-button-v2')
          .scrollIntoView()
          .click()

        cy.get('body').then(($body) => {
          if ($body.find('button:contains("Update")').length > 0) {
            cy.intercept('POST', '**/add_custom_pricing**')
              .as('bulkDSOConfirm')
            cy.get('button:contains("Update")').click()
            cy.wait('@bulkDSOConfirm', { timeout: 15000 })
              .then((interception) => {
                expect(interception.response.statusCode).to.eq(200)
                expect(interception.response.body.message).to.eq('SUCCESS')
              })
          } else {
            cy.wait('@bulkDSO', { timeout: 15000 })
              .then((interception) => {
                expect(interception.response.statusCode).to.eq(200)
                expect(interception.response.body.message).to.eq('SUCCESS')
              })
          }
        })

      })
    })

  })

    it('should apply bulk DSO for date range and verify save', () => {
      cy.fixture('dsoData').then((data) => {

        cy.intercept('POST', '**/add_custom_pricing**')
          .as('bulkDSO')

        
        MultiCalendarPage.openThreeDotsMenu(listingId)
        MultiCalendarPage.clickAddOverrides()

        cy.get('p:contains("Date Specific Overrides")')
          .should('be.visible')

       
        MultiCalendarPage.selectStartDate(22)
        MultiCalendarPage.selectEndDate(25)

       
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
          .type(data.bulkDSO.fixedPrice)

        cy.get('button#add-dso-button-v2')
          .scrollIntoView()
          .click()

        cy.get('body').then(($body) => {
          if ($body.find('button:contains("Update")').length > 0) {
            cy.intercept('POST', '**/add_custom_pricing**')
              .as('bulkDSOConfirm')
            cy.get('button:contains("Update")').click()
            cy.wait('@bulkDSOConfirm', { timeout: 15000 })
              .then((interception) => {
                expect(interception.response.statusCode).to.eq(200)
                expect(interception.response.body.message).to.eq('SUCCESS')
              })
          } else {
            cy.wait('@bulkDSO', { timeout: 15000 })
              .then((interception) => {
                expect(interception.response.statusCode).to.eq(200)
                expect(interception.response.body.message).to.eq('SUCCESS')
              })
          }
        })

      })
    })

  })


  // ───  TC3: Verify DSO save
  context('Scenario: Verify DSO save persistence', () => {

    it('should verify saved DSO appears in View Overrides', () => {

      cy.intercept('GET', '**/get_calendar_data**')
        .as('getCalendarData')

      
      cy.scrollTo('top')

      // Search input — wait for it with longer timeout since page may still be loading
      cy.get('input[placeholder="Search listings, IDs, cities, and tags"]',
        { timeout: 20000 })
        .scrollIntoView()
        .should('be.visible')
        .clear()
        .type('Sunset Watcher')

      // Wait for grid to filter
      cy.get(`[qa-id="listing-ellipses-${listingId}"]`, { timeout: 15000 })
        .should('be.visible')

      MultiCalendarPage.openThreeDotsMenu(listingId)
      MultiCalendarPage.clickViewOverrides()

      cy.wait('@getCalendarData', { timeout: 15000 })
        .then((interception) => {
          expect(interception.response.statusCode).to.eq(200)
        })

      cy.get('body', { timeout: 10000 })
        .should('contain.text', 'Listing Level Overrides')
    })

  })

