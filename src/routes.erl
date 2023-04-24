%%%-------------------------------------------------------------------
%%% @author Zatolokin Pavel
%%% @copyright (C) 2021, <COMPANY>
%%% @doc
%%%     Маршрутизация HTTP запросов.
%%% @end
%%% Created : 20. лют 2021 15:41
%%%-------------------------------------------------------------------
-module(routes).
-author("Zatolokin Pavel").
-export([cowboy_dispatch/0]).

cowboy_dispatch() -> [
    {'_', [
        {"/",                       cowboy_static,      {priv_file, bus_pidgorodne, "static/passenger.html"}},
        {"/favicon.ico",            cowboy_static,      {priv_file, bus_pidgorodne, "static/img/favicon.ico"}},
        {"/service-worker.js",      cowboy_static,      {priv_file, bus_pidgorodne, "static/js/service-worker.js"}},
        {"/pwa/[...]",              cowboy_static,      {priv_dir,  bus_pidgorodne, "static/pwa"}},
        {"/img/[...]",              cowboy_static,      {priv_dir,  bus_pidgorodne, "static/img"}},
        {"/css/index.css",          cowboy_static,      {priv_file, bus_pidgorodne, "static/css/index.css"}},
        {"/js/[...]",               cowboy_static,      {priv_dir,  bus_pidgorodne, "static/js"}},
        {"/passenger/schedule",     http_handler,       no_state},
        {"/dispatcher",             cowboy_static,      {priv_file, bus_pidgorodne, "static/dispatcher.html"}},
        {"/dispatcher/schedule",    http_handler,       no_state},
        {'_',                       cowboy_static,      {priv_file, bus_pidgorodne, "static/404.html"}}
    ]} ].
