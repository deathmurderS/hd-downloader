// api/remove-bg.js
// Vercel Serverless Function untuk Remove Background

import fetch from 'node-fetch';
import FormData from 'form-data';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method not allowed',
      message: 'Only POST requests are accepted'
    });
  }

  try {
    // Get API key from environment variable
    const API_KEY = process.env.REMOVEBG_API_KEY;
    
    if (!API_KEY) {
      throw new Error('REMOVEBG_API_KEY not configured');
    }

    // Get base64 image from request body
    const { image } = req.body;
    
    if (!image) {
      return res.status(400).json({ 
        error: 'Bad request',
        message: 'Image data is required'
      });
    }

    // Prepare form data
    const formData = new FormData();
    formData.append('image_file_b64', image);
    formData.append('size', 'auto');

    // Call Remove.bg API
    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': API_KEY,
        ...formData.getHeaders()
      },
      body: formData
    });

    // Check if request was successful
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Remove.bg API error:', errorText);
      
      return res.status(response.status).json({
        error: 'Remove.bg API error',
        message: errorText
      });
    }

    // Get image buffer
    const imageBuffer = await response.buffer();

    // Return image
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Length', imageBuffer.length);
    return res.send(imageBuffer);

  } catch (error) {
    console.error('Error removing background:', error);
    
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}

// Configuration for Vercel
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb' // Max file size
    }
  }
};