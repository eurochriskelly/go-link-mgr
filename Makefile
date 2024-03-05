
.PHONY: build run

build:
	go build -o dist/linkman src/linkman.go

run:
	./dist/linkman --by-name
