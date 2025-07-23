#!/usr/bin/env python3

import json

class SimpleMCPService:
    def __init__(self):
        self.methods = {"ping": self.ping}

    def ping(self, params=None):
        return {"message": "pong", "params": params}

    def handle_request(self, request):
        if isinstance(request, str):
            request = json.loads(request)
        
        if request.get("jsonrpc") != "2.0":
            return {"jsonrpc": "2.0", "error": {"code": -32600, "message": "Bad version"}, "id": request.get("id")}
        
        method = request.get("method")
        if method not in self.methods:
            return {"jsonrpc": "2.0", "error": {"code": -32601, "message": "Method not found"}, "id": request.get("id")}
        
        result = self.methods[method](request.get("params"))
        return {"jsonrpc": "2.0", "result": result, "id": request.get("id")}

def test_mcp():
    service = SimpleMCPService()
    
    tests = [
        {"jsonrpc": "2.0", "method": "ping", "id": 1},
        {"jsonrpc": "2.0", "method": "ping", "params": {"test": True}, "id": 2},
        {"jsonrpc": "1.0", "method": "ping", "id": 3},
        {"jsonrpc": "2.0", "method": "bad", "id": 4}
    ]
    
    for test in tests:
        response = service.handle_request(test)
        print(f"Request: {test}")
        print(f"Response: {response}")
        print()

if __name__ == "__main__":
    test_mcp()


