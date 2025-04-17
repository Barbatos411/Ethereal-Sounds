import threading
from typing import Any, Dict, Optional

import yaml
from colorlog import getLogger

logger = getLogger(__name__)


class ConfigError(Exception):
    """配置相关错误"""
    pass


class Config:
    _instance = None
    _lock = threading.Lock()
    REQUIRED_FIELDS = ['HOST', 'PORT', 'LOGLEVEL', 'LOG_RETAIN_DAYS']

    def __new__(cls):
        if cls._instance is None:
            with cls._lock:
                if cls._instance is None:
                    cls._instance = super(Config, cls).__new__(cls)
                    cls._instance.load_config()
        return cls._instance

    def load_config(self) -> None:
        try:
            with open("config/config.yaml", "r", encoding = "utf-8") as f:
                self.config_dict = yaml.safe_load(f)
            self._validate_config()
            logger.info("✅ 配置加载成功")
        except yaml.YAMLError as e:
            raise ConfigError(f"❌ 配置文件格式错误: {str(e)}")
        except Exception as e:
            raise ConfigError(f"❌ 加载配置文件失败: {str(e)}")

    def _validate_config(self) -> None:
        """验证配置项"""
        # 检查必需字段
        for field in self.REQUIRED_FIELDS:
            if field not in self.config_dict:
                raise ConfigError(f"缺少必需的配置项: {field}")

        # 验证端口范围
        port = self.config_dict.get('PORT')
        if not (isinstance(port, int) and 1 <= port <= 65535):
            raise ConfigError(f"无效的端口号: {port}，端口必须在1-65535之间")

        # 验证日志级别
        valid_log_levels = ['INFO', 'DEBUG', 'WARNING', 'ERROR', 'CRITICAL']
        if self.config_dict.get('LOGLEVEL') not in valid_log_levels:
            raise ConfigError(f"无效的日志级别，必须是以下之一: {', '.join(valid_log_levels)}")

    def reload_config(self) -> None:
        try:
            self.load_config()
            logger.info("配置已更新")
        except ConfigError as e:
            logger.error(f"重新加载配置失败: {str(e)}")
            raise

    def get(self, key: str, default: Any = None) -> Any:
        """获取配置项，支持动态新增"""
        return self.config_dict.get(key, default)

    def get_platform_config(self, platform: str) -> Optional[Dict]:
        """获取指定平台的配置"""
        platforms = self.config_dict.get('platforms', {})
        return platforms.get(platform)


# 生成全局唯一 config 实例
config = Config()
