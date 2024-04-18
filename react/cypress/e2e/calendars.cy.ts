import dayjs = require("dayjs");

describe("calendars page", () => {
  before(() => {
    cy.login();

    cy.getCookie("csrftoken").then((cookie) => {
      // create meeting
      cy.request({
        method: "POST",
        url: "http://localhost:8000/api/meetings/",
        body: {},
        headers: { "X-CSRFToken": cookie.value },
      });

      // create team
      cy.request({
        method: "POST",
        url: "http://localhost:8000/api/teams/",
        body: { name: "testTeam" },
        headers: { "X-CSRFToken": cookie.value },
      })
        .its("body")
        .then((body: any) => {
          // create team meeting
          cy.request({
            method: "POST",
            url: "http://localhost:8000/api/meetings/",
            body: { team: body.id },
            headers: { "X-CSRFToken": cookie.value },
          });
        });

      cy.logout();
    });
  });

  beforeEach(() => {
    cy.login();

    cy.intercept("GET", "http://localhost:8000/api/meetings/").as(
      "getMeetings",
    );
    cy.visit("/calendars");
    cy.wait(500);

    cy.contains("main > div > h1", "Please Wait...", { timeout: 10000 }).should(
      "not.exist",
    );
  });

  it("loads successfully", () => {
    cy.get("aside")
      .find("a")
      .contains("Calendars")
      .should("have.class", "text-amber-500");

    cy.get("button span").contains("All Meetings");
  });

  it("shows a meeting in the calender", () => {
    cy.wait("@getMeetings");

    cy.get("section")
      .contains(dayjs().format("D"))
      .parent()
      .children("p")
      .should("have.length", 2)
      .eq(1)
      .should("have.class", "bg-blue-500");
  });

  it("shows meeting information when clicked", () => {
    cy.get("section").contains(dayjs().format("D")).parent().click();

    cy.get("section + aside").contains(dayjs().format("dddd D").toLowerCase());
    cy.get("section + aside .group\\/meeting").should(
      "have.length.at.least",
      1,
    );
  });

  it("shows current month as default month", () => {
    cy.get("section + aside").contains(
      dayjs().format("MMMM YYYY").toLowerCase(),
    );
  });

  it("toggles to next month successfully", () => {
    cy.get("section + aside")
      .contains(dayjs().format("MMMM YYYY").toLowerCase())
      .next()
      .click();

    cy.get("section + aside").contains(
      dayjs()
        .month(parseInt(dayjs().format("M")))
        .format("MMMM YYYY")
        .toLowerCase(),
    );
  });

  it("toggles to previous month successfully", () => {
    cy.get("section + aside")
      .contains(dayjs().format("MMMM YYYY").toLowerCase())
      .prev()
      .click();

    cy.get("section + aside").contains(
      dayjs()
        .month(parseInt(dayjs().format("M")) - 2)
        .format("MMMM YYYY")
        .toLowerCase(),
    );
  });

  it("successfully redirects to resources page on click", () => {
    cy.get("aside").find("a").contains("Resources").click();

    cy.url().should("contain", "/resources");

    cy.get("aside")
      .find("a")
      .contains("Resources")
      .should("have.class", "text-amber-500");
  });

  it("shows team dropdown filter on click", () => {
    cy.get("button")
      .contains("All Meetings")
      .parent()
      .parent()
      .as("teamFilter");
    cy.get("@teamFilter").find("button + div").should("have.class", "hidden");

    cy.get("@teamFilter").find("button").click();
    cy.get("@teamFilter")
      .find("button + div")
      .should("not.have.class", "hidden");
    cy.get("@teamFilter")
      .find("button + div")
      .contains("All Meetings")
      .next()
      .find("svg");
  });

  it("filters calendar by team successfully", () => {
    cy.wait("@getMeetings");

    cy.get("button")
      .contains("All Meetings")
      .parent()
      .parent()
      .as("teamFilter");

    cy.get("@teamFilter").find("button").click();
    cy.get("@teamFilter").find("button + div p").contains("testTeam").click();

    cy.get("button span")
      .contains("testTeam")
      .parent()
      .parent()
      .find("button + div")
      .should("have.class", "hidden");
    cy.get("button span").contains("testTeam");

    cy.get("section")
      .contains(dayjs().format("D"))
      .parent()
      .children("p")
      .should("have.length", 2)
      .eq(1)
      .should("have.class", "bg-amber-500");
  });

  it("opens schedule meeting modal successfully", () => {
    cy.get("h1")
      .contains("Schedule New Meeting")
      .parent()
      .parent()
      .parent()
      .should("not.have.class", "visible");

    cy.get("button").contains("Schedule Meeting").click();

    cy.get("h1")
      .contains("Schedule New Meeting")
      .parent()
      .parent()
      .parent()
      .should("have.class", "visible");
  });

  it("schedules meeting successfully", () => {
    cy.get("h1")
      .contains("Schedule New Meeting")
      .parent()
      .parent()
      .parent()
      .should("not.have.class", "visible");

    cy.get("button").contains("Schedule Meeting").click();

    cy.get("h1").contains("Schedule New Meeting").parent().next().as("form");

    cy.get("@form")
      .find("label")
      .contains("Team")
      .next()
      .find("button")
      .click();
    cy.get("@form")
      .find("label")
      .contains("Team")
      .next()
      .find("button + div span")
      .contains("testTeam")
      .click();

    cy.get("@form")
      .find("label")
      .contains("Day")
      .next()
      .find("button")
      .contains("Please select a date")
      .click();
    cy.get("@form")
      .find("label")
      .contains("Day")
      .next()
      .find("button + div button")
      .contains(parseInt(dayjs().format("D")) + 1)
      .click();

    cy.get("@form")
      .find("label")
      .contains("Start Time")
      .next()
      .find("button")
      .click();
    cy.get("@form")
      .find("label")
      .contains("Start Time")
      .next()
      .find("button + div")
      .children()
      .eq(0)
      .click();

    cy.get("@form")
      .find("label")
      .contains("End Time")
      .next()
      .find("button")
      .click();
    cy.get("@form")
      .find("label")
      .contains("End Time")
      .next()
      .find("button + div")
      .children()
      .eq(1)
      .click();

    cy.get("@form").next().click();

    cy.get("section")
      .contains(parseInt(dayjs().format("D")) + 1)
      .parent()
      .children("p")
      .should("have.length", 2)
      .eq(1)
      .should("have.class", "bg-amber-500");
  });

  it("opens join meeting modal successfully", () => {
    cy.get("aside h2").contains("Join Meeting").click();

    cy.get("h1")
      .contains("Meeting Id")
      .parent()
      .parent()
      .parent()
      .parent()
      .should("have.class", "visible");
  });

  it("joins meetings successfully from modal", () => {
    cy.get("aside h2").contains("Join Meeting").click();

    cy.getCookie("csrftoken").then((cookie) => {
      cy.request({
        method: "POST",
        url: "http://localhost:8000/api/meetings/",
        body: {},
        headers: { "X-CSRFToken": cookie.value },
      })
        .its("body")
        .then((meeting) => {
          cy.get("h1")
            .contains("Meeting Id")
            .parent()
            .parent()
            .next()
            .find("input")
            .type(meeting.id);

          cy.get("h1")
            .contains("Meeting Id")
            .parent()
            .parent()
            .next()
            .find("button")
            .click();

          cy.url().should("contain", `/meeting/${meeting.id}`);
        });
    });
  });

  it("opens create meeting modal successfully", () => {
    cy.get("aside h2").contains("Create Meeting").click();

    cy.get("h1")
      .contains("Start Meeting")
      .parent()
      .parent()
      .parent()
      .parent()
      .should("have.class", "visible");
  });

  it("creates meeting successfully from modal and redirects to video-conference page", () => {
    cy.get("aside h2").contains("Create Meeting").click();

    cy.get("h1")
      .contains("Start Meeting")
      .parent()
      .parent()
      .next()
      .find("button")
      .contains("Go")
      .click();

    cy.url().should("contain", "/meeting");
  });
});
