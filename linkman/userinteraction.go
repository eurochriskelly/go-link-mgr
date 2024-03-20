package main

import (
	"bufio"
	"fmt"
	"os"
	"path/filepath"
	"strconv"
	"strings"
)

func userSelectFilesToLink(fileMap map[string][]string) {
	// Map for tracking keys and relative paths
	var selectionMap []string
	counter := 1

	fmt.Println("Files:")
	for key, values := range fileMap {
		for _, value := range values {
			// Get the relative path from the key to the value
			relPath, err := filepath.Rel(key, value)
			if err != nil {
				fmt.Println("Error calculating relative path:", err)
				return
			}
			fmt.Printf("%d. %s::%s\n", counter, filepath.Base(key), relPath)
			// Keep the selection mapping
			selectionMap = append(selectionMap, key+"::"+relPath)
			counter++
		}
	}

	fmt.Print("\nEnter a number to select a file: ")

	scanner := bufio.NewScanner(os.Stdin)
	if scanner.Scan() {
		input := scanner.Text()
		choice, err := strconv.Atoi(input)
		if err != nil || choice < 1 || choice > len(selectionMap) {
			fmt.Println("Invalid input. Please enter a valid number.")
			return
		}

		// Retrieve the selected entry
		selected := selectionMap[choice-1]
		split := strings.Split(selected, "::")
		fmt.Printf("You selected: [%s, %s]\n", split[0], split[1])
	}
	if err := scanner.Err(); err != nil {
		fmt.Fprintf(os.Stderr, "Error reading input: %s\n", err)
	}
}
