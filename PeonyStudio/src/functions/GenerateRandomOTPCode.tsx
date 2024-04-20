const GenerateRandomOTPCode = () => {
    let result = '';
    for (let i = 0; i < 6; i++) {
        result += Math.floor(Math.random() * 10);
    }
    return result;
};

export default GenerateRandomOTPCode;

