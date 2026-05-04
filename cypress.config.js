const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "https://app.pricelabs.co",
    specPattern: "cypress/e2e/**/*.cy.js",
    supportFile: "cypress/support/e2e.js",
    viewportWidth: 1440,
    viewportHeight: 900,
    defaultCommandTimeout: 15000,
    pageLoadTimeout: 60000,
    requestTimeout: 15000,
    responseTimeout: 15000,
    video: false,
    screenshotOnRunFailure: true,
    chromeWebSecurity: false,

    env: {
      loginUrl: "https://pricelabs.co/signin",
      email: "qa.pricelabs@gmail.com",
      password: "qg33N$yxJP"
    },

    reporter: "cypress-mochawesome-reporter",
    reporterOptions: {
      reportDir: "cypress/reports",
      charts: true,
      reportPageTitle: "PriceLabs Automation Report",
      embeddedScreenshots: true,
      inlineAssets: true,
      saveAllAttempts: false,
    },

    setupNodeEvents(on, config) {
      require("cypress-mochawesome-reporter/plugin")(on);
      return config;
    },
  },
});