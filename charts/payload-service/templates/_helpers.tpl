{{/*
Expand the name of the chart.
*/}}
{{- define "name" -}}
{{- .Values.name | trunc 63 | trimSuffix "-" -}}
{{- end -}}
{{/*
Create a default fully qualified app name.
*/}}
{{- define "fullname" -}}
{{- printf "%s-%s-%s" .Chart.Name .Values.name .Values.track | trimSuffix "-" -}}
{{- end -}}
{{/*
Expand the name of the chart for the backend ingress.
*/}}
{{- define "staging-ingress-name" -}}
{{- $name := .Values.name | trunc 39 | trimSuffix "-" -}}
{{- printf "%s-backend-staging-ingress" $name -}}
{{- end -}}
{{/*
Create a default fully qualified app name.
*/}}
{{- define "staging-ingress-fullname" -}}
{{- $name := printf "%s-%s-%s" .Chart.Name .Values.name .Values.track | trunc 39 | trimSuffix "-" -}}
{{- printf "%s-backend-staging-ingress" $name -}}
{{- end -}}
