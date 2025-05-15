# Web Scraper & Data Visualizer

This project is a **Web Scraper and Data Visualizer** application that allows users to scrape data from websites, process the data, and generate visualizations such as bar charts, pie charts, line charts, and more. The application also integrates with a chatbot to assist users in creating visualizations and saving their work.

## Features

### 1. **Web Scraping**
- Users can input a URL to scrape data from a website.
- The scraped data is displayed in a text area for review and editing.

### 2. **Data Visualization**
- Users can configure and generate visualizations from the scraped data.
- Supported chart types include:
  - Bar Chart
  - Pie Chart
  - Line Chart
  - Scatter Plot
  - Table

### 3. **Chatbot Integration**
- A chatbot assists users in creating visualizations by processing user instructions.
- The chatbot generates chart specifications and titles based on user input and scraped data.

### 4. **User Authentication**
- Integrated with Supabase for user authentication.
- Users must log in to save their chats and visualizations.

### 5. **Chat History Management**
- Users can save their chatbot interactions and visualizations to a database.
- Saved chats can be retrieved and edited later.

### 6. **Responsive Design**
- The application is fully responsive and works on various screen sizes.
- Dynamic containers ensure that content, including charts, adjusts to fit the screen.

## Technologies Used

### Frontend
- **React**: Used for building the user interface.
- **Next.js**: Framework for server-side rendering and routing.
- **Tailwind CSS**: For styling the application with a modern and responsive design.
- **TypeScript**: Ensures type safety and better code maintainability.

### Backend
- **Supabase**: Used for authentication and database management.
- **Node.js**: Backend runtime for API endpoints.
- **REST API**: Custom API endpoints for scraping, chatbot interaction, and saving data.

### Charting
- **Chart.js**: Library used for rendering visualizations.

### Other Tools
- **Fetch API**: For making HTTP requests to the backend.
- **Custom CSS**: Additional styling for specific components.

## Project Structure
