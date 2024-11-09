```markdown
# Tetris with Nginx

This project is a simple implementation of the classic Tetris game built with JavaScript (ES6) and served by Nginx.

## Features

- Classic Tetris gameplay:
    -  Tetrominoes falling from the top
    -  Control the tetrominoes with left, right, down, and rotate keys
    -  Game over when the blocks stack up to the top
    -  Score system

- Clean and modern UI:
    -  Minimalistic design with clear visuals
    -  Responsive layout for different screen sizes

## Technologies Used

- HTML5: Structure of the game.
- CSS3: Styling and layout.
- JavaScript (ES6): Game logic, DOM manipulation, and interactions.
- Nginx: Web server to serve the game.
```
## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/EdgarIbragimov/Tetris.git
   ```
2. Install Nginx:
   - Follow the installation instructions for your operating system.

3. Configure Nginx:
   - Create a new server block configuration file (e.g., `tetris.conf`) within your Nginx configuration directory.
   - Configure the server block to serve the game files:
      ```nginx
      server {
          listen 80;
          server_name your-domain.com;
          root /path/to/tetris-nginx;
          index index.html;

          location / {
              try_files $uri $uri/ /index.html;
          }
      }
      ```
   - Reload Nginx:
      ```bash
      sudo systemctl reload nginx
      ```

4. Access the game:
   - Open your web browser and navigate to `http://your-domain.com`.

## How to Play

- Use the following keys to control the tetrominoes:
    - Arrow Left: Move left
    - Arrow Right: Move right
    - Arrow Down: Move down
    - Space: Rotate
    - Enter: Drop tetromino
- Clear lines and achieve a high score!
