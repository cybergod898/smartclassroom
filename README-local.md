# 教师端一体化交付包 v0.9.0

生成时间：2025-10-02T14:56:35.781749Z

## 一键启动（推荐 Docker）
```bash
docker-compose up -d
# 前端: http://localhost:5173/teacher/index
# 后端: http://localhost:3000/health
```
> 首次启动会自动初始化 MySQL，并导入 `db/init/schema.sql` + `seed.sql`。

## 手动启动（可选）
- 启 DB（本地 MySQL smart_classroom）；
- 后端：`cd backend && npm i && node server.js`
- 前端：`cd frontend && npm i && npm run dev`

## 修改数据库
- 临时：`docker exec -it teacher-mysql mysql -uroot -prootpass smart_classroom`
- 持久：修改 `db/init/schema.sql` 后执行：
  ```bash
  docker-compose down -v
  docker-compose up -d
  ```
