variable "aws_region" {
  description = "AWS region for resources"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
  default     = "dev"
}

variable "app_name" {
  description = "Application name"
  type        = string
  default     = "todo-app"
}

variable "vpc_cidr" {
  description = "CIDR block for VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "availability_zones" {
  description = "Availability zones"
  type        = list(string)
  default     = ["us-east-1a", "us-east-1b"]
}

variable "backend_image" {
  description = "Docker image for backend"
  type        = string
  default     = "todo-backend:latest"
}

variable "frontend_image" {
  description = "Docker image for frontend"
  type        = string
  default     = "todo-frontend:latest"
}

variable "backend_port" {
  description = "Backend application port"
  type        = number
  default     = 8080
}

variable "frontend_port" {
  description = "Frontend application port"
  type        = number
  default     = 80
}

variable "backend_cpu" {
  description = "CPU units for backend"
  type        = number
  default     = 512
}

variable "backend_memory" {
  description = "Memory for backend in MB"
  type        = number
  default     = 1024
}

variable "frontend_cpu" {
  description = "CPU units for frontend"
  type        = number
  default     = 256
}

variable "frontend_memory" {
  description = "Memory for frontend in MB"
  type        = number
  default     = 512
}

variable "jwt_secret" {
  description = "JWT secret key"
  type        = string
  sensitive   = true
}

variable "certificate_arn" {
  description = "ACM certificate ARN for HTTPS"
  type        = string
  default     = ""
}
