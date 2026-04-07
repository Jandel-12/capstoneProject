/**
 * All challenge data for the El Royale platform
 */

export const CHALLENGES = {
  
  html: [
    {
      id: 'html-1',
      title: 'Your First Heading',
      difficulty: 'easy',
      instructions: `Welcome to HTML! Let's start with one of the most important elements: headings. 

In HTML, headings help organize content and show hierarchy. The <h1> tag represents the main heading - think of it as the title of a page. It's the biggest and most important heading.

Your task: Create an <h1> element containing the text "Hello El Royale". Remember, HTML elements need both an opening tag <h1> and a closing tag </h1>, with your content in between.`,
      starterCode: '<!-- Write your HTML here -->\n',
      hints: [
        'Headings in HTML use tags from <h1> (largest) to <h6> (smallest). For this challenge, use <h1>.',
        'HTML elements follow this pattern: <tagname>Your content here</tagname>. Don\'t forget the closing tag!',
        'The exact text should be: Hello El Royale (check your spelling and capitalization)'
      ],
      validation: [
        { selector: 'h1', exists: true, errorMsg: 'No <h1> element found. Make sure you\'re using the h1 tag.' },
        { selector: 'h1', textContent: 'Hello El Royale', errorMsg: 'The h1 text should be exactly "Hello El Royale"' }
      ]
    },
    {
      id: 'html-2',
      title: 'Adding a Paragraph',
      difficulty: 'easy',
      instructions: `Great job on your first heading! Now let's add some body text using paragraphs.

Paragraphs are used for regular text content on a webpage. The <p> tag tells the browser "this is a paragraph of text." Web pages typically combine headings with paragraphs to create well-structured content.

Your task: Below your h1 heading, add a paragraph that says "Welcome to interactive learning". Notice how different elements work together to build a complete page!`,
      starterCode: '<h1>Hello El Royale</h1>\n<!-- Add your paragraph here -->\n',
      hints: [
        'Use the <p> tag to create paragraphs. It works just like the h1 tag you just learned!',
        'Make sure your paragraph comes AFTER the h1 tag (below it in your code).',
        'The paragraph text should be exactly: Welcome to interactive learning'
      ],
      validation: [
        { selector: 'p', exists: true, errorMsg: 'No <p> element found. Use the p tag for paragraphs.' },
        { selector: 'p', textContent: 'Welcome to interactive learning', errorMsg: 'Paragraph text should be "Welcome to interactive learning"' }
      ]
    },
    {
      id: 'html-3',
      title: 'Creating a List',
      difficulty: 'medium',
      instructions: `Lists are essential in HTML for organizing related items. There are two types: ordered lists (numbered) and unordered lists (bulleted).

For this challenge, we'll create an unordered list using <ul>. Inside the <ul>, each item needs its own <li> (list item) tag. Think of <ul> as the container, and <li> as each individual item in the list.

Your task: Create an unordered list with three technologies you're learning: "HTML", "CSS", and "JavaScript". Each technology should be in its own list item.

Structure:
<ul>
  <li>First item</li>
  <li>Second item</li>
  <li>Third item</li>
</ul>`,
      starterCode: '<!-- Create your list here -->\n',
      hints: [
        'Start with <ul> to begin your unordered list. Don\'t forget to close it with </ul> at the end!',
        'Inside the <ul>, create three <li> tags - one for each technology.',
        'The order matters! First item: HTML, Second: CSS, Third: JavaScript'
      ],
      validation: [
        { selector: 'ul', exists: true, errorMsg: 'No <ul> element found. Use <ul> to create an unordered list.' },
        { selector: 'ul > li', count: 3, errorMsg: 'You need exactly 3 list items. Make sure each technology has its own <li> tag.' },
        { selector: 'ul > li:nth-child(1)', textContent: 'HTML', errorMsg: 'First list item should be "HTML"' },
        { selector: 'ul > li:nth-child(2)', textContent: 'CSS', errorMsg: 'Second list item should be "CSS"' },
        { selector: 'ul > li:nth-child(3)', textContent: 'JavaScript', errorMsg: 'Third list item should be "JavaScript"' }
      ]
    },
    {
      id: 'html-4',
      title: 'Adding a Link',
      difficulty: 'medium',
      instructions: `Links are what make the web "web-like" - they connect pages together! In HTML, we create links using the <a> (anchor) tag.

Links have two parts:
1. The text that users see and click on
2. The destination (where the link goes) - this goes in the "href" attribute

Attributes are extra information we add to tags. They go inside the opening tag like this:
<a href="destination">Click here</a>

Your task: Create a link with the text "Learn More" that points to "#learn". The # symbol creates an internal link (useful for navigation on the same page).`,
      starterCode: '<!-- Create your link here -->\n',
      hints: [
        'Use the <a> tag to create links. The structure is: <a href="url">Link Text</a>',
        'The href attribute should be set to "#learn" - don\'t forget the # symbol!',
        'The visible text between the tags should be: Learn More'
      ],
      validation: [
        { selector: 'a', exists: true, errorMsg: 'No <a> element found. Use the <a> tag to create links.' },
        { selector: 'a', attribute: 'href', value: '#learn', errorMsg: 'The href attribute should be "#learn"' },
        { selector: 'a', textContent: 'Learn More', errorMsg: 'Link text should be "Learn More"' }
      ]
    },
    {
      id: 'html-5',
      title: 'Complete Structure',
      difficulty: 'hard',
      instructions: `Excellent progress! Now let's combine everything you've learned into a complete page structure.

      Real web pages are built by combining multiple HTML elements. In this challenge, you'll create a mini-page with three different elements, demonstrating how they work together.

      Your task: Create a complete page structure with:
      1. A heading (h1) that says "My Page" - the page title
      2. A paragraph (p) that says "This is my page" - some content
      3. A button element that says "Click Me" - for user interaction

      Buttons are created with the <button> tag. Unlike links, buttons are typically used for actions like submitting forms or triggering JavaScript functions.

      Think about the order - headings usually come first, then content, then action elements like buttons.`,
      starterCode: '<!-- Build the complete structure -->\n',
      hints: [
        'You need three elements: <h1>, <p>, and <button>. Create them in that order.',
        'Each element should be on its own line for better readability. Remember to close each tag!',
        'Double-check your text: h1="My Page", p="This is my page", button="Click Me"'
      ],
      validation: [
        { selector: 'h1', exists: true, errorMsg: 'No <h1> found. Start with a heading.' },
        { selector: 'h1', textContent: 'My Page', errorMsg: 'The h1 heading should say "My Page"' },
        { selector: 'p', exists: true, errorMsg: 'No <p> found. Add a paragraph after the heading.' },
        { selector: 'p', textContent: 'This is my page', errorMsg: 'The paragraph should say "This is my page"' },
        { selector: 'button', exists: true, errorMsg: 'No <button> found. Add a button element.' },
        { selector: 'button', textContent: 'Click Me', errorMsg: 'The button should say "Click Me"' }
      ]
    }
  ],

  // ===== CSS MODULE =====
  css: [
    {
      id: 'css-1',
      title: 'Select by Tag',
      difficulty: 'easy',
      type: 'css',
      instructions: 'Make all paragraphs blue using the color property',
      starterCode: '<style>\n  /* Write your CSS here */\n</style>\n\n<p>This text should be blue</p>\n<p>This text should also be blue</p>',
      hints: [
        'Use the p selector to target all paragraphs',
        'Set the color property to blue',
        'Remember the semicolon after each property'
      ],
      validation: [
        { selector: 'p', property: 'color', value: 'rgb(0, 0, 255)', errorMsg: 'Paragraphs should be blue (color: blue)' }
      ]
    },
    {
      id: 'css-2',
      title: 'Select by Class',
      difficulty: 'easy',
      type: 'css',
      instructions: 'Make elements with class "highlight" have a yellow background',
      starterCode: '<style>\n  /* Write your CSS here */\n</style>\n\n<p class="highlight">This should have yellow background</p>\n<p>This should not</p>',
      hints: [
        'Use .highlight to select elements with that class',
        'Use the background-color property',
        'Set it to yellow'
      ],
      validation: [
        { selector: '.highlight', property: 'backgroundColor', value: 'rgb(255, 255, 0)', errorMsg: 'Elements with class "highlight" should have yellow background' }
      ]
    },
    {
      id: 'css-3',
      title: 'Select by ID',
      difficulty: 'easy',
      type: 'css',
      instructions: 'Make the element with id "main" have a font size of 24px',
      starterCode: '<style>\n  /* Write your CSS here */\n</style>\n\n<h1 id="main">Main Heading</h1>',
      hints: [
        'Use #main to select the element with id="main"',
        'Use the font-size property',
        'Set it to 24px'
      ],
      validation: [
        { selector: '#main', property: 'fontSize', value: '24px', errorMsg: 'Element with id "main" should have font-size: 24px' }
      ]
    },
    {
      id: 'css-4',
      title: 'Multiple Selectors',
      difficulty: 'medium',
      type: 'css',
      instructions: 'Make all h1 and h2 elements red',
      starterCode: '<style>\n  /* Write your CSS here */\n</style>\n\n<h1>Heading 1</h1>\n<h2>Heading 2</h2>\n<p>Paragraph</p>',
      hints: [
        'Use a comma to select multiple elements: h1, h2',
        'Set the color property to red',
        'Both headings should turn red'
      ],
      validation: [
        { selector: 'h1', property: 'color', value: 'rgb(255, 0, 0)', errorMsg: 'h1 should be red' },
        { selector: 'h2', property: 'color', value: 'rgb(255, 0, 0)', errorMsg: 'h2 should be red' }
      ]
    },
    {
      id: 'css-5',
      title: 'Descendant Selector',
      difficulty: 'medium',
      type: 'css',
      instructions: 'Make only paragraphs inside the div have green text',
      starterCode: '<style>\n  /* Write your CSS here */\n</style>\n\n<div>\n  <p>This should be green</p>\n</div>\n<p>This should NOT be green</p>',
      hints: [
        'Use a space for descendant selector: div p',
        'This selects p elements inside div elements',
        'Set color to green'
      ],
      validation: [
        { selector: 'div p', property: 'color', value: 'rgb(0, 128, 0)', errorMsg: 'Paragraphs inside div should be green' }
      ]
    },
    {
      id: 'css-6',
      title: 'Text Alignment',
      difficulty: 'medium',
      type: 'css',
      instructions: 'Center align all text in elements with class "center"',
      starterCode: '<style>\n  /* Write your CSS here */\n</style>\n\n<p class="center">This text should be centered</p>',
      hints: [
        'Use .center to select the class',
        'Use the text-align property',
        'Set it to center'
      ],
      validation: [
        { selector: '.center', property: 'textAlign', value: 'center', errorMsg: 'Text should be center-aligned' }
      ]
    },
    {
      id: 'css-7',
      title: 'RGB Colors',
      difficulty: 'hard',
      type: 'css',
      instructions: 'Use RGB to make the box have background color rgb(255, 100, 150)',
      starterCode: '<style>\n  .box {\n    width: 100px;\n    height: 100px;\n    /* Add background-color here */\n  }\n</style>\n\n<div class="box"></div>',
      hints: [
        'Use the rgb() function: rgb(red, green, blue)',
        'The values are: 255, 100, 150',
        'Apply to the .box selector'
      ],
      validation: [
        { selector: '.box', property: 'backgroundColor', value: 'rgb(255, 100, 150)', errorMsg: 'Background should be rgb(255, 100, 150)' }
      ]
    },
    {
      id: 'css-8',
      title: 'Complete Styling',
      difficulty: 'hard',
      type: 'css',
      instructions: 'Style the card: white text, purple background (rgb(128, 0, 128)), padding 20px, border-radius 10px',
      starterCode: '<style>\n  .card {\n    /* Add your styles here */\n  }\n</style>\n\n<div class="card">Card Content</div>',
      hints: [
        'Use color for text color (white)',
        'Use background-color for background (purple or rgb(128, 0, 128))',
        'Use padding and border-radius properties'
      ],
      validation: [
        { selector: '.card', property: 'color', value: 'rgb(255, 255, 255)', errorMsg: 'Text should be white' },
        { selector: '.card', property: 'backgroundColor', value: 'rgb(128, 0, 128)', errorMsg: 'Background should be purple' },
        { selector: '.card', property: 'padding', value: '20px', errorMsg: 'Padding should be 20px' },
        { selector: '.card', property: 'borderRadius', value: '10px', errorMsg: 'Border radius should be 10px' }
      ]
    }
  ],

  // ===== FLEXBOX MODULE =====
  flexbox: [
    {
      id: 'flex-1',
      title: 'Enable Flexbox',
      difficulty: 'easy',
      type: 'css',
      instructions: 'Make the container a flex container by setting display to flex',
      starterCode: '<style>\n  .container {\n    /* Add display property here */\n    border: 2px solid blue;\n    padding: 10px;\n  }\n  .box {\n    width: 50px;\n    height: 50px;\n    background: orange;\n    margin: 5px;\n  }\n</style>\n\n<div class="container">\n  <div class="box"></div>\n  <div class="box"></div>\n  <div class="box"></div>\n</div>',
      hints: [
        'Use the display property',
        'Set it to flex',
        'This will make child elements flexible'
      ],
      validation: [
        { selector: '.container', property: 'display', value: 'flex', errorMsg: 'Container should have display: flex' }
      ]
    },
    {
      id: 'flex-2',
      title: 'Center Items',
      difficulty: 'easy',
      type: 'css',
      instructions: 'Center items horizontally using justify-content',
      starterCode: '<style>\n  .container {\n    display: flex;\n    /* Add justify-content here */\n    border: 2px solid blue;\n    padding: 10px;\n    height: 100px;\n  }\n  .box {\n    width: 50px;\n    height: 50px;\n    background: orange;\n  }\n</style>\n\n<div class="container">\n  <div class="box"></div>\n</div>',
      hints: [
        'Use the justify-content property',
        'Set it to center',
        'This centers items along the main axis'
      ],
      validation: [
        { selector: '.container', property: 'justifyContent', value: 'center', errorMsg: 'Use justify-content: center' }
      ]
    },
    {
      id: 'flex-3',
      title: 'Vertical Alignment',
      difficulty: 'easy',
      type: 'css',
      instructions: 'Center items vertically using align-items',
      starterCode: '<style>\n  .container {\n    display: flex;\n    justify-content: center;\n    /* Add align-items here */\n    border: 2px solid blue;\n    height: 150px;\n  }\n  .box {\n    width: 50px;\n    height: 50px;\n    background: orange;\n  }\n</style>\n\n<div class="container">\n  <div class="box"></div>\n</div>',
      hints: [
        'Use the align-items property',
        'Set it to center',
        'This centers items along the cross axis'
      ],
      validation: [
        { selector: '.container', property: 'alignItems', value: 'center', errorMsg: 'Use align-items: center' }
      ]
    },
    {
      id: 'flex-4',
      title: 'Space Between',
      difficulty: 'medium',
      type: 'css',
      instructions: 'Distribute boxes evenly using justify-content: space-between',
      starterCode: '<style>\n  .container {\n    display: flex;\n    /* Add justify-content here */\n    border: 2px solid blue;\n    padding: 10px;\n  }\n  .box {\n    width: 50px;\n    height: 50px;\n    background: orange;\n  }\n</style>\n\n<div class="container">\n  <div class="box"></div>\n  <div class="box"></div>\n  <div class="box"></div>\n</div>',
      hints: [
        'Use justify-content property',
        'Set it to space-between',
        'This puts space between items, pushing first and last to edges'
      ],
      validation: [
        { selector: '.container', property: 'justifyContent', value: 'space-between', errorMsg: 'Use justify-content: space-between' }
      ]
    },
    {
      id: 'flex-5',
      title: 'Flex Direction Column',
      difficulty: 'medium',
      type: 'css',
      instructions: 'Stack boxes vertically using flex-direction: column',
      starterCode: '<style>\n  .container {\n    display: flex;\n    /* Add flex-direction here */\n    border: 2px solid blue;\n    padding: 10px;\n  }\n  .box {\n    width: 50px;\n    height: 50px;\n    background: orange;\n    margin: 5px;\n  }\n</style>\n\n<div class="container">\n  <div class="box"></div>\n  <div class="box"></div>\n  <div class="box"></div>\n</div>',
      hints: [
        'Use the flex-direction property',
        'Set it to column',
        'This stacks items vertically'
      ],
      validation: [
        { selector: '.container', property: 'flexDirection', value: 'column', errorMsg: 'Use flex-direction: column' }
      ]
    },
    {
      id: 'flex-6',
      title: 'Gap Between Items',
      difficulty: 'medium',
      type: 'css',
      instructions: 'Add 20px gap between flex items using the gap property',
      starterCode: '<style>\n  .container {\n    display: flex;\n    /* Add gap here */\n    border: 2px solid blue;\n    padding: 10px;\n  }\n  .box {\n    width: 50px;\n    height: 50px;\n    background: orange;\n  }\n</style>\n\n<div class="container">\n  <div class="box"></div>\n  <div class="box"></div>\n  <div class="box"></div>\n</div>',
      hints: [
        'Use the gap property',
        'Set it to 20px',
        'This adds space between all flex items'
      ],
      validation: [
        { selector: '.container', property: 'gap', value: '20px', errorMsg: 'Use gap: 20px' }
      ]
    },
    {
      id: 'flex-7',
      title: 'Flex Wrap',
      difficulty: 'hard',
      type: 'css',
      instructions: 'Allow items to wrap to next line using flex-wrap: wrap',
      starterCode: '<style>\n  .container {\n    display: flex;\n    /* Add flex-wrap here */\n    border: 2px solid blue;\n    padding: 10px;\n    width: 200px;\n  }\n  .box {\n    width: 70px;\n    height: 50px;\n    background: orange;\n    margin: 5px;\n  }\n</style>\n\n<div class="container">\n  <div class="box"></div>\n  <div class="box"></div>\n  <div class="box"></div>\n  <div class="box"></div>\n</div>',
      hints: [
        'Use the flex-wrap property',
        'Set it to wrap',
        'Items will move to next line if they don\'t fit'
      ],
      validation: [
        { selector: '.container', property: 'flexWrap', value: 'wrap', errorMsg: 'Use flex-wrap: wrap' }
      ]
    },
    {
      id: 'flex-8',
      title: 'Complete Flexbox Layout',
      difficulty: 'hard',
      type: 'css',
      instructions: 'Create a centered layout: display flex, justify-content center, align-items center, height 200px',
      starterCode: '<style>\n  .container {\n    /* Add all flexbox properties here */\n    border: 2px solid blue;\n  }\n  .box {\n    width: 100px;\n    height: 100px;\n    background: orange;\n  }\n</style>\n\n<div class="container">\n  <div class="box">Centered!</div>\n</div>',
      hints: [
        'Start with display: flex',
        'Add justify-content: center for horizontal centering',
        'Add align-items: center for vertical centering',
        'Don\'t forget height: 200px'
      ],
      validation: [
        { selector: '.container', property: 'display', value: 'flex', errorMsg: 'Need display: flex' },
        { selector: '.container', property: 'justifyContent', value: 'center', errorMsg: 'Need justify-content: center' },
        { selector: '.container', property: 'alignItems', value: 'center', errorMsg: 'Need align-items: center' },
        { selector: '.container', property: 'height', value: '200px', errorMsg: 'Need height: 200px' }
      ]
    }
  ],

  // ===== JAVASCRIPT MODULE =====
  javascript: [
    {
      id: 'js-1',
      title: 'Select Element by ID',
      difficulty: 'easy',
      type: 'javascript',
      instructions: 'Use document.getElementById to select the element with id "demo" and change its text to "Changed!"',
      starterCode: '<p id="demo">Original Text</p>\n \n<script>\n  // Write your JavaScript here\n  \n</script>',
      hints: [
        'Use document.getElementById("demo") to select the element',
        'Use .textContent to change the text',
        'Set it to "Changed!"'
      ],
      validation: [
        { type: 'domChange', selector: '#demo', property: 'textContent', value: 'Changed!', errorMsg: 'Text should be changed to "Changed!"' }
      ]
    },
    {
      id: 'js-2',
      title: 'Select by Query Selector',
      difficulty: 'easy',
      type: 'javascript',
      instructions: 'Use document.querySelector to select the element with class "highlight" and change its color to blue',
      starterCode: '<p class="highlight">This text should turn blue</p>\n\n<script>\n  // Write your JavaScript here\n  \n</script>',
      hints: [
        'Use document.querySelector(".highlight")',
        'Use .style.color to change the color',
        'Set it to "blue"'
      ],
      validation: [
        { type: 'domChange', selector: '.highlight', property: 'color', value: 'blue', errorMsg: 'Color should be changed to blue' }
      ]
    },
    {
      id: 'js-3',
      title: 'Change Background Color',
      difficulty: 'easy',
      type: 'javascript',
      instructions: 'Select the box and change its background color to green',
      starterCode: '<div id="box" style="width:100px;height:100px;background:gray;"></div>\n\n<script>\n  // Write your JavaScript here\n  \n</script>',
      hints: [
        'Select the element with id "box"',
        'Use .style.backgroundColor',
        'Set it to "green"'
      ],
      validation: [
        { type: 'domChange', selector: '#box', property: 'backgroundColor', value: 'green', errorMsg: 'Background should be green' }
      ]
    },
    {
      id: 'js-4',
      title: 'Click Event Listener',
      difficulty: 'medium',
      type: 'javascript',
      instructions: 'Add a click event listener to the button that changes the text of the paragraph to "Button Clicked!"',
      starterCode: '<button id="btn">Click Me</button>\n<p id="text">Original</p>\n\n<script>\n  // Write your JavaScript here\n  \n</script>',
      hints: [
        'Select the button using getElementById',
        'Use .addEventListener("click", function)',
        'Inside the function, change the paragraph text'
      ],
      validation: [
        { type: 'eventListener', selector: '#btn', event: 'click', errorMsg: 'Button needs a click event listener' }
      ]
    },
    {
      id: 'js-5',
      title: 'Toggle Class',
      difficulty: 'medium',
      type: 'javascript',
      instructions: 'When the button is clicked, toggle the "active" class on the box',
      starterCode: '<style>\n  #box { width:100px; height:100px; background:gray; }\n  #box.active { background:orange; }\n</style>\n\n<button id="toggleBtn">Toggle</button>\n<div id="box"></div>\n\n<script>\n  // Write your JavaScript here\n  \n</script>',
      hints: [
        'Select the button and the box',
        'Add click event listener to button',
        'Use box.classList.toggle("active")'
      ],
      validation: [
        { type: 'eventListener', selector: '#toggleBtn', event: 'click', errorMsg: 'Button needs a click event listener' }
      ]
    },
    {
      id: 'js-6',
      title: 'Create Element',
      difficulty: 'medium',
      type: 'javascript',
      instructions: 'Create a new paragraph element with text "New Element" and append it to the container',
      starterCode: '<div id="container"></div>\n\n<script>\n  // Write your JavaScript here\n  \n</script>',
      hints: [
        'Use document.createElement("p") to create a paragraph',
        'Set its textContent to "New Element"',
        'Use container.appendChild() to add it'
      ],
      validation: [
        { type: 'elementExists', selector: '#container p', errorMsg: 'Container should have a paragraph' },
        { type: 'domChange', selector: '#container p', property: 'textContent', value: 'New Element', errorMsg: 'Paragraph should say "New Element"' }
      ]
    },
    {
      id: 'js-7',
      title: 'Loop Through Elements',
      difficulty: 'hard',
      type: 'javascript',
      instructions: 'Select all elements with class "item" and change their text color to red',
      starterCode: '<p class="item">Item 1</p>\n<p class="item">Item 2</p>\n<p class="item">Item 3</p>\n\n<script>\n  // Write your JavaScript here\n  \n</script>',
      hints: [
        'Use document.querySelectorAll(".item") to get all items',
        'Loop through them using forEach',
        'Set each item\'s style.color to "red"'
      ],
      validation: [
        { type: 'domChange', selector: '.item', property: 'color', value: 'red', errorMsg: 'All items should be red' }
      ]
    },
    {
      id: 'js-8',
      title: 'Complete Interactive Counter',
      difficulty: 'hard',
      type: 'javascript',
      instructions: 'Create a counter: clicking the button should increment the count displayed in the span',
      starterCode: '<button id="countBtn">Increment</button>\n<p>Count: <span id="count">0</span></p>\n\n<script>\n  // Write your JavaScript here\n  \n</script>',
      hints: [
        'Create a variable to store the count (let count = 0)',
        'Add click listener to button',
        'Increment count and update the span\'s textContent'
      ],
      validation: [
        { type: 'eventListener', selector: '#countBtn', event: 'click', errorMsg: 'Button needs a click event listener' }
      ]
    }
  ]
};

