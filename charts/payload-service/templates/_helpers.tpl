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
{{- printf "%s-%s-%s" .Chart.Name .Values.name .Values.track | trimSuffix "-" -}}
{{- end -}}

{{/*
Use NodePort if GCE global static ip name is defined
*/}}
{{- define "servicetype" -}}
{{- $name := default "ClusterIP" -}}
{{- if .Values.ingress.globalStaticIpName -}}
{{- printf "NodePort" -}}
{{- else -}}
{{- printf "ClusterIP" -}}
{{- end -}}
{{- end -}}
