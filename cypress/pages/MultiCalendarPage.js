const L = require('../locators/MultiCalendarLocators')

class MultiCalendarPage {

  // ─── Navigation ──────────────────────────────────
  navigate() {
    cy.visit('/multicalendar')
    cy.url().should('include', 'multicalendar')
    this.waitForPageLoad()
  }

  waitForPageLoad() {
    cy.get(L.listingRow, { timeout: 15000 })
      .should('exist')
  }

  // ─── Search ──────────────────────────────────────
  searchListing(name) {
    cy.get(L.searchInput)
      .should('be.visible')
      .clear()
      .type(name)
    cy.wait(1000)
    cy.get(L.listingRow).should('exist')
  }

  clearSearch() {
    cy.get(L.searchInput).clear()
  }

  // ─── Checkbox Selection ───────────────────────────
  selectListingByName(name) {
    cy.get(L.listingRowByName(name))
      .find(L.listingCheckbox)
      .click({ force: true })
  }

  selectListingById(listingId) {
    cy.get(L.listingCheckboxByListingId(listingId))
      .click({ force: true })
  }

  // ─── 3-dot Menu ───────────────────────────────────
  openThreeDotsMenu(listingId) {
    cy.get(L.threeDotsMenuByListingId(listingId))
      .should('be.visible')
      .click()
  }

  clickAddOverrides() {
    cy.get(L.addOverridesOption)
      .should('be.visible')
      .click()
    cy.get(L.dsoPanelTitle)
      .should('be.visible')
  }

  clickViewOverrides() {
    cy.get(L.viewOverridesOption)
      .should('be.visible')
      .click()
  }

  // ─── DSO Date Picker ──────────────────────────────
 

 selectStartDate(day) {
  cy.get(L.startDateContainer)
    .first()
    .should('be.visible')
    .click({ force: true })   // ← add force: true

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
    .click({ force: true })   // ← add force: true

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
  // ─── DSO Price Settings ───────────────────────────
 selectFixedPrice() {
  // Click the Fixed radio using qa-id 
  cy.get('[qa-id="dso-radio-option-fixed"]')
    .click({ force: true })
}

selectPercentPrice() {
  // Click percent radio using value 
  cy.get('input[type="radio"][value="percent"]')
    .click({ force: true })
}

 

  enterFinalPrice(price) {
  cy.get(L.newFinalPriceInput, { timeout: 10000 })
    .scrollIntoView()
    .should('be.visible')
    .clear()
    .type(price)
}

  addMinPrice(price) {
    cy.get(L.minPriceAddBtn)
      .click()
    cy.get(L.minPriceInput)
      .should('be.visible')
      .clear()
      .type(price)
  }

  addMaxPrice(price) {
    cy.get(L.maxPriceAddBtn)
      .click()
    cy.get(L.maxPriceInput)
      .should('be.visible')
      .clear()
      .type(price)
  }

  addBasePrice(price) {
    cy.get(L.basePriceAddBtn)
      .click()
    cy.get(L.basePriceInput)
      .should('be.visible')
      .clear()
      .type(price)
  }

  // ─── DSO Submit ───────────────────────────────────
  submitDSO() {
    cy.intercept('POST', '**/overrides**').as('saveDSO')
    cy.get(L.dsoAddButton)
      .should('be.visible')
      .click()
    cy.wait('@saveDSO').its('response.statusCode')
      .should('eq', 200)
  }

  cancelDSO() {
    cy.get(L.dsoCancelButton)
      .should('be.visible')
      .click()
  }

  // ─── Full DSO Flow ────────────────────────────────
  addDSOForListing(listingId, startDay, endDay, price) {
    this.openThreeDotsMenu(listingId)
    this.clickAddOverrides()
    this.selectStartDate(startDay)
    this.selectEndDate(endDay)
    this.selectFixedPrice()
    this.enterFinalPrice(price)
    this.submitDSO()
  }

  // ─── Bulk Actions ─────────────────────────────────
  clickApplyOverride() {
    cy.get(L.applyOverrideBtn)
      .should('be.visible')
      .click()
    cy.get(L.dsoPanelTitle)
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
    cy.wait('@saveRefresh')
  }

  // ─── Toast Verification ───────────────────────────
  verifySuccessToast() {
    cy.get(L.toastMessage, { timeout: 10000 })
      .should('be.visible')
  }

  verifyToastContains(text) {
    cy.get(L.toastMessage, { timeout: 10000 })
      .should('contain.text', text)
  }

  // ─── Drag and Drop ────────────────────────────────
  dragMetric(sourceSelector, targetSelector) {
    cy.get(sourceSelector)
      .drag(targetSelector, { force: true })
  }

}

module.exports = new MultiCalendarPage()