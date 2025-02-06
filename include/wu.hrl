%%%-------------------------------------------------------------------
%%% @author Zatolokin Pavel
%%% @doc
%%%     Рекорды общего назначения. Для функций, помогающих упростить код.
%%% @end
%%% Created : 29. кві 2023 00:19
%%%-------------------------------------------------------------------
-author("Zatolokin Pavel").

%% Данные для шаблонов ErlyDTL
-record(dtl, {
    file            :: file:name(),             % имя файла шаблона
    variables = []  :: proplists:proplist(),    % переменные, которые нужно подставить в шаблон
    options = []    :: proplists:proplist()     % опции рендеринга для ErlyDTL
}).

-record(json, {
    value           :: jsone:json_value(),
    options = [
        {float_format, [{decimals, 10}, compact]}
    ]               :: jsone:encode_option()
}).
