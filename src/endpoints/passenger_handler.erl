%%%-------------------------------------------------------------------
%%% @author Zatolokin Pavel
%%% @doc
%%%     Обработчик HTTP запросов на сервер страницы пассажира.
%%% @end
%%% Created : 23. кві 2023 22:43
%%%-------------------------------------------------------------------
-module(passenger_handler).
-behaviour(cowboy_handler).
-author("Zatolokin Pavel").

%% API
-export([init/2, terminate/3]).

init(Req, State) ->
    Body = schedule(),
    Req1 = cowboy_req:set_resp_header(<<"Content-Type">>, <<"application/json">>, Req),
    Req2 = cowboy_req:set_resp_body(Body, Req1),
    Req3 = cowboy_req:reply(200, Req2),
    {ok, Req3, State}.

terminate(_Reason, _Req, _State) -> ok.


schedule() ->
    {ok,ScheduleBin} = file:read_file(code:priv_dir(bus_pidgorodne)++"/schedule.json"),
    Schedule = jsone:decode(ScheduleBin),
    {Date,_} = calendar:local_time(),
    JSON = {[
        {schedules, Schedule},
        {isWeekend, calendar:day_of_the_week(Date) > 5}
    ]},
    jsone:encode(JSON, []).