/**
 * Module configuration
 */
export const MODULES = [
  {
    id: 'html',
    name: 'HTML Basics',
    icon: '📖',
    color: 'orange',
    challenges: CHALLENGES.html.length,
    locked: false,
    description: 'Learn HTML structure, tags, and semantic markup'
  },
  {
    id: 'css',
    name: 'CSS Selectors & Colors',
    icon: '🎨',
    color: 'blue',
    challenges: CHALLENGES.css.length,
    locked: false, // Changed to unlocked
    description: 'Master CSS selectors, specificity, and color properties'
  },
  {
    id: 'flexbox',
    name: 'Flexbox Layout',
    icon: '📐',
    color: 'purple',
    challenges: CHALLENGES.flexbox.length,
    locked: false, // Changed to unlocked
    description: 'Build responsive layouts with CSS Flexbox'
  },
  {
    id: 'javascript',
    name: 'JavaScript DOM',
    icon: '⚡',
    color: 'yellow',
    challenges: CHALLENGES.javascript.length,
    locked: false, // Changed to unlocked
    description: 'Manipulate the DOM and handle events with JavaScript'
  }
];

// Helper functions remain the same
export function getChallengeById(challengeId) {
  for (const moduleId in CHALLENGES) {
    const challenge = CHALLENGES[moduleId].find(c => c.id === challengeId);
    if (challenge) {
      return challenge;
    }
  }
  return null;
}

export function getModuleById(moduleId) {
  return MODULES.find(m => m.id === moduleId) || null;
}

export function getModuleChallenges(moduleId) {
  return CHALLENGES[moduleId] || [];
}

export function getTotalChallenges() {
  return Object.values(CHALLENGES).reduce((total, challenges) => total + challenges.length, 0);
}

export default {
  CHALLENGES,
  MODULES,
  getChallengeById,
  getModuleById,
  getModuleChallenges,
  getTotalChallenges
};