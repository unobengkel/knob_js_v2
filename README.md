# Premium 3D Knob Component (JS & CSS)

A reusable, premium-styled 3D knob component built with Vanilla JavaScript and Canvas API. This component is designed to be easily integrated into any web project as a volume control, dimmer, or any rotary input.

![Knob Preview](https://github.com/unobengkel/knob_js_v2/blob/main/preview.PNG) *(Note: Replace with your actual screenshot link)*

## Features

- **Premium Aesthetics**: Metallic finish with 3D drop shadows and realistic ridges.
- **Interactive**: Smooth rotation using mouse or touch events.
- **High DPI Support**: Renders clearly on Retina and 4K displays using Device Pixel Ratio (DPR) scaling.
- **Modular**: The core logic is encapsulated in a reusable class.
- **Lightweight**: No external dependencies (Vanilla JS and CSS).

## Installation

Simply copy the `asset/knob` folder into your project's assets directory.

```text
your-project/
├── asset/
│   └── knob/
│       ├── knob.js
│       └── knob.css
└── index.html
```

## Quick Start

### 1. Include the assets

Add the CSS in your `<head>` and the JS before the closing `</body>` tag.

```html
<link rel="stylesheet" href="asset/knob/knob.css">
<script src="asset/knob/knob.js"></script>
```

### 2. Add the Canvas element

```html
<div class="knob-container">
    <canvas id="myKnob" class="knob-canvas"></canvas>
</div>
```

### 3. Initialize the Knob

```javascript
const canvas = document.getElementById('myKnob');

const knob = new Knob(canvas, {
    initialValue: 50,
    onValueChange: (value) => {
        console.log('Current Value:', Math.round(value) + '%');
    }
});
```

## Project Structure

- `index.html`: Demo page.
- `asset/knob/`: Core component files (Reusable).
  - `knob.js`: Main logic and drawing routines.
  - `knob.css`: Essential styles for the canvas element.
- `asset/web/`: Demo-specific styling and initialization.

## Customization

You can pass an options object to the `Knob` constructor:

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `initialValue` | Number | 65 | The starting value (0-100). |
| `baseSize` | Number | 300 | The logical size of the knob in pixels. |
| `onValueChange` | Function | null | Callback function triggered when the value changes. |

## License

MIT License. Feel free to use and modify!
