%%%-------------------------------------------------------------------
%%% @author Zatolokin Pavel
%%% @doc
%%%
%%% @end
%%% Created : 29. кві 2023 00:45
%%%-------------------------------------------------------------------
-module(schedule).
-author("Zatolokin Pavel").
-include("wu.hrl").

%% API
-export([schedule/0]).


schedule() ->
    {ok,ScheduleBin} = file:read_file(code:priv_dir(bus_pidgorodne)++"/schedule.json"),
    Schedule = jsone:decode(ScheduleBin),
    {Today,_} = calendar:local_time(),
    JSON = {[
        {schedules, Schedule},
        {cars, cars(Schedule)},
        {isWeekendToday, calendar:day_of_the_week(Today) > 5}
    ]},
    #json{value = JSON}.

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
