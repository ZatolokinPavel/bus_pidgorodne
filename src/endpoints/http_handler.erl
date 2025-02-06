%%%-------------------------------------------------------------------
%%% @author Zatolokin Pavel
%%% @doc
%%%     Обработчик HTTP запросов на сервер страниц пассажира и диспетчера.
%%% @end
%%% Created : 23. кві 2023 22:43
%%%-------------------------------------------------------------------
-module(http_handler).
-behaviour(cowboy_handler).
-author("Zatolokin Pavel").
-include("wu.hrl").

%% API
-export([init/2, terminate/3]).

init(Req, State) ->
    Path = binary_to_list(cowboy_req:path(Req)),
    Method = case cowboy_req:method(Req) of
                 <<"GET">> -> get;
                 <<"POST">> -> post end,
    QueryString = cowboy_req:parse_qs(Req),
    Result = routes:page(Req, Method, QueryString, Path),
    {Code,Resp,Req1} = parse_result(Result, Req),
    Body = render_answer(Resp),
    Req2 = set_headers(Resp, Req1),
    Req3 = cowboy_req:set_resp_body(Body, Req2),
    Req4 = cowboy_req:reply(Code, Req3),
    {ok, Req4, State}.

terminate(_Reason, _Req, _State) -> ok.


parse_result({Code,Result,Req},_) when is_integer(Code) -> {Code, Result, Req};
parse_result({Code,Result}, Req) when is_integer(Code) -> {Code, Result, Req};
parse_result(Result, Req) when is_atom(Result) -> {204, "", Req};
parse_result(Result, Req) -> {200, Result, Req}.

render_answer(R) when is_list(R) -> R;
render_answer(R) when is_binary(R) -> R;
render_answer(R = #json{}) -> jsone:encode(R#json.value, R#json.options);
render_answer(R = #dtl{}) ->
    Mod = list_to_existing_atom(R#dtl.file ++ "_dtl"),
    {ok,HTML} = Mod:render(R#dtl.variables, R#dtl.options),
    HTML.

set_headers(#json{}, Req) -> cowboy_req:set_resp_header(<<"Content-Type">>, <<"application/json">>, Req);
set_headers(_Resp, Req) -> Req.
