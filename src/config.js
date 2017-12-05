export const radiusStops = {
    2: [
        [{ zoom: 8, value: 5000 }, 1],
        [{ zoom: 12, value: 1 }, 1],
        [{ zoom: 12, value: 10 }, 5],
        [{ zoom: 12, value: 50 }, 20],
        [{ zoom: 12, value: 5000 }, 50],
        [{ zoom: 16, value: 1 }, 5],
        [{ zoom: 16, value: 50 }, 40],
        [{ zoom: 16, value: 5000 }, 100]
    ],
    4: [
        [{ zoom: 8, value: 5000 }, 1],
        
        [{ zoom: 12, value: 1 }, 1],
        [{ zoom: 12, value: 50 }, 5],
        [{ zoom: 12, value: 5000 }, 10],

        [{ zoom: 16, value: 1 }, 2],
        [{ zoom: 16, value: 50 }, 10],
        [{ zoom: 16, value: 5000 }, 20]
    ]
}

export const colorStops = {
    2: [
            [1, "rgb(209,229,240)"],
            [10, "rgb(103,169,207)"],
            [50, "rgb(253,219,199)"],
            [5000, "rgba(178,24,43, 0.6)"]
    ],
    4: [
            [1, "rgb(209,229,240)"],
            [5, "rgb(103,169,207)"],
            [20, "rgb(253,219,199)"],
            [200, "rgba(178,24,43, 0.6)"]
    ]
}