
.PHONY: build run

build:
	go build -o dist/linkman ./linkman/

install:
	go install ./linkman/

run:
	./dist/linkman --by-name
