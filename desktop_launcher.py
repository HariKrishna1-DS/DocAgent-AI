import os
import socket
import sys
import threading
import time
import webbrowser
import uvicorn
from app import app  # Imports your FastAPI app


def find_available_port(start_port=8000, max_attempts=50):
    """Finds an unused TCP port starting from start_port."""
    for port in range(start_port, start_port + max_attempts):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            try:
                s.bind(("127.0.0.1", port))
                return port
            except OSError:
                continue
    return start_port


def main():
    try:
        os.makedirs("uploads", exist_ok=True)
        port = find_available_port(8000)

        def start_server():
            uvicorn.run(app, host="127.0.0.1", port=port, log_level="error")

        server_thread = threading.Thread(target=start_server, daemon=True)
        server_thread.start()

        time.sleep(1.5)
        url = f"http://127.0.0.1:{port}"
        webbrowser.open(url)

        print("=" * 60)
        print("  DocuAgent AI Application is Running Successfully!")
        print(f"  URL: {url}")
        print("  Do not close this console window while using the app.")
        print("=" * 60)

        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        sys.exit(0)
    except Exception as err:
        print(f"\n[ERROR] Application failed to launch: {err}")
        input("\nPress Enter to exit...")


if __name__ == "__main__":
    main()