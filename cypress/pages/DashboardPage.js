const L = require('../locators/DashboardLocators')

class DashboardPage {

  navigate() {
    cy.visit('/pricing')
    cy.url().should('include', 'pricing')
    cy.get(L.listingSearchInput, { timeout: 15000 })
      .should('be.visible')
  }

  navigateToMultiCalendar() {
    cy.get(L.dynamicPricingDropdown).click()
    cy.get(L.multiCalendarNav).click()
    cy.url().should('include', 'multicalendar')
  }

  searchListing(name) {
    cy.get(L.listingSearchInput)
      .clear()
      .type(name)
  }

  openFilters() {
    cy.get(L.filterModalOpenBtn).click()
  }

  applyFilter() {
    cy.get(L.applyFilterBtn).click()
  }

  cancelFilter() {
    cy.get(L.cancelFilterBtn).click()
  }

  clearFilter() {
    cy.get(L.clearFilterBtn).click()
  }

  openAddMetrics() {
    cy.get(L.addMetricsBtn).click()
  }

  updateMetrics() {
    cy.get(L.updateMetricsBtn).click()
  }

  clearMetrics() {
    cy.get(L.clearMetricsBtn).click()
  }

  openRowColumnSettings() {
    cy.get(L.rowColumnBtn).click()
  }

  toggleOverridesRow() {
    cy.get(L.overridesRowCheckbox).click()
  }

  toggleMinStayRow() {
    cy.get(L.minStayRowCheckbox).click()
  }

}

module.exports = new DashboardPage()