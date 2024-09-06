export const testJson = {
  type: "hcbs",
  name: "plan name",
  pages: [
    {
      name: "apple",
      elements: [
        {
          type: "header",
          text: "Hello I am the general app page",
        },
        {
          type: "paragraph",
          text: "why say more when less do",
        },
      ],
    },
    {
      name: "onion",
      elements: [
        {
          type:"paragraph",
          text:"lets try some nesting"
        },
        {
          type: "button",
          text: "sub-page",
          pages: [
            {
              name: "onion-1-2-1",
              elements: [
                {
                  type: "header",
                  text: "Did this work",
                },
                {
                  type: "paragraph",
                  text: "i am the first layer",
                },
              ],
            },
            {
              name: "onion-1-2-2",
              elements: [
                {
                  type: "paragraph",
                  text: "Click the button below to go in another layer",
                },
                {
                  type: "button",
                  text: "sub-sub-page",
                  pages: [
                    {
                      name: "onion-2-2-1",
                      elements: [
                        {
                          type: "paragraph",
                          text: "i am a layer within a layer",
                        },
                      ],
                    },
                    {
                      name: "onion-2-2-2",
                      elements: [
                        {
                          type: "paragraph",
                          text: "Do you want more layers?",
                        },
                        {
                          type: "button",
                          text: "more layers",
                          pages: [
                            {
                              name: "onion-3-1-1",
                              elements: [
                                {
                                  type: "paragraph",
                                  text: "there's no more layers",
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              name: "onion-1-2-3",
            },
          ],
        },
      ],
      pages: [
        {
          name: "onion-1",
        },
        {
          name: "onion-2",
          pages: [{}],
        },
      ],
    },
    {
      name: "banana",
    },
  ],
};
