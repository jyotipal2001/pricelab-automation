const LoginLocators = require('../locators/LoginLocators')

class LoginPage {

  navigate() {
    cy.visit('https://pricelabs.co/signin')
    cy.url().should('include', 'signin')
  }

  enterEmail(email) {
    cy.get(LoginLocators.emailInput)
      .should('be.visible')
      .clear()
      .type(email)
  }

  enterPassword(password) {
    cy.get(LoginLocators.passwordInput)
      .should('be.visible')
      .clear()
      .type(password)
  }

  clickSignIn() {
    cy.get(LoginLocators.signInButton)
      .should('be.visible')
      .click()
  }

  login(email, password) {
    this.navigate()
    this.enterEmail(email)
    this.enterPassword(password)
    this.clickSignIn()
    cy.url({ timeout: 20000 })
      .should('include', 'app.pricelabs.co')
  }

  verifyLoginError() {
    cy.get('body').should('contain.text', 'Invalid')
  }

}

module.exports = new LoginPage()