# Práctica 12: Modelado de Datos - SIVIC 

**Nombre de la App**: **SIVIC**
*Sistema Integral de Vigilancia en Inmunodeficiencias Clínicas*

---

## Flujo General de la Aplicación 

SIVIC, está diseñada para resolver el problema central de la desorganización de citas en una clínica de VIH y proporcionar herramientas esenciales para pacientes y médicos. El flujo principal es el siguiente:

1.  **Registro y Acceso:**
    *   Los **Pacientes** se registran con su correo, contraseña y datos básicos. Inician sesión para acceder a sus funciones.
    *   Los **Médicos** (especializados en VIH) se registran con sus datos profesionales (incluyendo cédula como identificador) y correo. Su cuenta queda 'Pendiente' hasta que un **Administrador** la revise y apruebe. Una vez aprobados, pueden iniciar sesión.
    *   El **Administrador** tiene credenciales predefinidas o un registro especial para acceder a su panel.

2.  **Gestión de Disponibilidad (Médico):**
    *   El Médico (aprobado) configura sus horarios de atención disponibles y puede ajustar su límite máximo de citas diarias (el cual también puede ser configurado por el Admin).

3.  **Agendado de Citas (Paciente):**
    *   El Paciente busca médicos disponibles en la clínica.
    *   Visualiza los horarios disponibles del médico seleccionado (el sistema filtra los horarios ocupados o si el médico ya alcanzó su límite diario).
    *   Selecciona una fecha y hora, y agenda la cita. El estado inicial es 'Programada' o 'Confirmada' (según se defina).
    *   El Paciente recibe una notificación (in-app) y puede ver sus citas en su panel.

4.  **Gestión de Citas (Médico):**
    *   El Médico ve su agenda de citas programadas.
    *   Recibe notificaciones (in-app) de nuevas citas.
    *   Puede gestionar el estado de la cita (confirmar si es necesario, cancelar si hay imprevisto).

5.  **Consulta Médica:**
    *   Durante la cita, el Médico accede al **Expediente Básico** del Paciente dentro de SIVIC (datos personales, historial simple de resultados de laboratorio, tratamientos activos, síntomas registrados por el paciente, notas de citas previas).
    *   El Médico registra **Notas/Diagnóstico** relevantes de la consulta actual.
    *   Si es necesario, el Médico crea una **Prescripción** simple (registra medicamentos, dosis, frecuencia).
    *   Al finalizar, el Médico marca la cita como **'Completada'**, lo cual sirve como confirmación de que la consulta se realizó.

6.  **Seguimiento (Paciente):**
    *   El Paciente puede ver sus tratamientos activos (prescritos por el médico).
    *   Puede **configurar recordatorios** para tomar sus medicamentos (ej. "Tomar X medicamento a las 8:00 AM") y alertas opcionales de bajo stock (ej. "Recordarme resurtir Y cuando queden Z días"). El sistema le enviará notificaciones (in-app o método definido) basadas en esta configuración.
    *   (Opcional) El Paciente puede registrar sus síntomas diarios/periódicos en la sección `registros_sintomas`.

7.  **Administración (Admin):**
    *   El Administrador gestiona las solicitudes de registro de médicos (Aprueba/Rechaza).
    *   Puede configurar ajustes generales, como el límite de citas por defecto.
    *   Puede supervisar usuarios (activar/desactivar cuentas si es necesario).

Este flujo se enfoca en digitalizar y organizar el proceso de citas, facilitar la consulta con información básica centralizada y ayudar al paciente con la adherencia a su tratamiento mediante recordatorios.

---

## Aspectos Cubiertos a Detalle

*   **Autenticación y Gestión de Usuarios:** Registro, login y roles (Paciente, Médico, Admin) mediante el sistema de autenticación de la aplicación. Incluye flujo de aprobación manual para médicos.
*   **Gestión de Citas:** Creación, visualización (agenda médico, lista paciente), actualización de estados (incluyendo 'Completada' para confirmación) y lógica de disponibilidad (horarios y límite diario configurable).
*   **Expediente Básico del Paciente:** Almacenamiento y visualización (por el médico) de datos clave: resultados de laboratorio, tratamientos activos y registros de síntomas.
*   **Registro de Consulta:** Capacidad del médico para añadir notas o diagnóstico a una cita completada.
*   **Prescripción Simple:** Registro de medicamentos prescritos por el médico asociados a un paciente.
*   **Recordatorios de Medicación:** Configuración por parte del paciente de alertas para la toma de medicamentos y bajo stock, basado en sus tratamientos registrados.
*   **Administración Básica:** Panel para que el admin valide médicos y ajuste configuraciones simples (límite de citas).

