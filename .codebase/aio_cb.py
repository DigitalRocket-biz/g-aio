import os
from pathlib import Path
import unicodedata
from collections import OrderedDict

# Define the base directory of your project
base_dir = Path("C:/Users/willi/OneDrive/Desktop/ADOTIO")

# Define files to scan
files_to_scan = [
    "src/components/chat/messages.js",
    "src/components/chat/threads.js",
    "src/components/dashboard/campaigns.js",
    "src/components/dashboard/metrics.js",
    "src/services/auth/auth-service.js",
    "src/services/chat/openai-service.js",
    "src/services/database/database.js",
    "src/services/google-ads/google-ads-handler.js",
    "src/styles/components/chat.css",
    "src/styles/components/dashboard.css",
    "src/styles/main.css",
    "src/utils/auth-utils.js",
    "src/utils/date-utils.js",
    "src/utils/formatting.js",
    ".env",
    "index.html",
    "main.js",
    "package.json",
    "preload.js",
    "renderer.js"
]

# Output directory and file
output_dir = base_dir / ".codebase"
output_dir.mkdir(parents=True, exist_ok=True)
output_file = output_dir / "codebase.md"

def get_relevant_files():
    # Use OrderedDict to maintain order but prevent duplicates
    files_dict = OrderedDict()
    
    # Add specified files in order
    for file in files_to_scan:
        file_path = base_dir / file
        if file_path.is_file():
            rel_path = file_path.relative_to(base_dir)
            files_dict[str(rel_path)] = file_path

    return list(files_dict.values())

def create_file_anchor(file_path):
    # Create a unique anchor for each file
    rel_path = file_path.relative_to(base_dir)
    # Replace directory separators with dashes and remove special characters
    anchor = str(rel_path).replace('\\', '-').replace('/', '-')
    anchor = ''.join(c for c in anchor if c.isalnum() or c in '-_').lower()
    return anchor

def get_file_language(extension):
    return {
        'js': 'javascript',
        'jsx': 'javascript',
        'ts': 'typescript',
        'tsx': 'typescript',
        'html': 'html',
        'css': 'css',
        'json': 'json',
        'py': 'python',
        'md': 'markdown',
        'sql': 'sql',
        'env': 'plaintext',
        'db': 'sql'
    }.get(extension.lower().lstrip('.'), '')

def write_codebase_doc():
    # Write markdown version
    with output_file.open("w", encoding="utf-8-sig", newline='\n') as md_file:
        # Write title
        md_file.write("# Project Codebase\n\n")
        
        # Get all files
        files = get_relevant_files()
        
        # Write table of contents
        md_file.write("## Table of Contents\n\n")
        for idx, file_path in enumerate(files, start=1):
            rel_path = file_path.relative_to(base_dir)
            anchor = create_file_anchor(file_path)
            md_file.write(f"{idx}. [{rel_path}](#{anchor})\n")
        md_file.write("\n")

        # Write file contents
        for file_path in files:
            rel_path = file_path.relative_to(base_dir)
            anchor = create_file_anchor(file_path)
            md_file.write(f"## {rel_path}\n\n")
            md_file.write(f"<!-- Full path: {file_path} -->\n")
            
            language = get_file_language(file_path.suffix)
            md_file.write(f"```{language}\n")

            try:
                with open(file_path, 'rb') as f:
                    content = f.read()
                content = content.decode('utf-8-sig')
                content = unicodedata.normalize('NFC', content)
                content = '\n'.join(content.splitlines())
                md_file.write(content)
            except Exception as e:
                md_file.write(f"// Error reading file: {e}\n")

            md_file.write("\n```\n\n")

    # Write plain text version for AI readability
    txt_file = output_dir / "codebase.txt"
    with txt_file.open("w", encoding="utf-8-sig", newline='\n') as txt_file:
        files = get_relevant_files()
        
        for file_path in files:
            try:
                with open(file_path, 'rb') as f:
                    content = f.read().decode('utf-8-sig')
                content = unicodedata.normalize('NFC', content)
                # Write file path followed by content with minimal separators
                txt_file.write(f"@{file_path}\n{content}\n")
            except Exception as e:
                txt_file.write(f"@{file_path}\nERROR:{e}\n")

if __name__ == "__main__":
    write_codebase_doc()
    print(f"Documentation generated at:")
    print(f"- Markdown: {output_file}")
    print(f"- Text: {output_dir/'codebase.txt'}")