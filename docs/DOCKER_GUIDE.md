# UI Docker Deployment & Testing Guide

This guide explains how to build, test, and publish the `VegaEdge` UI using Docker.

## 1. Credentials Setup (GitHub Actions)

To allow GitHub to push the image to Docker Hub, ensure the following secrets are added to your **VegaEdge** GitHub repository:

| Secret Name                 | Description                                                       |
| :-------------------------- | :---------------------------------------------------------------- |
| `DOCKER_USERNAME`           | Your Docker Hub ID (e.g., `vegamarket`)                           |
| `DOCKER_PASSWORD`           | Docker Hub Personal Access Token (PAT)                            |
| `VITE_BACKEND_API_BASE_URL` | (Optional) Backend API URL. Default: `https://api.vegagreeks.com` |

## 2. Local Testing

### Build the Image

```bash
docker build -t vega-ui:local .
```

### Run the Image

```bash
docker run -p 8080:80 vega-ui:local
```

Access the UI at `http://localhost:8080`.

## 3. How the Build Works

- **Multi-Stage Build**:
  - **Stage 1**: Uses Node.js to install dependencies and build the optimized production bundle (`dist` folder).
  - **Stage 2**: Uses Nginx to serve the static files.
- **SPA Routing**: Nginx is configured to redirect all non-file requests to `index.html`, allowing React Router to handle page navigation.
- **Compression**: Nginx is configured with Gzip compression to minimize data usage and improve load times.
