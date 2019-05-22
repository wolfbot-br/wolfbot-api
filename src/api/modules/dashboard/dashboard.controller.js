const dashboard = require("./dashboard.service");

const dataDashboard = async (req, res) => {
    try {
        const { uid } = req.user;
        const dayResult = await dashboard.dayResult();
        const openOrdersTableResult = await dashboard.openOrdersTable();
        const operationsSummaryResult = await dashboard.operationsSummary();
        const overallResult = await dashboard.overallResult(uid);
        const totalizerResult = await dashboard.totalizerOpenOrdersAndClosedOrders(uid);
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
