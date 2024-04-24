Cypress.Commands.add("login", () => {
  cy.visit("/login");

  cy.getCookie("sessionid").should("not.exist");
  cy.getCookie("csrftoken").should("exist");

  cy.get("input[name=email]").type("tester@dictate.com");
  cy.get("input[name=password]").type("12345678");

  cy.get("button").contains("Log In").click();

  cy.url().should("include", "/calendars");
  cy.getCookie("sessionid").should("exist");
});

Cypress.Commands.add("login2", () => {
  cy.visit("/login");

  cy.getCookie("sessionid").should("not.exist");
  cy.getCookie("csrftoken").should("exist");

  cy.get("input[name=email]").type("tester2@dictate.com");
  cy.get("input[name=password]").type("12345678");

  cy.get("button").contains("Log In").click();

  cy.url().should("include", "/calendars");
  cy.getCookie("sessionid").should("exist");
});

Cypress.Commands.add("logout", () => {
  cy.getCookie("csrftoken").should("exist");
  cy.getCookie("sessionid").should("exist");

  cy.intercept("POST", "/api/logout/").as("logout");
  cy.visit("/home");
  cy.viewport(1024, 700);
  cy.get("nav button").contains("Log Out").click();
  cy.wait("@logout");

  cy.viewport(1000, 660);
  cy.url().should("eq", "http://localhost/");
  cy.getCookie("sessionid").should("not.exist");
});
