# Car Collision Simulation

A simple browser-based simulation showing what happens when two cars collide. Built with plain HTML, CSS and JavaScript using the Canvas API. The simulation demonstrates conservation of momentum and kinetic energy, and lets you experiment with restitution (bounciness), mass and speed.

## Files
- `index.html` - Main page and UI
- `styles.css` - Visual styles
- `simulation.js` - Simulation logic and rendering

## How to run
1. Open `index.html` in your web browser (double-click or use `File -> Open`).
2. Adjust the sliders for Car 1 and Car 2 (speed in km/h, mass in kg).
3. Optionally adjust the `Restitution` slider (0 = perfectly inelastic, 1 = perfectly elastic).
4. Click **Start Simulation** to run. Use **Reset** to return to initial positions.

## Controls
- Speed sliders: sets the initial speed of each car in km/h
- Mass sliders: sets the mass of each car in kilograms
- Restitution: controls collision bounciness (0 to 1)
- Start/Stop: begin or pause the animation
- Reset: reset the simulation

## Physics information displayed
- Per-car velocity (before and after)
- Per-car momentum and kinetic energy (before and after)
- Total momentum and total kinetic energy (before and after)
- Closing speed
- Center of mass velocity
- Kinetic energy lost during collision

## Notes
- The simulation uses a simplified 1D collision model along the road centerline.
- Velocities on the canvas are scaled for animation; the displayed physics values are converted to m/s where appropriate.
- Restitution (e) is applied in the collision response so you can test elastic and inelastic cases.

## Publishing
To host this simulation using GitHub Pages:
1. Go to your repository's Settings -> Pages
2. Select the `main` branch and `/ (root)` folder, Save
3. The site will be available at `https://<your-username>.github.io/CarCollision/` once GitHub Pages finishes building.

## License
This project is provided as-is for learning and demonstration purposes. Feel free to modify and reuse.
