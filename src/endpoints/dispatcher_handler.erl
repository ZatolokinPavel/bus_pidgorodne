%%%-------------------------------------------------------------------
%%% @author Zatolokin Pavel
%%% @doc
%%%     Обработчик HTTP запросов страницы диспетчера.
%%% @end
%%% Created : 10. бер 2021 20:37
%%%-------------------------------------------------------------------
-module(dispatcher_handler).
-behaviour(cowboy_handler).
-author("Zatolokin Pavel").

%% API
-export([init/2, terminate/3]).

init(Req, State) ->
    {ok, Req, State}.

terminate(_Reason, _Req, _State) -> ok.
