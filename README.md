# CanteenOrderSystem

## 一、项目简介
本项目是一个食堂订餐系统，旨在为食堂和用餐者提供便捷的订餐和管理服务。

## 二、技术栈
- **后端**：mysql 5.7、jdk 21、maven 3.9.6
- **前端**：node.js 16.19、vue3
- **开发工具**：IDEA2024

## 三、项目结构
1. **项目根目录**：`canteen`
    - **`.idea`**：IntelliJ IDEA项目配置文件。
    - **`canteen`**：项目主要代码目录。
        - **`springboot`**：Spring Boot相关代码。
            - **`src`**：
                - **`main`**：
                    - **`java`**：Java源代码目录。
                    - **`resources`**：配置文件等资源目录。
            - **`target`**：编译后的文件存放目录。
                - **`classes`**：编译后的类文件。
                - **`generated - sources`**：生成的源代码（如通过某些插件生成）。
        - **`m pom.xml`**：Maven项目配置文件。
        - **`vue`**：Vue相关代码。
            - **`node_modules`**：Node.js模块目录。
            - **`public`**：
                - **`src`**：
                    - **`assets`**：静态资源文件（如图片等）。
                    - **`router`**：路由相关文件。
                    - **`utils`**：工具类文件。
                    - **`views`**：Vue组件视图文件，其中包含`App.vue`。
                - **`js main.js`**：主JavaScript文件。
            - **`.env.development`**：开发环境配置文件。
            - **`.env.production`**：生产环境配置文件。
            - **`index.html`**：入口HTML文件。
            - **`package.json`**：Node.js项目配置文件。
            - **`package - lock.json`**：锁定的包版本文件。
            - **`js vite.config.js`**：Vite配置文件
    - **`files`**：其他文件目录。
        - **`.gitignore`**：Git版本控制忽略文件。
    - **`sql`**：用于存放生成数据表的sql文件的文件夹。
    - **`WeChat

## 五、项目运行方式
1. **数据库配置**
    - 在数据库中运行canteen.sql文件。
    - 进入springboot/resources/application.yml，修改数据库账号密码为自己的账号密码。
2. **maven依赖导入**
    - 进入项目根目录下的`canteen/springboot`文件夹，找到`pom.xml`文件所在位置，右键add as maven project
3. **前端运行**
    - 进入`vue`文件夹。
    - 在命令行中执行`npm install`，这将安装项目所需的所有前端依赖包。
    - 执行`npm run dev`来启动前端开发服务器，运行项目的前端部分。