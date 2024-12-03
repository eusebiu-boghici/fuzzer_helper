// List of arguments for each tool
const argumentsList = [
    { id: 'url', label: 'Target URL', type: 'text', placeholder: 'Enter target URL', value: 'https://' },
    { id: 'userAgent', label: 'User-Agent', type: 'text', placeholder: 'User-Agent string', value: 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/109.0' },
    { id: 'threads', label: 'Threads', type: 'number', placeholder: 'Number of threads', value: 10 },
    { id: 'wordlist', label: 'Wordlist', type: 'text', placeholder: 'Enter wordlist path', value: '/usr/share/seclists/Discovery/Web-Content/raft-medium-directories.txt' },
    { id: 'outputFile', label: 'Output File Name', type: 'text', placeholder: 'Enter output file name', value: 'raft-medium-dirs' },
    { id: 'proxy', label: 'Proxy', type: 'text', placeholder: 'http://localhost:8080', value: '' }
];

// Function to dynamically create input fields based on argumentsList
function generateInputs() {
    const inputForm = document.getElementById('inputForm');
    argumentsList.forEach(arg => {
        const div = document.createElement('div');
        div.classList.add('input-field');
        const label = document.createElement('label');
        label.setAttribute('for', arg.id);
        label.textContent = arg.label;
        const input = document.createElement('input');
        input.setAttribute('type', arg.type);
        input.setAttribute('id', arg.id);
        input.setAttribute('placeholder', arg.placeholder);
        input.setAttribute('value', localStorage.getItem(arg.id) || arg.value);  // Load from localStorage if available
        input.oninput = updateCommands;
        div.appendChild(label);
        div.appendChild(input);
        inputForm.appendChild(div);
    });
}

// Function to save input field values to localStorage
function saveToLocalStorage() {
    argumentsList.forEach(arg => {
        const value = document.getElementById(arg.id).value;
        localStorage.setItem(arg.id, value);  // Save each input field value to localStorage
    });
}

// Function to update commands
function updateCommands() {
    const url = document.getElementById('url').value;
    const wordlist = document.getElementById('wordlist').value;
    const threads = document.getElementById('threads').value;
    const userAgent = document.getElementById('userAgent').value;
    const outputFileBase = document.getElementById('outputFile').value;
    const proxy = document.getElementById('proxy').value;

    // Parse the output file for each tool
    const feroxbusterOutputFile = `${outputFileBase}.feroxbuster`;
    const wfuzzOutputFile = `${outputFileBase}.wfuzz`;
    const ffufOutputFile = `${outputFileBase}.ffuf`;

    // Build Feroxbuster command with multiline template
    const feroxbusterCommandParts = [
        `feroxbuster`,
        `--wordlist ${wordlist}`,
        `--threads ${threads}`,
        `--user-agent "${userAgent}"`,
        `--output ${feroxbusterOutputFile}`,
        `${proxy ? `--proxy ${proxy} --insecure` : ''}`,
        `--url ${url}`
    ].filter(part => part); // Filter out any empty strings

    const feroxbusterCommand = feroxbusterCommandParts.join(' \\\n');

    document.getElementById('feroxbusterOutput').textContent = feroxbusterCommand;

    // Build wfuzz command with multiline template
    const wfuzzProxy = `${proxy.split('://')[1]}:${proxy.split('://')[0].toUpperCase()}`
    const wfuzzCommandParts = [
        `wfuzz`,
        `-c`,
        `-z file,${wordlist}`,
        `-t ${threads}`,
        `-H "User-Agent: ${userAgent}"`,
        `-f ${wfuzzOutputFile}`,
        `${proxy ? `-p ${wfuzzProxy}` : ''}`, // Include proxy only if set
        `-u ${url}/FUZZ`
    ].filter(part => part); // Filter out any empty strings

    const wfuzzCommand = wfuzzCommandParts.join(' \\\n');

    document.getElementById('wfuzzOutput').textContent = wfuzzCommand;

    // Build ffuf command with multiline template
    const ffufCommandParts = [
        `ffuf`,
        `-w ${wordlist}`,
        `-t ${threads}`,
        `-H "User-Agent: ${userAgent}"`,
        `-o ${ffufOutputFile}`,
        `${proxy ? `-x ${proxy}` : ''}`, // Include proxy only if set
        `-u ${url}/FUZZ`
    ].filter(part => part); // No proxy to filter here

    const ffufCommand = ffufCommandParts.join(' \\\n');


    document.getElementById('ffufOutput').textContent = ffufCommand;
}


// Function to copy command to clipboard
function copyToClipboard(elementId) {
    const text = document.getElementById(elementId).textContent;
    navigator.clipboard.writeText(text).then(() => {
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
}

window.onload = function () {
    generateInputs();
    updateCommands();
};
