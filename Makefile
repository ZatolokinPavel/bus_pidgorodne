RELEASE_NAME = bus_pidgorodne
PROFILE = default

all: console
console:
	./rebar3 as default release
	./_build/default/rel/$(RELEASE_NAME)/bin/$(RELEASE_NAME) console
