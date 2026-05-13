


const L = require('../locators/MultiCalendarLocators')
 
class MultiCalendarPage {
 
    navigate() {
    cy.visit('/multicalendar')
    cy.url().should('include', 'multicalendar')
    this.waitForPageLoad()
  }
 
  waitForPageLoad() {
    cy.get(L.listingRow, { timeout: 15000 })
      .should('exist')
  }
 
  
  searchListing(name) {
    cy.get(L.searchInput)
      .should('be.visible')
      .clear()
      .type(name)
   
    cy.get(L.listingRow, { timeout: 10000 }).should('exist')
  }
 
  clearSearch() {
    cy.get(L.searchInput).clear()
    cy.get(L.listingRow, { timeout: 10000 }).should('exist')
  }
 
  selectListingByName(name) {
    cy.get(L.listingRowByName(name))
      .find(L.listingCheckbox)
      .click({ force: true })
  }
 
  selectListingById(listingId) {
    cy.get(L.listingCheckboxByListingId(listingId))
      .click({ force: true })
  }
 
  
  openThreeDotsMenu(listingId) {
    cy.get(L.threeDotsMenuByListingId(listingId))
      .should('be.visible')
      .click()
  }
 
  clickAddOverrides() {
    cy.get(L.addOverridesOption)
      .should('be.visible')
      .click()
    cy.get(L.dsoPanelTitle, { timeout: 10000 })
      .should('be.visible')
  }
 
  clickViewOverrides() {
    cy.get(L.viewOverridesOption)
      .should('be.visible')
      .click()
  }
 
  
  selectStartDate(day) {
    cy.get(L.startDateContainer)
      .first()
      .should('be.visible')
      .click({ force: true })
 
    const padded = String(day).padStart(3, '0')
    cy.get(`.react-datepicker__day--${padded}`)
      .not('.react-datepicker__day--outside-month')
      .first()
      .click({ force: true })
  }
 
  selectEndDate(day) {
    cy.get(L.endDateContainer)
      .first()
      .should('be.visible')
      .click({ force: true })
 
    const padded = String(day).padStart(3, '0')
    cy.get(`.react-datepicker__day--${padded}`)
      .not('.react-datepicker__day--outside-month')
      .first()
      .click({ force: true })
  }
 
  selectDateRange(startDay, endDay) {
    this.selectStartDate(startDay)
    this.selectEndDate(endDay)
  }
 
 
  selectFixedPrice() {
    cy.get('[qa-id="dso-radio-option-fixed"]')
      .should('be.visible')
      .click({ force: true })
  }
 
  selectPercentPrice() {
    cy.get('input[type="radio"][value="percent"]')
      .should('exist')
      .click({ force: true })
  }
 
  
  enterFinalPrice(price) {
    cy.get(L.newFinalPriceInput, { timeout: 10000 })
      .scrollIntoView()
      .should('be.visible')
      .and('not.be.disabled')
      .clear()
      .type(price)
  }
 
  addMinPrice(price) {
    cy.get(L.minPriceAddBtn).click()
    cy.get(L.minPriceInput)
      .should('be.visible')
      .clear()
      .type(price)
  }
 
  addMaxPrice(price) {
    cy.get(L.maxPriceAddBtn).click()
    cy.get(L.maxPriceInput)
      .should('be.visible')
      .clear()
      .type(price)
  }
 
  addBasePrice(price) {
    cy.get(L.basePriceAddBtn).click()
    cy.get(L.basePriceInput)
      .should('be.visible')
      .clear()
      .type(price)
  }
 
  
  submitDSO() {
    cy.intercept('POST', '**/add_custom_pricing**').as('saveDSO')
    cy.get(L.dsoAddButton)
      .should('be.visible')
      .click()
    cy.wait('@saveDSO', { timeout: 15000 })
      .its('response.statusCode')
      .should('eq', 200)
  }
 
  cancelDSO() {
    cy.get(L.dsoCancelButton)
      .should('be.visible')
      .click()
  }
 
  
  addDSOForListing(listingId, startDay, endDay, price) {
    this.openThreeDotsMenu(listingId)
    this.clickAddOverrides()
    this.selectStartDate(startDay)
    this.selectEndDate(endDay)
    // Wait for datepicker to close
    cy.get('.react-datepicker-popper').should('not.exist')
    this.selectFixedPrice()
    this.enterFinalPrice(price)
    this.submitDSO()
  }
 
 
  clickApplyOverride() {
    cy.get(L.applyOverrideBtn)
      .should('be.visible')
      .click()
    cy.get(L.dsoPanelTitle, { timeout: 10000 })
      .should('be.visible')
  }
 
  clickClearSelection() {
    cy.get(L.clearSelectionBtn)
      .should('be.visible')
      .click()
  }
 
  clickSaveAndRefresh() {
    cy.intercept('POST', '**/refresh**').as('saveRefresh')
    cy.get(L.saveRefreshBtn)
      .should('be.visible')
      .click()
    cy.wait('@saveRefresh', { timeout: 15000 })
  }
 
  
  verifySuccessToast() {
    cy.get(L.toastMessage, { timeout: 10000 })
      .should('be.visible')
  }
 
  verifyToastContains(text) {
    cy.get(L.toastMessage, { timeout: 10000 })
      .should('contain.text', text)
  }
 
 
  dragMetric(sourceSelector, targetSelector) {
    cy.get(sourceSelector)
      .drag(targetSelector, { force: true })
  }
 
}
 
module.exports = new MultiCalendarPage()