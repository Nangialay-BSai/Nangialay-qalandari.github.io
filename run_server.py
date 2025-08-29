#!/usr/bin/env python3
"""
Portfolio Backend Server
Run this script to start the Flask backend server
"""

import os
import sys
from app import app, init_db

def main():
    print("Starting Portfolio Backend Server...")
    print("Initializing database...")
    
    # Initialize database
    init_db()
    print("Database initialized successfully!")
    
    print("\nServer starting on http://localhost:5000")
    print("API endpoints available:")
    print("   - POST /api/signup - User registration")
    print("   - POST /api/login - User authentication") 
    print("   - POST /api/contact - Contact form submissions")
    print("   - POST /api/projects - Add new projects")
    print("   - GET /api/projects - Get all projects")
    print("   - GET /api/health - Health check")
    
    print("\nTo stop the server, press Ctrl+C")
    print("=" * 50)
    
    try:
        app.run(debug=True, host='0.0.0.0', port=5000)
    except KeyboardInterrupt:
        print("\n\nServer stopped by user")
        sys.exit(0)
    except Exception as e:
        print(f"\nServer error: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()