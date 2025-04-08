# Práctica 11: Conceptualización del Proyecto Final  
**Nombre de la App**: **SIVIC**  
(*Sistema Integral de Vigilancia en Inmunodeficiencias Clínicas*)  

---

## **Descripción de la App**  
Aplicación web especializada en la gestión segura de clínicas de VIH, que integra:  

### **1. Parte Pública (Acceso General)**  
- **Educación médica**:  
  - Biblioteca digital con artículos verificados por la OMS/Secretaria de Salud.  
  - Infografías descargables sobre prevención y tratamiento.  
- **Directorio médico**:  
  - Perfiles públicos de especialistas (certificaciones, horarios).  
- **Acceso básico**:  
  - Mapa interactivo de centros de apoyo asociados.  

### **2. Parte Privada (Acceso con Autenticación)**  
#### **Para Pacientes**:  
- **Historial médico cifrado**:  
  - Visualización de resultados de laboratorio (CD4, carga viral).  
  - Registro de tratamientos con alertas de dosis (notificaciones push).  
- **Gestión de citas**:  
  - Sistema de agendado con verificación de disponibilidad en tiempo real.  
  - Recordatorios automáticos por SMS/email.  

#### **Para Médicos**:  
- **Dashboard clínico**:  
  - Tablero con gráficos de progreso de pacientes.  
  - Alertas automáticas para pruebas pendientes (CD4 < 200).    
- **Gestión de archivos**:  
  - Subida segura de tomografías/informes (PDF, DICOM).  

--- 

## **Moodboard (Descripción Visual)**  
![moodboard](./assets/moodboard.png)
- **Paleta de colores**:  
  - 011627-fdfffc-2ec4b6-e71d36-ff9f1c
- **Elementos UI**:  
  - Tarjetas modulares con sombras suaves.  
  - Iconos lineales en SVG (medicina, seguridad).  
  - Formularios con validación visual (✓/✗ en tiempo real).  
- **Ejemplo de componentes**:  
  - Calendario de citas con código de colores:  
    - Verde: Cita confirmada  
    - Rojo: Urgencia médica  
    - Gris: Horario no disponible  

---

## **Algoritmo en Lenguaje Natural**  

### **1. Registro de Usuarios**  
**Para Pacientes:**  
1. Ingresar: Nombre completo, correo válido, teléfono y contraseña.  
2. Validar:  
   - Formato de correo con expresión regular.  
   - Contraseña segura (8+ caracteres, 1 mayúscula, 1 número).  
3. Crear perfil:  
   - Generar ID único cifrado.  
   - Asignar rol "Paciente".  

**Para Médicos:**  
1. Ingresar: Cédula profesional, correo institucional y contraseña.  
2. Validar:  
   - Cédula en registro nacional de salud.  
   - Correo con dominio @hospital.gob.mx.  
3. Crear perfil:  
   - Generar ID único + código QR para firma digital.  
   - Asignar rol "Médico".  

---

### **2. Agendado de Citas**  
1. Paciente selecciona:  
   - Especialidad (infectología, psicología, etc.).  
   - Fecha y hora preferida.  
2. Sistema verifica en tiempo real:  
   - **Disponibilidad del médico**:  
     ```  
     SI médico tiene menos de 10 citas/día  
       Y horario no está ocupado  
       → Confirmar cita  
     SI NO → Mostrar 3 alternativas similares  
     ```  
   - **Compatibilidad de horarios**:  
     - Evitar choques con tratamientos programados.  
3. Confirmación:  
   - Enviar SMS/email con código QR de acceso.  
   - Cifrar detalles de cita en base de datos.  

---

### **3. Seguimiento de Síntomas (Pacientes)**  
1. Diario médico digital:  
   - Registrar: Temperatura, efectos secundarios, estado de ánimo.  
2. Sistema genera:  
   - Gráficos de progreso semanal/mensual.  
   - Alertas automáticas:  
     ```  
     SI temperatura > 38°C por 2 días  
       → Notificar al médico asignado  
     ```  
3. Historial cifrado:  
   - Solo accesible con clave temporal enviada por SMS.  

---

### **4. Gestión de Prescripciones (Médicos)**  
1. Crear receta médica:  
   - Seleccionar paciente de lista verificada.  
   - Ingresar: Medicamentos, dosis, frecuencia.  
2. Validaciones:  
   - Chequear alergias del paciente.  
   - Alertar sobre interacciones entre medicamentos.  
3. Firma digital:  
   - Usar código QR único del médico.  
   - Generar PDF cifrado con sello de tiempo. 

---

### **5. Comunicación Segura**  
**Sistema de Preguntas Frecuentes:**  
1. Paciente envía consulta:  
   - Seleccionar categoría (tratamiento, efectos secundarios).  
   - Redactar pregunta (máx. 500 caracteres).  
2. Médico recibe notificación:  
   - Responder en menos de 24 horas.  
   - Respuesta cifrada y archivada en historial.  
3. Protecciones:  
   - Sanitizar texto contra inyecciones SQL/XSS.  
   - Limitar a 3 consultas no respondidas por paciente.  


## Diagrama de flujo
![moodboard](./assets/Diagramadeflujo.drawio.png)


