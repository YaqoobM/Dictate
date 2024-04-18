/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    login(): Chainable<void>;
    login2(): Chainable<void>;
    logout(): Chainable<void>;
  }
}
