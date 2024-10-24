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
  },
};
