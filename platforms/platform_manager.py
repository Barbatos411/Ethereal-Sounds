from typing import List

from platforms.base import BasePlatform


class PlatformManager:
    def __init__(self):
        self.platforms: List[BasePlatform] = []

    def add_platform(self, platform: BasePlatform):
        self.platforms.append(platform)

    def get_platform_by_id(self, platform_id: str) -> BasePlatform:
        for platform in self.platforms:
            if platform.id == platform_id:
                return platform
        raise ValueError(f"平台 ID {platform_id} 不存在")

    def get_all_platforms(self):
        return [{"name": p.name, "id": p.id, "order": p.order} for p in self.platforms]


platform_manager = PlatformManager()
