class CustomError extends Error {
    constructor(code, message) {
        super(message);
        this.code = code;
    }
}

const errorDictionary = {
    USER_EXISTS: { code: 4001, message: 'User already exists' },
    MISSING_FIELDS: { code: 4002, message: 'Missing required fields' },
    PET_NOT_FOUND: { code: 4003, message: 'Pet not found' },
    DATABASE_ERROR: { code: 5001, message: 'Database error' },
};

const handleCustomError = (errorKey, res) => {
    const error = errorDictionary[errorKey];
    if (!error) {
        return res.status(500).json({ error: 'Unknown error occurred' });
    }
    return res.status(400).json({ code: error.code, message: error.message });
};

module.exports = { CustomError, errorDictionary, handleCustomError };
