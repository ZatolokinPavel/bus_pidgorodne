RELEASE_NAME = bus_pidgorodne
PROFILE = default

all: console
console:
	./rebar3 as default release
	./_build/default/rel/$(RELEASE_NAME)/bin/$(RELEASE_NAME) console

release: rel
rel:
	./rebar3 as default release

start:
	./_build/$(PROFILE)/rel/$(RELEASE_NAME)/bin/$(RELEASE_NAME) start

stop:
	./_build/$(PROFILE)/rel/$(RELEASE_NAME)/bin/$(RELEASE_NAME) stop

attach:
	./_build/$(PROFILE)/rel/$(RELEASE_NAME)/bin/$(RELEASE_NAME) attach
