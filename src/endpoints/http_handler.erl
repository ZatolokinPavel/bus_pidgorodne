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
    {Today,_} = calendar:local_time(),
    JSON = {[
        {schedules, Schedule},
        {cars, cars(Schedule)},
        {isWeekendToday, calendar:day_of_the_week(Today) > 5}
    ]},
    jsone:encode(JSON, []).

cars(Schedule) ->
    {[
        {maps:get(<<"route">>,S), {[
            {<<"weekday">>, cars_from_directions([maps:find(<<"weekday">>,R) || R <- maps:get(<<"directions">>,S)])},
            {<<"weekend">>, cars_from_directions([maps:find(<<"weekend">>,R) || R <- maps:get(<<"directions">>,S)])}
        ]}}
        || S <- Schedule
    ]}.

cars_from_directions(Directions) ->
    Numbers = [[maps:get(<<"number">>,Time) || Time <- Direction] || {ok,Direction} <- Directions],
    case Numbers of
        [] -> null;
        [_|_] -> lists:usort(lists:flatten(Numbers))
    end.
