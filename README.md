# Movie Search App (TMDB + Node.js MVC)

A simple MVC application to search movies using The Movie Database (TMDB) API.

## Structure
- `app.js`: Server entry point.
- `controllers/movieController.js`: Handles API logic.
- `routes/movieRoutes.js`: Defines API endpoints.
- `movie.html`: Client-side interface.
- `.env`: Configuration.

## Setup
1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure API Key**:
   - Create a `.env` file (or edit the existing one).
   - Add your TMDB API Key:
     ```
     TMDB_API_KEY=your_actual_api_key_here
     ```

3. **Run Server**:
   ```bash
   node app.js
   ```

4. **Use App**:
   - Open your browser to `http://localhost:3000`.
   - Or open `movie.html` directly (ensure server is running for API calls).
