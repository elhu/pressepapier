package renderings

// HealthCheckResponse represents the response format for the /health-check endpoint
type HealthCheckResponse struct {
	Message string `json:"message"`
}
