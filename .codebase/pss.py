import os
import re

# Paths to your codebase.md file and the output directory
codebase_md_path = r"C:\Users\willi\OneDrive\Desktop\ADOTIO\.codebase\codebase.md"
output_directory = r"C:\Users\willi\OneDrive\Desktop\ADOTIO"

# Regular expression patterns to match file paths and content
file_pattern = re.compile(
    r'## (.+?)\n\n<!-- Full path: (.+?) -->\n```(?:\w+\n)?(.*?)\n```',
    re.DOTALL
)

def create_files_from_md(md_content):
    matches = file_pattern.findall(md_content)
    for match in matches:
        file_name = match[0].strip()
        full_path = match[1].strip()
        file_content = match[2].strip()

        # Calculate relative path from output_directory
        relative_path = os.path.relpath(full_path, os.path.commonpath([output_directory, full_path]))
        file_dir = os.path.dirname(relative_path)
        file_dir_full = os.path.join(output_directory, file_dir)

        # Create directories if they don't exist
        if not os.path.exists(file_dir_full):
            os.makedirs(file_dir_full)

        file_path_full = os.path.join(output_directory, relative_path)

        # Write content to the file
        with open(file_path_full, 'w', encoding='utf-8') as f:
            f.write(file_content)

        print(f"Created {file_path_full}")

def main():
    with open(codebase_md_path, 'r', encoding='utf-8') as f:
        md_content = f.read()

    create_files_from_md(md_content)

if __name__ == "__main__":
    main()
