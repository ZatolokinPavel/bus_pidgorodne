RELEASE_NAME = bus_pidgorodne

all: console
console:
	./rebar3 unlock
	./rebar3 as dev release
	./_build/dev/rel/$(RELEASE_NAME)/bin/$(RELEASE_NAME) console

release: rel
rel:
	./rebar3 unlock
	./rebar3 as prod release

start:
	./_build/prod/rel/$(RELEASE_NAME)/bin/$(RELEASE_NAME) start

stop:
	./_build/prod/rel/$(RELEASE_NAME)/bin/$(RELEASE_NAME) stop

attach:
	./_build/prod/rel/$(RELEASE_NAME)/bin/$(RELEASE_NAME) attach
