import bcrypt from 'bcryptjs'

export const hashPassword = async (password) => {
    var salt = await bcrypt.genSalt(10);
    var hashPassword = await bcrypt.hash(password, salt);
    return hashPassword
}

export const comparePassword = async (password, hashedPassword) => {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
};