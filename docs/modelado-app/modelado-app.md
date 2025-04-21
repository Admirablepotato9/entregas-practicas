# Práctica 12: Modelado de Datos - SIVIC

**Nombre de la App**: **SIVIC**
*Sistema Integral de Vigilancia en Inmunodeficiencias Clínicas*

## 1. Listado de Entidades

A continuación, se detallan las entidades principales identificadas para la aplicación SIVIC, con sus atributos clave:

**Usuarios y Perfiles**

*   **usuarios** (ED)
    *   `usuario_id` (PK, SERIAL) - Identificador único del usuario
    *   `email` (UQ, VARCHAR) - Correo electrónico (debe ser único)
    *   `password_hash` (VARCHAR) - Contraseña cifrada
    *   `nombre_completo` (VARCHAR) - Nombre del usuario
    *   `telefono` (VARCHAR) - Teléfono de contacto
    *   `rol` (VARCHAR) - Rol del usuario ('Paciente', 'Medico', 'Admin')
    *   `fecha_creacion` (TIMESTAMP) - Fecha de registro
    *   `activo` (BOOLEAN) - Estado de la cuenta

*   **perfiles_medicos** (ED)
    *   `perfil_medico_id` (PK, SERIAL) - Identificador único del perfil
    *   `usuario_id` (FK, UQ, INT) - Referencia al usuario con rol 'Medico'
    *   `cedula_profesional` (UQ, VARCHAR) - Cédula profesional (única)
    *   `especialidad` (VARCHAR) - Ej: Infectología, Psicología
    *   `codigo_qr_firma` (TEXT) - Código QR para firma digital (o ruta al archivo)
    *   `horarios_disponibles` (JSONB) - Estructura para definir disponibilidad (ej: `{"lunes": ["09:00-13:00", "15:00-18:00"], ...}`)
    *   `visible_directorio` (BOOLEAN) - Si aparece en el directorio público

**Citas Médicas**

*   **citas** (ED)
    *   `cita_id` (PK, SERIAL) - Identificador único de la cita
    *   `paciente_id` (FK, INT) - Referencia al usuario Paciente
    *   `medico_id` (FK, INT) - Referencia al usuario Medico
    *   `fecha_hora_cita` (TIMESTAMP) - Fecha y hora programada
    *   `especialidad_solicitada` (VARCHAR) - Especialidad requerida por el paciente
    *   `estado_cita` (VARCHAR) - ('Programada', 'Confirmada', 'Cancelada', 'Completada', 'Urgencia')
    *   `codigo_qr_acceso` (TEXT) - Código QR para la cita (opcional)
    *   `recordatorio_enviado` (BOOLEAN) - Si ya se envió recordatorio SMS/email

**Historial y Seguimiento del Paciente**

*   **resultados_laboratorio** (ED)
    *   `resultado_id` (PK, SERIAL) - Identificador único del resultado
    *   `paciente_id` (FK, INT) - Referencia al usuario Paciente
    *   `tipo_prueba` (VARCHAR) - Ej: 'CD4', 'Carga Viral'
    *   `valor_resultado` (VARCHAR) - Valor numérico o textual
    *   `unidades` (VARCHAR) - Ej: 'células/mm³', 'copias/mL'
    *   `fecha_toma` (DATE) - Fecha de la toma de muestra
    *   `fecha_resultado` (DATE) - Fecha de emisión del resultado

*   **tratamientos** (ED)
    *   `tratamiento_id` (PK, SERIAL) - Identificador único del tratamiento/medicamento activo
    *   `paciente_id` (FK, INT) - Referencia al usuario Paciente
    *   `prescripcion_id` (FK, INT, NULLABLE) - Referencia a la prescripción que lo originó
    *   `medicamento` (VARCHAR) - Nombre del medicamento
    *   `dosis` (VARCHAR) - Dosis indicada
    *   `frecuencia` (VARCHAR) - Ej: 'Cada 12 horas', 'Una vez al día'
    *   `fecha_inicio` (DATE)
    *   `fecha_fin` (DATE, NULLABLE) - Si el tratamiento tiene fin o fue suspendido
    *   `activo` (BOOLEAN) - Si el tratamiento está actualmente en curso

*   **alertas_dosis** (ED)
    *   `alerta_id` (PK, SERIAL) - Identificador único de la alerta
    *   `tratamiento_id` (FK, INT) - Referencia al tratamiento asociado
    *   `paciente_id` (FK, INT) - Referencia al usuario Paciente
    *   `hora_programada` (TIME) - Hora a la que debe sonar la alerta/notificación
    *   `dias_semana` (VARCHAR) - Ej: 'L,M,X,J,V,S,D' o JSON `[1,2,3,4,5,6,7]`
    *   `activada` (BOOLEAN)

