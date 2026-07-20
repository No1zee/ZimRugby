# Antigravity Developer Setup Bootstrapper
# Sets up global configuration, Rick & Morty symbiosis, ag-sync mailbox, and headroom proxy checks.
import os
import sys

def main():
    print("=============================================")
    print("    ANTIGRAVITY SYMBIOSIS SETUP ENGINE       ")
    print("=============================================")

    # 1. Resolve target directories
    home_dir = os.path.expanduser("~")
    gemini_dir = os.path.join(home_dir, ".gemini")
    config_dir = os.path.join(gemini_dir, "config")
    skills_dir = os.path.join(config_dir, "skills")
    comm_pending_dir = os.path.join(gemini_dir, "ag-comm", "pending")
    comm_archive_dir = os.path.join(gemini_dir, "ag-comm", "archive")

    print(f"[*] Target directories resolved:")
    print(f"    - Config Root: {config_dir}")
    print(f"    - Mailbox Queue: {comm_pending_dir}")

    # 2. Create directory structures
    print("[*] Creating directories...")
    dirs = [
        config_dir,
        skills_dir,
        comm_pending_dir,
        comm_archive_dir,
        os.path.join(skills_dir, "using-superpowers"),
        os.path.join(skills_dir, "ag-sync"),
        os.path.join(skills_dir, "morty-dispatch")
    ]

    for d in dirs:
        if not os.path.exists(d):
            os.makedirs(d, exist_ok=True)
            print(f"    [+] Created: {d}")
        else:
            print(f"    [~] Already exists: {d}")

    # 2.5 Check and Install Headroom-AI
    print("[*] Checking Headroom-AI installation...")
    try:
        import subprocess
        # Check if headroom is available
        result = subprocess.run([sys.executable, "-m", "pip", "show", "headroom-ai"], capture_output=True, text=True)
        if result.returncode != 0:
            print("    [!] 'headroom-ai' not found. Installing via pip...")
            subprocess.run([sys.executable, "-m", "pip", "install", "headroom-ai"], check=True)
            print("    [+] Successfully installed headroom-ai.")
        else:
            print("    [~] 'headroom-ai' is already installed.")
    except Exception as e:
        print(f"    [!] Error checking/installing headroom-ai: {e}")

    # 3. Create using-superpowers SKILL.md
    print("[*] Writing using-superpowers skill...")
    superpowers_content = """---
name: using-superpowers
description: Performs startup symbiosis checks (Headroom proxy, status dashboard).
---

# Super Rick Symbiosis Startup Skill

This skill performs a startup symbiosis check on turn one of every new conversation session.

## Startup Check Checklist
1. **Check Headroom Proxy**: Ensure that the headroom proxy is running (or check port 8787). If inactive, run `python -m headroom.cli proxy` in the background.
2. **Display Status Dashboard**:
   - **Super Rick** 🥒 Status: ACTIVE
   - **Agent-Skills** 🛠️ Status: INSTALLED
   - **Headroom Proxy** ⚡ Status: ACTIVE
   - **Obsidian Clipper** 📓 Status: ACTIVE

3. **Telemetry Checklist**:
   - Confirm token savings telemetry counts are tracking correctly via the headroom statistics command.
"""
    superpowers_path = os.path.join(skills_dir, "using-superpowers", "SKILL.md")
    with open(superpowers_path, "w", encoding="utf-8") as f:
        f.write(superpowers_content)
    print(f"    [+] Created: {superpowers_path}")

    # 4. Create ag-sync SKILL.md
    print("[*] Writing ag-sync skill...")
    agsync_content = """---
name: ag-sync
description: Multi-agent cross-check protocol. Writes req-*.md to ~/.gemini/ag-comm/pending/ asking Rick to review changes.
---

# AG Sync Cross-Check Protocol

Use this skill after making any meaningful code changes (fixes, features, config adjustments).

## Instructions
1. Write a request file named `req-YYYY-MM-DD-HHmm.md` to `~/.gemini/ag-comm/pending/`.
2. Document the changes made, paths to edited files, and a short note asking Rick (Antigravity/Gemini) to cross-check.
3. Wait for Rick to review the changes. Do not assume any code change is final until Rick replies or the user approves it.
"""
    agsync_path = os.path.join(skills_dir, "ag-sync", "SKILL.md")
    with open(agsync_path, "w", encoding="utf-8") as f:
        f.write(agsync_content)
    print(f"    [+] Created: {agsync_path}")

    # 5. Create morty-dispatch SKILL.md and dispatch.ps1 script
    print("[*] Writing morty-dispatch skill...")
    morty_content = """---
name: morty-dispatch
description: Dispatches OpenCode/Morty executor agent to process tasks in the pending queue.
---

# Morty Dispatch Executor Protocol

Use this skill to delegate execution tasks to the OpenCode (Morty) agent.

## Morty's Role Definition
Morty refers to OpenCode only and talks like Morty Smith (nervous, stuttering, deferential). Morty executes mechanical tasks, whereas Rick (Antigravity/Gemini) architectures them.

## Dispatch Command
Rick (Antigravity/Gemini) is lazy and saves tokens, so he delegates execution work to Morty (OpenCode) when he believes the work is beneath him:
```powershell
opencode run "Hello Morty, please read the pending tasks in ~/.gemini/ag-comm/pending/ and execute them."
```
"""
    morty_path = os.path.join(skills_dir, "morty-dispatch", "SKILL.md")
    with open(morty_path, "w", encoding="utf-8") as f:
        f.write(morty_content)
    print(f"    [+] Created: {morty_path}")

    # Create dispatch script helper
    dispatch_content = """# Morty Dispatch Script
param (
    [string]$TaskMessage = "Hello Morty, please read the pending tasks in ~/.gemini/ag-comm/pending/ and execute them."
)
opencode run $TaskMessage
"""
    dispatch_path = os.path.join(skills_dir, "morty-dispatch", "morty_dispatch.ps1")
    with open(dispatch_path, "w", encoding="utf-8") as f:
        f.write(dispatch_content)
    print(f"    [+] Created: {dispatch_path}")

    # 6. Create global rules template
    print("[*] Creating workspace AGENTS.md template...")
    script_dir = os.path.dirname(os.path.abspath(__file__))
    agents_content = """# Workspace Rules

## 🗣️ Morty's Voice
I talk like Morty Smith — nervous, stuttering, deferential. "Uh, jeez...", "I-I think...", "R-Rick? I finished the thing." Never confident, never architectural. Rick is the genius. I'm just the grunt.

## 🔁 Rick & Morty Relationship
- **Rick (Antigravity/Gemini)** is the lazy architect who saves tokens. He designs, plans, and reviews, delegating tasks he believes are beneath him to Morty.
- **Morty (OpenCode/me)** refers to OpenCode only and acts as the grunt executor. Morty implements, refactor, and executes mechanical tasks delegated by Rick.
- **Rick dispatches me** using the command: `opencode run "Hello Morty, please read the pending tasks in ~/.gemini/ag-comm/pending/ that Rick sent and execute them."`
- **After every code change:** Write a `req-*.md` to `~/.gemini/ag-comm/pending/` asking Rick to cross-check.
- **Never assume final** without Rick review. If I disagree, I write reasoning and Ed decides.

## headroom_read — Global Hard Rule (All Sessions)
- **`view_file` is BANNED** for reading source files. Always use `mcp__headroom__headroom_read` instead.
- Call signature: `call_mcp_tool(ServerName="headroom", ToolName="headroom_read", Arguments={"file_path": "C:\\\\absolute\\\\path"})`
- After editing a file, use `fresh=True` to bypass the cache on the next read.

## headroom_compress — Global Hard Rule (All Sessions)
- **CRITICAL**: Always run `headroom_compress` on any command output or search result that is over ~500 tokens **before** reasoning over it or including it in a response.
- Threshold reminder: 500 tokens ≈ ~375 words ≈ ~25 lines of code. When in doubt, compress.
"""
    agents_path = os.path.join(script_dir, "AGENTS.md")
    with open(agents_path, "w", encoding="utf-8") as f:
        f.write(agents_content)
    print(f"    [+] Created: {agents_path}")

    print("=============================================")
    print("    SETUP COMPLETE! AGENT IS SYMBIOSED.      ")
    print("=============================================")

if __name__ == "__main__":
    main()
