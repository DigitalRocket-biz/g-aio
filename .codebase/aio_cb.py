import os
from pathlib import Path

# Get all files recursively from the src directory
src_dir = Path("C:/Users/willi/OneDrive/Desktop/ADOTIO/google-ads-assistant/src")
specific_files = []

for root, dirs, files in os.walk(src_dir):
    for file in files:
        file_path = Path(root) / file
        specific_files.append(file_path)

# Sort files for consistent ordering
specific_files.sort()

# Output directory and file
output_dir = Path("C:/Users/willi/OneDrive/Desktop/ADOTIO/google-ads-assistant/codebase_debug/")
output_dir.mkdir(parents=True, exist_ok=True)
output_file = output_dir / "gaa_cb.md"

# Write contents to markdown file
with output_file.open("w", encoding="utf-8") as md_file:
    # Write the title and table of contents
    md_file.write("# Google Ads Assistant Codebase Documentation\n\n")
    md_file.write("## Table of Contents\n\n")
    for idx, file_path in enumerate(specific_files, start=1):
        rel_path = file_path.relative_to(src_dir)
        anchor = str(rel_path).replace('/', '_').replace('.', '').replace('\\', '_').lower()
        md_file.write(f"{idx}. [{rel_path}](#{anchor})\n")
    md_file.write("\n")

    # Write each file's content
    for file_path in specific_files:
        rel_path = file_path.relative_to(src_dir)
        anchor = str(rel_path).replace('/', '_').replace('.', '').replace('\\', '_').lower()
        md_file.write(f"## {rel_path}\n\n")
        
        # Determine file extension and set appropriate language for code block
        file_ext = file_path.suffix.lower()
        lang_map = {
            '.ts': 'typescript',
            '.tsx': 'typescript',
            '.js': 'javascript',
            '.jsx': 'javascript',
            '.css': 'css',
            '.scss': 'scss',
            '.json': 'json',
            '.md': 'markdown'
        }
        lang = lang_map.get(file_ext, 'plaintext')
        
        md_file.write(f"```{lang}\n")

        if file_path.is_file():
            try:
                md_file.write(file_path.read_text(encoding="utf-8"))
            except UnicodeDecodeError:
                md_file.write(f"# Binary file or encoding error: {rel_path}\n")
        else:
            md_file.write(f"# File not found: {rel_path}\n")

        md_file.write("\n```\n\n")