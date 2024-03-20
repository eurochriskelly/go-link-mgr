
.PHONY: build run

build:
	go build -o dist/linkman ./linkman/

install:
	go install ./linkman/

uninstall:
	bash scripts/install.sh --uninstall

run:
	./dist/linkman --by-name