*   **registros_sintomas** (ED)
    *   `registro_sintoma_id` (PK, SERIAL) - Identificador único del registro diario
    *   `paciente_id` (FK, INT) - Referencia al usuario Paciente
    *   `fecha_registro` (DATE)
    *   `temperatura_celsius` (NUMERIC(4,2), NULLABLE)
    *   `efectos_secundarios` (TEXT, NULLABLE) - Descripción
    *   `estado_animo` (VARCHAR, NULLABLE) - Ej: 'Bien', 'Regular', 'Mal', escala 1-5
    *   `notas_adicionales` (TEXT, NULLABLE)

**Gestión Médica**

*   **prescripciones** (ED)
    *   `prescripcion_id` (PK, SERIAL) - Identificador único de la receta
    *   `paciente_id` (FK, INT) - Referencia al usuario Paciente
    *   `medico_id` (FK, INT) - Referencia al usuario Medico que prescribe
    *   `fecha_prescripcion` (TIMESTAMP)
    *   `diagnostico_asociado` (TEXT, NULLABLE)
    *   `pdf_cifrado_ruta` (VARCHAR, NULLABLE) - Ruta al PDF generado
    *   `firma_medico_ts` (TIMESTAMP, NULLABLE) - Timestamp de la firma digital

*   **detalles_prescripcion** (ED)
    *   `detalle_id` (PK, SERIAL)
    *   `prescripcion_id` (FK, INT) - Referencia a la cabecera de la prescripción
    *   `medicamento` (VARCHAR)
    *   `dosis` (VARCHAR)
    *   `frecuencia` (VARCHAR)
    *   `duracion` (VARCHAR, NULLABLE) - Ej: 'Por 15 días', 'Uso continuo'
    *   `indicaciones_adicionales` (TEXT, NULLABLE)

*   **archivos_medicos** (ED)
    *   `archivo_id` (PK, SERIAL) - Identificador único del archivo
    *   `paciente_id` (FK, INT) - Referencia al usuario Paciente
    *   `medico_carga_id` (FK, INT) - Referencia al usuario Medico que subió el archivo
    *   `nombre_archivo_original` (VARCHAR(255))
    *   `ruta_archivo_seguro` (VARCHAR(500)) - Ruta en el servidor/storage
    *   `tipo_archivo` (VARCHAR(10)) - Ej: 'PDF', 'DICOM', 'JPG'
    *   `descripcion` (TEXT, NULLABLE)
    *   `fecha_carga` (TIMESTAMP)

**Comunicación y Contenido Público**

*   **mensajes** (ED)
    *   `mensaje_id` (PK, SERIAL) - Identificador único del mensaje
    *   `remitente_id` (FK, INT) - Referencia al usuario que envía (Paciente o Médico)
    *   `destinatario_id` (FK, INT) - Referencia al usuario que recibe
    *   `asunto` (VARCHAR(150), NULLABLE) - O categoría de consulta
    *   `contenido` (TEXT) - Contenido cifrado del mensaje
    *   `fecha_envio` (TIMESTAMP)
    *   `fecha_lectura` (TIMESTAMP, NULLABLE)
    *   `estado` (VARCHAR(20)) - Ej: 'Enviado', 'Leído', 'Respondido'

*   **articulos_educativos** (ED)
    *   `articulo_id` (PK, SERIAL)
    *   `titulo` (VARCHAR(255))
    *   `contenido` (TEXT)
    *   `fuente` (VARCHAR(200)) - Ej: 'OMS', 'SSA'
    *   `fecha_publicacion` (DATE)
    *   `autor_id` (FK, INT, NULLABLE) - Referencia al usuario (Admin/Medico) que lo publicó

*   **infografias** (ED)
    *   `infografia_id` (PK, SERIAL)
    *   `titulo` (VARCHAR(150))
    *   `descripcion_corta` (TEXT, NULLABLE)
    *   `ruta_imagen` (VARCHAR(255)) - Ruta al archivo descargable (JPG, PNG, PDF)
    *   `fecha_publicacion` (DATE)

*   **centros_apoyo** (ED)
    *   `centro_id` (PK, SERIAL)
    *   `nombre_centro` (VARCHAR(200))
    *   `direccion` (TEXT)
    *   `telefono` (VARCHAR(50), NULLABLE)
    *   `latitud` (NUMERIC(10, 7), NULLABLE)
    *   `longitud` (NUMERIC(10, 7), NULLABLE)
    *   `servicios_ofrecidos` (TEXT, NULLABLE)

---

## 2. Relaciones Principales