---

## 1. Listado de Entidades

A continuación, se detallan las entidades principales identificadas de SIVIC, con sus atributos clave:

**Usuarios y Perfiles**

*   **usuarios**
    *   `id` (PK) - Identificador único del usuario
    *   `email` (UQ) - Correo electrónico
    *   `password_hash` - Contraseña cifrada
    *   `role` - Rol asignado ('Paciente', 'Medico', 'Admin')
    *   `nombre_completo`
    *   `telefono`
    *   `created_at` - Fecha de registro
    *   `is_active` (default true) - Estado de la cuenta
    *   `estado_validacion` (NULLABLE, default 'Pendiente' para Médicos) - Estado de validación ('Pendiente', 'Aprobado', 'Rechazado')

*   **perfiles_medicos**
    *   `perfil_medico_id` (PK) - Identificador único del perfil
    *   `usuario_id` (FK, UQ) - Referencia a `usuarios.id` (con rol 'Medico')
    *   `cedula_profesional` - Identificador profesional
    *   `horarios_disponibles` - Estructura para definir disponibilidad
    *   `limite_citas_diarias` (default 10) - Límite configurable
    *   `visible_admin` (default true) - Control interno

**Citas Médicas**

*   **citas**
    *   `cita_id` (PK)
    *   `paciente_id` (FK) - Referencia a `usuarios.id` (Paciente)
    *   `medico_id` (FK) - Referencia a `usuarios.id` (Medico)
    *   `fecha_hora_cita`
    *   `estado_cita` - ('Programada', 'Confirmada', 'Cancelada_Paciente', 'Cancelada_Medico', 'Completada')
    *   `notas_diagnostico` (NULLABLE) - Notas del médico
    *   `fecha_creacion` (default now())

**Historial y Seguimiento del Paciente**

*   **resultados_laboratorio**
    *   `resultado_id` (PK)
    *   `paciente_id` (FK) - Referencia a `usuarios.id` (Paciente)
    *   `tipo_prueba` - Ej: 'CD4', 'Carga Viral'
    *   `valor_resultado`
    *   `unidades` (NULLABLE)
    *   `fecha_toma`
    *   `fecha_resultado`
    *   `registrado_por_medico_id` (FK, NULLABLE) - Referencia a `usuarios.id` (Medico)

*   **tratamientos**
    *   `tratamiento_id` (PK)
    *   `paciente_id` (FK) - Referencia a `usuarios.id` (Paciente)
    *   `prescripcion_id` (FK, NULLABLE) - Referencia a `prescripciones.prescripcion_id`
    *   `medicamento`
    *   `dosis`
    *   `frecuencia`
    *   `fecha_inicio`
    *   `fecha_fin` (NULLABLE)
    *   `activo` (default true)

*   **alertas_medicacion_paciente**
    *   `alerta_id` (PK)
    *   `paciente_id` (FK) - Referencia a `usuarios.id` (Paciente)
    *   `tratamiento_id` (FK) - Referencia a `tratamientos.tratamiento_id`
    *   `tipo_alerta` - 'Dosis', 'BajoStock'
    *   `hora_programada` (NULLABLE) - Para alerta 'Dosis'
    *   `dias_semana` (NULLABLE) - Para alerta 'Dosis'
    *   `dias_anticipacion_stock` (NULLABLE) - Para alerta 'BajoStock'
    *   `mensaje_personalizado` (NULLABLE)
    *   `activada` (default true)

*   **registros_sintomas**
    *   `registro_sintoma_id` (PK)
    *   `paciente_id` (FK) - Referencia a `usuarios.id` (Paciente)
    *   `fecha_registro` (default now())
    *   `temperatura_celsius` (NULLABLE)
    *   `efectos_secundarios` (NULLABLE)
    *   `estado_animo` (NULLABLE)
    *   `notas_adicionales` (NULLABLE)

**Gestión Médica**

