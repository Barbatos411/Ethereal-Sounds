from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from starlette.requests import Request

app = FastAPI()

# 设置静态文件的目录（'css', 'js', 'res' 目录需要映射）
app.mount("/css", StaticFiles(directory="web/css"), name="css")
app.mount("/js", StaticFiles(directory="web/js"), name="js")
app.mount("/res", StaticFiles(directory="web/res"), name="res")

# 初始化模板引擎
templates = Jinja2Templates(directory="web")  # web 目录包含 html 模板文件

# 定义主页路由
@app.get("/")
async def read_item(request: Request):
    # 你可以从数据库查询数据或者传递静态数据
    example_data = {"message": "Welcome to the music player"}
    return templates.TemplateResponse("index.html", {"request": request, "data": example_data})
