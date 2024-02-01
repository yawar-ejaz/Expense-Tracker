const bcrypt = require("bcrypt");

const encrypt = async (password) => {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
};

const isMatching = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};

module.exports = { encrypt, isMatching };