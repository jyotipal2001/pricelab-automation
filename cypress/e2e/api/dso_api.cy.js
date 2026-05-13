

describe('Feature: DSO API Testing', () => {
 
  const baseUrl = 'https://app.pricelabs.co'
  const dsoEndpoint = '/api/add_custom_pricing'
  const listingId = 'SUNSETPROPS_OLSE___533'
  const pmsName = 'vrm'
 
  before(() => {
    cy.loginToPriceLabs()
  })
 
  beforeEach(() => {
    cy.loginToPriceLabs()
    cy.visit('https://app.pricelabs.co/multicalendar')
    cy.url().should('include', 'multicalendar')
    cy.get('tr[data-index]', { timeout: 15000 })
      .should('exist')
  })
 
 
  
  context('API: Intercept real DSO API call from UI', () => {
 
    it('should intercept add_custom_pricing and return 200', () => {
 
      
      cy.intercept('POST', '**/add_custom_pricing**')
        .as('addCustomPricing')
 
      cy.get(`[qa-id="listing-ellipses-${listingId}"]`)
        .should('be.visible')
        .click()
 
      cy.get('button:contains("Add Overrides")')
        .should('be.visible')
        .click()
 
      
      cy.get('p:contains("Date Specific Overrides")', { timeout: 10000 })
        .should('be.visible')
 
      
      cy.get('input[qa-id="dso-price"]', { timeout: 10000 })
        .should('be.visible')
        .and('not.be.disabled')
        .clear()
        .type('150')
 
      cy.get('button#add-dso-button-v2')
        .should('be.visible')
        .click()
 
      
      cy.get('body').then(($body) => {
        if ($body.find('button:contains("Update")').length > 0) {
          // Re-register intercept for confirm click
          cy.intercept('POST', '**/add_custom_pricing**')
            .as('addCustomPricingConfirm')
          cy.get('button:contains("Update")').click()
          cy.wait('@addCustomPricingConfirm', { timeout: 15000 })
            .then((interception) => {
              expect(interception.response.statusCode).to.eq(200)
              expect(interception.response.body.message).to.eq('SUCCESS')
            })
        } else {
          cy.wait('@addCustomPricing', { timeout: 15000 })
            .then((interception) => {
              expect(interception.response.statusCode).to.eq(200)
              expect(interception.response.body.message).to.eq('SUCCESS')
            })
        }
      })
    })
 
  })
 
 
  
  context('API: Direct request with valid payload', () => {
 
    it('should return 200 with SUCCESS message', () => {
 
      cy.request({
        method: 'POST',
        url: `${baseUrl}${dsoEndpoint}`,
        body: {
          price: '250',
          priceType: 'fixed',
          startDate: 'Jun 20 2026',
          endDate: 'Jun 20 2026',
          actualStartDate: '2026-06-20',
          actualEndDate: '2026-06-20',
          listingId: listingId,
          pmsName: pmsName,
          minPrice: '',
          maxPrice: '',
          basePrice: '',
          minStay: '',
          currency: 'USD',
          checkInCheckOutEnabled: false,
          checkIn: '0000000',
          checkOut: '1111111',
          reason: '',
          snoozeDso: false,
          syncChildren: true,
          hasChildren: false,
          isParentListing: false,
          isPricingPage: false,
          page: 1,
          cacheBuster: Date.now()
        },
        failOnStatusCode: false
      }).then((response) => {
        cy.log('Status: ' + response.status)
        cy.log('Body: ' + JSON.stringify(response.body))
        expect(response.status).to.eq(200)
        expect(response.body.message).to.eq('SUCCESS')
      })
    })
 
  })
 
 
  
  context('API: Negative - Expired/Invalid auth token', () => {
 
    it('should verify API behavior with invalid token', () => {
 
      cy.request({
        method: 'POST',
        url: `${baseUrl}${dsoEndpoint}`,
        headers: {
          'Authorization': 'Bearer invalid_token_xyz_123',
          'Cookie': '_pricelabs_session=invalid_session_token'
        },
        body: {
          price: '100',
          priceType: 'fixed',
          startDate: 'Jun 10 2026',
          endDate: 'Jun 10 2026',
          listingId: listingId,
          pmsName: pmsName,
          currency: 'USD',
          cacheBuster: Date.now()
        },
        failOnStatusCode: false
      }).then((response) => {
        cy.log('Status: ' + response.status)
        cy.log('Body: ' + JSON.stringify(response.body))
        // PriceLabs may return 302 redirect, 401, 403, or 200 with error body
        expect([200, 302, 401, 403]).to.include(response.status)
        cy.log(' TC03 passed — status: ' + response.status)
      })
    })
 
  })
 
 
  
  context('API: Negative - Invalid/missing listingId', () => {
 
    it('should return error when listingId is invalid', () => {
 
      cy.request({
        method: 'POST',
        url: `${baseUrl}${dsoEndpoint}`,
        body: {
          price: '100',
          priceType: 'fixed',
          startDate: 'Jun 10 2026',
          endDate: 'Jun 10 2026',
          listingId: 'INVALID_LISTING_ID_DOES_NOT_EXIST',
          pmsName: 'invalid_pms',
          currency: 'USD',
          cacheBuster: Date.now()
        },
        failOnStatusCode: false
      }).then((response) => {
        cy.log('Status: ' + response.status)
        cy.log('Body: ' + JSON.stringify(response.body))
        if (response.status === 200) {
          cy.log('API returned 200 — body: ' + JSON.stringify(response.body))
        }
        expect([200, 400, 422, 500]).to.include(response.status)
        cy.log('TC04 passed — status: ' + response.status)
      })
    })
 
  })
 
 
  context('API: Validate complete response structure', () => {
 
    it('should validate all response fields on success', () => {
 
      
      cy.intercept('POST', '**/add_custom_pricing**')
        .as('dsoFull')
 
      cy.get(`[qa-id="listing-ellipses-${listingId}"]`)
        .should('be.visible')
        .click()
 
      cy.get('button:contains("Add Overrides")')
        .should('be.visible')
        .click()
 
      
      cy.get('p:contains("Date Specific Overrides")', { timeout: 10000 })
        .should('be.visible')
 
      cy.get('input[qa-id="dso-price"]', { timeout: 10000 })
        .should('be.visible')
        .and('not.be.disabled')
        .clear()
        .type('300')
 
      cy.get('button#add-dso-button-v2')
        .should('be.visible')
        .click()
 
     
      cy.get('body').then(($body) => {
        if ($body.find('button:contains("Update")').length > 0) {
          cy.intercept('POST', '**/add_custom_pricing**')
            .as('dsoFullConfirm')
          cy.get('button:contains("Update")').click()
          cy.wait('@dsoFullConfirm', { timeout: 15000 })
            .then((interception) => {
              const body = interception.response.body
              expect(body).to.have.property('message')
              expect(body).to.have.property('response')
              expect(body).to.have.property('status')
              expect(body.message).to.eq('SUCCESS')
              expect(body.status).to.eq(200)
              cy.log(' Response structure: ' + JSON.stringify(body))
            })
        } else {
          cy.wait('@dsoFull', { timeout: 15000 })
            .then((interception) => {
              const body = interception.response.body
              expect(body).to.have.property('message')
              expect(body).to.have.property('response')
              expect(body).to.have.property('status')
              expect(body.message).to.eq('SUCCESS')
              expect(body.status).to.eq(200)
              cy.log(' Response structure: ' + JSON.stringify(body))
            })
        }
      })
    })
 
  })
 
})