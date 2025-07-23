#!/usr/bin/env python3

from http.server import HTTPServer, BaseHTTPRequestHandler
import json

class TestHandler(BaseHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        
        data = json.loads(post_data.decode('utf-8'))
        message = data.get('message', 'No message')
        
        print(f"Received: {message}")
        
        response = {"status": "success", "echo": message}
        
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps(response).encode('utf-8'))
    
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps({"status": "alive"}).encode('utf-8'))
    
    def log_message(self, format, *args):
        pass

def test_server():
    httpd = HTTPServer(('localhost', 8080), TestHandler)
    print("Server running on http://localhost:8080")
    httpd.serve_forever()

if __name__ == "__main__":
    test_server()
