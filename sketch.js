let nucleus;
let initialOrbitRadii = [80, 180, 280, 380, 480]; // Radii for shells 1 to 5
let numElectrons = 1; // Initial value
let electrons = [];
let electronInput;
let resetButton;
const MAX_ELECTRONS = 118; // Define the maximum number of electrons
let elementData = []; // Array to store element information
let warningMessage = "";
const MIN_NUCLEUS_RADIUS = 30; // Minimum radius for the nucleus
const MAX_NUCLEUS_RADIUS = 60; // Maximum radius for the nucleus

// Global variables for Electric Field
let electricFieldStrength = 0; // 0 means no field, positive/negative for direction
let electricFieldInput;
let electricFieldToggle;
let fieldActive = false; // To toggle the field on/off
const MAX_EFFECTIVE_ELECTRIC_FIELD_STRENGTH = 1.0; // The maximum value the *effective* strength can be

function preload() {
    // Basic element data (you can expand this with more accurate mass numbers)
    elementData = [
        { name: "Hydrogen", symbol: "H", atomicNumber: 1, atomicWeight: 1.008, massNumber: 1 },
        { name: "Helium", symbol: "He", atomicNumber: 2, atomicWeight: 4.0026, massNumber: 4 },
        { name: "Lithium", symbol: "Li", atomicNumber: 3, atomicWeight: 6.94, massNumber: 7 },
        { name: "Beryllium", symbol: "Be", atomicNumber: 4, atomicWeight: 9.0122, massNumber: 9 },
        { name: "Boron", symbol: "B", atomicNumber: 5, atomicWeight: 10.81, massNumber: 11 },
        { name: "Carbon", symbol: "C", atomicNumber: 6, atomicWeight: 12.011, massNumber: 12 },
        { name: "Nitrogen", symbol: "N", atomicNumber: 7, atomicWeight: 14.007, massNumber: 14 },
        { name: "Oxygen", symbol: "O", atomicNumber: 8, atomicWeight: 15.999, massNumber: 16 },
        { name: "Fluorine", symbol: "F", atomicNumber: 9, atomicWeight: 18.998, massNumber: 19 },
        { name: "Neon", symbol: "Ne", atomicNumber: 10, atomicWeight: 20.180, massNumber: 20 },
        { name: "Sodium", symbol: "Na", atomicNumber: 11, atomicWeight: 22.990, massNumber: 23 },
        { name: "Magnesium", symbol: "Mg", atomicNumber: 12, atomicWeight: 24.305, massNumber: 24 },
        { name: "Aluminum", symbol: "Al", atomicNumber: 13, atomicWeight: 26.982, massNumber: 27 },
        { name: "Silicon", symbol: "Si", atomicNumber: 14, atomicWeight: 28.085, massNumber: 28 },
        { name: "Phosphorus", symbol: "P", atomicNumber: 15, atomicWeight: 30.974, massNumber: 31 },
        { name: "Sulfur", symbol: "S", atomicNumber: 16, atomicWeight: 32.06, massNumber: 32 },
        { name: "Chlorine", symbol: "Cl", atomicNumber: 17, atomicWeight: 35.45, massNumber: 35 },
        { name: "Argon", symbol: "Ar", atomicNumber: 18, atomicWeight: 39.948, massNumber: 40 },
        { name: "Potassium", symbol: "K", atomicNumber: 19, atomicWeight: 39.098, massNumber: 39 },
        { name: "Calcium", symbol: "Ca", atomicNumber: 20, atomicWeight: 40.078, massNumber: 40 },
        { name: "Scandium", symbol: "Sc", atomicNumber: 21, atomicWeight: 44.956, massNumber: 45 },
        { name: "Titanium", symbol: "Ti", atomicNumber: 22, atomicWeight: 47.867, massNumber: 48 },
        { name: "Vanadium", symbol: "V", atomicNumber: 23, atomicWeight: 50.942, massNumber: 51 },
        { name: "Chromium", symbol: "Cr", atomicNumber: 24, atomicWeight: 51.996, massNumber: 52 },
        { name: "Manganese", symbol: "Mn", atomicNumber: 25, atomicWeight: 54.938, massNumber: 55 },
        { name: "Iron", symbol: "Fe", atomicNumber: 26, atomicWeight: 55.845, massNumber: 56 },
        { name: "Cobalt", symbol: "Co", atomicNumber: 27, atomicWeight: 58.933, massNumber: 59 },
        { name: "Nickel", symbol: "Ni", atomicNumber: 28, atomicWeight: 58.693, massNumber: 59 },
        { name: "Copper", symbol: "Cu", atomicNumber: 29, atomicWeight: 63.546, massNumber: 63 },
        { name: "Zinc", symbol: "Zn", atomicNumber: 30, atomicWeight: 65.38, massNumber: 64 },
        { name: "Gallium", symbol: "Ga", atomicNumber: 31, atomicWeight: 69.723, massNumber: 70 },
        { name: "Germanium", symbol: "Ge", atomicNumber: 32, atomicWeight: 72.63, massNumber: 73 },
        { name: "Arsenic", symbol: "As", atomicNumber: 33, atomicWeight: 74.922, massNumber: 75 },
        { name: "Selenium", symbol: "Se", atomicNumber: 34, atomicWeight: 78.971, massNumber: 80 },
        { name: "Bromine", symbol: "Br", atomicNumber: 35, atomicWeight: 79.904, massNumber: 79 },
        { name: "Krypton", symbol: "Kr", atomicNumber: 36, atomicWeight: 83.798, massNumber: 84 },
        { name: "Rubidium", symbol: "Rb", atomicNumber: 37, atomicWeight: 85.468, massNumber: 85 },
        { name: "Strontium", symbol: "Sr", atomicNumber: 38, atomicWeight: 87.62, massNumber: 88 },
        { name: "Yttrium", symbol: "Y", atomicNumber: 39, atomicWeight: 88.906, massNumber: 89 },
        { name: "Zirconium", symbol: "Zr", atomicNumber: 40, atomicWeight: 91.224, massNumber: 90 },
        { name: "Niobium", symbol: "Nb", atomicNumber: 41, atomicWeight: 92.906, massNumber: 93 },
        { name: "Molybdenum", symbol: "Mo", atomicNumber: 42, atomicWeight: 95.96, massNumber: 98 },
        { name: "Technetium", symbol: "Tc", atomicNumber: 43, atomicWeight: 98, massNumber: 98 },
        { name: "Ruthenium", symbol: "Ru", atomicNumber: 44, atomicWeight: 101.07, massNumber: 102 },
        { name: "Rhodium", symbol: "Rh", atomicNumber: 45, atomicWeight: 102.906, massNumber: 103 },
        { name: "Palladium", symbol: "Pd", atomicNumber: 46, atomicWeight: 106.42, massNumber: 106 },
        { name: "Silver", symbol: "Ag", atomicNumber: 47, atomicWeight: 107.868, massNumber: 107 },
        { name: "Cadmium", symbol: "Cd", atomicNumber: 48, atomicWeight: 112.414, massNumber: 112 },
        { name: "Indium", symbol: "In", atomicNumber: 49, atomicWeight: 114.818, massNumber: 115 },
        { name: "Tin", symbol: "Sn", atomicNumber: 50, atomicWeight: 118.710, massNumber: 120 },
        { name: "Antimony", symbol: "Sb", atomicNumber: 51, atomicWeight: 121.760, massNumber: 121 },
        { name: "Tellurium", symbol: "Te", atomicNumber: 52, atomicWeight: 127.60, massNumber: 130 },
        { name: "Iodine", symbol: "I", atomicNumber: 53, atomicWeight: 126.904, massNumber: 127 },
        { name: "Xenon", symbol: "Xe", atomicNumber: 54, atomicWeight: 131.293, massNumber: 132 },
        { name: "Cesium", symbol: "Cs", atomicNumber: 55, atomicWeight: 132.905, massNumber: 133 },
        { name: "Barium", symbol: "Ba", atomicNumber: 56, atomicWeight: 137.327, massNumber: 138 },
        { name: "Lanthanum", symbol: "La", atomicNumber: 57, atomicWeight: 138.906, massNumber: 139 },
        { name: "Cerium", symbol: "Ce", atomicNumber: 58, atomicWeight: 140.116, massNumber: 140 },
        { name: "Praseodymium", symbol: "Pr", atomicNumber: 59, atomicWeight: 140.908, massNumber: 141 },
        { name: "Neodymium", symbol: "Nd", atomicNumber: 60, atomicWeight: 144.242, massNumber: 142 },
        { name: "Promethium", symbol: "Pm", atomicNumber: 61, atomicWeight: 145, massNumber: 145 },
        { name: "Samarium", symbol: "Sm", atomicNumber: 62, atomicWeight: 150.36, massNumber: 152 },
        { name: "Europium", symbol: "Eu", atomicNumber: 63, atomicWeight: 151.964, massNumber: 153 },
        { name: "Gadolinium", symbol: "Gd", atomicNumber: 64, atomicWeight: 157.25, massNumber: 158 },
        { name: "Terbium", symbol: "Tb", atomicNumber: 65, atomicWeight: 158.925, massNumber: 159 },
        { name: "Dysprosium", symbol: "Dy", atomicNumber: 66, atomicWeight: 162.500, massNumber: 164 },
        { name: "Holmium", symbol: "Ho", atomicNumber: 67, atomicWeight: 164.930, massNumber: 165 },
        { name: "Erbium", symbol: "Er", atomicNumber: 68, atomicWeight: 167.259, massNumber: 166 },
        { name: "Thulium", symbol: "Tm", atomicNumber: 69, atomicWeight: 168.934, massNumber: 169 },
        { name: "Ytterbium", symbol: "Yb", atomicNumber: 70, atomicWeight: 173.045, massNumber: 174 },
        { name: "Lutetium", symbol: "Lu", atomicNumber: 71, atomicWeight: 174.967, massNumber: 175 },
        { name: "Hafnium", symbol: "Hf", atomicNumber: 72, atomicWeight: 178.49, massNumber: 180 },
        { name: "Tantalum", symbol: "Ta", atomicNumber: 73, atomicWeight: 180.948, massNumber: 181 },
        { name: "Tungsten", symbol: "W", atomicNumber: 74, atomicWeight: 183.84, massNumber: 184 },
        { name: "Rhenium", symbol: "Re", atomicNumber: 75, atomicWeight: 186.207, massNumber: 187 },
        { name: "Osmium", symbol: "Os", atomicNumber: 76, atomicWeight: 190.23, massNumber: 192 },
        { name: "Iridium", symbol: "Ir", atomicNumber: 77, atomicWeight: 192.217, massNumber: 193 },
        { name: "Platinum", symbol: "Pt", atomicNumber: 78, atomicWeight: 195.084, massNumber: 195 },
        { name: "Gold", symbol: "Au", atomicNumber: 79, atomicWeight: 196.967, massNumber: 197 },
        { name: "Mercury", symbol: "Hg", atomicNumber: 80, atomicWeight: 200.592, massNumber: 202 },
        { name: "Thallium", symbol: "Tl", atomicNumber: 81, atomicWeight: 204.383, massNumber: 205 },
        { name: "Lead", symbol: "Pb", atomicNumber: 82, atomicWeight: 207.2, massNumber: 208 },
        { name: "Bismuth", symbol: "Bi", atomicNumber: 83, atomicWeight: 208.980, massNumber: 209 },
        { name: "Polonium", symbol: "Po", atomicNumber: 84, atomicWeight: 209, massNumber: 209 },
        { name: "Astatine", symbol: "At", atomicNumber: 85, atomicWeight: 210, massNumber: 210 },
        { name: "Radon", symbol: "Rn", atomicNumber: 86, atomicWeight: 222, massNumber: 222 },
        { name: "Francium", symbol: "Fr", atomicNumber: 87, atomicWeight: 223, massNumber: 223 },
        { name: "Radium", symbol: "Ra", atomicNumber: 88, atomicWeight: 226, massNumber: 226 },
        { name: "Actinium", symbol: "Ac", atomicNumber: 89, atomicWeight: 227, massNumber: 227 },
        { name: "Thorium", symbol: "Th", atomicNumber: 90, atomicWeight: 232.038, massNumber: 232 },
        { name: "Protactinium", symbol: "Pa", atomicNumber: 91, atomicWeight: 231.036, massNumber: 231 },
        { name: "Uranium", symbol: "U", atomicNumber: 92, atomicWeight: 238.029, massNumber: 238 },
        { name: "Neptunium", symbol: "Np", atomicNumber: 93, atomicWeight: 237, massNumber: 237 },
        { name: "Plutonium", symbol: "Pu", atomicNumber: 94, atomicWeight: 244, massNumber: 244 },
        { name: "Americium", symbol: "Am", atomicNumber: 95, atomicWeight: 243, massNumber: 243 },
        { name: "Curium", symbol: "Cm", atomicNumber: 96, atomicWeight: 247, massNumber: 247 },
        { name: "Berkelium", symbol: "Bk", atomicNumber: 97, atomicWeight: 247, massNumber: 247 },
        { name: "Californium", symbol: "Cf", atomicNumber: 98, atomicWeight: 251, massNumber: 251 },
        { name: "Einsteinium", symbol: "Es", atomicNumber: 99, atomicWeight: 252, massNumber: 252 },
        { name: "Fermium", symbol: "Fm", atomicNumber: 100, atomicWeight: 257, massNumber: 257 },
        { name: "Mendelevium", symbol: "Md", atomicNumber: 101, atomicWeight: 258, massNumber: 258 },
        { name: "Nobelium", symbol: "No", atomicNumber: 102, atomicWeight: 259, massNumber: 259 },
        { name: "Lawrencium", symbol: "Lr", atomicNumber: 103, atomicWeight: 262, massNumber: 262 },
        { name: "Rutherfordium", symbol: "Rf", atomicNumber: 104, atomicWeight: 267, massNumber: 267 },
        { name: "Dubnium", symbol: "Db", atomicNumber: 105, atomicWeight: 268, massNumber: 268 },
        { name: "Seaborgium", symbol: "Sg", atomicNumber: 106, atomicWeight: 271, massNumber: 271 },
        { name: "Bohrium", symbol: "Bh", atomicNumber: 107, atomicWeight: 272, massNumber: 272 },
        { name: "Hassium", symbol: "Hs", atomicNumber: 108, atomicWeight: 277, massNumber: 277 },
        { name: "Meitnerium", symbol: "Mt", atomicNumber: 109, atomicWeight: 278, massNumber: 278 },
        { name: "Darmstadtium", symbol: "Ds", atomicNumber: 110, atomicWeight: 281, massNumber: 281 },
        { name: "Roentgenium", symbol: "Rg", atomicNumber: 111, atomicWeight: 282, massNumber: 282 },
        { name: "Copernicium", symbol: "Cn", atomicNumber: 112, atomicWeight: 285, massNumber: 285 },
        { name: "Nihonium", symbol: "Nh", atomicNumber: 113, atomicWeight: 286, massNumber: 286 },
        { name: "Flerovium", symbol: "Fl", atomicNumber: 114, atomicWeight: 289, massNumber: 289 },
        { name: "Moscovium", symbol: "Mc", atomicNumber: 115, atomicWeight: 290, massNumber: 290 },
        { name: "Livermorium", symbol: "Lv", atomicNumber: 116, atomicWeight: 293, massNumber: 293 },
        { name: "Tennessine", symbol: "Ts", atomicNumber: 117, atomicWeight: 294, massNumber: 294 },
        { name: "Oganesson", symbol: "Og", atomicNumber: 118, atomicWeight: 294, massNumber: 294 }
    ];
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    background(0);
    nucleus = new Nucleus(numElectrons, MIN_NUCLEUS_RADIUS, MAX_NUCLEUS_RADIUS);

    // Create the input field for electrons
    electronInput = createInput(str(numElectrons));
    electronInput.position(20, 20);

    // Create the button for resetting electrons
    resetButton = createButton('Reset Electrons');
    resetButton.position(electronInput.x + electronInput.width + 10, 20);
    resetButton.mousePressed(resetElectrons);

    // Electric Field UI
    let uiY = 60; // Position below electron controls
    electricFieldInput = createInput(str(electricFieldStrength));
    electricFieldInput.position(20, uiY);

    electricFieldToggle = createButton('Toggle Electric Field');
    electricFieldToggle.position(electricFieldInput.x + electricFieldInput.width + 10, uiY);
    electricFieldToggle.mousePressed(toggleElectricField);

    resetElectrons();
}

