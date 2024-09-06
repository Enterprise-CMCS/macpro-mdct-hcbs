export const testJson = {
  type: "hcbs",
  name: "plan id",
  pages: [
    {
      id: "root",
      children: ["apple", "onion", "banana"],
    },
    {
      id: "apple",
      elements: [
        {
          type: "header",
          text: "Hello I am the general app page",
        },
        {
          type: "paragraph",
          text: "why say more when less do",
        },
        {
          type: "button",
          text: "Jump to Onion",
          to: "onion",
        },
        {
          type: "button",
          text: "Jump to Banana",
          to: "banana",
        },
      ],
    },
    {
      id: "onion",
      elements: [
        {
          type: "paragraph",
          text: "lets try some nesting",
        },
        {
          type: "button",
          text: "sub-page",
          to: "onion-1-1",
        },
      ],
      children: ["onion-1-1", "onion-1-2"],
    },
    {
      id: "onion-1-1",
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
      id: "onion-1-2",
      elements: [
        {
          type: "paragraph",
          text: "Click the button below to go in another layer",
        },
        {
          type: "button",
          text: "sub-sub-page",
          to: "onion-1-2-1",
        },
      ],
      children: ["onion-1-2-1", "onion-1-2-2"],
    },
    {
      id: "onion-1-2-1",
      elements: [
        {
          type: "paragraph",
          text: "i am a layer within a layer",
        },
      ],
    },
    {
      id: "onion-1-2-2",
      elements: [
        {
          type: "paragraph",
          text: "Do you want more layers?",
        },
        {
          type: "button",
          text: "more layers",
          to: "onion-1-2-2-1",
        },
      ],
      children: ["onion-1-2-2-1"],
    },
    {
      id: "onion-1-2-3",
      elements: [
        {
          type: "paragraph",
          text: "this doesn't go anywhere",
        },
      ],
    },
    {
      id: "onion-1-2-2-1",
      elements: [
        {
          type: "paragraph",
          text: "there's no more layers",
        },
        {
          type: "button",
          text: "back to Banana",
          to: "banana",
        },
      ],
    },
    {
      id: "banana",
    },
  ],
};
