import time
import threading
import os
from sqlalchemy.orm import Session
from backend.db.session import SessionLocal
from backend.models.documents import Document
from backend.core.hashing import get_file_hash
from backend.api.v1.endpoints.documents import STORAGE_DIR

def check_integrity():
    """
    Simulates a background agent that verifies file integrity.
    """
    while True:
        try:
            print("[IntegrityAgent] Starting integrity scan...")
            db = SessionLocal()
            docs = db.query(Document).all()
            
            for doc in docs:
                # Reconstruct path. file_url stored as /storage/filename.
                # Assuming simple mapping for this demo.
                filename = doc.file_url.split("/storage/")[-1]
                file_path = os.path.join(STORAGE_DIR, filename)
                
                if not os.path.exists(file_path):
                    print(f"[IntegrityAgent] ALERT: File missing for Doc ID {doc.id} ({doc.doc_number})")
                    continue
                
                with open(file_path, "rb") as f:
                    content = f.read()
                    current_hash = get_file_hash(content)
                
                if current_hash != doc.hash:
                    # TAMPER DETECTED!
                    print(f"\n!!!!!!!!!!!!!!!!!\n[IntegrityAgent] CRITICAL ALERT: TAMPER DETECTED\nDocument: {doc.doc_number} (ID: {doc.id})\nExpected: {doc.hash}\nFound:    {current_hash}\n!!!!!!!!!!!!!!!!!\n")
                # else:
                #     print(f"[IntegrityAgent] Verified {doc.doc_number} - OK")
            
            db.close()
        except Exception as e:
            print(f"[IntegrityAgent] Error: {e}")
        
        time.sleep(30) # Run every 30 seconds

def start_integrity_checker():
    t = threading.Thread(target=check_integrity, daemon=True)
    t.start()
