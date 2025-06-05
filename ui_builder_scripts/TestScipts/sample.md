[
    {"item": "Build", "status": "pass"},
    {"item": "Deploy", "status": "pass"},
    {"item": "Validation", "status": "pass"}
]

✅

"❌"

CONCAT(@item.value.item, "✅")

CONCAT(IF((@item.value.status == "pass"), "✅", "❌"), "  ", @item.value.item)
CONCAT(IF((@item.value.status == "pass"), "✅", "❌"), "  ", @item.value.item)