// Toggle Electric Field Function
function toggleElectricField() {
  let rawInputStrength = parseFloat(electricFieldInput.value());
    fieldActive = !fieldActive;
    if (fieldActive) {
        if (!isNaN(rawInputStrength)) {
            let scaledStrength = rawInputStrength / 1000;     
            electricFieldStrength = constrain(scaledStrength, -MAX_EFFECTIVE_ELECTRIC_FIELD_STRENGTH, MAX_EFFECTIVE_ELECTRIC_FIELD_STRENGTH);
        } else {
            electricFieldStrength = 0; // Default to 0 if invalid input
        }
        electricFieldToggle.html('Electric Field ON');
    } else {
        electricFieldStrength = 0; // Turn off the effect by setting strength to 0
        electricFieldToggle.html('Electric Field OFF');
    }
}


function draw() {
    background(0);
    nucleus.position.set(width / 2, height / 2);
    nucleus.show();

    // Apply attraction force to each electron
    for (let electron of electrons) {
        let attractionForce = nucleus.attract(electron);
        electron.applyForce(attractionForce);
    }

    // Apply repulsion force between each pair of electrons
    for (let i = 0; i < electrons.length; i++) {
        for (let j = i + 1; j < electrons.length; j++) {
            let repulsionForce = electrons[i].repel(electrons[j]);
            electrons[i].applyForce(repulsionForce);
            // Apply the opposite force to the other electron (Newton's third law)
            repulsionForce.mult(-1);
            electrons[j].applyForce(repulsionForce);
        }
    }

    // Directly adjust electron speed based on electric field strength
    if (fieldActive && electricFieldStrength !== 0) {
        for (let electron of electrons) {
            let currentSpeed = electron.velocity.mag();
            // The electricFieldStrength is already scaled (input/1000) and constrained (-1 to 1)
            // The 0.005 multiplier determines how much effect *this scaled* strength has
            let speedChange = electricFieldStrength * 0.005;
            let newSpeed = currentSpeed + speedChange;

            // Constrain speed to prevent it from going too low or too high
            newSpeed = constrain(newSpeed, 0.1, 8); 

            // Set the new magnitude while preserving the current direction
            electron.velocity.setMag(newSpeed);
        }
    }

    // Update and show electrons
    for (let electron of electrons) {
        electron.update();
        electron.show();
        electron.showTrail(); // Draw the trail
    }

    // Display element information
    fill(255);
    textSize(16);
    textAlign(LEFT);
    let elementIndex = numElectrons - 1;
    if (elementIndex >= 0 && elementIndex < elementData.length) {
        text("Element: " + elementData[elementIndex].name, 20, height - 80);
        text("Atomic Number: " + elementData[elementIndex].atomicNumber, 20, height - 60);
        text("Approx. Mass Number: " + elementData[elementIndex].massNumber, 20, height - 40);
        text("Atomic Weight: " + elementData[elementIndex].atomicWeight.toFixed(3), 20, height - 20);
    } else if (numElectrons > 0) {
        text("Element information not available for this number of electrons.", 20, height - 80);
    }

    // Display warning message
    fill(255, 0, 0);
    textSize(18);
    text(warningMessage, 20, 140);

    // Display Electric Field status
    fill(255);
    textSize(16);
    text("Electric Field: " + (fieldActive ? "ON" : "OFF"), 20, 120);
    if (fieldActive) {
        // Display the actual effective strength
        text("Strength: " + electricFieldStrength + " (Field Strength is divided by 1000 to prevent electrons from going haywire)", 20, 180);
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function resetElectrons() {
    electrons = [];
    let desiredElectrons = parseInt(electronInput.value());
    warningMessage = ""; // Clear any previous warning

    if (isNaN(desiredElectrons) || desiredElectrons < 1) {
        numElectrons = 1; // Ensure at least one electron
        electronInput.value(1); // Update the input field
    } else if (desiredElectrons > MAX_ELECTRONS) {
        numElectrons = MAX_ELECTRONS; // Limit to the maximum
        electronInput.value(MAX_ELECTRONS); // Update the input field
        warningMessage = "Warning: Maximum number of electrons is 118.";
    } else {
        numElectrons = desiredElectrons;
    }

    nucleus.setAtomicNumber(numElectrons);

    for (let i = 0; i < numElectrons; i++) {
        let radiusIndex;
        let shellNumber;

        if (i < 2) {
            radiusIndex = 0; // First shell (n=1) - up to 2 electrons
            shellNumber = 1;
        } else if (i < 10) {
            radiusIndex = 1; // Second shell (n=2) - up to 8 electrons (2 + 6)
            shellNumber = 2;
        } else if (i < 28) {
            radiusIndex = 2; // Third shell (n=3) - up to 18 electrons (2 + 6 + 10)
            shellNumber = 3;
        } else if (i < 60) {
            radiusIndex = 3; // Fourth shell (n=4) - up to 32 electrons (2 + 6 + 10 + 14)
            shellNumber = 4;
        } else {
            radiusIndex = 4; // Fifth shell (n=5)
            shellNumber = 5;
        }

  
        radiusIndex = min(radiusIndex, initialOrbitRadii.length - 1);
        let radius = initialOrbitRadii[radiusIndex];
        let angle = random(TWO_PI);
        let initialX = nucleus.position.x + radius * cos(angle);
        let initialY = nucleus.position.y + radius * sin(angle);
        let initialPosition = createVector(initialX, initialY);
        electrons.push(new Electron(initialPosition, shellNumber));
    }
}