*   **prescripciones**
    *   `prescripcion_id` (PK)
    *   `paciente_id` (FK) - Referencia a `usuarios.id` (Paciente)
    *   `medico_id` (FK) - Referencia a `usuarios.id` (Medico)
    *   `cita_id` (FK, NULLABLE) - Referencia a `citas.cita_id`
    *   `fecha_prescripcion` (default now())
    *   `diagnostico_asociado` (NULLABLE)

*   **detalles_prescripcion**
    *   `detalle_id` (PK)
    *   `prescripcion_id` (FK) - Referencia a `prescripciones.prescripcion_id`
    *   `medicamento`
    *   `dosis`
    *   `frecuencia`
    *   `duracion` (NULLABLE)
    *   `indicaciones_adicionales` (NULLABLE)

---

## 2. Relaciones Principales

*   Un `usuario` (con rol 'Medico') tiene un `perfil_medico` (1 - 1).
*   Un `usuario` (Paciente) puede tener muchas `citas` (1 - M).
*   Un `usuario` (Medico) puede tener muchas `citas` (1 - M).
*   Una `cita` pertenece a un `paciente` y a un `medico` (M - 1 / M - 1).
*   Un `usuario` (Paciente) tiene muchos `resultados_laboratorio` (1 - M).
*   Un `usuario` (Paciente) tiene muchos `tratamientos` (1 - M).
*   Un `tratamiento` puede tener muchas `alertas_medicacion_paciente` configuradas por el `paciente` (1 - M).
*   Un `usuario` (Paciente) tiene muchos `registros_sintomas` (1 - M).
*   Un `usuario` (Medico) crea muchas `prescripciones` (1 - M).
*   Una `prescripcion` pertenece a un `paciente` y a un `medico` (M - 1 / M - 1).
*   Una `prescripcion` tiene muchos `detalles_prescripcion` (1 - M).

---

## 3. Diagrama Relacional


**Referencia al Diagrama:**

---

## 4. Reglas de Negocio

**Usuarios y Autenticación**
*   Registro: Pacientes se auto-registran. Médicos se registran y quedan 'Pendientes'. Admins son pre-creados o tienen ruta especial.
*   Validación Médico: Un Admin debe cambiar `estado_validacion` a 'Aprobado' para que el médico pueda operar.
*   Login: Autenticación mediante el sistema implementado. El acceso a funciones depende del rol y del `estado_validacion` (para médicos).
*   Roles: El sistema debe restringir el acceso a funcionalidades basado en el rol ('Paciente', 'Medico', 'Admin').

**Perfiles Médicos**
*   Configuración: Médicos pueden definir/actualizar sus `horarios_disponibles`. El `limite_citas_diarias` es configurado por el administrador.

**Citas**
*   Agendado (Paciente):
    *   Solo puede seleccionar médicos 'Aprobados'.
    *   Solo puede seleccionar slots donde `horarios_disponibles` coincida Y el médico no haya alcanzado su `limite_citas_diarias` para esa fecha Y el slot no esté ocupado por otra cita.
*   Gestión (Médico):
    *   Puede ver su agenda.
    *   Puede cancelar citas (notifica al paciente).
    *   **Debe marcar la cita como 'Completada'** para indicar que se realizó. Al hacerlo, puede añadir `notas_diagnostico`.
*   Gestión (Paciente):
    *   Puede ver sus citas futuras y pasadas.
    *   Puede cancelar citas (con antelación mínima si se define, notifica al médico).
*   Estados: El `estado_cita` debe gestionarse correctamente ('Programada', 'Confirmada', 'Cancelada_...', 'Completada').

**Expediente y Consulta**
*   Acceso: Médicos solo pueden ver datos de pacientes con los que tienen o han tenido citas.
*   Registro Resultados/Tratamientos: Médicos pueden añadir/editar resultados de laboratorio y tratamientos para sus pacientes.
*   Registro Síntomas: Pacientes pueden registrar sus síntomas. Médicos pueden consultarlos.
*   Notas Diagnóstico: Se guardan asociadas a la cita 'Completada'.

**Prescripciones**
*   Creación: Médicos pueden crear prescripciones simples (cabecera y detalles) durante o después de una cita 'Completada'.
*   Visualización: Pacientes pueden ver las prescripciones emitidas para ellos.

**Administración**
*   Validación Médicos: Admin tiene interfaz para ver médicos 'Pendientes' y cambiar su estado a 'Aprobado' o 'Rechazado'.
*   Configuración: Admin puede ajustar el `limite_citas_diarias` por médico.
