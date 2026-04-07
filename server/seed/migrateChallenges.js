require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const Challenge = require('../models/Challenge');
const Module = require('../models/Module');

const MODULES = [
  { id: 'html', name: 'HTML Basics', icon: '📖', color: 'orange', locked: false, order: 0 },
  { id: 'css', name: 'CSS Selectors & Colors', icon: '🎨', color: 'blue', locked: false, order: 1 },
  { id: 'flexbox', name: 'Flexbox Layout', icon: '📐', color: 'purple', locked: false, order: 2 },
  { id: 'javascript', name: 'JavaScript DOM', icon: '⚡', color: 'yellow', locked: false, order: 3 }
];

const CHALLENGES = {
  html: [
    {
      id: 'html-1', title: 'Your First Heading', difficulty: 'easy', type: 'html', order: 0,
      instructions: "Welcome to HTML! Let's start with headings.\n\nYour task: Create an <h1> element containing the text \"Hello El Royale\".",
      starterCode: '<!-- Write your HTML here -->\n',
      hints: ['Use the <h1> tag', 'Don\'t forget the closing tag!', 'Text: Hello El Royale'],
      validation: [
        { type: 'exists', selector: 'h1', message: 'No <h1> element found.' },
        { type: 'text', selector: 'h1', expected: 'Hello El Royale', message: 'h1 text should be "Hello El Royale"' }
      ]
    },
    {
      id: 'html-2', title: 'Adding a Paragraph', difficulty: 'easy', type: 'html', order: 1,
      instructions: 'Add a paragraph below the heading that says "Welcome to interactive learning".',
      starterCode: '<h1>Hello El Royale</h1>\n<!-- Add your paragraph here -->\n',
      hints: ['Use the <p> tag', 'Place it after the h1 tag', 'Text: Welcome to interactive learning'],
      validation: [
        { type: 'exists', selector: 'p', message: 'No <p> element found.' },
        { type: 'text', selector: 'p', expected: 'Welcome to interactive learning', message: 'Paragraph text should be "Welcome to interactive learning"' }
      ]
    },
    {
      id: 'html-3', title: 'Creating a List', difficulty: 'medium', type: 'html', order: 2,
      instructions: 'Create an unordered list with three items: "HTML", "CSS", and "JavaScript".',
      starterCode: '<!-- Create your list here -->\n',
      hints: ['Use <ul> for unordered list', 'Each item needs <li> tags', 'Order: HTML, CSS, JavaScript'],
      validation: [
        { type: 'exists', selector: 'ul', message: 'No <ul> element found.' },
        { type: 'count', selector: 'ul > li', expected: '3', message: 'You need exactly 3 list items.' },
        { type: 'text', selector: 'ul > li:nth-child(1)', expected: 'HTML', message: 'First item should be "HTML"' },
        { type: 'text', selector: 'ul > li:nth-child(2)', expected: 'CSS', message: 'Second item should be "CSS"' },
        { type: 'text', selector: 'ul > li:nth-child(3)', expected: 'JavaScript', message: 'Third item should be "JavaScript"' }
      ]
    },
    {
      id: 'html-4', title: 'Adding a Link', difficulty: 'medium', type: 'html', order: 3,
      instructions: 'Create a link with text "Learn More" that points to "#learn".',
      starterCode: '<!-- Create your link here -->\n',
      hints: ['Use the <a> tag', 'Set href="#learn"', 'Text: Learn More'],
      validation: [
        { type: 'exists', selector: 'a', message: 'No <a> element found.' },
        { type: 'attribute', selector: 'a', expected: '#learn', message: 'href should be "#learn"' },
        { type: 'text', selector: 'a', expected: 'Learn More', message: 'Link text should be "Learn More"' }
      ]
    },
    {
      id: 'html-5', title: 'Complete Structure', difficulty: 'hard', type: 'html', order: 4,
      instructions: 'Create a complete page with: h1 "My Page", p "This is my page", button "Click Me".',
      starterCode: '<!-- Build the complete structure -->\n',
      hints: ['You need three elements: h1, p, button', 'Create them in order', 'Check your text carefully'],
      validation: [
        { type: 'exists', selector: 'h1', message: 'No <h1> found.' },
        { type: 'text', selector: 'h1', expected: 'My Page', message: 'h1 should say "My Page"' },
        { type: 'exists', selector: 'p', message: 'No <p> found.' },
        { type: 'text', selector: 'p', expected: 'This is my page', message: 'p should say "This is my page"' },
        { type: 'exists', selector: 'button', message: 'No <button> found.' },
        { type: 'text', selector: 'button', expected: 'Click Me', message: 'button should say "Click Me"' }
      ]
    }
  ],
  css: [
    {
      id: 'css-1', title: 'Select by Tag', difficulty: 'easy', type: 'css', order: 0,
      instructions: 'Make all paragraphs blue using the color property.',
      starterCode: '<style>\n  /* Write your CSS here */\n</style>\n\n<p>This text should be blue</p>\n<p>This text should also be blue</p>',
      hints: ['Use the p selector', 'Set color to blue', 'Remember the semicolon'],
      validation: [{ type: 'style', selector: 'p', expected: 'rgb(0, 0, 255)', message: 'Paragraphs should be blue' }]
    },
    {
      id: 'css-2', title: 'Select by Class', difficulty: 'easy', type: 'css', order: 1,
      instructions: 'Make elements with class "highlight" have a yellow background.',
      starterCode: '<style>\n  /* Write your CSS here */\n</style>\n\n<p class="highlight">This should have yellow background</p>\n<p>This should not</p>',
      hints: ['Use .highlight selector', 'Use background-color property', 'Set to yellow'],
      validation: [{ type: 'style', selector: '.highlight', expected: 'rgb(255, 255, 0)', message: '.highlight should have yellow background' }]
    },
    {
      id: 'css-3', title: 'Select by ID', difficulty: 'easy', type: 'css', order: 2,
      instructions: 'Make the element with id "main" have a font size of 24px.',
      starterCode: '<style>\n  /* Write your CSS here */\n</style>\n\n<h1 id="main">Main Heading</h1>',
      hints: ['Use #main selector', 'Use font-size property', 'Set to 24px'],
      validation: [{ type: 'style', selector: '#main', expected: '24px', message: '#main should have font-size: 24px' }]
    },
    {
      id: 'css-4', title: 'Multiple Selectors', difficulty: 'medium', type: 'css', order: 3,
      instructions: 'Make all h1 and h2 elements red.',
      starterCode: '<style>\n  /* Write your CSS here */\n</style>\n\n<h1>Heading 1</h1>\n<h2>Heading 2</h2>\n<p>Paragraph</p>',
      hints: ['Use comma to select multiple: h1, h2', 'Set color to red', 'Both headings should be red'],
      validation: [
        { type: 'style', selector: 'h1', expected: 'rgb(255, 0, 0)', message: 'h1 should be red' },
        { type: 'style', selector: 'h2', expected: 'rgb(255, 0, 0)', message: 'h2 should be red' }
      ]
    },
    {
      id: 'css-5', title: 'Descendant Selector', difficulty: 'medium', type: 'css', order: 4,
      instructions: 'Make only paragraphs inside the div have green text.',
      starterCode: '<style>\n  /* Write your CSS here */\n</style>\n\n<div>\n  <p>This should be green</p>\n</div>\n<p>This should NOT be green</p>',
      hints: ['Use div p for descendant selector', 'Set color to green'],
      validation: [{ type: 'style', selector: 'div p', expected: 'rgb(0, 128, 0)', message: 'Paragraphs inside div should be green' }]
    },
    {
      id: 'css-6', title: 'Text Alignment', difficulty: 'medium', type: 'css', order: 5,
      instructions: 'Center align all text in elements with class "center".',
      starterCode: '<style>\n  /* Write your CSS here */\n</style>\n\n<p class="center">This text should be centered</p>',
      hints: ['Use .center selector', 'Use text-align property', 'Set to center'],
      validation: [{ type: 'style', selector: '.center', expected: 'center', message: 'Text should be center-aligned' }]
    },
    {
      id: 'css-7', title: 'RGB Colors', difficulty: 'hard', type: 'css', order: 6,
      instructions: 'Use RGB to make the box have background color rgb(255, 100, 150).',
      starterCode: '<style>\n  .box {\n    width: 100px;\n    height: 100px;\n    /* Add background-color here */\n  }\n</style>\n\n<div class="box"></div>',
      hints: ['Use rgb() function', 'Values: 255, 100, 150', 'Apply to .box selector'],
      validation: [{ type: 'style', selector: '.box', expected: 'rgb(255, 100, 150)', message: 'Background should be rgb(255, 100, 150)' }]
    },
    {
      id: 'css-8', title: 'Complete Styling', difficulty: 'hard', type: 'css', order: 7,
      instructions: 'Style the card: white text, purple background rgb(128, 0, 128), padding 20px, border-radius 10px.',
      starterCode: '<style>\n  .card {\n    /* Add your styles here */\n  }\n</style>\n\n<div class="card">Card Content</div>',
      hints: ['color: white', 'background-color: rgb(128, 0, 128)', 'padding: 20px, border-radius: 10px'],
      validation: [
        { type: 'style', selector: '.card', expected: 'rgb(255, 255, 255)', message: 'Text should be white' },
        { type: 'style', selector: '.card', expected: 'rgb(128, 0, 128)', message: 'Background should be purple' },
        { type: 'style', selector: '.card', expected: '20px', message: 'Padding should be 20px' },
        { type: 'style', selector: '.card', expected: '10px', message: 'Border radius should be 10px' }
      ]
    }
  ],
  flexbox: [
    {
      id: 'flex-1', title: 'Enable Flexbox', difficulty: 'easy', type: 'css', order: 0,
      instructions: 'Make the container a flex container by setting display to flex.',
      starterCode: '<style>\n  .container {\n    /* Add display property here */\n    border: 2px solid blue;\n    padding: 10px;\n  }\n  .box { width: 50px; height: 50px; background: orange; margin: 5px; }\n</style>\n\n<div class="container">\n  <div class="box"></div>\n  <div class="box"></div>\n  <div class="box"></div>\n</div>',
      hints: ['Use display property', 'Set to flex'],
      validation: [{ type: 'style', selector: '.container', expected: 'flex', message: 'Container should have display: flex' }]
    },
    {
      id: 'flex-2', title: 'Center Items', difficulty: 'easy', type: 'css', order: 1,
      instructions: 'Center items horizontally using justify-content.',
      starterCode: '<style>\n  .container {\n    display: flex;\n    /* Add justify-content here */\n    border: 2px solid blue;\n    padding: 10px;\n    height: 100px;\n  }\n  .box { width: 50px; height: 50px; background: orange; }\n</style>\n\n<div class="container">\n  <div class="box"></div>\n</div>',
      hints: ['Use justify-content property', 'Set to center'],
      validation: [{ type: 'style', selector: '.container', expected: 'center', message: 'Use justify-content: center' }]
    },
    {
      id: 'flex-3', title: 'Vertical Alignment', difficulty: 'easy', type: 'css', order: 2,
      instructions: 'Center items vertically using align-items.',
      starterCode: '<style>\n  .container {\n    display: flex;\n    justify-content: center;\n    /* Add align-items here */\n    border: 2px solid blue;\n    height: 150px;\n  }\n  .box { width: 50px; height: 50px; background: orange; }\n</style>\n\n<div class="container">\n  <div class="box"></div>\n</div>',
      hints: ['Use align-items property', 'Set to center'],
      validation: [{ type: 'style', selector: '.container', expected: 'center', message: 'Use align-items: center' }]
    },
    {
      id: 'flex-4', title: 'Space Between', difficulty: 'medium', type: 'css', order: 3,
      instructions: 'Distribute boxes evenly using justify-content: space-between.',
      starterCode: '<style>\n  .container {\n    display: flex;\n    /* Add justify-content here */\n    border: 2px solid blue;\n    padding: 10px;\n  }\n  .box { width: 50px; height: 50px; background: orange; }\n</style>\n\n<div class="container">\n  <div class="box"></div>\n  <div class="box"></div>\n  <div class="box"></div>\n</div>',
      hints: ['Use justify-content', 'Set to space-between'],
      validation: [{ type: 'style', selector: '.container', expected: 'space-between', message: 'Use justify-content: space-between' }]
    },
    {
      id: 'flex-5', title: 'Flex Direction Column', difficulty: 'medium', type: 'css', order: 4,
      instructions: 'Stack boxes vertically using flex-direction: column.',
      starterCode: '<style>\n  .container {\n    display: flex;\n    /* Add flex-direction here */\n    border: 2px solid blue;\n    padding: 10px;\n  }\n  .box { width: 50px; height: 50px; background: orange; margin: 5px; }\n</style>\n\n<div class="container">\n  <div class="box"></div>\n  <div class="box"></div>\n  <div class="box"></div>\n</div>',
      hints: ['Use flex-direction property', 'Set to column'],
      validation: [{ type: 'style', selector: '.container', expected: 'column', message: 'Use flex-direction: column' }]
    },
    {
      id: 'flex-6', title: 'Gap Between Items', difficulty: 'medium', type: 'css', order: 5,
      instructions: 'Add 20px gap between flex items using the gap property.',
      starterCode: '<style>\n  .container {\n    display: flex;\n    /* Add gap here */\n    border: 2px solid blue;\n    padding: 10px;\n  }\n  .box { width: 50px; height: 50px; background: orange; }\n</style>\n\n<div class="container">\n  <div class="box"></div>\n  <div class="box"></div>\n  <div class="box"></div>\n</div>',
      hints: ['Use gap property', 'Set to 20px'],
      validation: [{ type: 'style', selector: '.container', expected: '20px', message: 'Use gap: 20px' }]
    },
    {
      id: 'flex-7', title: 'Flex Wrap', difficulty: 'hard', type: 'css', order: 6,
      instructions: 'Allow items to wrap to next line using flex-wrap: wrap.',
      starterCode: '<style>\n  .container {\n    display: flex;\n    /* Add flex-wrap here */\n    border: 2px solid blue;\n    padding: 10px;\n    width: 200px;\n  }\n  .box { width: 70px; height: 50px; background: orange; margin: 5px; }\n</style>\n\n<div class="container">\n  <div class="box"></div>\n  <div class="box"></div>\n  <div class="box"></div>\n  <div class="box"></div>\n</div>',
      hints: ['Use flex-wrap property', 'Set to wrap'],
      validation: [{ type: 'style', selector: '.container', expected: 'wrap', message: 'Use flex-wrap: wrap' }]
    },
    {
      id: 'flex-8', title: 'Complete Flexbox Layout', difficulty: 'hard', type: 'css', order: 7,
      instructions: 'Create a centered layout: display flex, justify-content center, align-items center, height 200px.',
      starterCode: '<style>\n  .container {\n    /* Add all flexbox properties here */\n    border: 2px solid blue;\n  }\n  .box { width: 100px; height: 100px; background: orange; }\n</style>\n\n<div class="container">\n  <div class="box">Centered!</div>\n</div>',
      hints: ['Start with display: flex', 'Add justify-content: center', 'Add align-items: center', 'Add height: 200px'],
      validation: [
        { type: 'style', selector: '.container', expected: 'flex', message: 'Need display: flex' },
        { type: 'style', selector: '.container', expected: 'center', message: 'Need justify-content: center' },
        { type: 'style', selector: '.container', expected: 'center', message: 'Need align-items: center' },
        { type: 'style', selector: '.container', expected: '200px', message: 'Need height: 200px' }
      ]
    }
  ],
  javascript: [
    {
      id: 'js-1', title: 'Select Element by ID', difficulty: 'easy', type: 'javascript', order: 0,
      instructions: 'Use document.getElementById to select the element with id "demo" and change its text to "Changed!"',
      starterCode: '<p id="demo">Original Text</p>\n\n<script>\n  // Write your JavaScript here\n</script>',
      hints: ['Use document.getElementById("demo")', 'Use .textContent to change text', 'Set to "Changed!"'],
      validation: [{ type: 'domChange', selector: '#demo', expected: 'Changed!', message: 'Text should be "Changed!"' }]
    },
    {
      id: 'js-2', title: 'Select by Query Selector', difficulty: 'easy', type: 'javascript', order: 1,
      instructions: 'Use document.querySelector to select the element with class "highlight" and change its color to blue.',
      starterCode: '<p class="highlight">This text should turn blue</p>\n\n<script>\n  // Write your JavaScript here\n</script>',
      hints: ['Use document.querySelector(".highlight")', 'Use .style.color', 'Set to "blue"'],
      validation: [{ type: 'domChange', selector: '.highlight', expected: 'blue', message: 'Color should be blue' }]
    },
    {
      id: 'js-3', title: 'Change Background Color', difficulty: 'easy', type: 'javascript', order: 2,
      instructions: 'Select the box and change its background color to green.',
      starterCode: '<div id="box" style="width:100px;height:100px;background:gray;"></div>\n\n<script>\n  // Write your JavaScript here\n</script>',
      hints: ['Select element with id "box"', 'Use .style.backgroundColor', 'Set to "green"'],
      validation: [{ type: 'domChange', selector: '#box', expected: 'green', message: 'Background should be green' }]
    },
    {
      id: 'js-4', title: 'Click Event Listener', difficulty: 'medium', type: 'javascript', order: 3,
      instructions: 'Add a click event listener to the button that changes the paragraph text to "Button Clicked!"',
      starterCode: '<button id="btn">Click Me</button>\n<p id="text">Original</p>\n\n<script>\n  // Write your JavaScript here\n</script>',
      hints: ['Select button using getElementById', 'Use addEventListener("click", function)', 'Change paragraph text inside function'],
      validation: [{ type: 'eventListener', selector: '#btn', expected: 'click', message: 'Button needs a click event listener' }]
    },
    {
      id: 'js-5', title: 'Toggle Class', difficulty: 'medium', type: 'javascript', order: 4,
      instructions: 'When the button is clicked, toggle the "active" class on the box.',
      starterCode: '<style>\n  #box { width:100px; height:100px; background:gray; }\n  #box.active { background:orange; }\n</style>\n\n<button id="toggleBtn">Toggle</button>\n<div id="box"></div>\n\n<script>\n  // Write your JavaScript here\n</script>',
      hints: ['Select button and box', 'Add click event listener', 'Use box.classList.toggle("active")'],
      validation: [{ type: 'eventListener', selector: '#toggleBtn', expected: 'click', message: 'Button needs a click event listener' }]
    },
    {
      id: 'js-6', title: 'Create Element', difficulty: 'medium', type: 'javascript', order: 5,
      instructions: 'Create a new paragraph with text "New Element" and append it to the container.',
      starterCode: '<div id="container"></div>\n\n<script>\n  // Write your JavaScript here\n</script>',
      hints: ['Use document.createElement("p")', 'Set textContent to "New Element"', 'Use container.appendChild()'],
      validation: [
        { type: 'elementExists', selector: '#container p', message: 'Container should have a paragraph' },
        { type: 'domChange', selector: '#container p', expected: 'New Element', message: 'Paragraph should say "New Element"' }
      ]
    },
    {
      id: 'js-7', title: 'Loop Through Elements', difficulty: 'hard', type: 'javascript', order: 6,
      instructions: 'Select all elements with class "item" and change their text color to red.',
      starterCode: '<p class="item">Item 1</p>\n<p class="item">Item 2</p>\n<p class="item">Item 3</p>\n\n<script>\n  // Write your JavaScript here\n</script>',
      hints: ['Use querySelectorAll(".item")', 'Loop with forEach', 'Set each item style.color to "red"'],
      validation: [{ type: 'domChange', selector: '.item', expected: 'red', message: 'All items should be red' }]
    },
    {
      id: 'js-8', title: 'Complete Interactive Counter', difficulty: 'hard', type: 'javascript', order: 7,
      instructions: 'Create a counter: clicking the button should increment the count displayed in the span.',
      starterCode: '<button id="countBtn">Increment</button>\n<p>Count: <span id="count">0</span></p>\n\n<script>\n  // Write your JavaScript here\n</script>',
      hints: ['Create a count variable (let count = 0)', 'Add click listener to button', 'Increment count and update span textContent'],
      validation: [{ type: 'eventListener', selector: '#countBtn', expected: 'click', message: 'Button needs a click event listener' }]
    }
  ]
};

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected');

  await Module.deleteMany({});
  await Challenge.deleteMany({});
  console.log('🗑️  Cleared existing data');

  for (const m of MODULES) {
    await Module.create(m);
  }
  console.log(`✅ Seeded ${MODULES.length} modules`);

  let total = 0;
  for (const moduleId of Object.keys(CHALLENGES)) {
    for (const c of CHALLENGES[moduleId]) {
      await Challenge.create({ ...c, moduleId });
      total++;
    }
  }
  console.log(`✅ Seeded ${total} challenges`);
  process.exit();
};

run().catch(err => {
  console.error('❌', err.message);
  process.exit(1);
});