*   Un `usuario` (con rol 'Medico') tiene un `perfil_medico` (1 - 1).
*   Un `usuario` (Paciente) puede tener muchas `citas` (1 - M).
*   Un `usuario` (Medico) puede tener muchas `citas` (1 - M).
*   Una `cita` pertenece a un `paciente` y a un `medico` (M - 1 / M - 1).
*   Un `usuario` (Paciente) tiene muchos `resultados_laboratorio` (1 - M).
*   Un `usuario` (Paciente) tiene muchos `tratamientos` (1 - M).
*   Un `tratamiento` puede tener muchas `alertas_dosis` (1 - M).
*   Una `alerta_dosis` pertenece a un `tratamiento` y a un `paciente` (M - 1 / M - 1).
*   Un `usuario` (Paciente) tiene muchos `registros_sintomas` (1 - M).
*   Un `usuario` (Medico) crea muchas `prescripciones` (1 - M).
*   Una `prescripcion` pertenece a un `paciente` y a un `medico` (M - 1 / M - 1).
*   Una `prescripcion` tiene muchos `detalles_prescripcion` (1 - M).
*   Un `detalle_prescripcion` pertenece a una `prescripcion` (M - 1).
*   Un `usuario` (Paciente) puede tener muchos `archivos_medicos` (1 - M).
*   Un `archivo_medico` es subido por un `usuario` (Medico) (M - 1).
*   Un `usuario` puede enviar y recibir muchos `mensajes` (1 - M / 1 - M).
*   Un `articulo_educativo` puede ser creado por un `usuario` (Admin/Medico) (M - 1).

---

## 3. Diagrama Relacional (dbdiagram.io)

Diagrama Relacional:

![Mi Diagrama](./Assets/diagrama.png)

## 4. Reglas de Negocio

Reglas de Negocio:

Usuarios

Crear un usuario (Paciente o Médico).

Leer datos de un usuario (perfil).

Actualizar datos de un usuario.

Desactivar/Activar cuenta de usuario.

Pacientes:

Validar formato de correo electrónico al registrar.

Validar fortaleza de contraseña (8+ caracteres, mayúscula, número).

Asignar rol "Paciente" automáticamente.

Médicos:

Validar Cédula Profesional.

Validar dominio de correo institucional (@hospital.gob.mx).

Asignar rol "Médico" automáticamente.

Generar código QR para firma digital al crear perfil médico.

Login: Autenticar usuario usando email y contraseña (comparando hash).

Perfiles Médicos

Crear perfil médico asociado a un usuario Médico.

Leer perfil médico.

Actualizar perfil médico (incluyendo horarios, visibilidad en directorio).

Citas

Crear una cita (solicitada por Paciente).

Leer citas (por Paciente, por Médico, por fecha).

Actualizar estado de una cita (Confirmada, Cancelada, Completada).

Eliminar una cita (cancelar).

Agendado:

Verificar disponibilidad del médico en tiempo real (< 10 citas/día y horario libre).

Si no hay disponibilidad, sugerir alternativas.

Verificar compatibilidad con horarios de tratamientos del paciente (si aplica).

Confirmación/Recordatorios:

Enviar notificación (SMS/Email) al confirmar.

Enviar recordatorios automáticos antes de la cita.

Cifrar detalles de la cita en la base de datos.

Resultados Laboratorio

Crear/Registrar un resultado de laboratorio para un paciente.

Leer historial de resultados de un paciente (filtrado por tipo de prueba).

Tratamientos y Alertas

Crear un registro de tratamiento activo para un paciente (puede originarse de una prescripción).

Leer tratamientos activos de un paciente.

Actualizar un tratamiento (ej. marcar como inactivo, cambiar fecha fin).

Crear alertas de dosis asociadas a un tratamiento.

Leer alertas de dosis activas para un paciente.

Activar/Desactivar una alerta de dosis.

Enviar notificaciones push para alertas de dosis programadas.

Registro de Síntomas

Crear un registro diario de síntomas para un paciente.

Leer historial de registros de síntomas de un paciente.

Generar visualización (gráficos) del progreso de síntomas (lógica en backend/frontend).

Prescripciones

Crear una prescripción (cabecera y detalles) por un médico para un paciente.

Leer prescripciones emitidas por un médico o recibidas por un paciente.

Validaciones:

Verificar alergias registradas del paciente antes de añadir medicamento (requiere tabla/campo de alergias no detallado previamente, se podría añadir a pacientes o tabla alergias_paciente).

Alertar sobre posibles interacciones medicamentosas (requiere base de datos externa o interna de interacciones).

Firma y Generación:

Requerir autenticación/firma del médico (vía QR o similar).

Generar un PDF cifrado de la receta con sello de tiempo.

Archivos Médicos

Subir un archivo médico (PDF, DICOM) asociado a un paciente, por un médico.

Listar/Leer archivos médicos de un paciente.

Descargar un archivo médico (con permisos adecuados).

Mensajes (Comunicación Segura)

Enviar un mensaje de un usuario a otro (Paciente a Médico o viceversa).

Listar mensajes recibidos/enviados por un usuario.

Marcar mensaje como leído.

Protecciones:

Sanitizar todo el contenido de texto para prevenir inyecciones (SQL, XSS).

Limitar el número de consultas no respondidas por paciente (ej: 3).

Asegurar que el contenido se almacene y transmita cifrado.

Contenido Público (Artículos, Infografías, Centros)

Crear/Leer/Actualizar/Eliminar artículos educativos (solo Admin/Medico).

Crear/Leer/Actualizar/Eliminar infografías (solo Admin/Medico).

Crear/Leer/Actualizar/Eliminar centros de apoyo (solo Admin).

Listar contenido público para usuarios no autenticados.

