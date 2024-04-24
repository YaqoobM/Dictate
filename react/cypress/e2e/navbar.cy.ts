describe("navbar", () => {
  beforeEach(() => {
    cy.viewport(1024, 700);
  });

  it("successfully loads", () => {
    cy.visit("/");
    cy.get("nav").contains("Dictate");
  });

  it("shows login and signup buttons if not logged in", () => {
    cy.visit("/");
    cy.get("nav a").contains("Login");
    cy.get("nav a").contains("Sign Up");
  });

  it("navigates to login and signup pages successfully", () => {
    cy.visit("/");

    cy.get("nav a").contains("Login").click();
    cy.url().should("include", "/login");

    cy.get("nav a").contains("Sign Up").click();
    cy.url().should("include", "/signup");
  });

  it("shows page navigation if logged in", () => {
    cy.login();

    cy.get("nav a").contains("Meetings");
    cy.get("nav a").contains("Teams");
    cy.get("nav a").contains("Profile");
    cy.get("nav button").contains("Log Out");
  });

  it("navigates to auth pages successfully", () => {
    cy.login();

    cy.get("nav a").contains("Meetings").click();
    cy.url().should("include", "/calendars");

    cy.get("nav a").contains("Teams").click();
    cy.url().should("include", "/teams");

    cy.get("nav a").contains("Profile").click();
    cy.url().should("include", "/profile");
  });

  it("logs out successfully if logged in", () => {
    cy.login();

    cy.get("nav button").contains("Log Out").click();

    cy.url().should("eq", Cypress.config().baseUrl + "/");
    cy.getCookie("sessionid").should("not.exist");
  });

  it("contains dark mode toggle", () => {
    cy.visit("/");

    cy.get("nav a + span svg:last-child");
  });

  it("toggles dark mode successfully", () => {
    cy.visit("/");

    cy.get("body").should("not.have.class", "dark");
    cy.get("nav a + span svg:last-child").click();
    cy.get("body").should("have.class", "dark");
  });

  it("shows menu toggle for small viewport widths", () => {
    cy.visit("/");

    cy.get("nav a + span svg:first-child").should(
      "have.css",
      "display",
      "none",
    );
    cy.get("nav a + span span").should("not.have.css", "display", "none");

    cy.viewport(1000, 660);
    cy.get("nav a + span svg:first-child").should(
      "not.have.css",
      "display",
      "none",
    );
    cy.get("nav a + span span").should("have.css", "display", "none");
  });

  it("opens menu toggle successfully for small viewport widths", () => {
    cy.visit("/");

    cy.viewport(1000, 660);
    cy.get("nav a + span svg:first-child").click();

    cy.get("nav a + span span").should("not.have.css", "display", "none");
  });
});
