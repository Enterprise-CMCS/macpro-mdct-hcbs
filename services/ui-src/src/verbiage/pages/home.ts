export default {
  intro: {
    header: "Home and Community Based Services (HCBS) Portal",
    body: {
      preLinkText:
        "Get started by completing the Home and Community-Based Services (HCBS) for your state or territory. Learn more about this ",
      linkText: "new data collection tool",
      linkLocation:
        "https://www.medicaid.gov/medicaid/home-community-based-services/index.html",
      postLinkText: " from CMS.",
    },
  },
  cards: {
    QM: {
      title: "HCBS Quality Measures",
      body: {
        available: "The HCBS is ...  ",
      },
      linkText: "6071(a)(1) of the Deficit Reduction Act (DRA)",
      linkLocation:
        "https://www.govinfo.gov/content/pkg/PLAW-109publ171/pdf/PLAW-109publ171.pdf",
      postLinkText:
        ' as "increasing the use of home and community-based, rather than institutional, long-term care services."',
      downloadText: "User Guide and Help File",
      link: {
        text: "Enter HCBS QM online",
        route: "/report/QM/{state}",
      },
      accordion: {
        buttonLabel: "When are the HCBS Quality Measures due?",
        text: [
          {
            content:
              "The HCBS Quality Measures will be created and submitted ...",
          },
          {
            content: "The HCBS Quality Measures deadlines are TBD ...",
          },
        ],
      },
    },
    TA: {
      title: "HCBS Timely Access Report",
      body: {
        available: "The HCBS is ...  ",
      },
      linkText: "6071(a)(1) of the Deficit Reduction Act (DRA)",
      linkLocation:
        "https://www.govinfo.gov/content/pkg/PLAW-109publ171/pdf/PLAW-109publ171.pdf",
      postLinkText:
        ' as "increasing the use of home and community-based, rather than institutional, long-term care services."',
      downloadText: "User Guide and Help File",
      link: {
        text: "Enter HCBS TA online",
        route: "/report/TA/",
      },
      accordion: {
        buttonLabel: "When is the HCBS Timely Access Report due?",
        text: [
          {
            content:
              "The HCBS Timely Access Report will be created and submitted ...",
          },
          {
            content: "The HCBS Timely Access Report deadlines are TBD ...",
          },
        ],
      },
    },
    CI: {
      title: "HCBS Critical Incident Report",
      body: {
        available: "The HCBS is ...  ",
      },
      linkText: "6071(a)(1) of the Deficit Reduction Act (DRA)",
      linkLocation:
        "https://www.govinfo.gov/content/pkg/PLAW-109publ171/pdf/PLAW-109publ171.pdf",
      postLinkText:
        ' as "increasing the use of home and community-based, rather than institutional, long-term care services."',
      downloadText: "User Guide and Help File",
      link: {
        text: "Enter HCBS CI online",
        route: "/report/CI/",
      },
      accordion: {
        buttonLabel: "When is the HCBS Critical Incident Report due?",
        text: [
          {
            content:
              "The HCBS Critical Incident will be created and submitted ...",
          },
          {
            content: "The HCBS Critical Incident Report deadlines are TBD ...",
          },
        ],
      },
    },
  },
  readOnly: {
    header: "View State/Territory Reports",
    buttonLabel: "Go to Report Dashboard",
  },
};
