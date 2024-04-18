describe("profile page", () => {
  beforeEach(() => {
    cy.login();
    // cy.intercept("GET", "http://localhost:8000/api/who_am_i/").as("getProfile");
    cy.visit("/profile");
  });

  it("successfully loads", () => {});

  it("shows correct profile information", () => {
    cy.get("h2")
      .contains("password: ****")
      .prev()
      .should("contain", "tester@dictate.com")
      .prev()
      .should("contain", "tester");
  });

  it("opens update information modal successfully", () => {
    cy.get("h2").contains("Update Information").click();

    cy.get("div.fixed.inset-0 > div.relative h1")
      .contains("Update Profile")
      .parent()
      .parent()
      .parent()
      .parent()
      .should("have.class", "visible");
  });

  it("updates profile information correctly", () => {
    cy.get("h2").contains("Update Information").click();

    cy.get("div.fixed.inset-0 > div.relative h1")
      .contains("Update Profile")
      .parent()
      .parent()
      .next()
      .find("label")
      .contains("Username")
      .next()
      .type("tester_2");

    cy.get("div.fixed.inset-0 > div.relative h1")
      .contains("Update Profile")
      .parent()
      .parent()
      .next()
      .find("button")
      .contains("Go")
      .click();

    cy.get("h2")
      .contains("password: ****")
      .prev()
      .prev()
      .should("contain", "tester_2");

    cy.get("div.fixed.inset-0 > div.relative h1")
      .contains("Update Profile")
      .parent()
      .parent()
      .next()
      .find("label")
      .contains("Username")
      .next()
      .type("tester");

    cy.get("div.fixed.inset-0 > div.relative h1")
      .contains("Update Profile")
      .parent()
      .parent()
      .next()
      .find("button")
      .contains("Go")
      .click();
  });

  it("shows error when trying to update username to forbidden value", () => {
    cy.get("h2").contains("Update Information").click();

    cy.get("div.fixed.inset-0 > div.relative h1")
      .contains("Update Profile")
      .parent()
      .parent()
      .next()
      .find("label")
      .contains("Username")
      .next()
      .type("username with spaces");

    cy.get("div.fixed.inset-0 > div.relative h1")
      .contains("Update Profile")
      .parent()
      .parent()
      .next()
      .find("button")
      .contains("Go")
      .click();

    cy.get("div.fixed.inset-0 > div.relative h1")
      .contains("Update Profile")
      .parent()
      .next()
      .contains("Enter a valid username");
  });
});
