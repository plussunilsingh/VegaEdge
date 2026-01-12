# Deployment Guide for VegaEdge Frontend

This guide explains how to deploy your React application to Vercel for free, map a custom domain, and ensure strong compression is enabled.

## Prerequisites

- A [Vercel account](https://vercel.com/signup) (Free "Hobby" plan is sufficient).
- Your code pushed to a Git repository (GitHub, GitLab, or Bitbucket).

## 1. Deployment to Vercel

The easiest way to deploy is by connecting your Git repository to Vercel.

1.  **Log in** to your Vercel dashboard.
2.  Click **"Add New..."** -> **"Project"**.
3.  **Import** your `VegaEdge` repository.
4.  **Configure Project**:
    - **Framework Preset**: Vercel should automatically detect **Vite**. If not, select it manually.
    - **Root Directory**: `./` (default).
    - **Build Command**: `vite build` (default).
    - **Output Directory**: `dist` (default).
    - **Environment Variables**: You shouldn't need any for the frontend itself, as the backend URL is configured in `vercel.json` via rewrites.
5.  Click **"Deploy"**.

Vercel will build your project and deploy it. Once finished, you will get a live URL (e.g., `vega-edge.vercel.app`).

## 2. Custom Domain Mapping

Vercel allows you to map a custom domain for free.

1.  Go to your **Project Dashboard** on Vercel.
2.  Click on the **"Settings"** tab.
3.  Select **"Domains"** from the left sidebar.
4.  Enter your domain name (e.g., `www.yourdomain.com`) in the input field and click **"Add"**.
5.  **Configure DNS**: Vercel will provide you with DNS records (usually an **A record** or **CNAME record**) that you need to add to your domain registrar's settings (e.g., GoDaddy, Namecheap, Cloudflare).
    - **A Record**: Point `@` to `76.76.21.21`.
    - **CNAME Record**: Point `www` to `cname.vercel-dns.com`.
6.  Wait for propagation (usually a few minutes to an hour). Vercel will automatically generate an SSL certificate for HTTPS.

## 3. Compression & Optimization

We have implemented "strong compression" in two ways:

1.  **Build-Time Compression**: We added `vite-plugin-compression` to your `vite.config.ts`. This generates `.gz` (Gzip) and `.br` (Brotli) compressed versions of your assets during the build process.
2.  **Vercel Edge Compression**: Vercel automatically compresses responses using Brotli or Gzip at the edge, ensuring the smallest possible file size is delivered to the user's browser.

You can verify this by inspecting the "Network" tab in your browser's developer tools and checking the `Content-Encoding` header for your JS/CSS files (it should say `br` or `gzip`).

## 4. Backend Integration

Your `vercel.json` has been configured to proxy API requests to your Render backend:

```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://vegabackendserver.onrender.com/api/:path*"
    }
  ]
}
```

This means calls to `/api/auth/login` on your frontend will be securely forwarded to `https://vegabackendserver.onrender.com/api/auth/login`.
