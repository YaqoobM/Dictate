describe("profile page", () => {
  beforeEach(() => {
    cy.login();
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

    cy.get("h2").contains("Update Information").click();

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

  it("successfully deletes profile", () => {
    const email = `tester.${Math.floor(Math.random() * 10000)}@dictate.com`;

    cy.logout();

    // create random profile
    cy.visit("/signup");

    cy.getCookie("sessionid").should("not.exist");
    cy.getCookie("csrftoken").should("exist");

    cy.get("input[name=email]").type(email);
    cy.get("input[name=username]").type("tester");
    cy.get("input[name=password]").type("12345678");
    cy.get("input[name=confirm-password]").type("12345678");

    cy.get("button").contains("Sign Up").click();

    cy.url().should("include", "/calendars");
    cy.getCookie("sessionid").should("exist");

    cy.visit("/profile");
    cy.get("h2 span").contains("Delete Account").click();

    cy.get("div.fixed.inset-0 div.relative h1")
      .contains("Are you sure?")
      .parent()
      .next()
      .click();

    cy.url().should("include", "/home");

    cy.visit("/login");
    cy.get("input[name=email]").type(email);
    cy.get("input[name=password]").type("12345678");
    cy.get("button").contains("Log In").click();
    cy.get("section article p")
      .contains("Invalid username or password.")
      .should("exist");
  });
});
