package main

import (
	"bufio"
	"flag"
	"fmt"
	"os"
	"path/filepath"
	"regexp"
	"strings"
	"strconv"
)

func main() {
	// Define and parse the --by-name flag
	byName := flag.Bool("by-name", false, "Search for symlinks by name pattern")
	flag.Parse()

	gdirs := getGitDirectories()

	// Check if the --by-name flag was provided
	if *byName {
		fmt.Println("Enter the pattern to search for:")
		scanner := bufio.NewScanner(os.Stdin)
		if scanner.Scan() {
			pattern := scanner.Text()

			matches, err := listMatchesByName(gdirs, pattern) 
			if err != nil {
				fmt.Println("Error:", err)
				return
			}

			fmt.Println("Matches found:")
			userSelectFilesToLink(matches)
			
			for dir, files := range matches {
				fmt.Printf("%s: %v\n", dir, files)
			}
		} else {
			fmt.Println("Failed to read the input pattern.")
		}
		if err := scanner.Err(); err != nil {
			fmt.Fprintf(os.Stderr, "Error reading input: %s\n", err)
		}
	} else {
		fmt.Println("Usage: goprog --by-name")
	}
}

func getGitDirectories() []string {
	homeDir, err := os.UserHomeDir()
	if err != nil {
		fmt.Println("Error:", err)
		return []string{}
	}
	directories := []string{
		filepath.Join(homeDir, "Workspace/repos/ml-dba-scripts"),
		filepath.Join(homeDir, "Workspace/repos/init-scripts"),
	}
	return directories
}

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

// listMatchesByName searches the given directories for files matching the pattern and returns a map of matches.
func listMatchesByName(directories []string, pattern string) (map[string][]string, error) {
	matches := make(map[string][]string)
	compiledPattern, err := regexp.Compile(pattern)
	if err != nil {
		return nil, err // pattern compilation error
	}

	for _, dir := range directories {
		err := filepath.Walk(dir, func(path string, info os.FileInfo, err error) error {
			if err != nil {
				return err // prevent panic by handling failure accessing a path
			}
			if !info.IsDir() && compiledPattern.MatchString(info.Name()) {
				matches[dir] = append(matches[dir], path)
			}
			return nil
		})
		if err != nil {
			return nil, err // error walking through directories
		}
	}

	return matches, nil
}

// e.g. listMatchesByName(['path/to/repo1', 'path/to/repo2'], 'foo*xqy')
