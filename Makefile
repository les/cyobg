IN = src
OUT = dist
STATS = compilation-stats.json

DOCKER_RUN = docker run --rm -u $(shell id -u):$(shell id -g) -v "$(PWD):/workspace" -w /workspace $(OPT_ARGS)
SH =  $(DOCKER_RUN) node:23-alpine sh
NPM = $(DOCKER_RUN) node:23-alpine npm

all: install build test
.PHONY: all

build:
	$(NPM) run build
.PHONY: build

clean:
	$(RM) -r $(OUT)
	$(RM) $(STATS)
.PHONY: clean

install:
	$(NPM) install
.PHONY: install

list:
	$(NPM) list
.PHONY: list

serve: OPT_ARGS = -p 8080:8080
serve:
	$(NPM) run serve
.PHONY: serve

stats:
	$(NPM) run stats
.PHONY: stats

test: test
	$(NPM) test
.PHONY: test

outdated:
	-$(NPM) outdated
.PHONY: outdated

update: outdated
	$(NPM) update
.PHONY: update

uninstall:
	$(RM) -r node_modules
.PHONY: uninstall
