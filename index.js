// nav elements
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');


// terminal elements
const terminalContainer = document.getElementById('terminal-container');
const terminalHeader = document.getElementById('terminal-header');
const terminalOutput = document.getElementById('terminal-output');
const terminalInput = document.getElementById('terminal-input');
const terminalToggleBtn = document.getElementById('terminal-toggle-btn');

let commands = {};

navToggle.addEventListener('click', () => {
  const isExpanded = navToggle.getAttribute('aria-expanded') === 'true' || false;
  navToggle.setAttribute('aria-expanded', !isExpanded);
  navMenu.classList.toggle('hidden');
});
var TxtType = function (el, toRotate, period) {
  this.toRotate = toRotate;
  this.el = el;
  this.loopNum = 0;
  this.period = parseInt(period, 10) || 2000;
  this.txt = '';
  this.tick();
  this.isDeleting = false;
};

TxtType.prototype.tick = function () {
  var i = this.loopNum % this.toRotate.length;
  var fullTxt = this.toRotate[i];

  if (this.isDeleting) {
    this.txt = fullTxt.substring(0, this.txt.length - 1);
  } else {
    this.txt = fullTxt.substring(0, this.txt.length + 1);
  }

  this.el.innerHTML = '<span class="wrap">' + this.txt + '</span>';

  var that = this;
  var delta = 200 - Math.random() * 100;

  if (this.isDeleting) { delta /= 2; }

  if (!this.isDeleting && this.txt === fullTxt) {
    delta = this.period;
    this.isDeleting = true;
  } else if (this.isDeleting && this.txt === '') {
    this.isDeleting = false;
    this.loopNum++;
    delta = 500;
  }

  setTimeout(function () {
    that.tick();
  }, delta);
};

window.onload = function () {
  var elements = document.getElementsByClassName('typewrite');
  for (var i = 0; i < elements.length; i++) {
    var toRotate = elements[i].getAttribute('data-type');
    var period = elements[i].getAttribute('data-period');
    if (toRotate) {
      new TxtType(elements[i], JSON.parse(toRotate), period);
    }
  }
  var css = document.createElement("style");
  css.type = "text/css";
  css.innerHTML = ".typewrite > .wrap { border-right: 0.08em solid #000}";
  document.body.appendChild(css);
};


fetch('./terminal.json')
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid JSON data');
    }
    commands = {
      'intro': data.introduction || 'No introduction available',
      'about': data.about || 'No about information available',
      'edu': data.education || 'No education information available',
      'skills': data.technicalSkills || 'No technical skills available',
      'projects': data.projects || 'No projects available',
      'blog': data.blog || 'No blog available',
      'help': [
      "<span class='text-blue-400'>Available commands:</span>",
      "<span class='text-green-400'>intro</span> - introduction about me",
      "<span class='text-green-400'>about</span> - about me",
      "<span class='text-green-400'>edu</span> - my education",
      "<span class='text-green-400'>skills</span> - my technical skills",
      "<span class='text-green-400'>projects</span> - my projects",
      "<span class='text-green-400'>blog</span> - my blog",
      "<span class='text-green-400'>help</span> - list of commands",
      "<span class='text-yellow-400'>clear</span> - clear the terminal",
      "<span class='text-red-400'>exit</span> - exit the terminal",
      "<span class='text-purple-400'>email</span> - my email address",
      "<span class='text-purple-400'>github</span> - my GitHub profile",
      "<span class='text-purple-400'>linkedin</span> - my LinkedIn profile",
      "<span class='text-blue-400'>ls</span> - list directory contents",
      "<span class='text-blue-400'>dir</span> - list directory contents",
      "<span class='text-blue-400'>cd</span> - change directory",
      "<span class='text-blue-400'>date</span> - display current date and time",
      "<span class='text-blue-400'>echo</span> - display a line of text",
      "<span class='text-blue-400'>find</span> - search for a text string in a file",
      "<span class='text-blue-400'>goto</span> - jump to a labeled line in a batch script",
      "<span class='text-blue-400'>tree</span> - display directory structure in a tree format"
      ],
      'clear': ["<span class='text-yellow-400'>Clearing the screen...</span>"],
      'exit': ["<span class='text-red-400'>Exiting the command prompt...</span>"],
      'ls': ["<span class='text-blue-400'>Listing directory contents...</span>"],
      'dir': ["<span class='text-blue-400'>Listing directory contents...</span>"],
      'cd': ["<span class='text-blue-400'>Changing directory...</span>"],
      'date': [new Date().toString()],
      'echo': ["<span class='text-blue-400'>Echoing text...</span>"],
      'find': ["<span class='text-blue-400'>Finding text...</span>"],
      'goto': ["<span class='text-blue-400'>Going to label...</span>"],
      'tree': ["<span class='text-blue-400'>Displaying directory structure...</span>"]
    };
  })
  .catch(error => {
    console.error('Error fetching or parsing JSON data:', error);
  });

const subCommands = {
  'email': ["Email: bbaikuntha87@gmail.com"],
  'github': ["GitHub: https://github.com/Baikun1"],
  'linkedin': ["LinkedIn: https://www.linkedin.com/in/baikuntha-behera-6b255220b/"]
};

