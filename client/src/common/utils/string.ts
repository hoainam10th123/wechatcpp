export const ChuHoaDau = (word: string) => {
    return word[0].toUpperCase() + word.substring(1)
}

export const baseUrl = process.env.REACT_APP_API_URL?.split('/api/v1')[0]