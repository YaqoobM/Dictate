import dayjs = require("dayjs");
const teamName1 = `test_team_${Math.floor(Math.random() * 1000)}`;
const teamName2 = `test_team_2_${Math.floor(Math.random() * 1000)}`;
const teamName3 = `test_team_3_${Math.floor(Math.random() * 1000)}`;
const teamName4 = `test_team_4_${Math.floor(Math.random() * 1000)}`;
const teamName5 = `test_team_5_${Math.floor(Math.random() * 1000)}`;

describe("teams page", () => {
  before(() => {
    cy.login();

    cy.getCookie("csrftoken").then((cookie) => {
      // create team
      cy.request({
        method: "POST",
        url: "/api/teams/",
        body: { name: teamName1 },
        headers: { "X-CSRFToken": cookie.value },
      })
        .as("team1")
        .its("body")
        .then((body: any) => {
          // create team meeting
          cy.request({
            method: "POST",
            url: "/api/meetings/",
            body: {
              team: body.id,
              start_time: `${dayjs()
                .date(dayjs().date() + 1)
                .format("DD/MM/YY")} 15:30:00`,
              end_time: `${dayjs()
                .date(dayjs().date() + 1)
                .format("DD/MM/YY")} 17:00:00`,
            },
            headers: { "X-CSRFToken": cookie.value },
          });
        });

      cy.request({
        method: "POST",
        url: "/api/teams/",
        body: { name: teamName2 },
        headers: { "X-CSRFToken": cookie.value },
      });
    });

    cy.logout();
    cy.login2();

    cy.getCookie("csrftoken").then((cookie) => {
      cy.get("@team1")
        .its("body")
        .then((body: any) => {
          cy.request({
            method: "POST",
            url: `/api/teams/${body.id}/join/`,
            body: {},
            headers: { "X-CSRFToken": cookie.value },
          });
        });
    });
    cy.logout();
  });

  beforeEach(() => {
    cy.login();
    cy.intercept("GET", "/api/teams/").as("getTeams");
    cy.visit("/teams");
    cy.wait("@getTeams");
  });

  it("successfully loads", () => {
    cy.get("button").contains("No teams available").should("not.exist");
  });

  it("changes selected team successfully", () => {
    cy.get("#teamFilter").find("button").click();
    cy.get("#teamFilter").find("p").contains(teamName1).eq(0).click();
    cy.get("#teamFilter").find("button").should("contain.text", teamName1);

    cy.get("#teamFilter").find("button").click();
    cy.get("#teamFilter").find("p").contains(teamName2).eq(0).click();
    cy.get("#teamFilter").find("button").should("contain.text", teamName2);
  });

  it("shows current user as part of team members", () => {
    cy.get("h1")
      .contains("Members")
      .parent()
      .siblings()
      .should("contain.text", "tester");
    cy.get("h1")
      .contains("Members")
      .parent()
      .siblings()
      .should("contain.text", "tester@dictate.com");
  });

  it("shows test user 2 as part of team members", () => {
    cy.get("#teamFilter").find("button").click();
    cy.get("#teamFilter").find("p").contains(teamName1).eq(0).click();
    cy.get("#teamFilter").find("button").should("contain.text", teamName1);

    cy.get("h1")
      .contains("Members")
      .parent()
      .siblings()
      .should("contain.text", "tester");
    cy.get("h1")
      .contains("Members")
      .parent()
      .siblings()
      .should("contain.text", "tester2@dictate.com");
  });

  it("shows meeting in upcoming meetings", () => {
    cy.get("#teamFilter").find("button").click();
    cy.get("#teamFilter").find("p").contains(teamName1).eq(0).click();

    cy.get("h1")
      .contains("Upcoming Meetings")
      .parent()
      .next()
      .find("h1")
      .should(
        "contain.text",
        dayjs()
          .date(dayjs().date() + 1)
          .format("DD/MM/YY"),
      )
      .should("contain.text", "15:30")
      .should("contain.text", "17:00");
  });

  it("opens join team modal successfully", () => {
    cy.get("aside h2").contains("Join Team").click();

    cy.get("div.fixed.inset-0 > div.relative h1")
      .contains("Join Team")
      .parent()
      .parent()
      .parent()
      .parent()
      .should("have.class", "visible");
  });

  it("successfully joins a team", () => {
    cy.getCookie("csrftoken").then((cookie) => {
      cy.request({
        method: "POST",
        url: "/api/teams/",
        body: { name: teamName3 },
        headers: { "X-CSRFToken": cookie.value },
      })
        .its("body")
        .as("meeting");

      cy.logout();

      cy.login2();
      cy.visit("/teams");
      cy.wait("@getTeams");

      cy.get("aside h2").contains("Join Team").click();
      cy.get("@meeting").then((meeting: any) => {
        cy.get("div.fixed.inset-0 > div.relative h1")
          .contains("Join Team")
          .parent()
          .parent()
          .next()
          .as("form")
          .find("input")
          .type(meeting.id);
        cy.get("@form").find("button").contains("Go").click();

        cy.get("#teamFilter").find("button").click();
        cy.get("#teamFilter").find("p").contains(teamName3).eq(0).click();
        cy.get("#teamFilter").find("button").should("contain.text", teamName3);
      });
    });
  });

  it("opens create team modal successfully", () => {
    cy.get("aside h2").contains("Create Team").click();

    cy.get("div.fixed.inset-0 > div.relative h1")
      .contains("Create Team")
      .parent()
      .parent()
      .parent()
      .parent()
      .should("have.class", "visible");
  });

  it("successfully creates a team", () => {
    cy.get("aside h2").contains("Create Team").click();

    cy.get("div.fixed.inset-0 > div.relative h1")
      .contains("Create Team")
      .parent()
      .parent()
      .next()
      .as("form")
      .find("input")
      .type(teamName4);
    cy.get("@form").find("button").contains("Go").click();

    cy.get("#teamFilter").find("button").click();
    cy.get("#teamFilter").find("p").contains(teamName4).eq(0).click();
    cy.get("#teamFilter").find("button").should("contain.text", teamName4);
    cy.get("h1").contains("Team Id: #");
  });

  it("opens leave team modal successfully", () => {
    cy.get("h2 span").contains("Leave Team").click();
    cy.get("div.fixed.inset-0 div.relative h1")
      .contains("Are you sure you want to leave?")
      .parent()
      .parent()
      .parent()
      .should("have.class", "visible");
  });

  it("successfully leaves a team", () => {
    cy.get("aside h2").contains("Create Team").click();

    cy.get("div.fixed.inset-0 > div.relative h1")
      .contains("Create Team")
      .parent()
      .parent()
      .next()
      .as("form")
      .find("input")
      .type(teamName5);
    cy.get("@form").find("button").contains("Go").click();

    cy.get("#teamFilter").find("button").click();
    cy.get("#teamFilter").find("p").contains(teamName5).eq(0).click();

    cy.get("h2 span").contains("Leave Team").click();
    cy.get("div.fixed.inset-0 div.relative h1")
      .contains("Are you sure you want to leave?")
      .parent()
      .next()
      .click();

    cy.get("#teamFilter").find("button").click();
    cy.get("#teamFilter").find("p").should("not.contain", teamName5);
  });
});
