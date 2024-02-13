let Build_IF_SAVE_PB = 30;


TribalWars.get("market", {
    ajax: "exchange_data"
}, function(data) {
    function calculateCost(e, a) {
        var r = data.stock[e],
            t = data.capacity[e];
        return (1 + (data.tax.buy)) * (calculateMarginalPrice(r, t) + calculateMarginalPrice(r - a, t)) * a / 2
    }
    function calculateMarginalPrice(e, a) {
        var r = data.constants;
        return r.resource_base_price - r.resource_price_elasticity * e / (a + r.stock_size_modifier)
    }

    var buildings = $("#buildings").find("tr");
    var clicked = false;
    for (var i = 0; i < buildings.length; i++) {
        if (i == 0) {
            text = "COST";
            $("#buildings").find("tr").eq(i).append('<th>'+text+'</th>');
        } else {
            var row = $(buildings[i]);
            var discountButton = row.find('.btn-bcr');

            if (discountButton.length > 0) {
                var currentWoodCost = row.find(".cost_wood").data("cost");
                var currentStoneCost = row.find(".cost_stone").data("cost");
                var currentIronCost = row.find(".cost_iron").data("cost");
                var discountInfo = discountButton.attr('data-title');
                var newWoodCost = discountInfo.match(/<span><span class="icon header wood"> <\/span>(\d+)/)[1];
                var newStoneCost = discountInfo.match(/<span><span class="icon header stone"> <\/span>(\d+)/)[1];
                var newIronCost = discountInfo.match(/<span><span class="icon header iron" > <\/span>(\d+)/)[1];
                var woodcost = Math.ceil(calculateCost("wood", currentWoodCost - newWoodCost));
                var stonecost = Math.ceil(calculateCost("stone", currentStoneCost - newStoneCost));
                var ironcost = Math.ceil(calculateCost("iron", currentIronCost - newIronCost));
                var PB_SAVE = Number(woodcost+stonecost+ironcost)
                }
            $("#buildings").find("tr").eq(i).append('<td><center><span class="coinbag coinbag-header"></span>'+PB_SAVE+'<center/></td>');
            if (!clicked && discountButton.length > 0 && !discountButton.hasClass('btn-bcr-disabled') && game_data.player.pp >= 30 && PB_SAVE >= Build_IF_SAVE_PB) {
                discountButton.click();
                clicked = true;
            }
        }
    }
});

void(0);
