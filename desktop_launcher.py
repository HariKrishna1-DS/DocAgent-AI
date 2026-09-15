import os
import sys
import threading
import time
import webbrowser
import uvicorn
from app import app  # Imports your FastAPI app

def start_server():
    # Run FastAPI server on port 8000
    uvicorn.run(app, host="127.0.0.1", port=8000, log_level="error")

if __name__ == "__main__":
    # Ensure uploads directory exists
    os.makedirs("uploads", exist_ok=True)

    # Start FastAPI server in a background thread
    server_thread = threading.Thread(target=start_server, daemon=True)
    server_thread.start()

    # Wait 1.5 seconds for the server to initialize
    time.sleep(1.5)

    # Automatically open the web app in the default web browser
    webbrowser.open("http://127.0.0.1:8000")

    print("DocuAgent AI is running at http://127.0.0.1:8000")
    print("Keep this window open while using the application. Press Ctrl+C to stop.")

    # Keep main thread alive
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        sys.exit(0)