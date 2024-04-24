describe("home page", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("successfully loads", () => {});

  it("contains title", () => {
    cy.get("h1").should(
      "contain.text",
      "real-time, face-to-face, fast meetings",
    );
  });

  it("contains meeting buttons", () => {
    cy.get("hgroup span button:first").should(
      "contain.text",
      "Start a Meeting",
    );

    cy.get("hgroup span button:last").should("contain.text", "Join a Meeting");
  });

  it("opens start meeting modal successfully", () => {
    cy.get("hgroup span button:first")
      .should("contain.text", "Start a Meeting")
      .click();

    cy.get("h1")
      .contains("Start New Meeting")
      .parent()
      .parent()
      .parent()
      .should("have.class", "visible");
  });

  it("creates a new meeting successfully and redirects to page", () => {
    cy.get("hgroup span button:first")
      .should("contain.text", "Start a Meeting")
      .click();

    cy.get("h1")
      .contains("Start New Meeting")
      .parent()
      .next()
      .should("contain.text", "Go")
      .click();

    cy.url().should("contain", "/meeting/");
  });

  it("opens join meeting modal successfully", () => {
    cy.request("POST", "/api/meetings/", {}).its("body").as("testMeeting");

    cy.get("hgroup span button:last")
      .should("contain.text", "Join a Meeting")
      .click();

    cy.get("h1")
      .contains("Meeting Id")
      .parent()
      .parent()
      .parent()
      .parent()
      .should("have.class", "visible");
  });

  it("joins ongoing meeting successfully and redirects to page", () => {
    cy.request("POST", "/api/meetings/", {}).its("body").as("testMeeting");

    cy.get("hgroup span button:last")
      .should("contain.text", "Join a Meeting")
      .click();

    cy.get("@testMeeting").then((meeting: any) => {
      cy.get("input[name=meetingId]").type(meeting.id);
    });

    cy.get("input[name=meetingId]")
      .parent()
      .next()
      .should("contain.text", "Go")
      .click();

    cy.url().should("contain", "/meeting/");
  });

  it("shows error when trying to join invalid meeting", () => {
    cy.get("hgroup span button:last")
      .should("contain.text", "Join a Meeting")
      .click();

    cy.get("input[name=meetingId]").type("randomMeetingId{enter}");

    cy.get("input[name=meetingId]")
      .parent()
      .next()
      .should("contain.text", "Go")
      .click();

    cy.get("h1").contains("Meeting Id").parent().next().as("error");

    cy.get("@error").should("contain.text", "Invalid id");
    cy.get("@error").should("have.class", "text-red-500");
  });

  it("contains login and signup links", () => {
    cy.get("hgroup p a").eq(0).should("contain.text", "Login");
    cy.get("hgroup p a").eq(1).should("contain.text", "create an account");
  });

  it("contains image", () => {
    cy.get("hgroup + svg");
  });
});
