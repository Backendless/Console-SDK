const createClient = (host, port) => {
    return {
        login: () => {
            return Promise.resolve(`logged in to ${host}:${port}`)
        }
    }
}

export {
    createClient
}