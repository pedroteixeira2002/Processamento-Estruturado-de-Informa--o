[
    {
        "$unionWith": {
            "coll": "treatment_update"
        }
    },
    {
        "$out": "treatment_merged"
    }
]