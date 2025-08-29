from flask import Flask, request, jsonify, render_template_string
from flask_cors import CORS
import sqlite3
import hashlib
import jwt
import datetime
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

app = Flask(__name__)
CORS(app)
app.config['SECRET_KEY'] = 'your-secret-key-here'

# Initialize database
def init_db():
    conn = sqlite3.connect('portfolio.db')
    c = conn.cursor()
    
    # Users table
    c.execute('''CREATE TABLE IF NOT EXISTS users
                 (id INTEGER PRIMARY KEY, email TEXT UNIQUE, password TEXT, name TEXT, created_at TIMESTAMP)''')
    
    # Contact submissions table
    c.execute('''CREATE TABLE IF NOT EXISTS contacts
                 (id INTEGER PRIMARY KEY, name TEXT, email TEXT, message TEXT, created_at TIMESTAMP)''')
    
    # Projects table
    c.execute('''CREATE TABLE IF NOT EXISTS projects
                 (id INTEGER PRIMARY KEY, title TEXT, description TEXT, technologies TEXT, 
                  github_url TEXT, demo_url TEXT, created_at TIMESTAMP)''')
    
    conn.commit()
    conn.close()

# Hash password
def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

# Generate JWT token
def generate_token(user_id):
    payload = {
        'user_id': user_id,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
    }
    return jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256')

# Signup endpoint
@app.route('/api/signup', methods=['POST'])
def signup():
    try:
        data = request.get_json()
        name = data.get('name')
        email = data.get('email')
        password = data.get('password')
        
        if not all([name, email, password]):
            return jsonify({'error': 'All fields required'}), 400
        
        conn = sqlite3.connect('portfolio.db')
        c = conn.cursor()
        
        # Check if user exists
        c.execute('SELECT id FROM users WHERE email = ?', (email,))
        if c.fetchone():
            return jsonify({'error': 'User already exists'}), 400
        
        # Create user
        hashed_password = hash_password(password)
        c.execute('INSERT INTO users (name, email, password, created_at) VALUES (?, ?, ?, ?)',
                  (name, email, hashed_password, datetime.datetime.now()))
        
        user_id = c.lastrowid
        conn.commit()
        conn.close()
        
        token = generate_token(user_id)
        return jsonify({'token': token, 'message': 'User created successfully'}), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Login endpoint
@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        
        if not all([email, password]):
            return jsonify({'error': 'Email and password required'}), 400
        
        conn = sqlite3.connect('portfolio.db')
        c = conn.cursor()
        
        hashed_password = hash_password(password)
        c.execute('SELECT id, name FROM users WHERE email = ? AND password = ?', 
                  (email, hashed_password))
        user = c.fetchone()
        conn.close()
        
        if not user:
            return jsonify({'error': 'Invalid credentials'}), 401
        
        token = generate_token(user[0])
        return jsonify({'token': token, 'name': user[1], 'message': 'Login successful'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Contact form endpoint
@app.route('/api/contact', methods=['POST'])
def contact():
    try:
        data = request.get_json()
        name = data.get('name')
        email = data.get('email')
        message = data.get('message')
        
        if not all([name, email, message]):
            return jsonify({'error': 'All fields required'}), 400
        
        conn = sqlite3.connect('portfolio.db')
        c = conn.cursor()
        
        c.execute('INSERT INTO contacts (name, email, message, created_at) VALUES (?, ?, ?, ?)',
                  (name, email, message, datetime.datetime.now()))
        
        conn.commit()
        conn.close()
        
        # Send email notification (optional)
        send_email_notification(name, email, message)
        
        return jsonify({'message': 'Message sent successfully'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Project upload endpoint
@app.route('/api/projects', methods=['POST'])
def add_project():
    try:
        data = request.get_json()
        title = data.get('title')
        description = data.get('description')
        technologies = data.get('technologies')
        github_url = data.get('github_url')
        demo_url = data.get('demo_url', '')
        
        if not all([title, description, technologies, github_url]):
            return jsonify({'error': 'Required fields missing'}), 400
        
        conn = sqlite3.connect('portfolio.db')
        c = conn.cursor()
        
        c.execute('INSERT INTO projects (title, description, technologies, github_url, demo_url, created_at) VALUES (?, ?, ?, ?, ?, ?)',
                  (title, description, technologies, github_url, demo_url, datetime.datetime.now()))
        
        conn.commit()
        conn.close()
        
        return jsonify({'message': 'Project added successfully'}), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Get projects endpoint
@app.route('/api/projects', methods=['GET'])
def get_projects():
    try:
        conn = sqlite3.connect('portfolio.db')
        c = conn.cursor()
        
        c.execute('SELECT * FROM projects ORDER BY created_at DESC')
        projects = c.fetchall()
        conn.close()
        
        project_list = []
        for project in projects:
            project_list.append({
                'id': project[0],
                'title': project[1],
                'description': project[2],
                'technologies': project[3],
                'github_url': project[4],
                'demo_url': project[5],
                'created_at': project[6]
            })
        
        return jsonify({'projects': project_list}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Email notification function
def send_email_notification(name, email, message):
    try:
        # Configure your email settings
        smtp_server = "smtp.gmail.com"
        smtp_port = 587
        sender_email = "your-email@gmail.com"
        sender_password = "your-app-password"
        
        msg = MIMEMultipart()
        msg['From'] = sender_email
        msg['To'] = "nangialayhamidi796@gmail.com"
        msg['Subject'] = f"New Contact Form Submission from {name}"
        
        body = f"""
        New contact form submission:
        
        Name: {name}
        Email: {email}
        Message: {message}
        """
        
        msg.attach(MIMEText(body, 'plain'))
        
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        server.login(sender_email, sender_password)
        server.send_message(msg)
        server.quit()
        
    except Exception as e:
        print(f"Email sending failed: {e}")

# Health check endpoint
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'timestamp': datetime.datetime.now().isoformat()}), 200

# Serve static HTML files
@app.route('/')
def home():
    with open('index.html', 'r', encoding='utf-8') as f:
        return f.read()

@app.route('/index.html')
def index():
    with open('index.html', 'r', encoding='utf-8') as f:
        return f.read()

@app.route('/auth.html')
def auth():
    with open('auth.html', 'r', encoding='utf-8') as f:
        return f.read()

@app.route('/admin.html')
def admin():
    with open('admin.html', 'r', encoding='utf-8') as f:
        return f.read()

# Serve CSS files
@app.route('/<path:filename>')
def serve_static(filename):
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            content = f.read()
        
        if filename.endswith('.css'):
            return content, 200, {'Content-Type': 'text/css'}
        elif filename.endswith('.js'):
            return content, 200, {'Content-Type': 'application/javascript'}
        else:
            return content
    except FileNotFoundError:
        return "File not found", 404

if __name__ == '__main__':
    init_db()
    app.run(debug=True, host='0.0.0.0', port=5000)