// List of arguments for each tool
const argumentsList = [
    { id: 'url', label: 'Target URL', type: 'text', placeholder: 'Enter target URL', value: 'https://' },
    { id: 'userAgent', label: 'User-Agent', type: 'text', placeholder: 'User-Agent string', value: 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/109.0' },
    { id: 'threads', label: 'Threads', type: 'number', placeholder: 'Number of threads', value: 10 },
    { id: 'wordlist', label: 'Wordlist', type: 'text', placeholder: 'Enter wordlist path', value: '/usr/share/seclists/Discovery/Web-Content/raft-medium-directories.txt' },
    { id: 'outputFile', label: 'Output File Name', type: 'text', placeholder: 'Enter output file name', value: 'raft-medium-dirs' }
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
        input.setAttribute('value', arg.value);
        input.setAttribute('required', true);
        input.oninput = updateCommands;
        div.appendChild(label);
        div.appendChild(input);
        inputForm.appendChild(div);
    });
}

// Function to update commands
function updateCommands() {
    const args = argumentsList.reduce((acc, arg) => {
        acc[arg.id] = document.getElementById(arg.id).value;
        return acc;
    }, {});

    const { url, wordlist, threads, userAgent, outputFile } = args;

    // Parse the output file for each tool
    const feroxbusterOutputFile = `${outputFile}.feroxbuster`;
    const wfuzzOutputFile = `${outputFile}.wfuzz`;
    const ffufOutputFile = `${outputFile}.ffuf`;

    // Build Feroxbuster command
    const feroxbusterCommand = `feroxbuster -u ${url} -w ${wordlist} -t ${threads} --user-agent "${userAgent}" -o ${feroxbusterOutputFile}`;
    document.getElementById('feroxbusterOutput').textContent = feroxbusterCommand;

    // Build Wfuzz command
    const wfuzzCommand = `wfuzz -c -z file,${wordlist} -u ${url}/FUZZ -t ${threads} -H "User-Agent: ${userAgent}" -o ${wfuzzOutputFile}`;
    document.getElementById('wfuzzOutput').textContent = wfuzzCommand;

    // Build FFUF command
    const ffufCommand = `ffuf -u ${url}/FUZZ -w ${wordlist} -t ${threads} -H "User-Agent: ${userAgent}" -o ${ffufOutputFile}`;
    document.getElementById('ffufOutput').textContent = ffufCommand;
}

// Function to copy command to clipboard
function copyToClipboard(elementId) {
    const text = document.getElementById(elementId).textContent;
    navigator.clipboard.writeText(text).then(() => {
        alert('Command copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
}

// Initialize inputs when the page loads
window.onload = generateInputs;
