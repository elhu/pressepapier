package renderings

// ClipboardResponse represents the response format for the clipboard entity
type ClipboardResponse struct {
	Data    string `json:"data"`
	HasFile bool   `json:"hasFile"`
	ID      int    `json:"id"`
}
