-- Tips de experiencia configurables (widget flotante público)
INSERT INTO "configuracion_sistema" ("clave", "valor", "tipo", "grupo", "etiqueta", "editable", "fecha_actualizacion")
VALUES (
  'contenido.tips',
  '{"enabled":true,"tips":[{"id":1,"icon":"Calendar","categoria":"Planificación","titulo":"Días Extra = Tranquilidad","contenido":"Disponé de 2 días extras. El clima en montaña es cambiante y más tiempo te permitirá modificar el plan.","color":"from-blue-500 to-blue-600","activo":true,"orden":1},{"id":2,"icon":"MapPin","categoria":"Investigación","titulo":"Conocé tu Destino","contenido":"Investigá el lugar para combinar el viaje con otras experiencias y conocer costumbres locales.","color":"from-green-500 to-green-600","activo":true,"orden":2},{"id":3,"icon":"Thermometer","categoria":"Equipamiento","titulo":"Preparate para el Clima","contenido":"Invierno: cadenas, mantas térmicas. Verano: agua extra, sombrero y protector solar.","color":"from-orange-500 to-red-500","activo":true,"orden":3},{"id":4,"icon":"Droplets","categoria":"Hidratación","titulo":"Hidratación Constante","contenido":"En altura, tomá agua cada 15-20 min. Evitá alcohol 48hs antes de la expedición.","color":"from-cyan-500 to-blue-500","activo":true,"orden":4},{"id":5,"icon":"Heart","categoria":"Preparación","titulo":"Entrenamiento Previo","contenido":"Comenzá 6 semanas antes. Enfocate en cardio y piernas. Caminatas con mochila son ideales.","color":"from-pink-500 to-rose-500","activo":true,"orden":5},{"id":6,"icon":"FileText","categoria":"Documentación","titulo":"Permisos y Seguros","contenido":"Verificá DNI vigente, contratá un seguro de viaje y consultá permisos especiales.","color":"from-purple-500 to-indigo-500","activo":true,"orden":6}]}',
  'json',
  'contenido',
  'Tips de experiencia (widget flotante)',
  true,
  NOW()
)
ON CONFLICT ("clave") DO NOTHING;
