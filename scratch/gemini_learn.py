import json
import os
import sys

def learn_gemini_failures():
    """
    Parses local Gemini Antigravity conversation transcripts to identify execution
    failures and automatically generates context/lessons for GEMINI.md.
    """
    # 1. Paths
    workspace_dir = r"C:\Users\Edward Magejo\OneDrive\Desktop\ZIM RUGBY UNION\ZimRugby"
    brain_dir = r"C:\Users\Edward Magejo\.gemini\antigravity\brain\49107131-e0ce-4134-b1d4-e5452c50af5e"
    logs_dir = os.path.join(brain_dir, ".system_generated", "logs")
    transcript_path = os.path.join(logs_dir, "transcript.jsonl")
    gemini_md_path = os.path.join(workspace_dir, "GEMINI.md")

    if not os.path.exists(transcript_path):
        print(f"Error: Transcript file not found at {transcript_path}")
        sys.exit(1)

    print(f"Parsing transcript: {transcript_path}")

    # 2. Extract Failures
    failures = []
    with open(transcript_path, "r", encoding="utf-8") as f:
        for line in f:
            try:
                step = json.loads(line)
                step_idx = step.get("step_index", 0)
                step_type = step.get("type", "")
                content = step.get("content", "")

                # Detect run command failures
                if step_type == "RUN_COMMAND" and ("The command failed" in content or "exit code" in content or "Error:" in content):
                    # Clean up the output string to get a clear error preview
                    clean_content = content.replace("\t", "").replace("\r", "").strip()
                    failures.append({
                        "step": step_idx,
                        "type": "Shell Command Failure",
                        "summary": clean_content[:300] + "..." if len(clean_content) > 300 else clean_content
                    })
                
                # Detect TypeScript compilation error logs
                elif "Type error:" in content or "TypeScript error" in content or "TypeScript compilation failed" in content:
                    failures.append({
                        "step": step_idx,
                        "type": "TypeScript Compilation Error",
                        "summary": content[:300] + "..." if len(content) > 300 else content
                    })
            except Exception as e:
                continue

    if not failures:
        print("No new failure patterns identified in this conversation's logs.")
        return

    print(f"Identified {len(failures)} failure events. Formatting recommendations...")

    # 3. Format recommendations
    new_lessons = ["\n### 🔵 Auto-Generated from Gemini Logs"]
    for fail in failures:
        new_lessons.append(f"- **Step {fail['step']} [{fail['type']}]:**")
        # Format failure trace code/output
        cleaned_summary = fail['summary'].replace('\n', '\n  > ')
        new_lessons.append(f"  > {cleaned_summary}")

    # 4. Append to GEMINI.md
    if os.path.exists(gemini_md_path):
        print(f"Appending new learnings to {gemini_md_path}")
        with open(gemini_md_path, "r", encoding="utf-8") as f:
            content = f.read()

        # Find or create learned lessons header
        if "## Learned Lessons" in content:
            parts = content.split("## Learned Lessons")
            updated_content = parts[0] + "## Learned Lessons" + parts[1] + "\n" + "\n".join(new_lessons) + "\n"
        else:
            updated_content = content + "\n\n## Learned Lessons\n" + "\n".join(new_lessons) + "\n"

        with open(gemini_md_path, "w", encoding="utf-8") as f:
            f.write(updated_content)
        
        # Sync back to superpowers references
        ref_path = r"C:\Users\Edward Magejo\.gemini\config\skills\using-superpowers\references\GEMINI.md"
        if os.path.exists(ref_path):
            with open(ref_path, "w", encoding="utf-8") as f:
                f.write(updated_content)
            print("Successfully synchronized learnings to Super Rick references.")
    else:
        print(f"GEMINI.md not found at {gemini_md_path}")

if __name__ == "__main__":
    learn_gemini_failures()
