#!/usr/bin/env python
# Rick's Lazy Auditor - Automated Quality Gate for Morty Army
import os
import subprocess
import sys

def check_build():
    print("[*] Running Next.js compilation check...")
    try:
        # Run npm run build in the ZimRugby root directory
        # Find where setup.py is relative to execution
        script_dir = os.path.dirname(os.path.abspath(__file__))
        project_root = os.path.dirname(script_dir)
        
        result = subprocess.run(
            ["npm", "run", "build"], 
            cwd=project_root if os.path.exists(os.path.join(project_root, "package.json")) else os.getcwd(),
            capture_output=True, 
            text=True, 
            shell=True,
            encoding="utf-8"
        )
        if result.returncode != 0:
            print("[-] BUILD FAILED: Next.js compilation contains errors.")
            print(result.stderr or result.stdout)
            return False
        print("[+] BUILD PASSED: 0 Next.js compilation errors.")
        return True
    except Exception as e:
        print(f"[-] Error running build check: {e}")
        return False

def check_rules():
    print("[*] Scanning git diff for forbidden brand tokens (no gold policy)...")
    try:
        script_dir = os.path.dirname(os.path.abspath(__file__))
        project_root = os.path.dirname(script_dir)
        
        result = subprocess.run(
            ["git", "diff", "HEAD"], 
            cwd=project_root if os.path.exists(os.path.join(project_root, ".git")) else os.getcwd(),
            capture_output=True, 
            text=True,
            encoding="utf-8"
        )
        if result.returncode == 0:
            diff_text = result.stdout or ""
            forbidden_gold = ["zru-gold", "clubhouse-gold", "color-gold", "gold-"]
            for token in forbidden_gold:
                if token in diff_text:
                    print(f"[-] RULE VIOLATION: Forbidden brand token '{token}' detected in modifications.")
                    return False
            print("[+] RULE ENFORCEMENT: No violations detected.")
            return True
        else:
            print("[~] No git changes detected, skipping rules check.")
            return True
    except Exception as e:
        print(f"[-] Error running rules check: {e}")
        return False

def main():
    print("=============================================")
    print("      RICK'S AUTOMATED MORTY AUDIT ENGINE    ")
    print("=============================================")
    
    build_ok = check_build()
    rules_ok = check_rules()
    
    print("=============================================")
    if build_ok and rules_ok:
        print("[SUCCESS] AUDIT PASSED: READY FOR REVIEW  ")
        print("=============================================")
        sys.exit(0)
    else:
        print("[FAILURE] AUDIT FAILED: FIX ERRORS FIRST   ")
        print("=============================================")
        sys.exit(1)

if __name__ == "__main__":
    main()
