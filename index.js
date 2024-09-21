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
    // Inject CSS for cursor
    var css = document.createElement("style");
    css.type = "text/css";
    css.innerHTML = ".typewrite > .wrap { border-right: 0.08em solid #000}";
    document.body.appendChild(css);
}; 

// terminal
const terminalContainer = document.getElementById('terminal-container');
const terminalHeader = document.getElementById('terminal-header');
const terminalOutput = document.getElementById('terminal-output');
const terminalInput = document.getElementById('terminal-input');

let commands = {};

// Fetch the JSON data
fetch('./terminal.json')
  .then(response => response.json())
  .then(data => {
    commands = {
      'intro': data.introduction.join('\n'),
      'about': data.about,
      'edu': data.education.join('\n'),
      'skills': data.technicalSkills.join('\n'),
      'projects': data.projects.join('\n'),
      'blog': data.blog.join('\n'),
      'help': "Available commands: intro, about, edu, skills, projects, blog, help, clear, exit",
      'clear': "Clearing the screen...",
      'exit': "Exiting the command prompt..."
    };
  })
  .catch(error => console.error('Error fetching JSON data:', error));
console.log(commands.intro)
const subCommands = {
    'email': "Email: bbaikuntha87@gmail.com",
    'github': "GitHub: (link unavailable)",
    'linkedin': "LinkedIn: (link unavailable)"
};

// Handle key events for terminal input
function handleKey(event) {
    if (event.key === 'Enter') {
        const inputText = terminalInput.value.trim().toLowerCase();

        appendToTerminal(`guest@terminal:~$ ${inputText}`);
        terminalInput.value = '';

        if (commands[inputText]) {
            showLoadingEffect(() => {
                if (inputText === 'contact') {
                    appendToTerminal(commands[inputText]);
                } else if (inputText === 'clear') {
                    clearTerminal();
                } else if (inputText === 'exit') {
                    appendToTerminal(commands[inputText]);
                    setTimeout(() => {
                        terminalContainer.classList.add('hidden');
                    }, 2000);
                } else {
                    appendToTerminal(commands[inputText]);
                }
            });
        } else if (subCommands[inputText]) {
            showLoadingEffect(() => {
                appendToTerminal(subCommands[inputText]);
            });
        } else {
            appendToTerminal('Command not found or error.');
        }
    }
}

// Show the "loading..." effect with dynamic dots
function showLoadingEffect(callback) {
    let dots = '';
    const intervalId = setInterval(() => {
        dots = dots.length < 3 ? dots + '.' : '';
        terminalOutput.lastChild.textContent = `Loading${dots}`;
    }, 500);

    setTimeout(() => {
        clearInterval(intervalId);
        callback();
    }, 2000);
}

// Append text to the terminal
function appendToTerminal(text) {
    const commandOutput = document.createElement('div');
    commandOutput.textContent = text;
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

// Hide terminal on scroll
window.addEventListener('scroll', () => {
    if (window.scrollY > 0) {
        terminalContainer.classList.add('hidden');
    }
});
