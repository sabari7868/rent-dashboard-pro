🏠 Rent Dashboard App

Live Demo: https://myrent.sabaridevops.online

GitHub Repository: https://github.com/sabari7868/rent-dashboard-pro

🚀 About the Project

Rent Dashboard is a modern web application to manage and track rental properties and expenses. Built with React, TypeScript, Tailwind CSS, and shadcn-ui, it provides a fast, responsive, and user-friendly interface for landlords and tenants.

🛠 Tech Stack

Frontend: React, TypeScript, Vite, Tailwind CSS, shadcn-ui

Backend: Supabase (authentication & database)

Deployment: Docker, AWS EC2, NGINX, Let's Encrypt SSL

CI/CD: GitHub Actions, Docker Hub

⚡ Features

Add, edit, and delete rental properties

Track monthly rent and expenses

Responsive design for mobile & desktop

Dockerized for easy deployment

HTTPS support with SSL certificates

CI/CD automated deployment via GitHub Actions

📦 Installation & Running Locally
1. Clone the repository
git clone https://github.com/sabari7868/rent-dashboard-pro.git
cd rent-dashboard-pro

2. Install dependencies
npm install

3. Run locally
npm run dev


Open http://localhost:5173
 in your browser.

Note: Use your own Supabase project ID and keys. Configure them in a .env file locally; do not commit .env.

🐳 Docker Deployment (Production)
1. Build the Docker image
docker build -t sabarisurya/rent-application:latest .

2. Run the container with HTTPS
docker run -d \
  -p 80:80 \
  -p 443:443 \
  --name rent-app \
  -v /etc/letsencrypt/live/myrent.sabaridevops.online/fullchain.pem:/etc/nginx/certs/fullchain.pem \
  -v /etc/letsencrypt/live/myrent.sabaridevops.online/privkey.pem:/etc/nginx/certs/privkey.pem \
  sabarisurya/rent-application:latest


Visit https://myrent.sabaridevops.online
 to see it live.

⚙️ CI/CD Workflow

The project uses GitHub Actions to:

Build the Docker image

Push to Docker Hub

Deploy automatically to EC2

📈 Future Improvements

Add tenant login with role-based access

Integrate real-time notifications for rent updates

Add analytics dashboard for income/expenses

📄 License

This project is licensed under the MIT License.
