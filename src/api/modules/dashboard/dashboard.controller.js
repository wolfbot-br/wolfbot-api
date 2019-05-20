const dashboard = require("./dashboard.service");

const dataDashboard = async (req, res) => {
    try {
        const dayResult = await dashboard.dayResult();
        const openOrdersTableResult = await dashboard.openOrdersTable();
        const operationsSummaryResult = await dashboard.operationsSummary();
        const overallResult = await dashboard.overallResult();
        const totalizerResult = await dashboard.totalizerOpenOrdersAndClosedOrders();
        res.status(200).json({
            data: {
                dayResult,
                openOrdersTableResult,
                operationsSummaryResult,
                overallResult,
                totalizerResult,
            },
        });
    } catch (error) {
        res.status(400).json({
            message: error,
        });
    }
};

module.exports = { dataDashboard };
