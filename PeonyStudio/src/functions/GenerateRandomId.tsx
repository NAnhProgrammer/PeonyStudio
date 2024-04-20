const GenerateRandomId = (characters: string): string => {
    const charactersLength = characters.length;
    let result = characters;
    for (let i = 0; i < 5; i++) {
        result += Math.floor(Math.random() * 10)
    }
    return result;
};

export default GenerateRandomId;
