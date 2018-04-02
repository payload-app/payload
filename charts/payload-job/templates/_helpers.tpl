{{/*
Expand the name of the chart.
*/}}
{{- define "name" -}}
{{- default .Release.Name .Values.name | trunc 63 | trimSuffix "-" -}}
{{- end -}}
{{/*
Create a default fully qualified app name.
*/}}
{{- define "fullname" -}}
{{- $name := default .Values.name -}}
{{- printf "%s-%s" .Chart.Name .Values.name | trimSuffix "-" -}}
{{- end -}}
