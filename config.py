import threading

import yaml


class Config:
    _instance = None
    _lock = threading.Lock()

    def __new__(cls):
        if cls._instance is None:
            with cls._lock:
                if cls._instance is None:
                    cls._instance = super(Config, cls).__new__(cls)
                    cls._instance.load_config()
        return cls._instance

    def load_config(self):
        """从 YAML 读取所有配置项，存入字典"""
        with open("config.yaml", "r", encoding = "utf-8") as f:
            self.config_dict = yaml.safe_load(f)

    def reload_config(self):
        """重新加载 YAML 配置"""
        self.load_config()
        print("配置已更新！")

    def get(self, key, default=None):
        """获取配置项，支持动态新增"""
        return self.config_dict.get(key, default)


# 生成全局唯一 config 实例
config = Config()
