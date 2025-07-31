# 🌼 School Library — Gentle Book Discovery

A calm, kid-first digital library application designed to help children discover stories they'll love while allowing teachers to see completions and reflections. Built with accessibility, gentleness, and trust at its core.

## ✨ Features

### 🎯 Core Functionality
- **Gentle Discovery**: Browse books by mood (Funny, Adventure, Magical, Thinky, True Stories, Short Reads)
- **Smart Search**: Fuzzy search across titles, authors, and topics
- **Format Variety**: Support for Books, Comics, and Audiobooks
- **Surprise Me**: Random book discovery for adventurous readers
- **Personal Shelf**: Save favorites, track reading progress, and celebrate completions

### 🎨 Design Philosophy
- **Trust-Based**: No time tracking, no grading, no comparisons
- **Gentle Language**: Kind messaging throughout the experience
- **Calm Interface**: Soft colors, generous whitespace, gentle animations
- **Kid-First**: Designed specifically for young readers

### ♿ Accessibility Features
- **WCAG AA Compliant**: High contrast, proper focus states, keyboard navigation
- **Dyslexia-Friendly**: Optional OpenDyslexic font toggle
- **Screen Reader Support**: Proper ARIA labels and semantic HTML
- **Reduced Motion**: Respects user preferences for reduced motion
- **Touch-Friendly**: Minimum 44px touch targets

### 📱 Responsive Design
- **Mobile-First**: 2-6 books per row depending on screen size
- **Tablet Optimized**: 3-4 books per row on medium screens
- **Desktop Enhanced**: Up to 6 books per row on large screens
- **8px Grid System**: Consistent spacing and alignment

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd school-library
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory, ready for deployment.

## 📚 Adding Real Books

The application currently uses mock data. To add real books:

### 1. Update Book Data Structure

Edit `src/lib/data/mockBooks.ts` and replace the mock data with your real books:

```typescript
export const books: Book[] = [
  {
    id: 'unique-book-id',
    title: 'Book Title',
    author: 'Author Name',
    summary: 'A brief, engaging description...',
    coverUrl: '/covers/book-cover.jpg',
    tags: ['Adventure', 'Funny'], // Choose from available mood tags
    pages: 120,
    format: 'book', // 'book' | 'comic' | 'audiobook'
    readingLevel: 'elementary', // Optional
    isbn: '978-0000000000' // Optional
  },
  // ... more books
];
```

### 2. Add Book Covers

1. Create a `public/covers` directory
2. Add book cover images (recommended: 300x400px, JPG/PNG)
3. Name files consistently (e.g., `book-title.jpg`)
4. Update `coverUrl` in book data to match filenames

### 3. Mood Tags

Use these predefined mood tags for consistent filtering:
- `Funny` - Humorous stories and jokes
- `Adventure` - Action and exploration
- `Magical` - Fantasy and magical elements  
- `Thinky` - Educational and thought-provoking
- `True Stories` - Non-fiction and biographies
- `Short Reads` - Quick stories under 50 pages

### 4. Reading Levels (Optional)

Add reading level classification:
- `early` - Ages 4-6
- `elementary` - Ages 7-9  
- `intermediate` - Ages 10-12
- `advanced` - Ages 13+

## 🎨 Customization

### Colors and Branding

Edit `tailwind.config.js` to customize the color palette:

```javascript
theme: {
  extend: {
    colors: {
      'primary-teal': '#2dd4bf',    // Main brand color
      'accent-mango': '#fbbf24',    // Secondary accent
      'accent-mist': '#f1f5f9',     // Light background
      'warm': '#fefcfb',            // Page background
      'charcoal': '#374151',        // Text color
      'focus-blue': '#3b82f6'       // Focus indicator
    }
  }
}
```

### Typography

The app uses two font families:
- **Inter**: Body text (clean, readable)
- **Nunito**: Headings (friendly, rounded)

To change fonts, update `src/app.css`:

```css
html {
  font-family: 'YourBodyFont', sans-serif;
}

h1, h2, h3, h4, h5, h6 {
  font-family: 'YourHeadingFont', sans-serif;
}
```

### Content and Messaging

Key text content can be customized in:
- `src/routes/+page.svelte` - Landing page headline
- `src/routes/discover/+page.svelte` - Discovery page messaging
- `src/routes/myshelf/+page.svelte` - Personal shelf content
- `src/routes/finish/[id]/+page.svelte` - Completion flow

## 🚀 Deployment

**Important**: Once deployed, your website runs on the hosting platform's servers - **you don't need to keep your computer running!**

### Option 1: GitHub Pages (Automatic)

The project is already configured for GitHub Pages with automatic deployment:

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Enable GitHub Pages**
   - Go to your repository settings
   - Scroll to "Pages" section
   - Select "GitHub Actions" as source
   - The site will automatically build and deploy on every push!

3. **Your site will be live at**: `https://yourusername.github.io/school-library`

### Option 2: Manual Deployment

If you prefer manual deployment:

```bash
# Build the site
npm run build

# Deploy to GitHub Pages
npm run deploy
```

### Option 3: Other Platforms

The built static files work on any web server:
- **Netlify**: Drag and drop the `build` folder
- **Vercel**: Connect your GitHub repository
- **Traditional Hosting**: Upload `build` folder contents

### ✅ Build Status

The project is fully configured and ready to deploy:
- ✅ Static adapter configured
- ✅ SPA mode enabled for dynamic routes
- ✅ GitHub Actions workflow ready
- ✅ Build tested and working

## 🛠 Technical Stack

- **Framework**: SvelteKit with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Search**: Fuse.js for fuzzy search
- **Storage**: localStorage for session persistence
- **Accessibility**: WCAG AA compliant
- **Build**: Vite for fast development and building

## 📁 Project Structure

```
src/
├── lib/
│   ├── components/          # Reusable UI components
│   │   ├── BookCard.svelte  # Individual book display
│   │   └── SkeletonLoader.svelte # Loading states
│   ├── data/
│   │   └── mockBooks.ts     # Book data (replace with real data)
│   ├── stores/              # Svelte stores for state management
│   │   ├── books.ts         # Book data and filtering
│   │   ├── favorites.ts     # User favorites and reading progress
│   │   └── session.ts       # User session management
│   └── types.ts             # TypeScript type definitions
├── routes/                  # SvelteKit pages
│   ├── book/[id]/          # Individual book details
│   ├── complete/[id]/      # Book completion celebration
│   ├── discover/           # Main book discovery page
│   ├── finish/[id]/        # Reading completion flow
│   ├── myshelf/            # Personal library
│   ├── read/[id]/          # Reading redirect page
│   └── +page.svelte        # Landing page
└── app.css                 # Global styles and design system
```

## 🤝 Contributing

This project follows gentle, inclusive development practices:

1. **Accessibility First**: All features must be keyboard navigable and screen reader friendly
2. **Kind Language**: Use gentle, encouraging language in all user-facing text
3. **Trust-Based Design**: No features that compare, rank, or pressure users
4. **Child-Centered**: Consider the young user experience in all decisions

## 📄 License

This project is designed for educational use in schools and libraries. Please respect the gentle, non-commercial nature of the project.

## 🌟 Philosophy

> "Every child deserves to find stories that feel like them, in a space that feels safe, gentle, and encouraging."

This library application embodies trust, kindness, and the joy of discovery. It's built to nurture young readers without pressure, comparison, or judgment.