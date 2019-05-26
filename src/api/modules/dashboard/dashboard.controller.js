const Dashboard = require("./dashboard.service");

const dataDashboard = async (req, res) => {
    try {
        const { uid } = req.user;
        const dayResult = await Dashboard.dayResult(uid);
        const openOrdersTableResult = await Dashboard.openOrdersTable(uid);
        const operationsSummaryResult = await Dashboard.operationsSummary(uid);
        const overallResult = await Dashboard.overallResult(uid);
        const totalizerResult = await Dashboard.totalizerOpenOrdersAndClosedOrders(uid);
        const totalAssets = await Dashboard.totalAssets(uid);
        res.status(200).json({
            data: {
                dayResult,
                openOrdersTableResult,
                operationsSummaryResult,
                overallResult,
                totalizerResult,
                totalAssets,
            },
        });
    } catch (error) {
        res.status(400).json({
            message: error,
        });
    }
};

module.exports = { dataDashboard };
