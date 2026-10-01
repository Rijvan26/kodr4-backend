export function sendSuccess(res, statuscode, message, data = null) {
    const body = {
        success: true,
        message,
        data
    };
    return res.status(statuscode).json(body);
}
//# sourceMappingURL=apiResponse.js.map