// Handle key events for terminal input
function handleKey(event) {
  if (event.key === 'Enter') {
    const inputText = terminalInput.value.trim().toLowerCase();
    appendToTerminal(`guest@terminal:~$ ${inputText}`);
    terminalInput.value = '';

    if (commands[inputText]) {
      if (inputText === 'clear') {
        clearTerminal();
      } else if (inputText === 'exit') {
        appendToTerminal(commands[inputText][0]);
        setTimeout(() => {
          terminalContainer.classList.add('hidden');
        }, 2000);
      } else {
        appendWithDelay(commands[inputText], 0); // Show result instantly for help command
      }
    } else if (subCommands[inputText]) {
      appendWithDelay(subCommands[inputText], 0); // Show result instantly for subcommands
    } else {
      appendToTerminal('Command not found or error.');
    }
  }
}

// Show the "loading..." effect with dynamic dots
function showLoadingEffect(callback) {
  let dots = '';
  const intervalId = setInterval(() => {
    dots = dots.length < 5 ? dots + '.' : '';
    terminalOutput.lastChild.textContent = `Loading${dots}`;
  }, 500);

  setTimeout(() => {
    clearInterval(intervalId);
    callback();
  }, 1500);
}

// Append text to the terminal one by one with delay
function appendWithDelay(dataArray, delay) {
  let i = 0;
  function displayNext() {
    if (i < dataArray.length) {
      appendToTerminal(dataArray[i]);
      i++;
      setTimeout(displayNext, delay);
    }
  }
  displayNext();
}

// Append text to the terminal
function appendToTerminal(text) {
  const commandOutput = document.createElement('div');
  commandOutput.innerHTML = text;
  terminalOutput.appendChild(commandOutput);
  terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

// Clear the terminal screen
function clearTerminal() {
  terminalOutput.innerHTML = '<div>guest@terminal:~$ Type "help" to see all commands</div>';
}

// Make the terminal draggable
let isDragging = false;
let offsetX, offsetY;

terminalHeader.addEventListener('mousedown', (e) => {
  isDragging = true;
  offsetX = e.clientX - terminalContainer.getBoundingClientRect().left;
  offsetY = e.clientY - terminalContainer.getBoundingClientRect().top;
  terminalContainer.style.transition = 'none'; // Disable transition for smooth dragging
});

document.addEventListener('mousemove', (e) => {
  if (isDragging) {
    const newX = e.clientX - offsetX;
    const newY = e.clientY - offsetY;
    terminalContainer.style.left = `${newX}px`;
    terminalContainer.style.top = `${newY}px`;
  }
});

document.addEventListener('mouseup', () => {
  isDragging = false;
  terminalContainer.style.transition = ''; // Re-enable transition if needed
});

// Cursor blinking effect for terminal input
terminalInput.addEventListener('focus', () => {
  terminalInput.classList.add('blinking-cursor');
});

terminalInput.addEventListener('blur', () => {
  terminalInput.classList.remove('blinking-cursor');
});

// Initialize terminal input functionality
terminalInput.addEventListener('keydown', handleKey);

// Function to toggle terminal visibility
terminalToggleBtn.addEventListener('click', () => {
  terminalContainer.classList.toggle('hidden');
});

// Function to close terminal
document.getElementById('terminal-close-btn').addEventListener('click', () => {
  terminalContainer.classList.add('hidden');
});

// Show terminal after 5 seconds of page load
setTimeout(() => {
  terminalContainer.classList.remove('hidden');
}, 5000);


// Constants
const ANIMATION_INTERVAL = 20; // ms
const PROGRESS_BARS = [
  { id: 'html', width: '90%' },
  { id: 'css', width: '85%' },
  { id: 'js', width: '75%' },
  { id: 'bootstrap', width: '80%' },
  { id: 'tailwind', width: '70%' },
  { id: 'mysql', width: '75%' },
  { id: 'oracle', width: '65%' },
  { id: 'python', width: '85%' },
  { id: 'pandas', width: '80%' },
  { id: 'tensorflow', width: '70%' },
  { id: 'numpy', width: '75%' },
  { id: 'oop', width: '80%' }
];

// Function to create and configure an IntersectionObserver
function createIntersectionObserver(callback) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        callback();
        observer.unobserve(entry.target);
      }
    });
  });
  return observer;
}

// Function to animate progress bars
function animateProgressBars() {
  PROGRESS_BARS.forEach((bar) => {
    const element = document.getElementById(bar.id);
    let width = 0;
    const intervalId = setInterval(() => {
      if (width >= parseInt(bar.width)) {
        clearInterval(intervalId);
      } else {
        width++;
        element.style.width = `${width}%`;
      }
    }, ANIMATION_INTERVAL);
  });
}

// Function to handle education items
function handleEducationItems() {
  const educationItems = document.querySelectorAll('.bnc');
  const observer = createIntersectionObserver(() => {
    educationItems.forEach((item) => {
      item.classList.add('bounce');
    });
  });
  educationItems.forEach((item) => {
    observer.observe(item);
  });
}

// Function to handle progress section
function handleProgressSection() {
  const progressSection = document.getElementById('skills');
  const observer = createIntersectionObserver(animateProgressBars);
  observer.observe(progressSection);
}

// Main function
function main() {
  handleEducationItems();
  handleProgressSection();
}

// Call the main function when the DOM is ready
document.addEventListener('DOMContentLoaded', main);

// Handle interactive tree structure
document.querySelectorAll('.tree li span').forEach(node => {
  node.addEventListener('click', () => {
    const nextUl = node.nextElementSibling;
    if (nextUl) {
      nextUl.style.display = nextUl.style.display === 'block' ? 'none' : 'block';
    }
  });
});
