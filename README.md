# 3D Printer Bed Mesh Visualizer

A modern web application for visualizing 3D printer bed mesh data with an interactive 3D representation. Built with React, Three.js, and Tailwind CSS.

![Bed Mesh Visualizer](https://images.unsplash.com/photo-1631468182740-00d6853d6a66?auto=format&fit=crop&q=80&w=1200&h=600)

## Features

- 🎯 Interactive 3D visualization of bed mesh data
- 📊 Real-time data point inspection
- 🎨 Color-coded height mapping
- 🔄 Multiple viewing angles (Isometric, Top, Side)
- 📱 Responsive design with fullscreen mode
- 🎮 Interactive controls with helpful overlay
- 📋 Easy data input with clipboard support

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/bed-mesh-visualizer.git
cd bed-mesh-visualizer
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

## Usage

1. Navigate to the Input page
2. Paste your bed mesh data in the following format:
```
+1.291 +0.767 +0.205 -0.436 -1.064
+1.300 +0.731 +0.139 -0.506 -1.143
+1.204 +0.620 -0.003 -0.628 -1.270
```

3. Click "Visualize" to see the 3D representation
4. Use the interactive controls:
   - Left click + drag to rotate
   - Right click + drag to pan
   - Scroll to zoom
   - Click on points to see exact values

## Tech Stack

- ⚛️ React
- 🎨 Tailwind CSS
- 🎮 Three.js with React Three Fiber
- 🛠️ TypeScript
- 📦 Vite

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) for 3D rendering
- [Tailwind CSS](https://tailwindcss.com) for styling
- [Lucide Icons](https://lucide.dev) for beautiful icons