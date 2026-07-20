#!/usr/bin/env python
# Mailbox Archiving Tool for Rick & Morty Agent Symbiosis
import os
import shutil
import sys

def main():
    home_dir = os.path.expanduser("~")
    gemini_dir = os.path.join(home_dir, ".gemini")
    pending_dir = os.path.join(gemini_dir, "ag-comm", "pending")
    archive_dir = os.path.join(gemini_dir, "ag-comm", "archive")

    if not os.path.exists(pending_dir) or not os.path.exists(archive_dir):
        print("[-] Mailbox folders not found. Please run setup.py first.")
        sys.exit(1)

    files = os.listdir(pending_dir)
    if not files:
        print("[~] Mailbox queue is clean. Zero pending tasks.")
        return

    print(f"[*] Found {len(files)} files in the pending queue:")
    for f in files:
        src = os.path.join(pending_dir, f)
        dst = os.path.join(archive_dir, f)
        print(f"    - Archiving: {f} -> archive/")
        shutil.move(src, dst)
    
    print("[+] All pending items successfully archived.")

if __name__ == "__main__":
    main()
