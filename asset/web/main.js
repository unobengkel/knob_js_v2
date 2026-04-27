/**
 * Main Web Logic
 * Initializes the Knob component and handles UI updates
 */

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('knobCanvas');
    const display = document.getElementById('valueDisplay');

    // Initialize the Knob
    const myKnob = new Knob(canvas, {
        initialValue: 65,
        onValueChange: (newValue) => {
            // Update the display when the knob turns
            display.innerText = Math.round(newValue) + '%';
        }
    });

    // Set initial display
    display.innerText = Math.round(myKnob.getValue()) + '%';
});
