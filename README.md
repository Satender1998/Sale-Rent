# Sale&Rent - Property Listing Platform

Sale&Rent is a MERN stack web application designed to facilitate property listing for both sale and rent. Users can explore property details, contact sellers, and manage their property listings.

## Deployed Link

[Visit Sale&Rent](https://google.com)

# Table of Contents

1. [Sale&Rent - Property Listing Platform](#salrent---property-listing-platform)
   1.1. [Deployed Link](#deployed-link)
2. [Technologies Used](#technologies-used)
   2.1. [Frontend](#frontend)
   2.2. [Backend](#backend)
   2.3. [User Authentication](#user-authentication)
   2.4. [Deployment Technology](#deployment-technology)
3. [Setting Up the Application](#setting-up-the-application)
   3.1. [Prerequisites](#prerequisites)
   3.2. [Steps to Run Locally](#steps-to-run-locally)
      - 3.2.1. [Fork the Repository](#1-fork-the-repository)
      - 3.2.2. [Clone the Repository](#2-clone-the-repository)
      - 3.2.3. [Move to Frontend Folder](#3-move-to-frontend-folder)
      - 3.2.4. [Install Dependencies for Frontend](#4-install-dependencies-for-frontend)
      - 3.2.5. [Run the Frontend Project](#5-run-the-frontend-project)
      - 3.2.6. [Move to Backend Folder](#6-move-to-backend-folder)
      - 3.2.7. [Install Dependencies for Backend](#7-install-dependencies-for-backend)
      - 3.2.8. [Run the Backend Project](#8-run-the-backend-project)
   3.3. [Setting up MongoDB Atlas](#setting-up-mongodb-atlas)
      - 3.3.1. [Create an Account](#1-create-an-account)
      - 3.3.2. [Create a New Cluster](#2-create-a-new-cluster)
      - 3.3.3. [Whitelist IP Address](#3-whitelist-ip-address)
      - 3.3.4. [Create a Database User](#4-create-a-database-user)
      - 3.3.5. [Connect to Your Cluster](#5-connect-to-your-cluster)
4. [Summary](#summary)
   4.1. [Features](#features)


## Technologies Used

### Frontend
- **React**: JavaScript library for building user interfaces.
- **HTML/CSS**: Basic building blocks for web development.
- **JavaScript**: Programming language for enhancing user interactivity.

### Backend
- **Express**: Fast, unopinionated, minimalist web framework for Node.js.
- **Node.js**: JavaScript runtime for server-side development.
- **MongoDB**: NoSQL database for storing application data.

### User Authentication
- **Firebase**

### Deployment Technology
- **Frontend**: [Vercel](https://vercel.com)
- **Backend**: [Render](https://render.com)

## Setting Up the Application

### Prerequisites
- Node.js installed on your machine.

### Steps to Run Locally

1. **Fork the Repository**

   Click on the 'Fork' button on the top right corner of this repository's page. This will create a copy of the repository in your GitHub account.

2. **Clone the Repository**

   ```bash
   git clone https://github.com/Satender1998/Sale-Rent





### Steps to run locally

1. **Fork the Repository for Frontend**

   Click on the 'Fork' button on the top right corner of this repository's page. This will create a copy of the repository in your GitHub account.

2. **Clone the Repository**

   ```bash
   git clone https://github.com/Satender1998/Sale-Rent.git

3. **Move to folder**

   ```bash
   cd final project upgrade
   cd Client

4. **Install Dependencies**

   ```bash
   npm install

5. **Run the Project**

   ```bash
   npm start

The project will now be running locally on http://localhost:3000.

1. **For Backend**


2. **Move to folder**

   ```bash
   cd final project upgrade

3. **Install Dependencies**

   ```bash
   npm install

4. **Run the Project**

   ```bash
   npm start

The project will now be running locally on http://localhost:3000.



## Setting up MongoDB Atlas

MongoDB Atlas is a cloud-based database service that allows you to easily set up, manage, and scale MongoDB databases. Follow these steps to set up MongoDB Atlas for your project.

### Step 1: Create an Account

1. Go to the [MongoDB Atlas website](https://www.mongodb.com/cloud/atlas).
2. Click on the "Start Free" button.
3. Fill out the required information to create your MongoDB Atlas account.

### Step 2: Create a New Cluster

1. After signing in, click on the "Build a Cluster" button.
2. Choose a cloud provider, region, and cluster tier. You can choose the free tier (M0) for testing and development purposes.
3. Click on the "Create Cluster" button to create your cluster. This may take a few minutes.

### Step 3: Whitelist IP Address

1. In the left sidebar, click on "Network Access" under the Security section.
2. Click on the "Add IP Address" button.
3. Add your current IP address to the IP Access List to allow connections from your location.
4. You can also choose to allow access from anywhere (`0.0.0.0/0`), but this is not recommended for production environments due to security reasons.

### Step 4: Create a Database User

1. In the left sidebar, click on "Database Access" under the Security section.
2. Click on the "Add New Database User" button.
3. Enter a username and password for your database user.
4. Assign necessary roles to the user. For example, you can give it the `readWrite` role for a specific database.
5. Click on the "Add User" button to create the user.

### Step 5: Connect to Your Cluster

1. In the left sidebar, click on "Clusters" under the Data Storage section.
2. Click on the "Connect" button of your cluster.
3. Choose "Connect your application" to get your connection string.
4. Replace `<password>` with the password of the database user you created.
5. You can customize the connection string based on your programming language and driver.

**Example Connection String for Node.js using MongoDB Native Driver:**

```mongodb
mongodb+srv://<username>:<password>@clustername.mongodb.net/test?retryWrites=true&w=majority

```
Create documents with name 'users' and 'games'


# Sale&Rent - Property Listing Platform

## Summary

Sale&Rent is a comprehensive and user-friendly platform designed to streamline the process of connecting property sellers with potential buyers or renters. With a seamless and intuitive user interface, the platform serves as a digital bridge, facilitating interactions between users engaged in property transactions. Whether you're a property seller, buyer, or someone looking to rent, Sale&Rent provides a centralized hub for property-related activities. The user experience is carefully crafted to ensure smooth navigation and efficient engagement with property listings.

### Features:

1. **List a Property for Rent**
   Sale&Rent empowers users to effortlessly list their properties for rent. The platform ensures a straightforward process for property owners to showcase rental opportunities, providing a valuable resource for those seeking rental accommodations.

2. **List a Property for Sale**
   For users looking to sell their properties, Sale&Rent offers a convenient avenue to list and market real estate. Sellers can showcase property details and attract potential buyers in a visually appealing manner, enhancing the chances of successful transactions.

3. **List a Property for Both Rent and Sale**
   Recognizing the diverse needs of users, Sale&Rent allows property owners to list their properties for both rent and sale. This flexibility caters to a broader audience, accommodating those with dual intentions or changing circumstances.

4. **Users Can Contact Sellers**
   The platform facilitates direct communication between users and property sellers. Interested individuals can easily reach out to property owners or agents for inquiries, negotiations, or to express interest in a particular listing.

5. **Users Can View All Property Details**
   Sale&Rent provides a comprehensive view of property details for users exploring the platform. Detailed information, including property specifications, images, and additional features, empowers potential renters or buyers to make informed decisions.

6. **Admins Can Update and Edit Property Listings**
   Administrators of the Sale&Rent platform have the authority to manage property listings efficiently. They can update and edit existing listings, ensuring that the information remains accurate and up-to-date for users.

7. **Admins Can Delete Property Listings**
   To maintain the integrity of the platform, administrators can remove outdated or irrelevant property listings. This feature ensures that users encounter reliable and relevant information when exploring properties on Sale&Rent.

Sale&Rent strives to create a dynamic and inclusive environment, fostering connections within the real estate market. Whether you're a property seeker or seller, the platform's user-centric design and robust features contribute to a positive and effective property transaction experience.
