describe("resources page", () => {
  before(() => {
    cy.login();

    cy.getCookie("csrftoken").then((cookie) => {
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
          })
            .its("body")
            .then((body: any) => {
              cy.visit(`/meeting/${body.id}`);

              cy.get("main > article svg").as("controls");

              cy.get("@controls").eq(1).click();
              cy.get("#editorjs").find(".ce-paragraph").type("testing");

              cy.get("@controls").eq(2).click();
              cy.get("h1").contains("start recording?").parent().next().click();
              cy.wait(500);
              cy.get("@controls").eq(2).click();
              cy.get("h1").contains("stop recording?").parent().next().click();
            });
        });

      cy.intercept("POST", "http://localhost:8000/api/logout/").as("logout");
      cy.visit("/home");
      cy.viewport(1024, 700);
      cy.get("nav button").contains("Log Out").click();
      cy.wait("@logout");
      cy.viewport(1000, 660);
    });
  });

  beforeEach(() => {
    cy.login();

    cy.intercept("GET", "http://localhost:8000/api/meetings/").as(
      "getMeetings",
    );
    cy.intercept("GET", "http://localhost:8000/api/recordings/").as(
      "getRecordings",
    );
    cy.intercept("GET", "http://localhost:8000/api/notes/").as("getNotes");

    cy.visit("/resources");
    cy.wait(500);

    cy.contains("main > div > h1", "Please Wait...", { timeout: 10000 }).should(
      "not.exist",
    );

    cy.wait("@getMeetings");
    cy.wait("@getRecordings");
    cy.wait("@getNotes");
  });

  it("successfully loads", () => {
    cy.get("aside a")
      .contains("Resources")
      .should("have.class", "text-amber-500");

    cy.get("section div.flex-wrap")
      .children()
      .should("not.contain", "No Resources Available");

    cy.get("button").contains("All Resources").should("exist");
    cy.get("button").contains("All Meetings").should("exist");
  });

  it("shows recording preview on click", () => {
    cy.get("section video")
      .eq(0)
      .as("video")
      .invoke("attr", "src")
      .then((src) => {
        cy.get("@video").click();

        cy.get(`div.fixed.inset-0 > div.relative video[src="${src}"]`)
          .parent()
          .parent()
          .should("have.class", "visible");
      });
  });

  it("shows notes preview on click", () => {
    cy.get("section div.aspect-\\[4\\/5\\]")
      .eq(0)
      .as("notes")
      .parent()
      .parent()
      .invoke("attr", "id")
      .then((id) => {
        cy.get("@notes").click();

        cy.get(
          `div.fixed.inset-0 > div.relative div[id="${`editorjs-${id.split("_")[1]}`}"]`,
        )
          .parent()
          .parent()
          .parent()
          .should("have.class", "visible");
      });
  });

  it("shows rename modal on click", () => {
    cy.get("section div.flex-wrap > div:first-child")
      .as("resource")
      .find("h1")
      .contains("rename?")
      .click();

    cy.get("@resource")
      .find("div.fixed.inset-0 > div.relative h1")
      .contains("Rename Resource")
      .parent()
      .parent()
      .parent()
      .parent()
      .should("have.class", "visible");
  });

  it("successfully renames a resource", () => {
    let title = `test_${Math.floor(Math.random() * 100)}`;

    cy.get("section div.flex-wrap > div:first-child")
      .as("resource")
      .find("h1")
      .contains("rename?")
      .click();

    cy.get("@resource")
      .find("div.fixed.inset-0 > div.relative h1")
      .contains("Rename Resource")
      .parent()
      .parent()
      .next()
      .as("form")
      .find("input")
      .type(title);

    cy.get("@form").find("button").contains("Go").click();

    cy.get("@resource").children().eq(1).find("h1").contains(title);
  });

  it("filters by recordings successfully", () => {
    cy.get("button").contains("All Resources").parent().as("button").click();
    cy.get("@button").next().find("p").contains("Recordings").click();

    cy.get("button").contains("Recordings").should("exist");

    cy.get("section div.flex-wrap")
      .children()
      .should("have.length.at.least", 1)
      .should("not.contain", "No Resources Available");
  });

  it("filters by notes successfully", () => {
    cy.get("button").contains("All Resources").parent().as("button").click();
    cy.get("@button").next().find("p").contains("Notes").click();

    cy.get("button").contains("Notes").should("exist");

    cy.get("section div.flex-wrap")
      .children()
      .should("have.length.at.least", 1)
      .should("not.contain", "No Resources Available");
  });

  it("filters by team successfully", () => {
    cy.get("button").contains("All Meetings").parent().as("button").click();
    cy.get("@button").next().find("p").contains("testTeam").click();

    cy.get("button").contains("testTeam").should("exist");

    cy.get("section div.flex-wrap")
      .children()
      .should("have.length.at.least", 1)
      .should("not.contain", "No Resources Available");
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
