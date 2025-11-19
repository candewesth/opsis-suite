# 🔄 Git Workflow - Sincronización de Cambios

## ⚠️ REGLA DE ORO
**Antes de cerrar VS Code, cambiar de computadora o terminar tu sesión de trabajo:**

```bash
git add .
git commit -m "descripción de cambios"
git push origin main
```

## 📋 Comandos Esenciales

### 1️⃣ Ver qué archivos cambiaron
```bash
git status
```

### 2️⃣ Agregar TODOS los cambios
```bash
git add .
```

### 3️⃣ Guardar los cambios con un mensaje descriptivo
```bash
git commit -m "Descripción de los cambios realizados"
```

### 4️⃣ Subir los cambios a GitHub
```bash
git push origin main
```

---

## 🚀 Al comenzar a trabajar

**Cuando abras el proyecto en otra computadora o Codespace:**

```bash
git pull origin main
```

Esto descarga todos los cambios más recientes del repositorio.

---

## 💡 Ejemplos de Mensajes de Commit

```bash
git commit -m "Actualizar motorsync dashboard"
git commit -m "Agregar nuevas funcionalidades"
git commit -m "Trabajo del día - cambios en motorsync"
git commit -m "Fix: corregir errores en formularios"
```

---

## 🔄 Workflow Completo

### **Antes de terminar tu sesión:**
```bash
git status              # Ver cambios
git add .              # Agregar todo
git commit -m "mensaje" # Guardar cambios
git push origin main   # Subir a GitHub
```

### **Al empezar una nueva sesión:**
```bash
git pull origin main   # Descargar cambios más recientes
```

---

## ✅ Verificación

**Para confirmar que todo está sincronizado:**
```bash
git status
# Debe mostrar: "nothing to commit, working tree clean"
```

---

## 🎯 Recordatorio

- ✅ **SIEMPRE** haz `git push origin main` antes de cambiar de dispositivo
- ✅ **SIEMPRE** haz `git pull origin main` al empezar a trabajar
- ✅ Verifica con `git status` que no haya cambios sin guardar
- ✅ Tus cambios solo están seguros cuando están en GitHub (después del push)

---

## 🆘 Si olvidaste hacer push

Si trabajaste en una computadora y olvidaste hacer push, tus cambios solo están localmente.

**Opciones:**
1. Regresa a esa computadora y haz `git push origin main`
2. O usa GitHub CLI para acceder al Codespace donde trabajaste (como hicimos con "musical-guacamole")

---

**📌 MANTÉN ESTE ARCHIVO ABIERTO COMO RECORDATORIO**
