%%%-------------------------------------------------------------------
%% @doc
%%      Маршрутки Подгородного
%% @end
%%%-------------------------------------------------------------------
-module(bus_pidgorodne_app).
-behaviour(application).
-export([start/2, stop/1]).

start(_StartType, _StartArgs) ->
    start_cowboy(),
    bus_pidgorodne_sup:start_link().

stop(_State) ->
    ok.

%% internal functions

start_cowboy() ->
    Dispatch = cowboy_router:compile(routes:cowboy_dispatch()),         % маршрутизация для ковбоя
    {ok,Port} = application:get_env(bus_pidgorodne, port),
    {ok, _} = cowboy:start_clear(http_listener, [{port, Port}], #{env => #{dispatch => Dispatch}}).
