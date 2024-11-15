# Project structure setup script
$projectRoot = "C:\Users\willi\OneDrive\Desktop\ADOTIO"

# Define the existing folder structure to verify
$existingFolders = @(
    ".codebase",
    ".studio.aio",
    ".Untype",
    "harvest",
    "node_modules",
    "src",
    "src\components",
    "src\components\chat",
    "src\components\dashboard",
    "src\services",
    "src\services\auth",
    "src\services\chat",
    "src\services\database",
    "src\services\google-ads",
    "src\styles",
    "src\styles\components",
    "src\utils"
)

# Verify existing folders
foreach ($folder in $existingFolders) {
    $path = Join-Path $projectRoot $folder
    if (!(Test-Path $path)) {
        Write-Host "Warning: Missing directory: $folder"
        New-Item -ItemType Directory -Path $path -Force
        Write-Host "Created directory: $path"
    }
}

# Define any new folders needed for the updates (minimal additions)
$newFolders = @(
    "src\components\ui", # For reusable UI components
    "src\styles\themes"  # For theme-specific styles
)

# Create new folders
foreach ($folder in $newFolders) {
    $path = Join-Path $projectRoot $folder
    if (!(Test-Path $path)) {
        New-Item -ItemType Directory -Path $path -Force
        Write-Host "Created new directory: $path"
    }
}

# Define new files needed for the dark theme update
$newFiles = @{
    "src\styles\themes\dark.css"         = "/* Dark theme variables - Added for theme support */"
    "src\components\ui\ThemeProvider.js" = "// Theme provider component - Added for theme management"
}

# Create new files
foreach ($file in $newFiles.Keys) {
    $path = Join-Path $projectRoot $file
    if (!(Test-Path $path)) {
        $newFiles[$file] | Out-File -FilePath $path -Encoding UTF8
        Write-Host "Created new file: $path"
    }
}

# List of existing files that need to be modified
$filesToModify = @(
    "src\components\chat\messages.js",
    "src\components\chat\threads.js",
    "src\components\dashboard\campaigns.js",
    "src\components\dashboard\metrics.js",
    "src\styles\components\chat.css",
    "src\styles\components\dashboard.css",
    "src\styles\main.css",
    "index.html",
    "renderer.js"
)

Write-Host "`nFiles requiring updates for dark theme support:"
Write-Host "==========================================="
foreach ($file in $filesToModify) {
    $fullPath = Join-Path $projectRoot $file
    if (Test-Path $fullPath) {
        Write-Host "- $file (Exists)"
    }
    else {
        Write-Host "- $file (Missing!)"
    }
}

Write-Host "`nSetup complete!"
Write-Host "You can now proceed with updating the individual files for dark theme support."