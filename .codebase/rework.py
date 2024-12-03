import os
import shutil
from pathlib import Path
from typing import Dict, List, Set
import logging
from dataclasses import dataclass

@dataclass
class PathConfig:
    src: Path
    backup: Path
    temp: Path

class DirectoryFixer:
    def __init__(self, base_path: str):
        timestamp = self._get_timestamp()
        self.paths = PathConfig(
            src=Path(base_path),
            backup=Path(base_path).parent / f"src_backup_{timestamp}",
            temp=Path(base_path).parent / f"src_temp_{timestamp}"
        )
        self.logger = self._setup_logger()
        
        # Define required structure
        self.required_files = {
            "components/chat/ChatHeader.tsx",
            "components/chat/ChatInput.tsx",
            "components/chat/ChatWidget.tsx",
            "components/chat/MessageList.tsx",
            "components/chat/ThreadList.tsx",
            "components/dashboard/CampaignBarChart.tsx",
            "components/dashboard/CampaignTable.tsx",
            "components/dashboard/ChartWrapper.tsx",
            "components/dashboard/ClientChart.tsx",
            "components/dashboard/DashboardHeader.tsx",
            "components/dashboard/DashboardLayout.tsx",
            "components/dashboard/MetricCard.tsx",
            "components/dashboard/PerformanceChart.tsx",
            "components/layouts/MainLayout.tsx",
            "components/layouts/Sidebar.tsx",
            "components/ui/Button.tsx",
            "components/ui/Card.tsx",
            "components/ui/Dialog.tsx",
            "components/ui/Input.tsx",
            "components/ui/Select.tsx",
            "components/ui/index.ts",
            "hooks/useCampaigns.ts",
            "hooks/useChat.ts",
            "hooks/useLeadTypePreferences.ts",
            "hooks/useLocalStorage.ts",
            "hooks/useSalesforce.ts",
            "hooks/useSettings.ts",
            "hooks/useSortPreferences.ts",
            "lib/api.ts",
            "lib/chartConfig.ts",
            "lib/db.ts",
            "lib/google-ads.ts",
            "lib/lsa.ts",
            "lib/openai.ts",
            "lib/prisma.ts",
            "lib/salesforce.ts",
            "pages/_app.tsx",
            "pages/analytics.tsx",
            "pages/auth/signin.tsx",
            "pages/api/auth/[...nextauth].ts",
            "pages/api/campaigns/cpc-history.ts",
            "pages/api/campaigns/update-tcpa.ts",
            "pages/api/campaigns/update-troas.ts",
            "pages/api/campaigns.ts",
            "pages/api/log.ts",
            "pages/api/salesforce/accounts.ts",
            "pages/chat.tsx",
            "pages/dashboard.tsx",
            "pages/index.tsx",
            "providers/AntdProvider.tsx",
            "store/accountSelections.ts",
            "store/chat.ts",
            "store/settings.ts",
            "styles/globals.css",
            "types/campaign.ts",
            "types/chart.ts",
            "types/lsa.ts",
            "types/next-auth.d.ts",
            "utils/date.ts",
            "utils/format.ts",
            "utils/index.ts"
        }

    def _get_timestamp(self) -> str:
        from datetime import datetime
        return datetime.now().strftime("%Y%m%d_%H%M%S")

    def _setup_logger(self) -> logging.Logger:
        logger = logging.getLogger("directory_fixer")
        logger.setLevel(logging.INFO)
        handler = logging.StreamHandler()
        handler.setFormatter(logging.Formatter('%(levelname)s: %(message)s'))
        logger.addHandler(handler)
        return logger

    def execute(self) -> bool:
        try:
            # Create backup
            self.logger.info("Creating backup...")
            shutil.copytree(self.paths.src, self.paths.backup)

            # Create temp directory with correct structure
            self.logger.info("Creating temporary directory with correct structure...")
            self._create_directory_structure()

            # Move files to correct locations
            self.logger.info("Moving files to correct locations...")
            self._organize_files()

            # Verify structure
            self.logger.info("Verifying structure...")
            if not self._verify_structure():
                raise Exception("Structure verification failed")

            # Replace original with new structure
            self.logger.info("Replacing original directory...")
            self._replace_original()

            self.logger.info("Cleanup completed successfully!")
            return True

        except Exception as e:
            self.logger.error(f"Error during restructuring: {str(e)}")
            self._restore_backup()
            return False

    def _create_directory_structure(self):
        base_dirs = {
            "components/chat",
            "components/dashboard",
            "components/layouts",
            "components/ui",
            "hooks",
            "lib",
            "pages/api/auth",
            "pages/api/campaigns",
            "pages/api/salesforce",
            "pages/auth",
            "providers",
            "store",
            "styles",
            "types",
            "utils"
        }

        for dir_path in base_dirs:
            (self.paths.temp / dir_path).mkdir(parents=True, exist_ok=True)

    def _organize_files(self):
        # Handle casing fixes first
        casing_fixes = {
            "components/Chat": "components/chat",
            "components/Dashboard": "components/dashboard",
            "components/Layout": "components/layouts"
        }

        # Copy files with correct casing
        for file_path in self.required_files:
            source = self.paths.src / file_path
            
            # Check for case-insensitive matches
            if not source.exists():
                for fix_old, fix_new in casing_fixes.items():
                    alt_source = self.paths.src / file_path.replace(fix_new, fix_old)
                    if alt_source.exists():
                        source = alt_source
                        break

            if source.exists():
                destination = self.paths.temp / file_path
                destination.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(source, destination)
                self.logger.info(f"Copied: {file_path}")

        # Remove unnecessary files/directories
        to_remove = [
            "components/Layout",
            "components/ui/Badge.tsx",
            "components/ui/Button/Button.tsx",
            "components/ui/Card/Card.tsx",
            "components/ui/Input/Input.tsx",
            "types/global.d.ts"
        ]

        for path in to_remove:
            full_path = self.paths.src / path
            if full_path.exists():
                if full_path.is_file():
                    full_path.unlink()
                else:
                    shutil.rmtree(full_path)
                self.logger.info(f"Removed: {path}")

    def _verify_structure(self) -> bool:
        for file_path in self.required_files:
            if not (self.paths.temp / file_path).exists():
                self.logger.error(f"Missing required file: {file_path}")
                return False
        return True

    def _replace_original(self):
        shutil.rmtree(self.paths.src)
        shutil.copytree(self.paths.temp, self.paths.src)
        shutil.rmtree(self.paths.temp)

    def _restore_backup(self):
        self.logger.info("Restoring from backup...")
        if self.paths.src.exists():
            shutil.rmtree(self.paths.src)
        shutil.copytree(self.paths.backup, self.paths.src)
        if self.paths.temp.exists():
            shutil.rmtree(self.paths.temp)

def main():
    src_path = r"C:\Users\willi\OneDrive\Desktop\ADOTIO\google-ads-assistant\src"
    fixer = DirectoryFixer(src_path)
    success = fixer.execute()
    
    if success:
        print("Directory restructuring completed successfully!")
        return 0
    else:
        print("Directory restructuring failed. Original structure restored from backup.")
        return 1

if __name__ == "__main__":
    import sys
    sys.exit(main())