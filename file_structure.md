# File Structure

## Integrated

```
📦Homies
 ┣ 📂app
 ┃ ┣ 📂internal
 ┃ ┃ ┣ 📂finance
 ┃ ┃ ┣ 📂home
 ┃ ┃ ┣ 📂hospital_core
 ┃ ┃ ┣ 📂human_resource
 ┃ ┃ ┣ 📂logistics
 ┃ ┃ ┗ 📜app.py
 ┃ ┗ 📂public
 ┃ ┃ ┣ 📂doctors
 ┃ ┃ ┣ 📂careers
 ┃ ┃ ┣ 📂home
 ┃ ┃ ┃ ┣ 📂routers
 ┃ ┃ ┃ ┃ ┣ 📂api
 ┃ ┃ ┃ ┃ ┗ 📂web
 ┃ ┃ ┃ ┃ ┃ ┗ 📜homeRoute.py
 ┃ ┃ ┃ ┗ 📂views
 ┃ ┃ ┃ ┃ ┣ 📂content
 ┃ ┃ ┃ ┃ ┃ ┣ 📜home.html
 ┃ ┃ ┃ ┃ ┃ ┗ 📜login.html
 ┃ ┃ ┃ ┃ ┗ 📂templates
 ┃ ┃ ┃ ┃ ┃ ┗ 📂public
 ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂components
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📜footer_section.html
 ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📜topbar.html
 ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📜footer.html
 ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📜header.html
 ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📜layout.html
 ┃ ┃ ┣ 📂visitors
 ┃ ┃ ┗ 📜app.py
 ┣ 📂static
 ┃ ┣ 📂dist
 ┃ ┣ 📂src
 ┃ ┃ ┣ 📂css
 ┃ ┃ ┣ 📂files
 ┃ ┃ ┣ 📂img
 ┃ ┃ ┗ 📂js
 ┃ ┗ 📂plugins
 ┣ 📜.gitattributes
 ┣ 📜.gitignore
 ┣ 📜database.py
 ┣ 📜file_structure.md
 ┣ 📜hashing.py
 ┣ 📜jwt_token.py
 ┣ 📜main.py
 ┣ 📜models.py
 ┣ 📜oauth2.py
 ┗ 📜requirements.txt
 ```

## Per Subsystem

```
📦Specific Folder
 ┣ 📂core
 ┃ ┣ 📂internal
 ┃ ┣ 📂internal
 ┃ ┣ 📂internal
 ┃ ┣ 📂internal
 ┣ 📂finance
 ┃ ┣ 📂internal
 ┃ ┣ 📂internal
 ┃ ┣ 📂internal
 ┃ ┣ 📂internal
 ┣ 📂human_resouce
 ┃ ┣ 📂internal
 ┃ ┣ 📂internal
 ┃ ┣ 📂internal
 ┃ ┣ 📂internal
 ┗ 📂logistics
   ┣ 📂internal
   ┣ 📂internal
   ┣ 📂internal
   ┗ 📂internal

```