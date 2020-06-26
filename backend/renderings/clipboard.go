package renderings

// ClipboardResponse represents the response format for the clipboard entity
type ClipboardResponse struct {
	Data string `json:"data"`
	ID   int    `json:"id"`
}
