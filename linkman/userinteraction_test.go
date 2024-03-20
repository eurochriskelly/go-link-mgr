package main

import (
	"bytes"
	"os"
	"strings"
	"testing"
)

func TestUserSelectFilesToLink(t *testing.T) {
	// Setup mock input (as if a user is typing '1\n')
	input := "1\n"
	stdin := os.Stdin      // Keep backup of the real stdin
	r, w, _ := os.Pipe()   // Create a pipe to use as stdin
	w.Write([]byte(input)) // Write mock input to the pipe
	w.Close()              // Close the write end of the pipe
	os.Stdin = r           // Redirect stdin to the read end of the pipe

	// Setup mock output
	var buf bytes.Buffer
	os.Stdout = &buf

	// Invoke the function with mock input
	fileMap := map[string][]string{
		"/path/to/dir1": []string{"/path/to/dir1/file1.txt"},
	}
	userSelectFilesToLink(fileMap)

	// Restore stdin
	os.Stdin = stdin

	// Check the output
	expectedOutput := "Files:\n1. dir1::file1.txt\n\nEnter a number to select a file: You selected: [/path/to/dir1, file1.txt]\n"
	if !strings.Contains(buf.String(), expectedOutput) {
		t.Errorf("Expected output to contain %q, got %q instead", expectedOutput, buf.String())
	}
}
