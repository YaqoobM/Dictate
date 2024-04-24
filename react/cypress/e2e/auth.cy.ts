describe("auth pages", () => {
  it("logs in in successfully", () => {
    cy.login();
  });

  it("shows error for bad password when logging in", () => {
    cy.visit("/login");

    cy.getCookie("sessionid").should("not.exist");
    cy.getCookie("csrftoken").should("exist");

    cy.get("input[name=email]").type("tester@dictate.com");
    cy.get("input[name=password]").type("123456789");

    cy.get("button").contains("Log In").click();

    cy.get("section article p")
      .contains("Invalid username or password")
      .should("exist");
  });

  it("signs up successfully", () => {
    const randomEmail = `tester.${Math.floor(Math.random() * 10000)}@dictate.com`;

    cy.visit("/signup");

    cy.getCookie("sessionid").should("not.exist");
    cy.getCookie("csrftoken").should("exist");

    cy.get("input[name=email]").type(randomEmail);
    cy.get("input[name=username]").type("tester");
    cy.get("input[name=password]").type("12345678");
    cy.get("input[name=confirm-password]").type("12345678");

    cy.get("button").contains("Sign Up").click();

    cy.url().should("include", "/calendars");
    cy.getCookie("sessionid").should("exist");
  });

  it("shows error for bad email when signing up in", () => {
    cy.visit("/signup");

    cy.getCookie("sessionid").should("not.exist");
    cy.getCookie("csrftoken").should("exist");

    cy.get("input[name=email]").type("tester@dictate.com");
    cy.get("input[name=username]").type("tester");
    cy.get("input[name=password]").type("12345678");
    cy.get("input[name=confirm-password]").type("12345678");

    cy.get("button").contains("Sign Up").click();

    cy.get("section article label")
      .contains("Email")
      .find("span")
      .contains("user with this email address already exists")
      .should("exist");
  });

  it("logs out successfully", () => {
    cy.login();
    cy.logout();
  });
});
