describe("meeting page", () => {
  beforeEach(() => {
    cy.request("POST", "/api/meetings/", {})
      .its("body")
      .as("testMeeting")
      .then((meeting: any) => {
        cy.visit(`/meeting/${meeting.id}/`);
      });
  });

  it("loads successfully", () => {});

  it("shows set username modal first if not logged in", () => {
    cy.get("h1")
      .contains("Set Username For Meeting")
      .parent()
      .parent()
      .parent()
      .should("have.class", "visible");
  });

  it("shows local video stream in the corner of the page", () => {
    cy.get("main > div.relative > article");
  });

  it("shows meeting controls at bottom of page", () => {
    cy.get("main > div.relative + article").as("controls");
    cy.get("@controls").children("svg").should("have.length", 4);
  });

  it("opens meeting information modal successfully", () => {
    cy.get("h1").contains("Set Username For Meeting").parent().prev().click();

    cy.get("main > div.relative + article").as("controls");
    cy.get("@controls").children("svg").eq(0).click();

    cy.get("h1")
      .contains("Meeting Id:")
      .parent()
      .parent()
      .parent()
      .parent()
      .should("have.class", "visible");
  });

  it("shows meeting id in information modal", () => {
    cy.get("h1").contains("Set Username For Meeting").parent().prev().click();

    cy.get("main > div.relative + article").as("controls");
    cy.get("@controls").children("svg").eq(0).click();

    cy.get("h1")
      .contains("Meeting Id:")
      .children("span")
      .should("not.be.empty");
  });

  it("shows dark mode toggle in information modal", () => {
    cy.get("h1").contains("Set Username For Meeting").parent().prev().click();

    cy.get("main > div.relative + article").as("controls");
    cy.get("@controls").children("svg").eq(0).click();

    cy.get("h1").contains("Meeting Id:").parent().find("svg");
  });

  it("toggles dark mode successfully", () => {
    cy.get("body").should("not.have.class", "dark");
    cy.get("h1").contains("Set Username For Meeting").parent().prev().click();

    cy.get("main > div.relative + article").as("controls");
    cy.get("@controls").children("svg").eq(0).click();

    cy.get("h1").contains("Meeting Id:").parent().find("svg").click();
    cy.get("body").should("have.class", "dark");
  });

  it("shows correct participants in information modal (guest user)", () => {
    cy.get("h1").contains("Set Username For Meeting").parent().prev().click();

    cy.get("main > div.relative + article").as("controls");
    cy.get("@controls").children("svg").eq(0).click();

    cy.get("h1")
      .contains("Meeting Id:")
      .parent()
      .next()
      .find("h2 + div")
      .children()
      .as("participants");

    cy.get("@participants").should("have.length", 1);
    cy.get("@participants").find("p").contains("Guest (You)");
    cy.get("@participants").find("p").contains("Not Signed In");
  });

  it("shows correct participants in information modal (logged in user)", () => {
    cy.login();
    cy.get("@testMeeting").then((meeting: any) => {
      cy.visit(`/meeting/${meeting.id}/`);
    });

    cy.get("main > div.relative + article").as("controls");
    cy.get("@controls").children("svg").eq(0).click();

    cy.get("h1")
      .contains("Meeting Id:")
      .parent()
      .next()
      .find("h2 + div")
      .children()
      .as("participants");

    cy.get("@participants").should("have.length", 1);
    cy.get("@participants").find("p").contains("tester");
    cy.get("@participants").find("p").contains("tester@dictate.com");
  });

  it("opens change username modal successfully", () => {
    cy.get("h1").contains("Set Username For Meeting").parent().prev().click();

    cy.get("main > div.relative + article").as("controls");
    cy.get("@controls").children("svg").eq(0).click();

    cy.get("h1")
      .contains("Meeting Id:")
      .parent()
      .next()
      .find("h2 + div > div button")
      .click();

    cy.get("h1")
      .contains("Meeting Id:")
      .parent()
      .parent()
      .parent()
      .parent()
      .should("not.have.class", "visible");

    cy.get("h1")
      .contains("Set Username For Meeting")
      .parent()
      .parent()
      .parent()
      .should("have.class", "visible");
  });

  it("updates username successfully for meeting participants", () => {
    cy.get("h1").contains("Set Username For Meeting").parent().prev().click();

    cy.get("main > div.relative + article").as("controls");
    cy.get("@controls").children("svg").eq(0).click();

    cy.get("h1")
      .contains("Meeting Id:")
      .parent()
      .next()
      .find("h2 + div > div")
      .as("me");

    cy.get("@me").find("p").contains("Guest (You)");
    cy.get("@me").find("button").click();

    cy.get("h1")
      .contains("Set Username For Meeting")
      .parent()
      .next()
      .find("input[name=username]")
      .type("tester");

    cy.get("h1")
      .contains("Set Username For Meeting")
      .parent()
      .next()
      .find("button")
      .click();

    cy.get("@me").find("p").contains("tester (You)");
  });

  it("hides meeting notes on first load", () => {
    cy.get("h1").contains("Set Username For Meeting").parent().prev().click();

    cy.get("#editorjs").should("not.exist");
  });

  it("opens meeting notes successfully", () => {
    cy.get("h1").contains("Set Username For Meeting").parent().prev().click();

    cy.get("main > div.relative + article").as("controls");
    cy.get("@controls").children("svg").eq(1).click();

    cy.get("#editorjs").should("exist");
  });

  it("writes text to group notes successfully", () => {
    cy.get("h1").contains("Set Username For Meeting").parent().prev().click();

    cy.get("main > div.relative + article").as("controls");
    cy.get("@controls").children("svg").eq(1).click();

    cy.get("#editorjs").find(".ce-paragraph").as("paragraph");

    cy.get("@paragraph").type("testing");
    cy.get("@paragraph").should("contain.text", "testing");
  });

  it("opens start recording modal successfully", () => {
    cy.get("h1").contains("Set Username For Meeting").parent().prev().click();

    cy.get("main > div.relative + article").as("controls");
    cy.get("@controls").children("svg").eq(2).click();

    cy.get("h1")
      .contains("record session")
      .parent()
      .parent()
      .parent()
      .should("have.class", "visible");
  });

  it("prompts guest user to log in before recording", () => {
    cy.get("h1").contains("Set Username For Meeting").parent().prev().click();

    cy.get("main > div.relative + article").as("controls");
    cy.get("@controls").children("svg").eq(2).click();

    cy.get("h1")
      .contains("Login required to record session")
      .parent()
      .next()
      .contains("Create an account here or login to access this feature");
  });

  it("successfully records meeting", () => {
    cy.intercept(
      {
        method: "POST",
        url: "/api/recordings/",
      },
      {
        statusCode: 201,
        body: {
          url: "/api/recordings/mock-url/",
        },
      },
    );

    // login
    cy.visit("/login");

    cy.getCookie("sessionid").should("not.exist");
    cy.getCookie("csrftoken").should("exist");

    cy.get("input[name=email]").type("tester@dictate.com");
    cy.get("input[name=password]").type("12345678");

    cy.get("button").contains("Log In").click();

    cy.url().should("include", "/calendars");
    cy.getCookie("sessionid").should("exist");

    cy.get("@testMeeting").then((meeting: any) => {
      cy.visit(`/meeting/${meeting.id}/`);
    });

    cy.get("main > div.relative + article").as("controls");

    cy.get("@controls").children("svg").eq(2).click();
    cy.get("h1").contains("start recording?").parent().next().click();

    cy.get("@controls").children("svg").eq(2).click();
    cy.get("h1").contains("stop recording?").parent().next().click();

    cy.get("h1")
      .contains("recording successfully saved")
      .parent()
      .parent()
      .parent()
      .should("have.class", "visible");
  });

  it("opens exit meeting modal successfully", () => {
    cy.get("h1").contains("Set Username For Meeting").parent().prev().click();

    cy.get("main > div.relative + article").as("controls");
    cy.get("@controls").children("svg").eq(3).click();

    cy.get("h1")
      .contains("Are you sure you want to exit?")
      .parent()
      .parent()
      .should("have.class", "visible");
  });

  it("exits room successfully and redirects", () => {
    cy.get("h1").contains("Set Username For Meeting").parent().prev().click();

    cy.get("main > div.relative + article").as("controls");
    cy.get("@controls").children("svg").eq(3).click();

    cy.get("h1").contains("Are you sure you want to exit?").next().click();

    cy.url().should("include", "/home");
  });
});
