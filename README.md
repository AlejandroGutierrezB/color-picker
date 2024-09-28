# Color Picker Tool

This project is a canvas-based color dropper tool built with **React** and **Vite**. The tool allows users to select colors from a canvas, displaying the hex code of the color and magnifying the area being hovered over.

## Features

- **Canvas Rendering**: Handles large canvases (up to 4000x4000 pixels or 16MB).
- **Color Dropper Tool**: Lets users hover over the canvas to pick a color.
- **Dynamic Circle**: A circle dynamically displays the hex code of the color being hovered over.
  - The circle’s border changes to the hovered color.
  - The circle magnifies the area under the cursor.
- **Typescript**: The entire project is written in **Typescript** for type safety and better code maintainability.

## Demo

You can try the deployed version of the app here: [Color Picker App](https://color-picker-one-chi.vercel.app/)

## Getting Started

### Prerequisites

- Node.js (>= 14.x.x)
- npm (>= 6.x.x)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/color-picker-app.git
   ```

2. Navigate to the project directory:

   ```bash
   cd color-picker-app
   ```

3. Install the dependencies:
   ```bash
   npm install
   ```

### Running the Development Server

To start the development server:

```bash
npm run dev
```
