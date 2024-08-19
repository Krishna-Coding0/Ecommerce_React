# E-Commerce Website

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Components](#components)
- [State Management](#state-management)
- [API Integration](#api-integration)
- [Authentication](#authentication)
- [Cart Functionality](#cart-functionality)
- [Product Search](#product-search)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [Developer Information](#developer)

## Overview

A modern e-commerce website built using **React.js**. The website offers users a seamless shopping experience with features like product browsing, cart management, user authentication, and checkout.

## Features

- **Product Listing**: Browse and search for products.
- **Product Details**: View detailed information about each product.
- **Cart Management**: Add, remove, and update product quantities in the cart.
- **User Authentication**: Sign up, log in, and log out functionality.
- **Checkout**: Secure checkout process.
- **Responsive Design**: Optimized for both desktop and mobile devices.

## Tech Stack

- **Frontend**: React.js, Redux, React Router, React Query
- **Backend**: Firebase Firestore, Firebase Authentication
- **Styling**: CSS & Bootstrap
- **Build Tool**: Vite
- **Version Control**: Git

## Installation

### Prerequisites

- Node.js and npm installed on your machine.

### Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/Krishna-Coding0/Ecommerce_React
   ```

2. Navigate to the project directory

   ```bash
   cd Ecommerce_React
   ```

3. Install dependencies (Opne Terminal/Command Prompt Execute below Command)

   ```bash
   npm install
   ```

4. Start the development server

   ```bash
   npm run dev
   ```

## Usage

After installation, the website can be accessed locally via http://localhost:3000.

### Available Scripts

- npm run dev: Starts the development server.
- npm run build: Builds the app for production.
- npm run lint: Lints the codebase.

## Components

### Navbar

- Renders the website's header, including the logo, navigation links, and search bar.

### Home

- Displays a list of products fetched from the Firestore database.

### Shop

- A reusable component that displays individual product details and an "Add to Cart" button.

### Cart

- Displays the items added to the cart, allows quantity updates, and provides a checkout button.

### Auth

- Handles user authentication (login, signup, and logout).


## State Management

- State is managed using Redux Toolkit for global state and React Query for data fetching.

## API Integration

### Firebase Firestore

- Used to fetch and store product data, as well as manage cart items.

### Firebase Authentication

- Used for user sign-up, login, and session management.

### Authentication

- User authentication is managed through Firebase Authentication, providing secure access to user-specific features such as the cart and checkout.

### Cart Functionality

- The cart is fully integrated with the product list and product details components.

- Users can add, remove, and update product quantities.
- The cart state is persisted using Redux.

## Product Search

- The search functionality is integrated into the Navbar, allowing users to search for products by name.
- The search results are displayed dynamically as the user types.

## Deployment

To deploy the website:

1. Build the application

    ```bash
        npm run build
    ```

2. Deploy the dist folder to your hosting provider (e.g., Netlify, Vercel).

## Contributing

Contributions are welcome! Please feel free to submit issues, fork the repository, and make pull requests.Reach out if you want to contribute or need any guidance.

### Developer

- **Name**: Krishna Kumar Singh
- **Email**: <krishnacodinglife@gmail.com>
- **GitHub**: [github.com/Krishna-Coding0](https://github.com/Krishna-Coding0)