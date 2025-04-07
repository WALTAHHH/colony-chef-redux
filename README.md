# Colony Chef

A web-based game where you manage a colony's food resources and crew morale.

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Deployment

This project is configured for deployment on Netlify. To deploy:

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Sign up for a [Netlify account](https://www.netlify.com/) if you haven't already
3. Click "New site from Git"
4. Select your repository
5. Use the following build settings:
   - Build command: `npm run build`
   - Publish directory: `build`
6. Click "Deploy site"

Netlify will automatically deploy your site whenever you push changes to your repository.

## Project Structure

- `src/` - Source files
  - `components/` - React components
  - `data/` - Game data and configuration
  - `utils/` - Utility functions
  - `contexts/` - React context providers

## Contributing

Feel free to submit pull requests or open issues for any improvements or bug fixes. 